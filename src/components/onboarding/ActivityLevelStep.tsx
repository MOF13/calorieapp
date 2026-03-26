import { Activity, Bike, Dumbbell, Zap } from 'lucide-react';

interface ActivityLevelStepProps {
  data: any;
  updateData: (data: any) => void;
}

const activityLevels = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise',
    icon: Activity,
  },
  {
    value: 'lightly_active',
    label: 'Lightly Active',
    description: 'Exercise 1-3 days/week',
    icon: Activity,
  },
  {
    value: 'moderately_active',
    label: 'Moderately Active',
    description: 'Exercise 3-5 days/week',
    icon: Bike,
  },
  {
    value: 'very_active',
    label: 'Very Active',
    description: 'Exercise 6-7 days/week',
    icon: Dumbbell,
  },
  {
    value: 'extra_active',
    label: 'Extra Active',
    description: 'Physical job + daily exercise',
    icon: Zap,
  },
];

export default function ActivityLevelStep({ data, updateData }: ActivityLevelStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Activity Level</h2>
        <p className="text-gray-600">How active are you on a typical day?</p>
      </div>

      <div className="space-y-4">
        {activityLevels.map((level) => {
          const Icon = level.icon;
          const isSelected = data.activityLevel === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => updateData({ activityLevel: level.value })}
              className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <Icon className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {level.label}
                  </div>
                  <p className="text-gray-600 text-sm">{level.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
