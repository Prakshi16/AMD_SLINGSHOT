import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const filterChips = [
  { label: 'Breakfast', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { label: 'Lunch', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { label: 'High Protein', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { label: 'Low Carb', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  { label: 'Vegan', bg: 'bg-rose-100', text: 'text-rose-800' },
  { label: 'Gluten-Free', bg: 'bg-amber-100', text: 'text-amber-800' },
];

const sampleMeals = [
  { id: 'b1', name: 'Avocado Smash', kcal: 340, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpLryGSUvxCpn0rOBIdDJDb-CAMUEU_vOegCIiOcFKbMVxrkJZ1QkNYNGDif_PBe3Uhj4Xmg2XkdUtlXA0Xi3bzEAC2e04jm1mFML7f5ha7pmJGnln8a9tmuvHbqVy36ik4O4inI8SZ94lcmUTYKKku7os_ibIlD0NBOK1Ylfmgv4ecNPEc_WY4Z1m-d0groa588nzhCfnXFtxU2KyxsUNABvTHo_LPARdTei4JmfCWC4jBuEgQyX2LlMLwIf2rBorOknF_0DyGA' },
  { id: 'b2', name: 'Rainbow Salad', kcal: 285, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7pTJm5Y8Y-wEDvuAiuQwTptva9aSmh6asayQxNoDMfum7m42vpX2L5KzmmKam0jB8A-3eFZ29TL_pngKowwxVDHtxZAt7_GbIo2CHFqX3ygj67yT_5N3j91lf_V3NmP173Bzvd5xZQurrnkzsen09c-v1t3ThKSEBf2I_0RoJov45OVKduxstUb-KuCNYUV7gJGO2dnvUVqiJz8j6Dga3X7lQ0wJb5Jz30tNIwPIyaYsuuZf8PB0GAcy6DrYWS-auwz4ci1l_hg' },
  { id: 'b3', name: 'Pesto Zoodles', kcal: 420, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9LkHwBRfbUZxo27Z08Q4jX9VuftvzSYW5MUh_zGJx3bAVoDiOK_74IjBc8zNvcBxAj8pduoJXWwVsiH3ZzivcNg9AcTR2qcW05mKutEzbUfxfhQtYkYvP26TD7cQKxu6Tlx-dmleXZVWIvwSxDaaN78sFPJ6rjiSo-ynZy9oUypZINWk_oeVcd95mbAIdWnx-nL7_fXeoLOjLaoe8TTH9mWxaFUTfoijvKysTlKo6D-T8iV7GdtuHg7qsz0rDtJKTn450PHeZKA' },
  { id: 'b4', name: 'Berry Boost', kcal: 190, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXVG0Oo5MjI1kLHRj8m4PS3q4IE-o0u0TCtWa0jtlOOD7luC5lVYgTBVUJRhwNyeHrhy0sWJCtzJ9czqKDGC9ttCIBqR7DGynDOGn2Zh_fJ5cyTbkamo3MzHupmW3wwcUU-CsDrsrN3Aluplgv6eOrT9j40dJLzyEpRm6uvOEwGFfQ6U9Cd2lctIICA4GodCpIZlAztMKO0G6rt1_39mKFd6MnNU4DxqxpnSr1JZ6K4lhMaihgsRLEzXzXAtpGLfHF8U9V_Q-08Q' },
  { id: 'b5', name: 'Salmon Poke', kcal: 510, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB57caDpOS8BUPsydwdYse9sE7ihkmzTcDVmY6utbo--OTTPl-jDOKqlx5As-M1ZMDba6jKx0tPTRhMX2N4JYDFAF1xwFfLm2W92WJ-4I46SP0hHy18NAXSK2aWWps6Llib2WE2FH_oC1e65kDZtySBJgmnJmHcRe3Bd4fwOVOH9b1jLokmXt5YzZ5iON3IaZQGx_1aBnbuyLzkOrGFUH0TY1z3uYp8TlCQVdo-xhIwr0JoSx1--JgTb60nOBlirxCJtjVBt0VM2w' },
  { id: 'b6', name: 'Pink Power', kcal: 260, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfvcQEhjWqb4cOOcYw3WG6Bu9CXqSYpvLnmB0vI6Q0UWv41jMZAlUEUoSftkwsyCq4KWLQEeO-PMnVN7UiI0cOnEdtb2gdlkmIL9RsES1ANPqAXcxKPSsVwwCudrWop8Ce4FrIhbmCuOBAyNq0fVNjts7Src9TEbyhbvFsmZacInRpfH_kmhdCOT4fjGLlnEdHTB76PObS5F6UPuzXcpgSl2DQ9B90JP3ws2tplS31QPRFmiTfhqelMVlu6wH538TonKRqy4ueyw' },
];

export default function BrowseScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-white/60 backdrop-blur-xl fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40 flex justify-between items-center px-6 py-4 border-none shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-primary-container">
            <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO_2_sKkOxFPZgd1kHCKd3oBZ5IqqLYh-4rkSkptzWOIeN82hxkLLfQgNILqo_ymKLC-suMNuIYb_nQdO81tla4qpnQqbo5dyoZDaRPlDS9wYUq0mPZuBwGJIR_afJJCkZtE1VE15y3Al0jxjNoPdWJLcAkXcdcNZywS9jhHhSzlZzWCu4RZK53sKHXrnwBPBIIiB2yni6je1Iv24pzA1aKujKJ6Np3LFK9ru-jjwVxPRTkBjgnB_O9rOerzSf1_KB_NTpEmQ5YQ" />
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-indigo-500">Discover</h1>
        </div>
        <div className="text-indigo-400">
          <span className="material-symbols-outlined text-2xl hover:opacity-80 transition-opacity cursor-pointer">notifications</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-container-margin">
        {/* Search */}
        <section className="mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="w-full h-14 pl-12 pr-4 bg-[#F7F7F9] border-none rounded-[16px] focus:ring-2 focus:ring-primary-container font-label-md transition-all shadow-sm"
              placeholder="Search for recipes or ingredients"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Filter Chips */}
        <section className="mb-xl -mx-container-margin">
          <div className="flex overflow-x-auto hide-scrollbar gap-sm px-container-margin py-2">
            {filterChips.map((chip) => (
              <div
                key={chip.label}
                onClick={() => setActiveFilter(activeFilter === chip.label ? null : chip.label)}
                className={`px-5 py-2 rounded-full font-label-sm whitespace-nowrap shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all ${
                  activeFilter === chip.label
                    ? 'ring-2 ring-primary ring-offset-2'
                    : ''
                } ${chip.bg} ${chip.text}`}
              >
                {chip.label}
              </div>
            ))}
          </div>
        </section>

        {/* Meal Grid */}
        <section className="grid grid-cols-2 gap-md">
          {sampleMeals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => navigate(`/meal/${meal.id}`)}
              className="bg-white rounded-lg p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              <div className="w-32 h-32 mb-4 relative">
                <img alt={meal.name} className="w-full h-full object-contain rounded-xl" src={meal.image} />
              </div>
              <div className="w-full">
                <h3 className="font-h3 text-on-surface mb-1">{meal.name}</h3>
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  <span className="text-label-sm">{meal.kcal} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
