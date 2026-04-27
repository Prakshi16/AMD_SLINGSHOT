import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

export default function MealDetail() {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ingredients');

  // Placeholder meal data
  const meal = {
    name: 'Zesty Salmon Bowl',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2-jpDWvXhvfMZY5Yj9_PQcR_WkRrgfsaCP0dNRJ9izZehDkhVWKgdWaLasg1tqKG_wAYVmhftVCQ8nN3dgz3tNCG4RWLgiKFR4wKgKgRD7sSUHJN165Za4ALZxjXQ-lWE6yaFXDryhvubwP5XfF-dMr1klRRF38_B02XzS1qEyfb3qAZ75GkMxzMrcioM-K6r2imNWmYIkE2TqutC0FB13n0p23uhDWivB02m847fyrg_y_FeUJxZcFTTCYk71e4yP8w4xNNUbA',
    ingredients: [
      { name: 'Fresh Atlantic Salmon', qty: '150g, cubed', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB-3HkT3IlbWVxxj1BfKOI_Ezt_DCHlLnmGKmk8g4nz2ZvyuIbmOPxHM2SXM1IkQvjiWBdl3MJVxIYyPoM-izSeapN0KDMqB-O17xBJ_h1ulJ8ayOzZtHIKTl3X5YV2iTVb4k3WeLPwPjXKuraeXUPxee2ydDaeFruFRCiHhgxeKao1n7JUHRBkvCMgicA0Rdbv_sZX6HnC5xvMukho3KLhn8bh5B8NhFp8RFCPu66Pfmy2SBghKWkUFAugsosv-iu5JDB-9B-rQ', checked: true },
      { name: 'Ripe Avocado', qty: '1/2 medium, sliced', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCOXBGOX74DkLZtTHFdwR3g32mQgLDC1lGsP3Ho1qOxTIqYFtHyIi4Mc0oapeRzabY19xVYix9PCuTG53cKumwH8fQdPKAG3L0OP7kFOGMs8kcAmNCH3dunNWBVj0okHjzJNIvrBOFwDHEl6dHb4NNQ51NizpxxzT8BFiWOsMmxPOEZ8vySbgR0rO2mZPl223Q2Q9-cQOU70QTjtjkNn7kuyAs89uXyOqAfAsuGhQYv-3f6U5Wb40XYYJtsGLQc_qkB7OFSx2WdQ', checked: false },
      { name: 'Shelled Edamame', qty: '50g, steamed', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIsN8-KRzh9rpmo0T7Y3UjjlecE_b2kqdwKAMWkYUWfZljUA1GNwZRe0aAUHWWsUp7tKITReMcwdceWZ1n2ei_sEes9yKo43tOf588tnsz5W5Cr8-b3-F7XTdwCeRfqs4tlDdQtImhv86CgceNtmTRM7PX4aAPMz_O1EpmmiXQlDbonRQLHdXgEwXixstjiiQdlSrnMytHiS86vgCUxsLcz2DcKENVb-stDVcAIe7zP-XpOsn8dJJo0SC_dOlvxv4AZYcAuVBzLA', checked: false },
    ],
  };

  const total = meal.protein + meal.carbs + meal.fat;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 flex justify-between items-center px-6 py-4 bg-white/60 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-95 transition-transform">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface">share</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </button>
        </div>
      </header>

      <main className="pb-32">
        {/* Hero */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary-fixed/30 rounded-b-xl"></div>
          <img alt={meal.name} className="relative z-10 w-72 h-72 object-contain drop-shadow-2xl" src={meal.image} />
          <div className="absolute top-1/4 right-10 w-12 h-12 bg-secondary-container/40 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-tertiary-container/40 rounded-full blur-xl"></div>
        </section>

        {/* Content */}
        <article className="px-container-margin -mt-10 relative z-20 space-y-lg">
          {/* Title Card */}
          <div className="bg-white p-lg rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-md">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface">{meal.name}</h1>
              <p className="text-on-surface-variant font-label-md flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                {meal.calories} kcal per serving
              </p>
            </div>
            <div className="flex flex-wrap gap-sm pt-2">
              <span className="px-md py-xs bg-primary-container text-on-primary-container rounded-full font-label-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span> Protein: {meal.protein}g
              </span>
              <span className="px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Carbs: {meal.carbs}g
              </span>
              <span className="px-md py-xs bg-tertiary-container text-on-tertiary-container rounded-full font-label-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span> Fats: {meal.fat}g
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-surface-container-low p-1.5 rounded-full flex gap-1">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-4 rounded-full font-label-md transition-colors ${activeTab === 'ingredients' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('directions')}
              className={`flex-1 py-2 px-4 rounded-full font-label-md transition-colors ${activeTab === 'directions' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
            >
              Directions
            </button>
          </div>

          {/* Ingredients */}
          {activeTab === 'ingredients' && (
            <section className="space-y-sm">
              <h2 className="font-h3 text-h3 px-2">What you'll need</h2>
              <div className="grid grid-cols-1 gap-sm">
                {meal.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-md p-md bg-white rounded-md border border-outline-variant/30">
                    <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden">
                      <img className="w-full h-full object-cover" src={ing.img} alt={ing.name} />
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface">{ing.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{ing.qty}</p>
                    </div>
                    <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${ing.checked ? 'border-primary' : 'border-outline'}`}>
                      {ing.checked && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Directions */}
          {activeTab === 'directions' && (
            <section className="space-y-sm">
              <h2 className="font-h3 text-h3 px-2">How to prepare</h2>
              <div className="space-y-md">
                {['Cube the salmon into bite-sized pieces and season with salt, pepper, and a squeeze of lime.', 'Steam the edamame for 5 minutes until tender.', 'Slice the avocado and arrange all ingredients in a bowl over a bed of brown rice.', 'Drizzle with soy sauce and sesame oil. Garnish with sesame seeds and pickled ginger.'].map((step, i) => (
                  <div key={i} className="flex gap-md p-md bg-white rounded-md border border-outline-variant/30">
                    <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center font-label-md text-on-primary-container flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="font-body-md text-on-surface">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nutrition Breakdown */}
          <section className="bg-white p-lg rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-md">
            <h3 className="font-h3 text-h3">Nutrition Breakdown</h3>
            <div className="flex items-center gap-xl">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(#5e5a7d 0% ${(meal.protein / total * 100).toFixed(0)}%, #356851 ${(meal.protein / total * 100).toFixed(0)}% ${((meal.protein + meal.carbs) / total * 100).toFixed(0)}%, #765842 ${((meal.protein + meal.carbs) / total * 100).toFixed(0)}% 100%)`
                  }}
                ></div>
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="font-h3 text-primary">{meal.calories}</span>
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase">kcal</span>
                </div>
              </div>
              <div className="flex-1 space-y-base">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-label-sm text-on-surface">Protein</span>
                  </div>
                  <span className="text-label-sm font-bold">{meal.protein}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="text-label-sm text-on-surface">Carbs</span>
                  </div>
                  <span className="text-label-sm font-bold">{meal.carbs}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                    <span className="text-label-sm text-on-surface">Fats</span>
                  </div>
                  <span className="text-label-sm font-bold">{meal.fat}g</span>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-container-margin bg-white/80 backdrop-blur-md z-40">
        <button className="w-full bg-primary text-white py-4 rounded-full font-label-md flex items-center justify-center gap-2 shadow-lg shadow-primary-container/50 hover:scale-[0.98] transition-transform">
          <span className="material-symbols-outlined">add_circle</span>
          Log to Today's Diary
        </button>
      </div>
    </div>
  );
}
