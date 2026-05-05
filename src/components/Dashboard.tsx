import { useState, useEffect } from 'react';
import { Utensils, ChevronLeft, ChevronRight, Plus, LogOut, Camera, Calendar, User, Zap, Activity } from 'lucide-react';
import { format, addDays, subDays, isAfter, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MacroDonutChart } from './dashboard/MacroDonutChart';
import { MealSection } from './dashboard/MealSection';
import { AddMealDialog } from './dashboard/AddMealDialog';
import { PhotoUploadModal } from './PhotoUploadModal';
import { FoodResultsScreen } from './FoodResultsScreen';
import { getUserProfile, getOrCreateDailyLog, getMeals, createMeal } from '@/lib/db';
import { signOut } from '@/lib/auth';
import type { UserProfile, DailyLog, Meal } from '@/lib/supabase';

interface DashboardProps {
  userId: string | null;
  onSignOut?: () => void;
}

export default function Dashboard({ userId, onSignOut }: DashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showFoodResults, setShowFoodResults] = useState(false);
  const [photoData, setPhotoData] = useState<{ base64: string; url: string } | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadDailyData();
    }
  }, [userId, currentDate]);

  const loadUserProfile = async () => {
    if (!userId) return;
    const profile = await getUserProfile(userId);
    setUserProfile(profile);
  };

  const loadDailyData = async () => {
    if (!userId) return;
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const log = await getOrCreateDailyLog(userId, dateKey);
    setDailyLog(log);

    if (log) {
      const logMeals = await getMeals(log.id);
      setMeals(logMeals);
    }
  };

  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    if (!isAfter(startOfDay(nextDay), startOfDay(new Date()))) {
      setCurrentDate(nextDay);
    }
  };

  const isFutureDate = isAfter(startOfDay(addDays(currentDate, 1)), startOfDay(new Date()));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAddMeal = async (meal: {
    name: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) => {
    if (!userId || !dailyLog) return;

    await createMeal({
      user_id: userId,
      daily_log_id: dailyLog.id,
      name: meal.name,
      meal_type: meal.meal_type,
      calories: meal.calories,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
    });

    await loadDailyData();
  };

  const getMealsByType = (type: string) => {
    return meals.filter((meal) => meal.meal_type === type);
  };

  const getMealTypeCalories = (type: string) => {
    return getMealsByType(type).reduce((sum: number, meal) => sum + (meal.calories || 0), 0);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-vitality-emerald border-t-transparent rounded-full animate-spin"></div>
          <p className="text-vitality-slate font-bold animate-pulse">Synchronizing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 vitality-gradient rounded-xl flex items-center justify-center shadow-lg shadow-vitality-lime/20">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-vitality-slate hidden sm:block">
                Calorie<span className="text-vitality-emerald">Tracker</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-vitality-lime/10 rounded-full border border-vitality-emerald/20">
                <Zap className="w-4 h-4 text-vitality-emerald" />
                <span className="text-xs font-bold text-vitality-emerald">DAILY STREAK: 5 DAYS</span>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut();
                  if (onSignOut) onSignOut();
                }}
                className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Dynamic Greeting */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-vitality-slate mb-2">
              {getGreeting()}, <span className="text-vitality-emerald">{(userProfile as any).full_name?.split(' ')[0] || 'Athlete'}</span>
            </h1>
            <p className="text-slate-500 font-medium">Ready to hit your nutritional goals today?</p>
          </div>
          
          <div className="glass-card p-2 rounded-2xl flex items-center gap-1 shadow-sm">
             <Button
                variant="ghost"
                onClick={handlePreviousDay}
                className="hover:bg-vitality-lime/10 hover:text-vitality-emerald rounded-xl px-4"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="px-6 flex flex-col items-center">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(currentDate, 'EEEE')}</span>
                 <span className="text-sm font-extrabold text-vitality-slate">{format(currentDate, 'MMMM d, yyyy')}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleNextDay}
                disabled={isFutureDate}
                className="hover:bg-vitality-lime/10 hover:text-vitality-emerald rounded-xl px-4 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-7 space-y-8">
             <div className="glass-card p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                   <div className="w-10 h-10 bg-vitality-lime/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-vitality-emerald" />
                   </div>
                </div>
                <h3 className="text-xl font-extrabold text-vitality-slate mb-8 flex items-center gap-2">
                   Nutritional Intelligence
                   <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 uppercase tracking-tighter">LIVE</span>
                </h3>
                <MacroDonutChart
                  consumed={{
                    protein: dailyLog?.total_protein_g || 0,
                    carbs: dailyLog?.total_carbs_g || 0,
                    fat: dailyLog?.total_fat_g || 0,
                    calories: dailyLog?.total_calories || 0,
                  }}
                  goals={{
                    protein: userProfile.daily_protein_g,
                    carbs: userProfile.daily_carbs_g,
                    fat: userProfile.daily_fat_g,
                    calories: userProfile.daily_calories,
                  }}
                />
             </div>

             {/* Personal Stats Row */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-vitality-lime/20 rounded-2xl flex items-center justify-center text-vitality-emerald">
                      <User className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Weight</p>
                      <p className="text-lg font-black text-vitality-slate">75.4 <span className="text-xs font-normal">kg</span></p>
                   </div>
                </div>
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-vitality-emerald/20 rounded-2xl flex items-center justify-center text-vitality-emerald">
                      <Activity className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">TDEE</p>
                      <p className="text-lg font-black text-vitality-slate">2,450 <span className="text-xs font-normal">kcal</span></p>
                   </div>
                </div>
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4 hidden md:flex">
                   <div className="w-12 h-12 bg-vitality-amber/20 rounded-2xl flex items-center justify-center text-vitality-amber">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Goal</p>
                      <p className="text-lg font-black text-vitality-slate">Lose Fat</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Meals Section */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-extrabold text-vitality-slate flex items-center gap-2 px-2">
               Daily Timeline
               <div className="h-px bg-slate-200 flex-grow ml-4"></div>
            </h3>
            <div className="space-y-6">
              <MealSection
                title="Breakfast"
                meals={getMealsByType('breakfast')}
                totalCalories={getMealTypeCalories('breakfast')}
              />
              <MealSection
                title="Lunch"
                meals={getMealsByType('lunch')}
                totalCalories={getMealTypeCalories('lunch')}
              />
              <MealSection
                title="Dinner"
                meals={getMealsByType('dinner')}
                totalCalories={getMealTypeCalories('dinner')}
              />
              <MealSection
                title="Snacks"
                meals={getMealsByType('snacks')}
                totalCalories={getMealTypeCalories('snacks')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <button
          onClick={() => setShowPhotoUpload(true)}
          className="group flex items-center gap-3 px-6 h-16 bg-white/80 backdrop-blur-xl border border-white/50 text-vitality-slate rounded-3xl shadow-2xl hover:bg-white transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 text-vitality-emerald group-hover:scale-110 transition-transform" />
          <span className="font-bold hidden sm:block">Log via Photo</span>
        </button>
        <button
          onClick={() => setShowAddMealDialog(true)}
          className="group flex items-center gap-3 px-8 h-16 vitality-gradient text-white rounded-3xl shadow-2xl shadow-vitality-emerald/30 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold">Add Entry</span>
        </button>
      </div>

      <PhotoUploadModal
        open={showPhotoUpload}
        onClose={() => setShowPhotoUpload(false)}
        onPhotoSelected={(base64, url) => {
          setPhotoData({ base64, url });
          setShowPhotoUpload(false);
          setShowFoodResults(true);
        }}
      />

      {photoData && dailyLog && (
        <FoodResultsScreen
          open={showFoodResults}
          onClose={() => {
            setShowFoodResults(false);
            setPhotoData(null);
            loadDailyData();
          }}
          imageBase64={photoData.base64}
          imageUrl={photoData.url}
          dailyLogId={dailyLog.id}
        />
      )}

      <AddMealDialog
        open={showAddMealDialog}
        onClose={() => setShowAddMealDialog(false)}
        onAdd={handleAddMeal}
      />
    </div>
  );
}
