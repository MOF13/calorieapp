import { useState } from 'react';
import { Scale, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WeightLogCardProps {
  currentWeight: number;
  onLog: (weight: number) => void;
}

export function WeightLogCard({ currentWeight, onLog }: WeightLogCardProps) {
  const [weight, setWeight] = useState(currentWeight.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const handleSubmit = () => {
    const val = parseFloat(weight);
    if (!isNaN(val)) {
      onLog(val);
      setIsEditing(false);
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 3000);
    }
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-sm group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-vitality-lime/20 rounded-2xl flex items-center justify-center text-vitality-emerald group-hover:scale-110 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-vitality-slate">Body Weight</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Keep track of your progress</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-grow">
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-2xl font-black h-14 rounded-2xl border-vitality-emerald/30 focus:ring-vitality-emerald"
              autoFocus
            />
            <Button 
              onClick={handleSubmit}
              className="h-14 w-14 rounded-2xl vitality-gradient p-0"
            >
              <Check className="w-6 h-6" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
               <span className="text-4xl font-black text-vitality-slate tabular-nums">{currentWeight}</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kilograms</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className={`h-14 px-6 rounded-2xl border-slate-200 font-bold transition-all ${
                justLogged ? 'bg-vitality-emerald text-white border-transparent' : 'hover:bg-vitality-lime/10'
              }`}
            >
              {justLogged ? (
                <Check className="w-5 h-5 mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {justLogged ? 'Logged' : 'Log Weight'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
