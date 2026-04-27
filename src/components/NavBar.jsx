import { useNavigate } from 'react-router-dom';

export default function NavBar({ active }) {
  const navigate = useNavigate();

  const tabs = [
    { icon: 'home', path: '/home', label: 'Home' },
    { icon: 'explore', path: '/browse', label: 'Discover' },
    { icon: 'smart_toy', path: '/chat', label: 'Chat' },
    { icon: 'query_stats', path: '/stats', label: 'Stats' },
    { icon: 'person', path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 flex justify-around items-center px-4 py-3 pb-6 bg-white/70 backdrop-blur-2xl border-t border-gray-100/20 shadow-[0_-10px_40px_rgba(220,214,255,0.15)] rounded-t-[32px]">
      {tabs.map((tab) => (
        <div
          key={tab.icon}
          onClick={() => navigate(tab.path)}
          className={`p-3 rounded-full transition-all cursor-pointer ${
            active === tab.icon
              ? 'bg-emerald-100 text-emerald-700'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={active === tab.icon ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {tab.icon}
          </span>
        </div>
      ))}
    </nav>
  );
}
