import { Plus, Coffee, Sun, Flame, Cookie } from 'lucide-react';

interface MealSectionProps {
  title: string;
  meals: any[];
  totalCalories: number;
}

const mealIcons: Record<string, { icon: any; color: string; bgColor: string }> = {
  Breakfast: { icon: Coffee, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  Lunch: { icon: Sun, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  Dinner: { icon: Flame, color: 'text-red-500', bgColor: 'bg-red-50' },
  Snacks: { icon: Cookie, color: 'text-pink-500', bgColor: 'bg-pink-50' },
};

export function MealSection({ title, meals, totalCalories }: MealSectionProps) {
  const mealIcon = mealIcons[title];
  const IconComponent = mealIcon?.icon || Coffee;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${mealIcon?.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${mealIcon?.color}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {totalCalories > 0 && (
              <p className="text-sm text-teal-600 font-medium">
                {totalCalories} calories logged
              </p>
            )}
          </div>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Plus className="w-8 h-8 text-gray-400 mb-2 border-2 border-dashed border-gray-300 rounded-full p-1" />
          <p className="text-sm text-gray-600">No meals logged yet</p>
          <p className="text-xs text-gray-500 mt-1">Tap the + button to add food</p>
        </div>
      ) : (
        <div className="space-y-2">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-3 flex items-start justify-between"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm mb-1">{meal.name}</p>
                <p className="text-xs text-gray-600">{meal.calories} cal</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
