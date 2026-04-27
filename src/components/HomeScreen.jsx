import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const { user, getInitials } = useUser();
  const navigate = useNavigate();
  const userName = user?.name?.split(' ')[0] || 'Alex';

  // Generate weekly calendar dates
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = days.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: day,
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });

  // Streak
  const streakDays = (() => {
    try {
      return parseInt(localStorage.getItem('nourishme_streakDays') || '1');
    } catch { return 1; }
  })();

  // Placeholder meals (will be replaced by Spoonacular in Phase 4)
  const meals = [
    {
      id: 'breakfast-1',
      type: 'Breakfast',
      name: 'Avocado Toast',
      calories: 350,
      protein: 12, carbs: 24, fat: 18,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcoWbo8psHBuXAw5i_ia3ZNxC9iBU9G1lyrBjdgKqspoJasXtUmR7EVckoelvJ5vzZ9_RiBCQwszlUidjM7-VI-TElDkU0DauAHrvee0s4CVnkv9t76VqCr9EPD0LVSM3ZCs2BVKIqGpHJR1b23DE9WEfIj3dXLTV-OF-Rr7ii-wZVSLW_seWlJU3l_ChaZV3lerMWHoZTMd6ffuRcreQ8peUnUnkCoObJs7lJGX3ql2z8vYwkfV7MAfsLHSj5y8Wg7z51PMh6Sw',
      bgClass: 'bg-tertiary-container/20',
    },
    {
      id: 'lunch-1',
      type: 'Lunch',
      name: 'Quinoa Salad',
      calories: 480,
      protein: 18, carbs: 52, fat: 14,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5FP4xr2H6l3J0P7uLJuj2zrhekuxhdbFTMWVpewEqIG1jvXiWCtQbryx9Topw9H7ixa3vw-vapigMhBtqH6wfL0AkDa2HkQhQCzrzMje-EGY2fqHdcAvfXFyky6HCmpPkvc9Cb8xuaQaZiswYKR_QA5ZiOtxkaLArfm71225WHpFz5jkVy-m_n7V2dsJO_dm0_6t9D0ySwZTQc01ktdNMMQ_0SGvQR6GWVu7tZgDeAwxa3gL_NUcKSN7B-e0eAdjeSlHNjuBCYw',
      bgClass: 'bg-secondary-container/20',
    },
    {
      id: 'dinner-1',
      type: 'Dinner',
      name: 'Pesto Pasta',
      calories: 620,
      protein: 15, carbs: 68, fat: 22,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk0Nw_CgRKRearyKoNbFYT8Gw5Tnvpbk10c8EonA-FUv9zkd_jwU255l5no9MFDAM-nsS4NC4_2LT3LMfcLFEZV6nJyx4Owl0_X_TAUi3OKljpL8KW8JJKHrNeNL6omWjnmQIiGg348QrNVQS-FmKr7wNpiRcyIlWtetYKDzShkeNymnxvORVjj6bLfNsfc3OTYy30kqZOUviU6aQ8Xva6OlM7bVRMhqBl3rKcgt7LM-J4C-IdbZvoiAg_M0A0jReGhsenMJg5wA',
      bgClass: 'bg-primary-container/20',
    },
  ];

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40 bg-white/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex flex-col">
          <span className="font-h2 text-h2 text-indigo-500 tracking-tight">Hey {userName}! 🌿</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-gray-400 hover:opacity-80 transition-opacity active:scale-95 duration-150">
            notifications
          </button>
          <div
            className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-h3 text-sm shadow-sm ring-2 ring-white cursor-pointer"
            title="User profile"
            onClick={() => navigate('/profile')}
          >
            {getInitials()}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-container-margin space-y-xl">
        {/* Calendar Strip */}
        <section className="flex justify-between items-center bg-surface-container-low p-sm rounded-lg">
          {calendarDays.map((day) => (
            <div
              key={day.label}
              className={`flex flex-col items-center gap-2 px-3 py-2 rounded-lg ${
                day.isToday ? 'bg-secondary-container text-on-secondary-container shadow-sm' : ''
              }`}
            >
              <span className={`font-label-sm ${day.isToday ? '' : 'text-outline'}`}>{day.label}</span>
              <span className="font-label-md">{day.date}</span>
            </div>
          ))}
        </section>

        {/* Streak Badge */}
        <div className="flex justify-center">
          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-label-sm shadow-sm">
            🔥 Day {streakDays} streak
          </span>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 gap-md">
          <div className="bg-primary-container/30 p-lg rounded-lg border border-primary-container/50">
            <p className="font-label-sm text-on-primary-container opacity-70">Calories</p>
            <p className="font-h2 text-primary">{totalCals.toLocaleString()} <span className="text-sm font-normal">kcal</span></p>
            <div className="w-full bg-white/50 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((totalCals / 2000) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-secondary-container/30 p-lg rounded-lg border border-secondary-container/50">
            <p className="font-label-sm text-on-secondary-container opacity-70">Water</p>
            <p className="font-h2 text-secondary">1.8 <span className="text-sm font-normal">Liters</span></p>
            <div className="w-full bg-white/50 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full w-1/2 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Today's Recommendations */}
        <section className="space-y-md">
          <div className="flex justify-between items-end">
            <h2 className="font-h2 text-h2">Today's Recommendations</h2>
            <a className="font-label-md text-primary cursor-pointer" onClick={() => navigate('/browse')}>View All</a>
          </div>
          {meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => navigate(`/meal/${meal.id}`)}
              className="bg-white p-md rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-surface-container flex items-center gap-md cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className={`w-24 h-24 ${meal.bgClass} rounded-lg flex items-center justify-center relative group overflow-hidden`}>
                <img alt={meal.name} className="w-16 h-16 transform group-hover:scale-110 transition-transform object-cover rounded" src={meal.image} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-label-sm text-outline uppercase tracking-wider">{meal.type}</p>
                    <h3 className="font-h3 text-h3">{meal.name}</h3>
                  </div>
                  <span className="font-label-md text-primary">{meal.calories} kcal</span>
                </div>
                <div className="flex flex-wrap gap-xs">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 font-label-sm rounded-full">Protein: {meal.protein}g</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 font-label-sm rounded-full">Carbs: {meal.carbs}g</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-label-sm rounded-full">Fat: {meal.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
