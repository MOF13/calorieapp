import { useState, useEffect } from 'react';
import { Utensils, ChevronLeft, ChevronRight, Plus, LogOut, Camera, Calendar, User, Zap, Activity, Flame, TrendingUp, Target, Share2, Trophy } from 'lucide-react';
import { format, addDays, subDays, isAfter, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MacroDonutChart } from './dashboard/MacroDonutChart';
import { MealSection } from './dashboard/MealSection';
import { AddMealDialog } from './dashboard/AddMealDialog';
import { PhotoUploadModal } from './PhotoUploadModal';
import { FoodResultsScreen } from './FoodResultsScreen';
import { getUserProfile, getOrCreateDailyLog, getMeals, createMeal, deleteMeal, updateWaterIntake, logWeight, getMealTemplates, createMealTemplate, checkAndUnlockAchievements } from '@/lib/db';
import { WeightLogCard } from './dashboard/WeightLogCard';
import { BarcodeScanner } from './dashboard/BarcodeScanner';
import { MealAdvisorCard } from './dashboard/MealAdvisorCard';
import { SocialShareCard } from './dashboard/SocialShareCard';
import { AchievementsView } from './dashboard/AchievementsView';
import { DashboardSkeleton } from './dashboard/DashboardSkeleton';
import { WaterTracker } from './dashboard/WaterTracker';
import { BottomNav } from './dashboard/BottomNav';
import { WeeklyView } from './dashboard/WeeklyView';
import { signOut } from '@/lib/auth';
import type { UserProfile, DailyLog, Meal, MealTemplate } from '@/lib/supabase';
import { toast } from 'sonner';

