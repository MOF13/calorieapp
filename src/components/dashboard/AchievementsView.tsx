import { useState, useEffect } from 'react';
import { Trophy, Droplets, Zap, Target, Star, Lock } from 'lucide-react';
import { getAchievements } from '@/lib/db';

interface AchievementInfo {
  type: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const ACHIEVEMENT_LIST: AchievementInfo[] = [
  {
    type: 'HYDRATION_HERO',
    title: 'Hydration Hero',
    description: 'Reached your daily water goal today!',
    icon: Droplets,
    color: 'bg-blue-500',
  },
  {
    type: 'STREAK_7',
    title: 'Consistency King',
    description: 'Maintained a 7-day logging streak.',
    icon: Zap,
    color: 'bg-orange-500',
  },
  {
    type: 'MEAL_MASTER',
    title: 'Meal Master',
    description: 'Logged over 50 meals total.',
    icon: Star,
    color: 'bg-vitality-emerald',
  },
  {
    type: 'EARLY_ADOPTER',
    title: 'Early Adopter',
    description: 'Joined the CalorieTracker V2 beta.',
    icon: Target,
    color: 'bg-purple-500',
  }
];

export function AchievementsView({ userId }: { userId: string }) {
  const [unlockedTypes, setUnlockedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAchievements(userId);
      setUnlockedTypes(data.map(a => a.achievement_type));
      setIsLoading(false);
    };
    load();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-vitality-emerald border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-vitality-lime/20 rounded-2xl flex items-center justify-center mx-auto text-vitality-emerald mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-vitality-slate">Your Milestones</h2>
        <p className="text-slate-500 text-sm">Every log is a step toward a better you.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ACHIEVEMENT_LIST.map((achievement) => {
          const isUnlocked = unlockedTypes.includes(achievement.type);
          const Icon = achievement.icon;

          return (
            <div 
              key={achievement.type}
              className={`glass-card p-6 flex flex-col items-center text-center transition-all duration-500 ${
                isUnlocked ? 'border-vitality-emerald/30 shadow-lg shadow-vitality-lime/5' : 'opacity-60 grayscale'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${
                isUnlocked ? achievement.color : 'bg-slate-300'
              }`}>
                {isUnlocked ? <Icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
              </div>
              <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-vitality-slate' : 'text-slate-400'}`}>
                {achievement.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                {achievement.description}
              </p>
              {isUnlocked && (
                <div className="mt-4 px-2 py-0.5 bg-vitality-lime/10 text-vitality-emerald text-[8px] font-black uppercase tracking-widest rounded-full">
                  Unlocked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
