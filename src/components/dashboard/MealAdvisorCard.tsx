import { useState } from 'react';
import { Sparkles, Loader2, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Suggestion {
  name: string;
  reason: string;
  nutrients: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
}

interface MealAdvisorCardProps {
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  onLogMeal: (meal: any) => void;
}

import { useTranslation } from 'react-i18next';

export function MealAdvisorCard({
  remainingCalories,
  remainingProtein,
  remainingCarbs,
  remainingFat,
  onLogMeal
}: MealAdvisorCardProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-meals`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remainingCalories,
          remainingProtein,
          remainingCarbs,
          remainingFat,
          mealType: getAppropriateMealType()
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Could not get AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAppropriateMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snack';
  };

  const handleQuickLog = (suggestion: Suggestion) => {
    onLogMeal({
      name: suggestion.name,
      meal_type: getAppropriateMealType() === 'snack' ? 'snacks' : getAppropriateMealType(),
      calories: suggestion.nutrients.calories,
      protein_g: suggestion.nutrients.proteinG,
      carbs_g: suggestion.nutrients.carbsG,
      fat_g: suggestion.nutrients.fatG,
    });
    toast.success(`Logged ${suggestion.name}!`);
    // Remove suggestion after logging
    setSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
  };

  return (
    <div className="glass-card p-6 rounded-[2rem] border-vitality-emerald/20 overflow-hidden relative group">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-vitality-emerald/10 blur-3xl group-hover:bg-vitality-emerald/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vitality-emerald/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-vitality-emerald" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-vitality-slate">AI Meal Advisor</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smart Recommendations</p>
          </div>
        </div>
        
        {suggestions.length === 0 && !isLoading && (
          <Button 
            onClick={getSuggestions}
            variant="ghost"
            className="text-vitality-emerald hover:bg-vitality-lime/10 font-bold text-xs"
          >
            Get Advice
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-vitality-emerald animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Analyzing your macro balance...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="p-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-2xl hover:border-vitality-emerald/30 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-vitality-slate text-sm">{suggestion.name}</h4>
                <Button
                  onClick={() => handleQuickLog(suggestion)}
                  size="sm"
                  className="h-8 w-8 rounded-full bg-vitality-emerald/10 text-vitality-emerald hover:bg-vitality-emerald hover:text-white p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{suggestion.reason}</p>
              <div className="flex gap-3">
                <div className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                  {suggestion.nutrients.calories} kcal
                </div>
                <div className="px-2 py-1 bg-vitality-lime/20 rounded-lg text-[10px] font-bold text-vitality-emerald">
                  P: {suggestion.nutrients.proteinG}g
                </div>
                <div className="px-2 py-1 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600">
                  C: {suggestion.nutrients.carbsG}g
                </div>
                <div className="px-2 py-1 bg-orange-50 rounded-lg text-[10px] font-bold text-orange-600">
                  F: {suggestion.nutrients.fatG}g
                </div>
              </div>
            </div>
          ))}
          <Button 
            onClick={() => setSuggestions([])}
            variant="ghost"
            className="w-full text-[10px] font-bold text-slate-400 uppercase hover:bg-slate-50"
          >
            Clear Suggestions
          </Button>
        </div>
      ) : (
        <div className="py-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Tap "Get Advice" to see what you should eat to hit your daily macro targets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
