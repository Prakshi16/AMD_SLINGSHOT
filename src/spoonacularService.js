// spoonacularService.js
// Spoonacular API integration with condition-based filtering,
// 1-hour localStorage cache, and hardcoded Indian fallback meals.

const API_BASE = 'https://api.spoonacular.com/recipes/complexSearch';
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// ─── Condition → Spoonacular param mapping (from prompt §2) ───

export function getConditionParams(conditions = []) {
  const paramMap = {
    'Diabetes':          { maxSugar: 10, diet: 'whole30' },
    'High Cholesterol':  { diet: 'low-fat' },
    'Hypertension':      { maxSodium: 600 },
    'PCOD':              { diet: 'low-carb' },
    'Thyroid':           { diet: 'balanced' },
    'Obesity':           { maxCalories: 400 },
  };

  const merged = {};

  conditions.forEach((condition) => {
    const params = paramMap[condition];
    if (!params) return; // skip "None" or unknown

    Object.entries(params).forEach(([key, value]) => {
      // For numeric params, keep the most restrictive (lowest) value
      if (typeof value === 'number') {
        if (merged[key] === undefined || value < merged[key]) {
          merged[key] = value;
        }
      }
      // For string params (diet), last one wins
      // (Spoonacular only accepts one diet value)
      if (typeof value === 'string') {
        merged[key] = value;
      }
    });
  });

  return merged;
}

// ─── Build query string from param object ───

function buildQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join('');
}

// ─── localStorage cache helpers ───

function getCachedData(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);
    const age = Date.now() - timestamp;

    if (age > CACHE_DURATION_MS) {
      localStorage.removeItem(cacheKey);
      return null; // expired
    }

    return data;
  } catch {
    return null;
  }
}

function setCachedData(cacheKey, data) {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

// ─── Fetch a single meal type ───

async function fetchMealByType(mealType, spoonacularType, conditionParams) {
  const cacheKey = `nourishme_meal_${mealType}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const conditionQS = buildQueryString(conditionParams);
  const url = `${API_BASE}?apiKey=${API_KEY}&cuisine=indian&addRecipeNutrition=true&number=3&type=${spoonacularType}${conditionQS}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Spoonacular ${mealType} fetch failed: ${response.status}`);
  }

  const json = await response.json();
  const results = (json.results || []).map(normalizeMeal);

  if (results.length === 0) {
    throw new Error(`No ${mealType} results from Spoonacular`);
  }

  setCachedData(cacheKey, results);
  return results;
}

// ─── Normalize Spoonacular response into our meal shape ───

function normalizeMeal(recipe) {
  const nutrients = {};
  (recipe.nutrition?.nutrients || []).forEach((n) => {
    nutrients[n.name.toLowerCase()] = n.amount;
  });

  const calories = Math.round(nutrients['calories'] || 0);
  const protein  = Math.round(nutrients['protein'] || 0);
  const carbs    = Math.round(nutrients['carbohydrates'] || 0);
  const fat      = Math.round(nutrients['fat'] || 0);
  const sugar    = Math.round(nutrients['sugar'] || 0);
  const sodium   = Math.round(nutrients['sodium'] || 0);

  return {
    id: String(recipe.id),
    name: recipe.title,
    image: recipe.image,
    calories,
    protein,
    carbs,
    fat,
    sugar,
    sodium,
    gi: calculateGI(sugar, carbs),
    sourceUrl: recipe.sourceUrl || '',
    ingredients: (recipe.nutrition?.ingredients || []).map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    })),
  };
}

// ─── GI Badge calculation (from prompt §3) ───

export function calculateGI(sugar, carbs) {
  if (sugar < 5 && carbs < 20) return { label: 'Low GI', emoji: '🟢', level: 'low' };
  if (sugar <= 15 || carbs <= 40) return { label: 'Medium GI', emoji: '🟡', level: 'medium' };
  return { label: 'High GI', emoji: '🔴', level: 'high' };
}

// ─── Main entry: fetch all 3 meals for Home Dashboard ───

export async function fetchDailyMeals(conditions = []) {
  const conditionParams = getConditionParams(conditions);

  try {
    const [breakfastResults, lunchResults, dinnerResults] = await Promise.all([
      fetchMealByType('breakfast', 'breakfast',   conditionParams),
      fetchMealByType('lunch',    'main+course',  conditionParams),
      fetchMealByType('dinner',   'dinner',       conditionParams),
    ]);

    return {
      breakfast: breakfastResults[0] || null,
      lunch:     lunchResults[0]     || null,
      dinner:    dinnerResults[0]    || null,
      allResults: {
        breakfast: breakfastResults,
        lunch:     lunchResults,
        dinner:    dinnerResults,
      },
    };
  } catch (err) {
    console.warn('Spoonacular API failed, using fallback meals:', err.message);
    return getFallbackMeals();
  }
}

// ─── Browse / Discover search ───

export async function searchMeals(query = '', filterType = '', conditions = []) {
  const conditionParams = getConditionParams(conditions);
  const conditionQS = buildQueryString(conditionParams);

  const typeParam = filterType ? `&type=${encodeURIComponent(filterType)}` : '';
  const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';

  const cacheKey = `nourishme_search_${query}_${filterType}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `${API_BASE}?apiKey=${API_KEY}&cuisine=indian&addRecipeNutrition=true&number=9${queryParam}${typeParam}${conditionQS}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Search failed: ${response.status}`);

    const json = await response.json();
    const results = (json.results || []).map(normalizeMeal);

    setCachedData(cacheKey, results);
    return results;
  } catch (err) {
    console.warn('Search failed, returning fallback:', err.message);
    return FALLBACK_MEALS;
  }
}

