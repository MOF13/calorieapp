import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';

interface GoalStepProps {
  data: any;
  updateData: (data: any) => void;
}

const goalTypes = [
  {
    value: 'lose_weight',
    label: 'Lose Weight',
    description: 'Create a calorie deficit',
    icon: TrendingDown,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-600',
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    description: 'Stay at current weight',
    icon: Minus,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-600',
  },
  {
    value: 'gain_weight',
    label: 'Gain Weight',
    description: 'Create a calorie surplus',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-600',
  },
];

const paceLoseWeight = [
  { value: '0_5_lb_per_week', label: '0.5 lb per week (Slow)' },
  { value: '1_lb_per_week', label: '1 lb per week (Moderate)' },
  { value: '2_lbs_per_week', label: '2 lbs per week (Fast)' },
];

const paceGainWeight = [
  { value: '0_5_lb_per_week', label: '0.5 lb per week (Slow)' },
  { value: '1_lb_per_week', label: '1 lb per week (Moderate)' },
];

export default function GoalStep({ data, updateData }: GoalStepProps) {
  const handleGoalTypeChange = (value: string) => {
    updateData({ goalType: value, goalPace: undefined });
  };

  const showPaceSelector = data.goalType === 'lose_weight' || data.goalType === 'gain_weight';
  const paceOptions = data.goalType === 'lose_weight' ? paceLoseWeight : paceGainWeight;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Goal</h2>
        <p className="text-gray-600">What would you like to achieve?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          {goalTypes.map((goal) => {
            const Icon = goal.icon;
            const isSelected = data.goalType === goal.value;
            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => handleGoalTypeChange(goal.value)}
                className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                  isSelected
                    ? `${goal.borderColor} ${goal.bgColor} shadow-md`
                    : 'border-gray-200 bg-white hover:border-emerald-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-5 h-5 ${goal.color} mt-1`} />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {goal.label}
                    </div>
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {showPaceSelector && (
          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Label htmlFor="pace" className="text-base font-semibold text-gray-900 mb-3 block">
              How fast do you want to {data.goalType === 'lose_weight' ? 'lose' : 'gain'} weight?
            </Label>
            <Select
              value={data.goalPace || ''}
              onValueChange={(value) => updateData({ goalPace: value })}
            >
              <SelectTrigger id="pace" className="bg-white h-12 text-base">
                <SelectValue placeholder="Select your pace" />
              </SelectTrigger>
              <SelectContent>
                {paceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-base">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-3">
              {data.goalType === 'lose_weight'
                ? 'A slower pace is more sustainable and easier to maintain long-term.'
                : 'A slower pace minimizes fat gain and keeps you feeling your best.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
