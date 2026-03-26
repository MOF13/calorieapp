import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileData {
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

interface SummaryStepProps {
  profile: ProfileData;
}

export default function SummaryStep({ profile }: SummaryStepProps) {
  const goalTypeLabels: Record<string, string> = {
    lose_weight: 'Lose Weight',
    maintain: 'Maintain Weight',
    gain_weight: 'Gain Weight',
  };

  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentary',
    lightly_active: 'Lightly Active',
    moderately_active: 'Moderately Active',
    very_active: 'Very Active',
    extra_active: 'Extra Active',
  };

  const paceLabels: Record<string, string> = {
    '0_5_lb_per_week': '0.5 lb/week',
    '1_lb_per_week': '1 lb/week',
    '2_lbs_per_week': '2 lbs/week',
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Plan</h2>
        <p className="text-gray-600">Here are your daily nutrition goals</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-center shadow-xl">
        <p className="text-emerald-50 font-medium mb-2">Daily Calorie Goal</p>
        <p className="text-6xl font-bold text-white mb-2">{profile.dailyCalories}</p>
        <p className="text-emerald-50 text-lg">calories</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Beef className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{profile.dailyProteinG}g</p>
            <p className="text-sm text-gray-600 font-medium">Protein</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Wheat className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{profile.dailyCarbsG}g</p>
            <p className="text-sm text-gray-600 font-medium">Carbs</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Droplet className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{profile.dailyFatG}g</p>
            <p className="text-sm text-gray-600 font-medium">Fat</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Age:</span>
            <span className="ml-2 font-semibold text-gray-900">{profile.age} years</span>
          </div>
          <div>
            <span className="text-gray-600">Sex:</span>
            <span className="ml-2 font-semibold text-gray-900 capitalize">{profile.sex}</span>
          </div>
          <div>
            <span className="text-gray-600">Height:</span>
            <span className="ml-2 font-semibold text-gray-900">{profile.heightCm} cm</span>
          </div>
          <div>
            <span className="text-gray-600">Weight:</span>
            <span className="ml-2 font-semibold text-gray-900">{profile.weightKg} kg</span>
          </div>
          <div>
            <span className="text-gray-600">Activity:</span>
            <span className="ml-2 font-semibold text-gray-900">{activityLabels[profile.activityLevel]}</span>
          </div>
          <div>
            <span className="text-gray-600">Goal:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {goalTypeLabels[profile.goalType]}
              {profile.goalPace && ` (${paceLabels[profile.goalPace]})`}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Ready to start?</span> Track your meals daily to stay on target and achieve your goals!
        </p>
      </div>
    </div>
  );
}
