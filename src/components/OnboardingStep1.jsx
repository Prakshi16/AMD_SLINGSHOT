import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const dietStyles = ['Vegan', 'Keto', 'Balanced', 'Paleo', 'Vegetarian'];
const goals = [
  { icon: 'fitness_center', label: 'Build muscle' },
  { icon: 'monitor_weight', label: 'Lose weight' },
  { icon: 'auto_awesome', label: 'Eat cleaner' },
  { icon: 'bolt', label: 'Improve energy' },
];
const allergyOptions = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs'];

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData } = useUser();
  const [selectedDiet, setSelectedDiet] = useState(onboardingData.dietStyle || '');
  const [selectedGoals, setSelectedGoals] = useState(onboardingData.goals || []);
  const [selectedAllergies, setSelectedAllergies] = useState(onboardingData.allergies || []);

  const toggleGoal = (goal) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleAllergy = (allergy) => {
    if (allergy === 'None') {
      setSelectedAllergies([]);
      return;
    }
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleNext = () => {
    setOnboardingData({
      dietStyle: selectedDiet,
      goals: selectedGoals,
      allergies: selectedAllergies,
    });
    navigate('/onboarding/step2');
  };

  return (
    <div className="bg-onboarding-gradient min-h-screen text-on-surface font-body-md overflow-x-hidden relative">
      {/* Decorative */}
      <div className="fixed top-0 right-0 -z-10 w-64 h-64 bg-tertiary-fixed rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-secondary-fixed rounded-full blur-[120px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

      <main className="max-w-md mx-auto px-container-margin pt-xl pb-xxl min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="text-label-sm uppercase tracking-widest text-outline">Setup Profile</div>
            <div className="w-10"></div>
          </div>
          <h1 className="font-h1 text-h1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-on-primary-container mb-xs">
            Personalize your plate
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Help us tailor your daily recipes and health insights to your unique lifestyle.
          </p>
        </header>

        {/* Dietary Style */}
        <section className="mb-xl">
          <div className="flex items-center gap-base mb-md">
            <img alt="Salad icon" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBStQ_t3EQEObY0lsynZ_KEQmvFtaNSFZiwdOh4qXscZ2z3zlQKbbSnzg_8ESNwAOusT8mngKu8c_2gGvrGKsA1sVariyke52uoCbhsZSnh8vYLtkz3TjdLqfn_bieFqTmS3eNshSkpyxJW16kmhf7MaX3Djx9H8l2o9RYt_qz2CE-dAp6IiRHk05163BRwwXlQvZPp2XVD-jON-F_YLIsI10GZJZA-8fydPm32N3ct7ans4IaqcraOTjnhV5xf4YSO4VPlfwkSFQ" />
            <h2 className="font-h2 text-h2 text-on-surface">What's your dietary style?</h2>
          </div>
          <div className="flex flex-wrap gap-sm">
            {dietStyles.map(diet => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-lg py-sm rounded-full font-label-md text-label-md shadow-sm transition-all ${
                  selectedDiet === diet
                    ? 'bg-primary-container text-on-primary-container shadow-md ring-2 ring-primary-container ring-offset-2 ring-offset-background'
                    : 'glass-card border-none text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </section>

        {/* Health Goals */}
        <section className="mb-xl">
          <div className="flex items-center gap-base mb-md">
            <img alt="Target icon" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFqbn7EN_JfSxNTkox8gB10YxLPfGF61y3NCht_eMwwWUQIKAm_xARaU5kVAEZx8W9ROW3l9sFztHHVAGSf-m1wWLwfS8yOtoO0ldLKrWafDVxBMaqAvWnbUJIHCp5xvnHlFTuImRWmFLp8fNkM71qLtU6J_5erc_79oUV3xAzO0RpsRdrNwpd_DF0gvH6R6Z03S2V8u-gknleCeZIOkkwLqrtOpGsQRTZoAae9qGZouOX0FeSdpLykzEG29Sr70v2SFkZuyF0Kw" />
            <h2 className="font-h2 text-h2 text-on-surface">What are your health goals?</h2>
          </div>
          <div className="grid grid-cols-2 gap-sm">
            {goals.map(goal => (
              <button
                key={goal.label}
                onClick={() => toggleGoal(goal.label)}
                className={`p-lg rounded-lg flex flex-col items-start gap-xs text-left transition-all ${
                  selectedGoals.includes(goal.label)
                    ? 'bg-secondary-container/50 border-2 border-secondary'
                    : 'glass-card hover:border-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {goal.icon}
                </span>
                <span className="font-label-md text-label-md">{goal.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Allergies */}
        <section className="mb-xxl">
          <div className="flex items-center gap-base mb-md">
            <img alt="Block icon" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHUdgDY4dHyot4pFuz9C4sxr3ZFLYqLaMtzAGqFEOb8pX1KPSdyUb22GnKEG7OskaOCAlbBc2uic0l3NbiBBrUYLpp9Iilb2RQJtuc3lEtPQVHrvpXEArGCzElzetwgZsbF8Kwj9IIISLpBZqNNEKvtliWvRdFkGcgka-3aavHfkadUCaxlKxZlBqtFam5FEq9jSaW3TjZ1FYDh-eT0cy27d9TCYzobPcE1gvXcmpI-eqDezel79yiI7uwRCl8nM0cxi5_rRABAg" />
            <h2 className="font-h2 text-h2 text-on-surface">Any allergies?</h2>
          </div>
          <div className="flex flex-wrap gap-sm">
            {allergyOptions.map(allergy => (
              <button
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
                className={`flex items-center gap-xs px-md py-base rounded-full font-label-sm text-label-sm transition-all ${
                  selectedAllergies.includes(allergy)
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-low border border-outline-variant'
                }`}
              >
                {allergy}
                {selectedAllergies.includes(allergy) && (
                  <span className="material-symbols-outlined text-sm">close</span>
                )}
              </button>
            ))}
            <button
              onClick={() => toggleAllergy('None')}
              className={`px-md py-base rounded-full font-label-sm text-label-sm ${
                selectedAllergies.length === 0
                  ? 'bg-secondary-fixed text-on-secondary-fixed'
                  : 'bg-surface-container-low border border-outline-variant'
              }`}
            >
              None
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-auto pt-lg space-y-lg">
          <div className="flex flex-col items-center gap-base">
            <div className="flex gap-xs">
              <div className="w-8 h-1.5 rounded-full bg-primary shadow-sm"></div>
              <div className="w-8 h-1.5 rounded-full bg-outline-variant/30"></div>
            </div>
            <p className="font-label-sm text-label-sm text-outline">Step 1 of 2</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-xl rounded-full bg-primary text-on-primary font-h3 text-h3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-base"
          >
            Next
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
