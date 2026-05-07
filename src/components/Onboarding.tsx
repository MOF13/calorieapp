import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        full_name: (data as any).full_name || 'Athlete',
        email: (data as any).email || '',
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
      return !!(data.full_name && data.age && data.age >= 13 && data.age <= 100 && data.sex && data.heightCm && data.heightCm > 0 && data.weightKg && data.weightKg > 0);
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border-white/40">
          <div className="p-8 border-b border-white/20">
            <div className="mb-6 text-center">
               <h2 className="text-2xl font-black text-vitality-slate mb-1">Set Your Target</h2>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personalizing Your Journey</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                  PHASE {currentStep} OF {totalSteps}
                </span>
                <span className="text-xs font-black text-vitality-emerald uppercase tracking-tighter">
                  {progress.toFixed(0)}% READY
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full vitality-gradient transition-all duration-700 ease-out rounded-full shadow-sm"
                   style={{ width: `${progress}%` }}
                 ></div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 min-h-[400px]">
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

          <div className="p-8 bg-slate-50/50 backdrop-blur-sm border-t border-white/20 flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 font-bold px-8 rounded-2xl border-slate-200 hover:bg-white disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="vitality-gradient hover:opacity-90 flex items-center gap-2 px-10 rounded-2xl shadow-lg shadow-vitality-emerald/20 font-bold"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="vitality-gradient hover:opacity-90 flex items-center gap-2 px-10 rounded-2xl shadow-lg shadow-vitality-emerald/20 font-bold animate-pulse"
              >
                Launch Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
