import { useState } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileScreen() {
  const { user, getAge, getBMI, getBMICategory, getInitials, updateProfile, logout } = useUser();
  const navigate = useNavigate();
  const bmiCat = getBMICategory();
  const [showEdit, setShowEdit] = useState(false);
  const [editHeight, setEditHeight] = useState(user?.height || '');
  const [editWeight, setEditWeight] = useState(user?.weight || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveEdit = () => {
    if (!editHeight || !editWeight) return;
    updateProfile({
      height: parseFloat(editHeight),
      weight: parseFloat(editWeight),
    });
    setShowEdit(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 flex justify-between items-center px-6 py-4">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-indigo-500">My Profile</h1>
        <span className="material-symbols-outlined text-indigo-400 hover:opacity-80 transition-opacity cursor-pointer">settings</span>
      </header>

      <main className="pt-24 pb-32 px-container-margin space-y-xl">
        {/* Profile Card */}
        <section className="bg-white rounded-lg p-lg shadow-[0_10px_40px_rgba(220,214,255,0.12)] border border-surface-container text-center space-y-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-h1 text-2xl shadow-md ring-4 ring-white">
            {getInitials()}
          </div>
          <div>
            <h2 className="font-h2 text-on-surface">{user?.name || 'User'}</h2>
            <p className="font-label-md text-on-surface-variant">{getAge()} years old</p>
          </div>
          <div className="flex justify-center gap-sm">
            {user?.dietStyle && (
              <span className="px-md py-xs bg-primary-container text-on-primary-container rounded-full font-label-sm">
                {user.dietStyle}
              </span>
            )}
            <span className={`px-md py-xs rounded-full font-label-sm font-bold ${bmiCat.bg} ${bmiCat.color}`}>
              BMI: {getBMI()} · {bmiCat.label}
            </span>
          </div>
        </section>

        {/* Health Conditions */}
        <section className="space-y-md">
          <h3 className="font-h3 text-on-surface">Health Conditions</h3>
          <div className="flex flex-wrap gap-sm">
            {(user?.conditions || ['None']).map(c => (
              <span key={c} className="px-md py-xs bg-primary-container/30 text-on-primary-container rounded-full font-label-sm border border-primary-container/50">
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Body Metrics */}
        <section className="grid grid-cols-2 gap-md">
          <div className="bg-surface-container-low p-lg rounded-lg text-center">
            <p className="font-label-sm text-on-surface-variant">Height</p>
            <p className="font-h2 text-primary">{user?.height || '--'} <span className="text-sm font-normal">cm</span></p>
          </div>
          <div className="bg-surface-container-low p-lg rounded-lg text-center">
            <p className="font-label-sm text-on-surface-variant">Weight</p>
            <p className="font-h2 text-primary">{user?.weight || '--'} <span className="text-sm font-normal">kg</span></p>
          </div>
        </section>

        {/* Allergies */}
        {user?.allergies && user.allergies.length > 0 && (
          <section className="space-y-md">
            <h3 className="font-h3 text-on-surface">Allergies</h3>
            <div className="flex flex-wrap gap-sm">
              {user.allergies.map(a => (
                <span key={a} className="px-md py-xs bg-error-container text-on-error-container rounded-full font-label-sm">
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Daily Health Tip */}
        <section className="bg-secondary-container/30 p-lg rounded-lg border border-secondary-container/50 space-y-base">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
            <h3 className="font-h3 text-on-secondary-container">Daily Health Tip</h3>
          </div>
          <p className="font-body-md text-on-secondary-fixed-variant">
            Try adding turmeric to your morning smoothie — it's anti-inflammatory and pairs great with mangoes! 🌿
          </p>
        </section>

        {/* Actions */}
        <section className="space-y-sm">
          <button
            onClick={() => setShowEdit(true)}
            className="w-full py-md bg-primary-container text-on-primary-container font-label-md rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-md bg-error-container text-on-error-container font-label-md rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            Log Out
          </button>
        </section>
      </main>

      {/* Edit Profile Modal (inline — no routing to onboarding) */}
      {showEdit && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowEdit(false)}
          ></div>

          {/* Sheet */}
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[32px] p-container-margin pb-xl shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto mb-xl"></div>
            <h2 className="font-h2 text-on-surface mb-lg">Update Metrics</h2>

            <div className="grid grid-cols-2 gap-md mb-xl">
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full h-14 pl-6 pr-16 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container font-body-md"
                    placeholder="175"
                  />
                  <div className="absolute right-2 top-2 bg-white px-3 py-2 rounded-md shadow-sm font-label-sm text-primary">cm</div>
                </div>
              </div>
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant ml-sm">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full h-14 pl-6 pr-16 rounded-lg bg-[#F7F7F9] border-none focus:ring-2 focus:ring-primary-container font-body-md"
                    placeholder="70"
                  />
                  <div className="absolute right-2 top-2 bg-white px-3 py-2 rounded-md shadow-sm font-label-sm text-primary">kg</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveEdit}
              className="w-full py-md bg-primary text-on-primary font-label-md rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
