export interface UserProfile {
  userId: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goalType: 'lose_weight' | 'maintain' | 'gain_weight';
  goalPace?: '0_5_lb_per_week' | '1_lb_per_week' | '2_lbs_per_week';
  dailyCalorieGoal: number;
  dailyProteinGoalG: number;
  dailyCarbsGoalG: number;
  dailyFatGoalG: number;
  createdAt: string;
}

export const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const goalPaceCalories = {
  '0_5_lb_per_week': 250,
  '1_lb_per_week': 500,
  '2_lbs_per_week': 1000,
};

export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female' | 'other'): number {
  if (sex === 'male') {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: keyof typeof activityMultipliers): number {
  return bmr * activityMultipliers[activityLevel];
}

export function calculateDailyCalorieGoal(
  tdee: number,
  goalType: 'lose_weight' | 'maintain' | 'gain_weight',
  goalPace?: keyof typeof goalPaceCalories
): number {
  if (goalType === 'maintain') {
    return Math.round(tdee);
  }

  if (!goalPace) {
    return Math.round(tdee);
  }

  const adjustment = goalPaceCalories[goalPace];

  if (goalType === 'lose_weight') {
    return Math.round(tdee - adjustment);
  } else {
    return Math.round(tdee + adjustment);
  }
}

export function calculateMacros(calories: number) {
  return {
    proteinG: Math.round((calories * 0.30) / 4),
    carbsG: Math.round((calories * 0.40) / 4),
    fatG: Math.round((calories * 0.30) / 9),
  };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / 2.54);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  const stored = localStorage.getItem('userProfile');
  return stored ? JSON.parse(stored) : null;
}
