import { useUser } from '../UserContext';

export default function StatsScreen() {
  const { user, getInitials } = useUser();
  const userName = user?.name?.split(' ')[0] || 'Alex';

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-white/60 backdrop-blur-xl fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 flex justify-between items-center px-6 py-4 border-none shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            <span className="text-on-primary-container font-h3 text-sm">{getInitials()}</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-indigo-400">Hey {userName}!</h1>
        </div>
        <div className="flex items-center">
          <span className="material-symbols-outlined text-indigo-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">notifications</span>
        </div>
      </header>

      <main className="pt-24 px-container-margin space-y-xl pb-32">
        {/* Total Calories Summary */}
        <section>
          <div className="bg-white rounded-lg p-lg shadow-[0_10px_40px_rgba(220,214,255,0.12)] border border-surface-container flex justify-between items-center overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl"></div>
            <div>
              <p className="font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Daily Average</p>
              <h2 className="font-h1 text-primary">1,842</h2>
              <p className="font-label-md text-on-secondary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                4% from last week
              </p>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-on-surface-variant mb-1">Weekly Total</p>
              <h3 className="font-h2 text-on-surface">12,894</h3>
              <p className="font-label-md text-on-surface-variant">kcal</p>
            </div>
          </div>
        </section>

        {/* Macro Breakdown Chart */}
        <section className="space-y-md">
          <div className="flex justify-between items-end">
            <h3 className="font-h3 text-on-surface">Macro Breakdown</h3>
            <div className="flex gap-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-[10px] font-bold text-on-surface-variant">PROTEIN</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-200"></div>
                <span className="text-[10px] font-bold text-on-surface-variant">CARBS</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                <span className="text-[10px] font-bold text-on-surface-variant">FAT</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-lg shadow-[0_10px_40px_rgba(220,214,255,0.1)] border border-surface-container">
            <div className="flex justify-between items-end h-48 gap-3">
              {[
                { day: 'M', p: 30, c: 40, f: 20, today: false },
                { day: 'T', p: 35, c: 35, f: 25, today: false },
                { day: 'W', p: 25, c: 50, f: 20, today: false },
                { day: 'T', p: 40, c: 30, f: 30, today: true },
                { day: 'F', p: 0, c: 0, f: 0, today: false },
                { day: 'S', p: 0, c: 0, f: 0, today: false },
                { day: 'S', p: 0, c: 0, f: 0, today: false },
              ].map((d, i) => (
                <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${d.p === 0 ? 'opacity-40' : ''}`}>
                  <div className={`w-full flex flex-col-reverse rounded-full overflow-hidden h-40 bg-surface-container-low ${d.today ? 'ring-2 ring-primary ring-offset-4 ring-offset-white' : ''}`}>
                    {d.p > 0 && <div style={{ height: `${d.p}%` }} className="bg-blue-400"></div>}
                    {d.c > 0 && <div style={{ height: `${d.c}%` }} className="bg-orange-200"></div>}
                    {d.f > 0 && <div style={{ height: `${d.f}%` }} className="bg-primary-container"></div>}
                  </div>
                  <span className={`font-label-sm ${d.today ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Weight Progress */}
        <section className="space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="font-h3 text-on-surface">Weight Progress</h3>
            <span className="font-label-md text-primary">Last 30 Days</span>
          </div>
          <div className="bg-white rounded-lg p-lg shadow-[0_10px_40px_rgba(220,214,255,0.1)] border border-surface-container h-48 relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
              <path d="M0,80 Q50,75 100,60 T200,50 T300,30 T400,25" fill="none" stroke="#5e5a7d" strokeLinecap="round" strokeWidth="4" />
              <path d="M0,80 Q50,75 100,60 T200,50 T300,30 T400,25 V100 H0 Z" fill="url(#grad1)" opacity="0.1" />
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#5e5a7d', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <circle cx="300" cy="30" fill="#5e5a7d" r="6" />
            </svg>
            <div className="absolute top-4 left-6">
              <p className="font-h3 text-on-surface">{user?.weight || 68.4} <span className="text-body-md font-normal text-on-surface-variant">kg</span></p>
              <p className="text-[10px] text-on-secondary-container font-bold">-2.1kg since March</p>
            </div>
          </div>
        </section>

        {/* AI Analysis CTA */}
        <section className="flex justify-center py-base">
          <button className="bg-inverse-surface text-white font-label-md px-xl py-4 rounded-full flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Start AI Analysis
          </button>
        </section>

        {/* Habits */}
        <section className="space-y-md pb-8">
          <h3 className="font-h3 text-on-surface">My Habits</h3>
          <div className="space-y-sm">
            {[
              { emoji: '💧', label: 'Water intake', done: true },
              { emoji: '🥗', label: 'Eat a veggie meal', done: false },
              { emoji: '🌙', label: 'No food after 9PM', done: false },
            ].map((habit) => (
              <div key={habit.label} className="bg-secondary-container/30 border border-secondary-container p-md rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.emoji}</span>
                  <p className="font-label-md text-on-secondary-fixed-variant">{habit.label}</p>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  habit.done
                    ? 'border-secondary bg-secondary text-white'
                    : 'border-secondary-fixed-dim bg-white'
                }`}>
                  {habit.done && <span className="material-symbols-outlined text-lg font-bold">check</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
