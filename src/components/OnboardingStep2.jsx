import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const conditionOptions = [
  { emoji: '🩺', label: 'Diabetes' },
  { emoji: '🥩', label: 'High Cholesterol' },
  { emoji: '💓', label: 'Hypertension' },
  { emoji: '🌸', label: 'PCOD' },
  { emoji: '🦋', label: 'Thyroid' },
  { emoji: '⚖️', label: 'Obesity' },
];

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const { saveProfile } = useUser();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [conditions, setConditions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(false);

  const toggleCondition = (condition) => {
    setNoneSelected(false);
    setConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const handleNone = () => {
    setNoneSelected(true);
    setConditions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dob || !height || !weight) {
      alert('Please fill in all required fields');
      return;
    }
    saveProfile({
      name,
      dob,
      height: parseFloat(height),
      weight: parseFloat(weight),
      conditions: noneSelected ? ['None'] : conditions,
    });
    navigate('/home');
  };

  return (
    <div className="bg-soft-gradient min-h-screen text-on-background font-body-md antialiased">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 w-full bg-white/60 backdrop-blur-xl fixed top-0 z-50">
        <button
          onClick={() => navigate('/onboarding/step1')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-container"></div>
          <div className="w-6 h-2 rounded-full bg-primary"></div>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 pb-32 px-container-margin max-w-lg mx-auto">
        <section className="mb-xl">
          <h1 className="font-h1 text-h1 text-on-background mb-base">Let's get to know you better</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tell us a bit about yourself so NourishMe can tailor your meal plans.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Full Name */}
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-6 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline-variant font-body-md"
                placeholder="Alex Johnson"
                required
              />
              <span className="material-symbols-outlined absolute right-6 top-4 text-outline-variant">person</span>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-14 px-6 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container transition-all font-body-md text-on-surface"
                required
              />
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Height</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-14 pl-6 pr-16 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container transition-all font-body-md"
                  placeholder="175"
                  required
                />
                <div className="absolute right-2 top-2 bg-white px-3 py-2 rounded-md shadow-sm font-label-sm text-primary">cm</div>
              </div>
            </div>
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Weight</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-14 pl-6 pr-16 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container transition-all font-body-md"
                  placeholder="70"
                  required
                />
                <div className="absolute right-2 top-2 bg-white px-3 py-2 rounded-md shadow-sm font-label-sm text-primary">kg</div>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-md pt-base">
            <div className="flex items-center justify-between ml-sm">
              <label className="font-label-md text-label-md text-on-surface-variant">Health Conditions</label>
              <span className="font-label-sm text-label-sm text-outline">Optional</span>
            </div>
            <div className="grid grid-cols-2 gap-sm">
              {conditionOptions.map(({ emoji, label }) => (
                <label key={label} className="relative cursor-pointer group">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={conditions.includes(label)}
                    onChange={() => toggleCondition(label)}
                  />
                  <div className="flex items-center gap-base p-4 rounded-lg bg-white border border-transparent shadow-[0_10px_20px_rgba(220,214,255,0.05)] transition-all peer-checked:border-primary-container peer-checked:bg-primary-container/20 group-hover:bg-surface-container-low">
                    <span className="text-lg">{emoji}</span>
                    <span className="font-label-md text-label-md text-on-surface">{label}</span>
                  </div>
                </label>
              ))}
              <label className="relative cursor-pointer group col-span-2">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={noneSelected}
                  onChange={handleNone}
                />
                <div className="flex items-center justify-center gap-base p-4 rounded-lg bg-white border border-transparent shadow-[0_10px_20px_rgba(220,214,255,0.05)] transition-all peer-checked:border-primary-container peer-checked:bg-primary-container/20 group-hover:bg-surface-container-low">
                  <span className="text-lg">✨</span>
                  <span className="font-label-md text-label-md text-on-surface">None</span>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-secondary-container/30 p-md rounded-lg flex gap-md items-start">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px] pt-xs">lock</span>
            <p className="font-label-sm text-label-sm text-on-secondary-container leading-relaxed">
              Your data stays private and is only used for personalized suggestions 🔒
            </p>
          </div>
        </form>
      </main>

      {/* Fixed Submit */}
      <footer className="fixed bottom-0 left-0 w-full p-container-margin bg-white/70 backdrop-blur-2xl z-50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            className="w-full h-16 bg-primary text-on-primary font-label-md text-body-lg rounded-full shadow-[0_10px_30px_rgba(94,90,125,0.3)] hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-sm"
          >
            Complete Profile
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </footer>

      {/* Decorative BGs */}
      <div className="fixed -bottom-24 -right-24 w-80 h-80 opacity-20 pointer-events-none z-[-1]">
        <img className="w-full h-full object-contain blur-md transform rotate-12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUTQRTQG6Kd8xLt-luQCSM0oJYfyZPFAI18pH5p2Rq6-tzjRFN7-bSX7YiKaSvmn2ax6bIYhfqeKqWeHjKomJmpkQDijX7gU5mY9GUIwTgXx9RNy5H0ByL39Rs_BVsOJlpHveplurVPV7K6T3HAVcgPl3H75BqKnF5nGaDFosT2Mzc_ClLbSGRitIFbkACRv00beXi41UYJ3tV5unRjCyVrPmFQYYHeVe6CwRZHt-PSaVsAMhVb2smvVZZoM6GUfltj2RZm01rvQ" alt="" />
      </div>
    </div>
  );
}
