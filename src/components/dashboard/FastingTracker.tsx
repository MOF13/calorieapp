import { useState, useEffect } from 'react';
import { Timer, Zap, Moon, Sun, Info, Settings2, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format, differenceInSeconds, addHours, isAfter, parseISO } from 'date-fns';
import { createFastingSession, updateFastingSession, getFastingSessions } from '@/lib/db';
import { toast } from 'sonner';

interface FastingTrackerProps {
  userId: string;
}

export function FastingTracker({ userId }: FastingTrackerProps) {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [protocol, setProtocol] = useState('16:8');
  const [showSettings, setShowSettings] = useState(false);

  const protocols = [
    { id: '16:8', hours: 16, label: 'Standard' },
    { id: '18:6', hours: 18, label: 'Advanced' },
    { id: '20:4', hours: 20, label: 'Warrior' },
    { id: 'OMAD', hours: 23, label: 'OMAD' },
  ];

  useEffect(() => {
    loadActiveSession();
  }, [userId]);

  useEffect(() => {
    let interval: any;
    if (activeSession && !activeSession.completed) {
      interval = setInterval(() => {
        const seconds = differenceInSeconds(new Date(), parseISO(activeSession.start_time));
        setElapsedSeconds(seconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const loadActiveSession = async () => {
    const sessions = await getFastingSessions(userId);
    const active = sessions.find(s => !s.completed);
    if (active) {
      setActiveSession(active);
      setProtocol(active.protocol);
    }
  };

  const handleStart = async () => {
    const hours = protocols.find(p => p.id === protocol)?.hours || 16;
    const session = await createFastingSession({
      user_id: userId,
      protocol,
      start_time: new Date().toISOString(),
      target_hours: hours,
      completed: false,
    });
    if (session) {
      setActiveSession(session);
      toast.success('Fast started! Good luck.');
    }
  };

  const handleEnd = async () => {
    if (!activeSession) return;
    const hours = elapsedSeconds / 3600;
    const updated = await updateFastingSession(activeSession.id, {
      end_time: new Date().toISOString(),
      actual_hours: hours,
      completed: true,
    });
    if (updated) {
      setActiveSession(null);
      setElapsedSeconds(0);
      toast.success('Fast completed! Ready for a healthy meal?');
    }
  };

  const targetSeconds = (protocols.find(p => p.id === protocol)?.hours || 16) * 3600;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMetabolicState = () => {
    const hours = elapsedSeconds / 3600;
    if (hours < 4) return { label: 'Blood Sugar Drop', color: 'text-blue-400', icon: Sun };
    if (hours < 12) return { label: 'Blood Sugar Normal', color: 'text-vitality-emerald', icon: Zap };
    if (hours < 16) return { label: 'Fat Burning', color: 'text-vitality-amber', icon: Moon };
    return { label: 'Ketosis Started', color: 'text-purple-500', icon: Sparkles };
  };

  const MetabolicIcon = getMetabolicState().icon;

  return (
    <div className="glass-card p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-extrabold text-vitality-slate flex items-center gap-2">
          <Timer className="w-6 h-6 text-vitality-emerald" />
          Fasting Timer
        </h3>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Settings2 className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {showSettings && !activeSession && (
        <div className="mb-8 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
          {protocols.map(p => (
            <button
              key={p.id}
              onClick={() => setProtocol(p.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                protocol === p.id 
                  ? 'bg-vitality-emerald border-vitality-emerald text-white shadow-lg shadow-vitality-emerald/20' 
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <p className="text-xs font-black uppercase tracking-widest">{p.id}</p>
              <p className="text-[10px] font-bold opacity-80">{p.label}</p>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Progress Ring Background */}
          <svg className="absolute w-full h-full -rotate-90">
             <circle
              cx="96" cy="96" r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="96" cy="96" r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={552}
              strokeDashoffset={552 - (552 * progress) / 100}
              strokeLinecap="round"
              className="text-vitality-emerald transition-all duration-1000"
            />
          </svg>
          
          <div className="text-center z-10">
            {activeSession ? (
              <>
                <p className="text-3xl font-black text-vitality-slate tabular-nums">{formatTime(elapsedSeconds)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Elapsed Time</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-black text-slate-300">00:00:00</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Ready to start</p>
              </>
            )}
          </div>
        </div>

        {activeSession && (
          <div className="flex flex-col items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 ${getMetabolicState().color}`}>
               <MetabolicIcon className="w-4 h-4" />
               <span className="text-xs font-black uppercase tracking-widest">{getMetabolicState().label}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400">Target: {protocols.find(p => p.id === protocol)?.hours}h ({protocol})</p>
          </div>
        )}

        <div className="w-full pt-4">
          {!activeSession ? (
            <Button
              onClick={handleStart}
              className="w-full h-14 rounded-2xl bg-vitality-emerald text-white hover:bg-vitality-emerald/90 text-lg font-black shadow-lg shadow-vitality-emerald/20"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Start Fasting
            </Button>
          ) : (
            <Button
              onClick={handleEnd}
              variant="outline"
              className="w-full h-14 rounded-2xl border-slate-200 text-vitality-slate hover:bg-red-50 hover:text-red-500 hover:border-red-100 text-lg font-black transition-all"
            >
              <Square className="w-5 h-5 mr-2 fill-current" />
              End Fasting
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const Sparkles = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