interface DashboardProps {
  userId: string | null;
  userProfile: UserProfile | null;
  onSignOut?: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export default function Dashboard({ userId, userProfile: initialProfile, onSignOut, onProfileUpdate }: DashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialProfile);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showFoodResults, setShowFoodResults] = useState(false);
  const [photoData, setPhotoData] = useState<{ base64: string; url: string } | null>(null);
  const [activeTab, setActiveTab] = useState('today');
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadTemplates();
    }
  }, [userId]);

  const loadTemplates = async () => {
    if (!userId) return;
    const data = await getMealTemplates(userId);
    setTemplates(data);
  };

  useEffect(() => {
    if (userId) {
      loadDailyData();
    }
  }, [userId, currentDate, userProfile]);

  const loadUserProfile = async () => {
    if (!userId) return;
    try {
      console.log('Loading user profile for:', userId);
      const profile = await getUserProfile(userId);
      console.log('User profile loaded:', profile);
      setUserProfile(profile);
      if (profile && onProfileUpdate) onProfileUpdate(profile);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      toast.error('Failed to load profile');
    }
  };

  const loadDailyData = async () => {
    if (!userId) return;
    try {
      console.log('Loading daily data for:', userId, currentDate);
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const log = await getOrCreateDailyLog(userId, dateKey);
      setDailyLog(log);

      if (log) {
        const logMeals = await getMeals(log.id);
        setMeals(logMeals);

        // Check for achievements
        if (userId && userProfile) {
          console.log('Checking achievements...');
          const unlocked = await checkAndUnlockAchievements(userId, {
            streak: userProfile.current_streak || 0,
            totalMeals: logMeals.length,
            waterToday: log.water_ml || 0,
            waterGoal: log.water_goal_ml || 2500,
          });

          if (unlocked.length > 0) {
            unlocked.forEach(type => toast.success(`Achievement Unlocked: ${type.replace('_', ' ')}!`, {
              icon: <Trophy className="w-5 h-5 text-vitality-amber" />
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error in loadDailyData:', error);
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

  const handleDeleteMeal = async (mealId: string) => {
    if (!userId) return;
    const success = await deleteMeal(mealId);
    if (success) {
      await loadDailyData();
    }
  };

  const handleUpdateWater = async (amount: number) => {
    if (!dailyLog) return;
    const currentWater = dailyLog.water_ml || 0;
    const newLog = await updateWaterIntake(dailyLog.id, currentWater + amount);
    if (newLog) {
      setDailyLog(newLog);
    }
  };

  const handleLogWeight = async (weight: number) => {
    if (!userId) return;
    const newLog = await logWeight(userId, weight);
    if (newLog) {
      loadUserProfile();
    }
  };

  const handleSaveTemplate = async (meal: Meal) => {
    if (!userId) return;
    const template = await createMealTemplate({
      user_id: userId,
      name: meal.name,
      meal_type: meal.meal_type,
      calories: meal.calories,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
    });
    if (template) {
      toast.success('Saved as template!');
      loadTemplates();
    }
  };

  const handleBarcodeDetected = (product: any) => {
    setScannedProduct(product);
    setShowBarcodeScanner(false);
    setShowAddMealDialog(true);
  };

  const getMealsByType = (type: string) => {
    return meals.filter((meal) => meal.meal_type === type);
  };

  const getMealTypeCalories = (type: string) => {
    return getMealsByType(type).reduce((sum: number, meal) => sum + (meal.calories || 0), 0);
  };

  if (!userProfile && !initialProfile) {
    return <DashboardSkeleton />;
  }

  // Use current profile or initial profile
  const profile = userProfile || initialProfile;
  if (!profile) return <DashboardSkeleton />;

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
                <span className="text-xs font-bold text-vitality-emerald uppercase tracking-wider">
                  STREAK: {profile?.current_streak || 0} DAYS
                </span>
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
              {getGreeting()}, <span className="text-vitality-emerald">{(profile as any).full_name?.split(' ')[0] || 'Athlete'}</span>
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

          {profile && dailyLog && (
            <div className={`mb-6 p-4 rounded-3xl border flex items-center justify-between transition-all ${
              (profile.daily_calories - dailyLog.total_calories) >= 0
                ? 'bg-vitality-emerald/10 border-vitality-emerald/20 text-vitality-emerald'
                : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  (profile.daily_calories - dailyLog.total_calories) >= 0 ? 'bg-vitality-emerald/20' : 'bg-red-100'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Remaining Balance</p>
                  <p className="text-xl font-black tabular-nums">
                    {Math.abs(Math.round(profile.daily_calories - dailyLog.total_calories))} kcal 
                    <span className="text-sm font-bold ml-2">
                      {(profile.daily_calories - dailyLog.total_calories) >= 0 ? 'LEFT' : 'OVER LIMIT'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                 <div className="h-1.5 w-32 bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        (profile.daily_calories - dailyLog.total_calories) >= 0 ? 'bg-vitality-emerald' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, ((dailyLog.total_calories || 0) / profile.daily_calories) * 100)}%` }}
                    ></div>
                 </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="glass-card p-3 sm:p-4 border-white/20 hover:border-vitality-emerald/40 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories</p>
              </div>
              <p className="text-lg sm:text-2xl font-black text-vitality-slate tabular-nums">{dailyLog?.total_calories || 0}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{Math.round(profile?.daily_calories || 0)} goal</p>
            </div>

            <div className="glass-card p-3 sm:p-4 border-white/20 hover:border-vitality-emerald/40 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-vitality-emerald group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protein</p>
              </div>
              <p className="text-lg sm:text-2xl font-black text-vitality-slate tabular-nums">{dailyLog?.total_protein_g || 0}g</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{profile?.daily_protein_g || 0}g goal</p>
            </div>

            <div className="glass-card p-3 sm:p-4 border-white/20 hover:border-vitality-emerald/40 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-vitality-lime group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</p>
              </div>
              <p className="text-lg sm:text-2xl font-black text-vitality-slate tabular-nums">
                {profile?.daily_calories ? Math.round(((dailyLog?.total_calories || 0) / profile.daily_calories) * 100) : 0}%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Daily goal</p>
            </div>
          </div>
        </div>

        {activeTab === 'weekly' ? (
          <WeeklyView userId={userId!} />
        ) : activeTab === 'achievements' ? (
          <AchievementsView userId={userId!} />
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Chart Section */}
            <div className="lg:col-span-7 space-y-8">
               <div className="glass-card p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6">
                     <div className="w-10 h-10 bg-vitality-lime/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-vitality-emerald" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-extrabold text-vitality-slate flex items-center gap-2">
                       Nutritional Intelligence
                       <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 uppercase tracking-tighter">LIVE</span>
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShareCard(true)}
                      className="text-vitality-emerald hover:bg-vitality-lime/10 font-bold text-xs gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Progress
                    </Button>
                  </div>
                  <MacroDonutChart
                    consumed={{
                      protein: dailyLog?.total_protein_g || 0,
                      carbs: dailyLog?.total_carbs_g || 0,
                      fat: dailyLog?.total_fat_g || 0,
                      calories: dailyLog?.total_calories || 0,
                    }}
                    goals={{
                      protein: profile.daily_protein_g,
                      carbs: profile.daily_carbs_g,
                      fat: profile.daily_fat_g,
                      calories: profile.daily_calories,
                    }}
                  />
               </div>

               <WeightLogCard 
                 currentWeight={profile.weight_kg} 
                 onLog={handleLogWeight} 
               />

               {/* Personal Stats Row */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-vitality-lime/20 rounded-2xl flex items-center justify-center text-vitality-emerald">
                      <User className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight</p>
                      <p className="text-lg font-black text-vitality-slate tabular-nums">{profile.weight_kg} <span className="text-xs font-normal">kg</span></p>
                   </div>
                </div>
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-vitality-emerald/20 rounded-2xl flex items-center justify-center text-vitality-emerald">
                      <Activity className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TDEE</p>
                      <p className="text-lg font-black text-vitality-slate tabular-nums">{Math.round(profile.daily_calories)} <span className="text-xs font-normal">kcal</span></p>
                   </div>
                </div>
                <div className="glass-card p-5 rounded-3xl flex items-center gap-4 hidden md:flex">
                   <div className="w-12 h-12 bg-vitality-amber/20 rounded-2xl flex items-center justify-center text-vitality-amber">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal</p>
                      <p className="text-lg font-black text-vitality-slate uppercase text-[10px]">{profile.goal_type.replace('_', ' ')}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Meals Section */}
          <div className="lg:col-span-5 space-y-6">
            <WaterTracker 
              currentMl={dailyLog?.water_ml || 0}
              goalMl={dailyLog?.water_goal_ml || 2500}
              onAdd={handleUpdateWater}
            />

            <MealAdvisorCard 
              remainingCalories={Math.max(0, Math.round(profile.daily_calories - (dailyLog?.total_calories || 0)))}
              remainingProtein={Math.max(0, Math.round(profile.daily_protein_g - (dailyLog?.total_protein_g || 0)))}
              remainingCarbs={Math.max(0, Math.round(profile.daily_carbs_g - (dailyLog?.total_carbs_g || 0)))}
              remainingFat={Math.max(0, Math.round(profile.daily_fat_g - (dailyLog?.total_fat_g || 0)))}
              onLogMeal={handleAddMeal}
            />
            
            <h3 className="text-xl font-extrabold text-vitality-slate flex items-center gap-2 px-2">
               Daily Timeline
               <div className="h-px bg-slate-200 flex-grow ml-4"></div>
            </h3>
            <div className="space-y-6">
              <MealSection
                title="Breakfast"
                meals={getMealsByType('breakfast')}
                totalCalories={getMealTypeCalories('breakfast')}
                onDeleteMeal={handleDeleteMeal}
                onSaveTemplate={handleSaveTemplate}
              />
              <MealSection
                title="Lunch"
                meals={getMealsByType('lunch')}
                totalCalories={getMealTypeCalories('lunch')}
                onDeleteMeal={handleDeleteMeal}
                onSaveTemplate={handleSaveTemplate}
              />
              <MealSection
                title="Dinner"
                meals={getMealsByType('dinner')}
                totalCalories={getMealTypeCalories('dinner')}
                onDeleteMeal={handleDeleteMeal}
                onSaveTemplate={handleSaveTemplate}
              />
              <MealSection
                title="Snacks"
                meals={getMealsByType('snacks')}
                totalCalories={getMealTypeCalories('snacks')}
                onDeleteMeal={handleDeleteMeal}
                onSaveTemplate={handleSaveTemplate}
              />
            </div>
          </div>
        </div>
      )}
    </main>

      {/* Floating Action Buttons (Desktop Only) */}
      <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 gap-4 z-50">
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

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => setShowAddMealDialog(true)} 
      />

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
        onClose={() => {
          setShowAddMealDialog(false);
          setScannedProduct(null);
        }}
        onAdd={handleAddMeal}
        templates={templates}
        initialData={scannedProduct}
        onScanClick={() => setShowBarcodeScanner(true)}
      />

      <BarcodeScanner 
        open={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onDetected={handleBarcodeDetected}
      />

      {profile && (
        <SocialShareCard
          open={showShareCard}
          onClose={() => setShowShareCard(false)}
          data={{
            calories: dailyLog?.total_calories || 0,
            protein: dailyLog?.total_protein_g || 0,
            carbs: dailyLog?.total_carbs_g || 0,
            fat: dailyLog?.total_fat_g || 0,
            goal: profile.daily_calories,
            streak: profile.current_streak || 0,
            userName: (profile as any).full_name || 'Athlete',
            date: format(currentDate, 'MMMM d, yyyy'),
          }}
        />
      )}
    </div>
  );
}