// ─── Fetch full meal detail by ID ───

export async function fetchMealDetail(mealId) {
  const cacheKey = `nourishme_detail_${mealId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.spoonacular.com/recipes/${mealId}/information?apiKey=${API_KEY}&includeNutrition=true`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Detail fetch failed: ${response.status}`);

    const recipe = await response.json();

    const detail = {
      ...normalizeMeal(recipe),
      instructions: recipe.instructions || '',
      analyzedInstructions: (recipe.analyzedInstructions?.[0]?.steps || []).map((s) => s.step),
      extendedIngredients: (recipe.extendedIngredients || []).map((ing) => ({
        name: ing.name,
        original: ing.original,
        image: ing.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}` : '',
        amount: ing.amount,
        unit: ing.unit,
      })),
      readyInMinutes: recipe.readyInMinutes || 0,
      servings: recipe.servings || 1,
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false,
    };

    setCachedData(cacheKey, detail);
    return detail;
  } catch (err) {
    console.warn('Detail fetch failed:', err.message);
    return null;
  }
}

// ─── Condition suitability check (for Meal Detail "Suitable For") ───

export function getSuitableConditions(meal) {
  const suitable = [];
  if (!meal) return suitable;

  if (meal.sugar < 10 && meal.gi?.level !== 'high') suitable.push('Diabetes');
  if (meal.fat < 15)          suitable.push('High Cholesterol');
  if (meal.sodium < 600)      suitable.push('Hypertension');
  if (meal.carbs < 30)        suitable.push('PCOD');
  if (meal.calories < 400)    suitable.push('Obesity');
  // Thyroid is "balanced" — most meals qualify
  suitable.push('Thyroid');

  return suitable;
}

// ─── Hardcoded fallback Indian meals (from prompt §9) ───

const FALLBACK_MEALS = [
  {
    id: 'fallback-1',
    name: 'Dal Tadka',
    image: 'https://img.spoonacular.com/recipes/716627-312x231.jpg',
    calories: 220,
    protein: 12,
    carbs: 30,
    fat: 6,
    sugar: 3,
    sodium: 450,
    gi: { label: 'Medium GI', emoji: '🟡', level: 'medium' },
    ingredients: [
      { name: 'toor dal', amount: 1, unit: 'cup' },
      { name: 'onion', amount: 1, unit: '' },
      { name: 'tomato', amount: 1, unit: '' },
      { name: 'turmeric', amount: 0.5, unit: 'tsp' },
      { name: 'cumin seeds', amount: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'fallback-2',
    name: 'Ragi Porridge',
    image: 'https://img.spoonacular.com/recipes/639851-312x231.jpg',
    calories: 180,
    protein: 7,
    carbs: 35,
    fat: 2,
    sugar: 4,
    sodium: 120,
    gi: { label: 'Low GI', emoji: '🟢', level: 'low' },
    ingredients: [
      { name: 'ragi flour', amount: 3, unit: 'tbsp' },
      { name: 'milk', amount: 1, unit: 'cup' },
      { name: 'jaggery', amount: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'fallback-3',
    name: 'Palak Paneer',
    image: 'https://img.spoonacular.com/recipes/654959-312x231.jpg',
    calories: 310,
    protein: 18,
    carbs: 12,
    fat: 22,
    sugar: 3,
    sodium: 380,
    gi: { label: 'Low GI', emoji: '🟢', level: 'low' },
    ingredients: [
      { name: 'spinach', amount: 2, unit: 'cups' },
      { name: 'paneer', amount: 200, unit: 'g' },
      { name: 'onion', amount: 1, unit: '' },
      { name: 'ginger-garlic paste', amount: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'fallback-4',
    name: 'Moong Dal Soup',
    image: 'https://img.spoonacular.com/recipes/632252-312x231.jpg',
    calories: 150,
    protein: 10,
    carbs: 22,
    fat: 3,
    sugar: 2,
    sodium: 200,
    gi: { label: 'Low GI', emoji: '🟢', level: 'low' },
    ingredients: [
      { name: 'moong dal', amount: 0.5, unit: 'cup' },
      { name: 'carrot', amount: 1, unit: '' },
      { name: 'cumin', amount: 1, unit: 'tsp' },
      { name: 'lemon juice', amount: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'fallback-5',
    name: 'Oats Upma',
    image: 'https://img.spoonacular.com/recipes/652423-312x231.jpg',
    calories: 200,
    protein: 8,
    carbs: 28,
    fat: 7,
    sugar: 3,
    sodium: 350,
    gi: { label: 'Medium GI', emoji: '🟡', level: 'medium' },
    ingredients: [
      { name: 'rolled oats', amount: 1, unit: 'cup' },
      { name: 'onion', amount: 1, unit: '' },
      { name: 'green chili', amount: 1, unit: '' },
      { name: 'mustard seeds', amount: 1, unit: 'tsp' },
      { name: 'curry leaves', amount: 5, unit: '' },
    ],
  },
];

function getFallbackMeals() {
  return {
    breakfast: FALLBACK_MEALS[1], // Ragi Porridge
    lunch:     FALLBACK_MEALS[0], // Dal Tadka
    dinner:    FALLBACK_MEALS[2], // Palak Paneer
    allResults: {
      breakfast: [FALLBACK_MEALS[1]],
      lunch:     [FALLBACK_MEALS[0]],
      dinner:    [FALLBACK_MEALS[2]],
    },
    isFallback: true,
  };
}

export { FALLBACK_MEALS };
