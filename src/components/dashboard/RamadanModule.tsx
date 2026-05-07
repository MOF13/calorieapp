import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Coffee, Utensils, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { format, parse, isAfter, isBefore, differenceInMinutes, addDays } from 'date-fns';
import { toast } from 'sonner';

interface RamadanModuleProps {
  userId: string;
  isRamadanMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export function RamadanModule({ userId, isRamadanMode, onToggle }: RamadanModuleProps) {
  const [timings, setTimings] = useState<any>(null);
  const [nextEvent, setNextEvent] = useState<{ name: string; time: string; type: 'iftar' | 'suhoor' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      // Default to Dubai for now, can be expanded to user's city
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Dubai&country=UAE&method=4');
      const data = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        calculateNextEvent(data.data.timings);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextEvent = (pTimings: any) => {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    
    const fajr = pTimings.Fajr;
    const maghrib = pTimings.Maghrib;

    if (currentTime < fajr) {
      setNextEvent({ name: 'Suhoor ends at', time: fajr, type: 'suhoor' });
    } else if (currentTime < maghrib) {
      setNextEvent({ name: 'Iftar at', time: maghrib, type: 'iftar' });
    } else {
      setNextEvent({ name: 'Suhoor tomorrow at', time: fajr, type: 'suhoor' });
    }
  };

  const getCountdown = () => {
    if (!nextEvent) return '';
    const now = new Date();
    const eventTime = parse(nextEvent.time, 'HH:mm', now);
    
    let diff = differenceInMinutes(eventTime, now);
    if (diff < 0) diff += 1440; // Add 24 hours if event is tomorrow

    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    
    return `${hrs}h ${mins}m`;
  };

  const tips = [
    { text: "Break your fast with 3 dates to restore blood sugar quickly.", icon: Coffee },
    { text: "Aim for 2.5L of water between Iftar and Suhoor.", icon: Utensils },
    { text: "Prioritize protein at Suhoor to stay full longer.", icon: CheckCircle2 }
  ];

  if (!isRamadanMode) {
    return (
      <div className="glass-card p-6 rounded-[2rem] border-dashed border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
               <Moon className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-vitality-slate">Ramadan Mode</h4>
               <p className="text-[10px] text-slate-400 font-medium">Auto-sync fasting with prayer times</p>
            </div>
         </div>
         <Switch 
            checked={isRamadanMode} 
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-indigo-500"
          />
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-950 text-white border-none shadow-xl shadow-indigo-900/20 relative overflow-hidden">
      {/* Decorative Moon */}
      <Moon className="absolute -top-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
            <Moon className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Ramadan Mode</h3>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Blessed Month</span>
          </div>
        </div>
        <Switch 
          checked={isRamadanMode} 
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-indigo-400"
        />
      </div>

      <div className="flex flex-col items-center justify-center py-6 relative z-10">
        <div className="text-center mb-6">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">{nextEvent?.name}</p>
          <p className="text-5xl font-black tabular-nums">{nextEvent?.time}</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/5">
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-200">Time remaining</span>
              <span className="text-xl font-black">{getCountdown()}</span>
           </div>
           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 w-3/4 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
           </div>
        </div>
      </div>

      <div className="mt-8 space-y-3 relative z-10">
        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Sunnah Wisdom</p>
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-2xl items-center border border-white/5">
             <tip.icon className="w-4 h-4 text-indigo-300" />
             <p className="text-[11px] font-medium leading-relaxed opacity-90">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
