You are a senior React developer. I have extracted a React UI 
from Stitch for a mobile health food app called NourishMe. 
The UI has 8 screens built with pastel colors (lavender, mint, 
peach), rounded cards, bottom nav, and Tailwind CSS.

Use the Stitch MCP extension to fetch all NourishMe 
screens directly. Do not wait for me to paste any code.

This must be a mobile-first Progressive Web App (PWA) 
with max-width 390px, runs in the browser, installable 
on Android/iOS via "Add to Home Screen".

Your job is to wire up full functionality into this React app. 
Here is exactly what to build:

---

## TECH STACK
- React (from Stitch output)
- Tailwind CSS
- Spoonacular Food API (free tier) for real Indian meal data
- You (Antigravity LLM) as the AI chat backend via fetch calls
- GCP Cloud Run for deployment (Dockerfile needed)

---
## 0. SIGN UP / LOG IN FLOW (UI WIRING ONLY)

The app has two entry points from the Sign Up / Log In screen:

LOG IN:
- Show a single input for name (no password, no auth backend)
- On submit, load existing profile from localStorage
- Route directly to Home Dashboard

SIGN UP:
- Route: SignUp screen (Screen 0) → Onboarding Step 1 
  (dietary style/goals/allergies) → Onboarding Step 2 / 
  Health Profile (name, DOB, height, weight, conditions)
- On final submit of Step 2, save entire profile to 
  UserContext + localStorage
- Route to Home Dashboard
- The Health Profile screen (Step 2) must NEVER appear 
  again after sign up is complete

PROFILE AVATAR (Home Dashboard — top right):
- Show a circular lavender avatar with user's initials
- On tap, open a right slide-in panel showing:
  - User's full name + age (calculated from DOB)
  - BMI badge (color-coded as defined in Section 5)
  - Health condition pills in pastel style
  - Diet style tag
- This panel pulls data from UserContext only
- Panel closes on outside tap or X button

On app load:
- If localStorage has a saved profile → skip Sign Up/Onboarding
  → go directly to Home Dashboard
- If no profile found → show Sign Up / Log In screen

## 1. HEALTH PROFILE (Screen 7 — Onboarding Step 2)

Store this in React state (useState) and localStorage:
- name: string
- dob: date → auto-calculate age
- height: number (cm)
- weight: number (kg) → auto-calculate BMI
- conditions: array — options are:
  ["Diabetes", "High Cholesterol", "Hypertension", 
   "PCOD", "Thyroid", "Obesity", "None"]
- dietStyle: string (from Screen 1 onboarding)
- allergies: array (from Screen 1 onboarding)

After saving, route to Home Dashboard.

---

## 2. SPOONACULAR API INTEGRATION

API base: https://api.spoonacular.com/recipes/complexSearch
Always include: &cuisine=indian&addRecipeNutrition=true&number=3
Store the API key in a .env file as REACT_APP_SPOONACULAR_KEY.

Build a function: getConditionParams(conditions[]) that maps:
- "Diabetes" → &maxSugar=10&diet=whole30
- "High Cholesterol" → &diet=low-fat
- "Hypertension" → &maxSodium=600
- "PCOD" → &diet=low-carb
- "Thyroid" → &diet=balanced
- "Obesity" → &maxCalories=400
- Multiple conditions → merge all params

Call this on the Home Dashboard to fetch:
- 1 breakfast result: &type=breakfast + condition params
- 1 lunch result: &type=main+course + condition params  
- 1 dinner result: &type=dinner + condition params

Show a loading skeleton (pastel shimmer card) while fetching.
Cache results in localStorage for 1 hour to save API points.

---

## 3. MEAL CARD LOGIC (Home Dashboard)

Each meal card must show:
- Meal name + food image from Spoonacular
- Calories (from nutrition data)
- Macro badges: Protein / Carbs / Fat in pastel pill tags
- GI Badge: calculate from sugar + carb content:
  - sugar < 5g AND carbs < 20g → 🟢 Low GI
  - sugar 5–15g OR carbs 20–40g → 🟡 Medium GI
  - else → 🔴 High GI
- Condition Warning Tag: if user has Diabetes and GI is High, 
  show a small ⚠️ "Use caution" tag on the card
When injecting GI badge and caution tag into the Stitch 
components, place GI badge at top-right of meal card and 
⚠️ "Use caution" pill at bottom-left. Both must fit within 
the existing card layout without resizing it.
---

## 4. MEAL DETAIL PAGE

On card tap, show:
- Large food image
- Full macro breakdown (donut chart using a simple CSS 
  conic-gradient — no external chart library needed)
- Ingredients list from Spoonacular
- Cooking instructions from Spoonacular
- GI badge (prominent)
- "Suitable For" section: list which conditions this meal 
  is good for based on its nutrition profile

---

## 5. HEALTH PROFILE PAGE

Accessible from nav bar (person icon). Show:
- Name, Age (calculated from DOB), BMI (calculated from 
  height/weight) with a color indicator:
  BMI < 18.5 → Underweight (blue)
  18.5–24.9 → Healthy (green)  
  25–29.9 → Overweight (yellow)
  30+ → Obese (red)
