import { Droplets, Plus } from 'lucide-react';

interface WaterTrackerProps {
  currentMl: number;
  goalMl: number;
  onAdd: (amount: number) => void;
}

export function WaterTracker({ currentMl, goalMl, onAdd }: WaterTrackerProps) {
  const percentage = Math.min(100, (currentMl / goalMl) * 100);

  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
      {/* Wave Background */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-vitality-sky/10 transition-all duration-1000 ease-in-out"
        style={{ height: `${percentage}%` }}
      >
        <div className="absolute top-0 left-0 w-[200%] h-20 -translate-y-1/2 flex">
           <div className="w-1/2 h-full bg-vitality-sky/5 animate-wave"></div>
           <div className="w-1/2 h-full bg-vitality-sky/5 animate-wave" style={{ animationDelay: '-2s' }}></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-vitality-sky/20 rounded-2xl flex items-center justify-center text-vitality-sky group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-vitality-slate">Hydration</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {currentMl} / {goalMl} ml
              </p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-3xl font-black text-vitality-sky tabular-nums">{Math.round(percentage)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[250, 500, 750].map((amount) => (
            <button
              key={amount}
              onClick={() => onAdd(amount)}
              className="flex flex-col items-center justify-center py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl hover:bg-vitality-sky/10 hover:border-vitality-sky/30 transition-all active:scale-95 group/btn"
            >
              <Plus className="w-4 h-4 text-vitality-sky mb-1 group-hover/btn:rotate-90 transition-transform" />
              <span className="text-xs font-black text-vitality-slate">{amount}ml</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
