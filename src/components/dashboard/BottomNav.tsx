import { BarChart3, Home, Plus, User, Trophy } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  const tabs = [
    { id: 'today', icon: Home, label: 'Today' },
    { id: 'weekly', icon: BarChart3, label: 'Weekly' },
    { id: 'achievements', icon: Trophy, label: 'Badges' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="absolute bottom-6 left-4 right-4 h-20 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-2">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-vitality-emerald scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-vitality-emerald/10' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onAddClick}
          className="relative -top-8 w-16 h-16 vitality-gradient rounded-3xl shadow-xl shadow-vitality-emerald/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        >
          <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-vitality-emerald scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-vitality-emerald/10' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
