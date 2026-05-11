import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BasicInfoStep from './onboarding/BasicInfoStep';
import ActivityLevelStep from './onboarding/ActivityLevelStep';
import GoalStep from './onboarding/GoalStep';
import SummaryStep from './onboarding/SummaryStep';
import {
  calculateBMR,
  calculateTDEE,
  calculateDailyCalorieGoal,
  calculateMacros,
} from '@/utils/calculations';
import { createUserProfile } from '@/lib/db';

interface OnboardingData {
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goalType: 'lose_weight' | 'maintain' | 'gain_weight';
  goalPace?: '0_5_lb_per_week' | '1_lb_per_week' | '2_lbs_per_week';
}

interface OnboardingProps {
  onComplete: () => void;
  userId: string | null;
}

interface CalculatedProfile {
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goalType: string;
  goalPace?: string;
  dailyCalories: number;
  dailyProteinG: number;
  dailyCarbsG: number;
  dailyFatG: number;
}

export default function Onboarding({ onComplete, userId }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [calculatedProfile, setCalculatedProfile] = useState<CalculatedProfile | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData({ ...data, ...newData });
  };

  const nextStep = () => {
    if (currentStep === 3) {
      calculateAndShowSummary();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateAndShowSummary = () => {
    const { age, sex, heightCm, weightKg, activityLevel, goalType, goalPace } = data as OnboardingData;

    const bmr = calculateBMR(weightKg, heightCm, age, sex);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyCalorieGoal = calculateDailyCalorieGoal(tdee, goalType, goalPace);
    const macros = calculateMacros(dailyCalorieGoal);

    const profile: CalculatedProfile = {
      age,
      sex,
      heightCm,
      weightKg,
      activityLevel,
      goalType,
      goalPace,
      dailyCalories: dailyCalorieGoal,
      dailyProteinG: macros.proteinG,
      dailyCarbsG: macros.carbsG,
      dailyFatG: macros.fatG,
    };

    setCalculatedProfile(profile);
  };

  const handleComplete = async () => {
    if (calculatedProfile && userId) {
      await createUserProfile({
        id: userId,
        age: calculatedProfile.age,
        sex: calculatedProfile.sex,
        height_cm: calculatedProfile.heightCm,
        weight_kg: calculatedProfile.weightKg,
        activity_level: calculatedProfile.activityLevel,
        goal_type: calculatedProfile.goalType,
        goal_pace: calculatedProfile.goalPace,
        daily_calories: calculatedProfile.dailyCalories,
        daily_protein_g: calculatedProfile.dailyProteinG,
        daily_carbs_g: calculatedProfile.dailyCarbsG,
        daily_fat_g: calculatedProfile.dailyFatG,
      });
      onComplete();
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return !!(data.age && data.age >= 13 && data.age <= 100 && data.sex && data.heightCm && data.heightCm > 0 && data.weightKg && data.weightKg > 0);
    }
    if (currentStep === 2) {
      return !!data.activityLevel;
    }
    if (currentStep === 3) {
      if (data.goalType === 'lose_weight' || data.goalType === 'gain_weight') {
        return !!(data.goalType && data.goalPace);
      }
      return !!data.goalType;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs sm:text-sm font-medium text-emerald-600">
                  {progress.toFixed(0)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-1.5 sm:h-2" />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[400px]">
            {currentStep === 1 && (
              <BasicInfoStep data={data} updateData={updateData} />
            )}
            {currentStep === 2 && (
              <ActivityLevelStep data={data} updateData={updateData} />
            )}
            {currentStep === 3 && (
              <GoalStep data={data} updateData={updateData} />
            )}
            {currentStep === 4 && calculatedProfile && (
              <SummaryStep profile={calculatedProfile} />
            )}
          </div>

          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                Start Tracking
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
