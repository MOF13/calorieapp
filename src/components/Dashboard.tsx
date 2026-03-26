import { useState, useEffect } from 'react';
import { Utensils, ChevronLeft, ChevronRight, Plus, LogOut, Camera } from 'lucide-react';
import { format, addDays, subDays, isAfter, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              <span className="text-base sm:text-lg font-bold text-gray-900">CalorieTracker</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut();
                  if (onSignOut) {
                    onSignOut();
                  }
                }}
                className="text-xs sm:text-sm text-gray-700 border-gray-300 hover:bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 h-8 sm:h-10"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24">
        <div className="mb-4 sm:mb-6">
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {format(currentDate, 'EEEE')}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-teal-600">
              {format(currentDate, 'MMMM d, yyyy')}
            </h2>
          </div>

          <div className="flex items-center justify-center">
            <ButtonGroup size="sm">
              <Button
                variant="outline"
                onClick={handlePreviousDay}
                className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3"
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleNextDay}
                disabled={isFutureDate}
                className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-2 sm:px-3"
              >
                Next
                <ChevronRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
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

        <div className="space-y-6 max-w-2xl mx-auto">
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
      </main>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={() => setShowPhotoUpload(true)}
          className="w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        >
          <Camera className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowAddMealDialog(true)}
          className="w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
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
