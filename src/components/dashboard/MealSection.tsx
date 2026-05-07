import { Plus, Coffee, Sun, Flame, Cookie, ChevronRight, Bookmark, Pencil } from 'lucide-react';

interface MealSectionProps {
  title: string;
  meals: any[];
  totalCalories: number;
  onDeleteMeal?: (mealId: string) => void;
  onEditMeal?: (meal: any) => void;
  onSaveTemplate?: (meal: any) => void;
}

const mealIcons: Record<string, { icon: any; color: string; bgColor: string; borderColor: string }> = {
  Breakfast: { icon: Coffee, color: 'text-orange-500', bgColor: 'bg-orange-50/50', borderColor: 'border-orange-200/50' },
  Lunch: { icon: Sun, color: 'text-yellow-500', bgColor: 'bg-yellow-50/50', borderColor: 'border-yellow-200/50' },
  Dinner: { icon: Flame, color: 'text-red-500', bgColor: 'bg-red-50/50', borderColor: 'border-red-200/50' },
  Snacks: { icon: Cookie, color: 'text-pink-500', bgColor: 'bg-pink-50/50', borderColor: 'border-pink-200/50' },
};

export function MealSection({ title, meals, totalCalories, onDeleteMeal, onEditMeal, onSaveTemplate }: MealSectionProps) {
  const mealIcon = mealIcons[title];
  const IconComponent = mealIcon?.icon || Coffee;

  return (
    <div className="glass-card rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${mealIcon?.bgColor} border ${mealIcon?.borderColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            <IconComponent className={`w-6 h-6 ${mealIcon?.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-vitality-slate">{title}</h3>
            {totalCalories > 0 && (
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-vitality-emerald animate-pulse"></div>
                 <p className="text-sm text-vitality-emerald font-bold">
                  {totalCalories} kcal
                </p>
              </div>
            )}
          </div>
        </div>
        {meals.length > 0 && (
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {meals.length === 0 ? (
        <div className="bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
            <Plus className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400 italic">No fuel logged for {title.toLowerCase()} yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="group/item bg-white/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-slate-100 hover:border-vitality-lime/30 hover:bg-white transition-all"
            >
              <div className="flex flex-col">
                <p className="font-bold text-vitality-slate text-sm leading-tight">{meal.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">PORTION OK</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-black text-vitality-slate">{meal.calories}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">KCAL</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  {onEditMeal && (
                    <button
                      onClick={() => onEditMeal(meal)}
                      className="p-2 text-slate-300 hover:text-vitality-emerald hover:bg-vitality-lime/10 rounded-lg transition-all"
                      title="Edit Meal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {onSaveTemplate && (
                    <button
                      onClick={() => onSaveTemplate(meal)}
                      className="p-2 text-slate-300 hover:text-vitality-emerald hover:bg-vitality-lime/10 rounded-lg transition-all"
                      title="Save as Template"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteMeal && (
                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Meal"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