- Active conditions as colored pill tags
- Edit button to update profile
- Daily Health Tip card: one-line AI-generated tip based 
  on their conditions (call Antigravity once on page load,
  prompt: "Give one 15-word food tip for someone with 
  [conditions]. Be specific and friendly.")

---

## 6. AI CHAT SCREEN

This screen calls Antigravity LLM. Build a chat interface where:

System prompt to send with every message:
"You are NourishMe's health nutrition assistant. 
The user's profile: Name=[name], Age=[age], 
Conditions=[conditions], Diet=[dietStyle]. 
You ONLY discuss food, nutrition, health, and meal advice. 
Keep responses under 3 sentences. Be warm and Gen Z friendly. 
Always suggest Indian food options when recommending meals."

User message → send to Antigravity → stream response back 
into the chat bubble UI.

Show typing indicator (animated dots) while waiting.
First message on load: "Hey [name]! 🌿 I'm your NourishMe 
assistant. Ask me anything about food, nutrition, or what 
to eat today based on your health profile!"

Call Antigravity using the same fetch pattern as the 
Anthropic /v1/messages endpoint already available in 
this environment. Use model: "claude-sonnet-4-20250514",
max_tokens: 1000. Pass system prompt + user message 
in the messages array. Handle streamed response and 
render tokens into the chat bubble as they arrive.

If streakDays > 0, the AI's first message each day must 
include: "You're on a 🔥 [n] day streak — keep it going!"
If streakDays === 0, first message says: 
"Let's start a new streak today 💪 Here's what I'd suggest..."
---

## 7. STATS / PROGRESS PAGE

Show:
- BMI card with color indicator (reuse from profile)
- Weekly calorie bar chart — use 7 dummy data points 
  shaped like realistic intake (no external chart lib, 
  use CSS bars with Tailwind heights)
- Macro split for today (from fetched meals: sum protein, 
  carbs, fat) shown as 3 horizontal progress bars
- Condition summary: "Eating plan optimized for: 
  [condition pills]"

---

## 8. BROWSE / DISCOVER

Search bar calls Spoonacular:
/complexSearch?cuisine=indian&query=[userInput]
  + condition params + &number=9

Filter chips (Breakfast / Lunch / Dinner / High Protein / 
Low Carb / Diabetic-Safe) → each maps to Spoonacular params.

Grid of 9 meal cards. Tap → Meal Detail Page.

---

## 9. ERROR HANDLING

- If Spoonacular API fails or points run out → show 5 
  hardcoded fallback Indian meals (dal tadka, ragi porridge, 
  palak paneer, moong dal soup, oats upma) with mock 
  nutrition values
- If Antigravity chat fails → show "I'm resting for a moment,
  try again in a sec 🌿"

---

## 10. GCP CLOUD RUN DEPLOYMENT

Create a Dockerfile:
- FROM node:18-alpine
- Build the React app (npm run build)
- Serve with serve -s build on port 8080
- Expose PORT 8080 (Cloud Run requirement)
Also create public/manifest.json with:
- name: "NourishMe"
- short_name: "NourishMe"  
- start_url: "/"
- display: "standalone"
- theme_color: "#E8E0FF"
- background_color: "#FFFFFF"
- icons: use a 192x192 and 512x512 placeholder

Add <meta name="viewport" content="width=device-width, 
initial-scale=1, maximum-scale=1"> in public/index.html

Create a .env.example with:
REACT_APP_SPOONACULAR_KEY=your_key_here

In package.json add:
"build": "react-scripts build"
"start:prod": "serve -s build -l 8080"

---

## 11. USER BEHAVIOR TRACKING

Track these 3 micro-behaviors in localStorage:
- mealsViewed: array of meal IDs the user tapped into
- mealsSkipped: array of meal IDs user swiped past 
  or ignored 3+ days in a row
- streakDays: count of consecutive days app was opened

Use this data in two places:
1. Home Dashboard — below meal cards, show a small 
   "🔥 Day [n] streak" pill badge in peach color
2. Spoonacular search — if a meal ID appears in 
   mealsSkipped, exclude it from recommendations by 
   adding its title to &excludeIngredients= or simply 
   re-fetching until a different result appears

No complex logic — just read/write localStorage arrays.

Render the 🔥 Day [n] streak peach pill directly below 
the weekly calendar strip in HomeScreen.jsx — slot it 
between the calendar and the "Today's Recommendations" 
heading.

---

## IMPORTANT CONSTRAINTS
1. Use React useState + useContext (UserContext) for all 
   runtime state. Use localStorage ONLY for:
   - Saved user profile (persist across sessions)
   - 1-hour Spoonacular API cache
   - mealsViewed, mealsSkipped, streakDays behavior tracking
   Never use localStorage for anything else.
2. All styling via Tailwind utility classes only
3. Single-file components where possible to keep it clean
4. Mobile-first: max-width 390px, everything scrollable
5. No login/auth needed — single user local app

---

Start by:
1. Fetch all NourishMe screens via the Stitch MCP 
   extension and convert them into individual React 
   JSX components. One file per screen. Keep ALL 
   Tailwind classes exactly as they are. Name them:
   SignUpScreen.jsx, HomeScreen.jsx, MealCard.jsx, 
   ChatScreen.jsx, BrowseScreen.jsx, StatsScreen.jsx, 
   ProfileScreen.jsx, OnboardingStep1.jsx, 
   OnboardingStep2.jsx, NavBar.jsx
   STOP. List all files created and wait for approval.

2. Create UserContext.js and spoonacularService.js only.
   STOP. Show both files and wait for "continue".

3. Wire up the onboarding flow (SignUp → Step1 → Step2 
   → UserContext) only.
   STOP. Wait for "continue".

4. Build screens one at a time in this order:
   HomeScreen → MealDetail → ChatScreen → BrowseScreen 
   → StatsScreen → ProfileScreen
   After EACH screen: STOP and wait for "looks good, 
   continue" before moving to the next screen.

5. Only after all screens are approved, generate:
   Dockerfile, manifest.json, .env.example
   STOP. Wait for final approval before any changes.

Do NOT proceed to the next step without explicit 
approval. If uncertain, ask rather than assume.