import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FoodItem {
  id: string;
  name: string;
  portionSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: number;
  multiplier: number;
}

interface FoodResultsScreenProps {
  open: boolean;
  onClose: () => void;
  imageBase64: string;
  imageUrl: string;
  dailyLogId: string;
}

export function FoodResultsScreen({
  open,
  onClose,
  imageBase64,
  imageUrl,
  dailyLogId,
}: FoodResultsScreenProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const [manualFood, setManualFood] = useState({
    name: '',
    portionSize: '',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatG: '',
  });

  useEffect(() => {
    if (open && imageBase64) {
      analyzeFood();
      setMealTypeByTime();
    }
  }, [open, imageBase64]);

  const setMealTypeByTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setMealType('breakfast');
    } else if (hour >= 11 && hour < 16) {
      setMealType('lunch');
    } else if (hour >= 16 && hour < 22) {
      setMealType('dinner');
    } else {
      setMealType('snacks');
    }
  };

  const analyzeFood = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-food`;
      console.log('Calling Edge Function:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to analyze food: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);

      if (result.error) {
        console.error('API returned error:', result.error);
        setError(result.error);
        return;
      }

      if (result.foods && result.foods.length > 0) {
        setFoods(
          result.foods.map((food: any) => ({
            ...food,
            multiplier: 1,
          }))
        );
      } else {
        setError('No food detected in this image. Please try a clearer photo or add foods manually.');
      }
    } catch (err) {
      console.error('Error analyzing food:', err);
      setError('Failed to analyze food. Please try again or add foods manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const adjustPortion = (foodId: string, delta: number) => {
    setFoods((prev) =>
      prev.map((food) => {
        if (food.id === foodId) {
          const newMultiplier = Math.max(0.25, Math.min(5, food.multiplier + delta));
          return { ...food, multiplier: newMultiplier };
        }
        return food;
      })
    );
  };

  const removeFood = (foodId: string) => {
    setFoods((prev) => prev.filter((food) => food.id !== foodId));
  };

  const updateFoodName = (foodId: string, newName: string) => {
    setFoods((prev) =>
      prev.map((food) => (food.id === foodId ? { ...food, name: newName } : food))
    );
  };

  const handleAddManualFood = () => {
    if (!manualFood.name || !manualFood.calories) {
      return;
    }

    const newFood: FoodItem = {
      id: `manual_${Date.now()}`,
      name: manualFood.name,
      portionSize: manualFood.portionSize || '1 serving',
      calories: parseInt(manualFood.calories) || 0,
      proteinG: parseInt(manualFood.proteinG) || 0,
      carbsG: parseInt(manualFood.carbsG) || 0,
      fatG: parseInt(manualFood.fatG) || 0,
      confidence: 1,
      multiplier: 1,
    };

    setFoods((prev) => [...prev, newFood]);
    setManualFood({ name: '', portionSize: '', calories: '', proteinG: '', carbsG: '', fatG: '' });
    setShowManualAdd(false);
  };

  const calculateTotals = () => {
    return foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.multiplier,
        proteinG: acc.proteinG + food.proteinG * food.multiplier,
        carbsG: acc.carbsG + food.carbsG * food.multiplier,
        fatG: acc.fatG + food.fatG * food.multiplier,
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    );
  };

  const handleLogMeal = async () => {
    if (foods.length === 0) {
      toast.error('Please add at least one food item');
      return;
    }

    setIsLogging(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to log meals');
        return;
      }

      const totals = calculateTotals();

      for (const food of foods) {
        const { error: mealError } = await supabase.from('meals').insert({
          user_id: user.id,
          daily_log_id: dailyLogId,
          meal_type: mealType,
          name: food.name,
          calories: Math.round(food.calories * food.multiplier),
          protein_g: Math.round(food.proteinG * food.multiplier),
          carbs_g: Math.round(food.carbsG * food.multiplier),
          fat_g: Math.round(food.fatG * food.multiplier),
        });

        if (mealError) {
          throw mealError;
        }
      }

      const { data: currentLog } = await supabase
        .from('daily_logs')
        .select('total_calories, total_protein_g, total_carbs_g, total_fat_g')
        .eq('id', dailyLogId)
        .single();

      if (currentLog) {
        const { error: updateError } = await supabase
          .from('daily_logs')
          .update({
            total_calories: (currentLog.total_calories || 0) + Math.round(totals.calories),
            total_protein_g: (currentLog.total_protein_g || 0) + Math.round(totals.proteinG),
            total_carbs_g: (currentLog.total_carbs_g || 0) + Math.round(totals.carbsG),
            total_fat_g: (currentLog.total_fat_g || 0) + Math.round(totals.fatG),
          })
          .eq('id', dailyLogId);

        if (updateError) {
          throw updateError;
        }
      }

      toast.success('Meal logged successfully!');
      onClose();
    } catch (err) {
      console.error('Error logging meal:', err);
      toast.error('Failed to log meal. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meal Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAnalyzing ? (
          <div className="py-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900">Analyzing your food with AI...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={analyzeFood} className="flex-1 bg-teal-600 hover:bg-teal-700">
                Try Again
              </Button>
              <Button
                onClick={() => setShowManualAdd(true)}
                variant="outline"
                className="flex-1"
              >
                Add Manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-40 rounded-xl overflow-hidden">
              <img src={imageUrl} alt="Food" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detected Foods</h3>
                <Button
                  onClick={() => setShowManualAdd(!showManualAdd)}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Food
                </Button>
              </div>

              {showManualAdd && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Add Food Manually</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="manual-name">Food Name</Label>
                      <Input
                        id="manual-name"
                        value={manualFood.name}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g., Apple"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="manual-portion">Portion Size</Label>
                      <Input
                        id="manual-portion"
                        value={manualFood.portionSize}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, portionSize: e.target.value }))
                        }
                        placeholder="e.g., 1 medium"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manual-calories">Calories</Label>
                      <Input
                        id="manual-calories"
                        type="number"
                        value={manualFood.calories}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, calories: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="manual-protein">Protein (g)</Label>
                      <Input
                        id="manual-protein"
                        type="number"
                        value={manualFood.proteinG}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, proteinG: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="manual-carbs">Carbs (g)</Label>
                      <Input
                        id="manual-carbs"
                        type="number"
                        value={manualFood.carbsG}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, carbsG: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="manual-fat">Fat (g)</Label>
                      <Input
                        id="manual-fat"
                        type="number"
                        value={manualFood.fatG}
                        onChange={(e) =>
                          setManualFood((prev) => ({ ...prev, fatG: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddManualFood}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={!manualFood.name || !manualFood.calories}
                  >
                    Add Food
                  </Button>
                </div>
              )}

              {foods.map((food) => (
                <div key={food.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Input
                        value={food.name}
                        onChange={(e) => updateFoodName(food.id, e.target.value)}
                        className="text-base font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                      />
                      {food.confidence < 0.7 && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs text-yellow-700">Low confidence - please verify</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFood(food.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => adjustPortion(food.id, -0.25)}
                      disabled={food.multiplier <= 0.25}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                      {food.portionSize}
                      {food.multiplier !== 1 && ` (${food.multiplier}x)`}
                    </span>
                    <button
                      onClick={() => adjustPortion(food.id, 0.25)}
                      disabled={food.multiplier >= 5}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(food.calories * food.multiplier)}
                      </div>
                      <div className="text-xs text-gray-500">cal</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(food.proteinG * food.multiplier)}
                      </div>
                      <div className="text-xs text-gray-500">protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(food.carbsG * food.multiplier)}
                      </div>
                      <div className="text-xs text-gray-500">carbs</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(food.fatG * food.multiplier)}
                      </div>
                      <div className="text-xs text-gray-500">fat</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {foods.length > 0 && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meal Type
                  </Label>
                  <div className="flex gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setMealType(type)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm capitalize transition-colors ${
                          mealType === type
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h3 className="font-semibold text-teal-900 mb-3">Total</h3>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-teal-900">
                        {Math.round(totals.calories)}
                      </div>
                      <div className="text-xs text-teal-700">Calories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-900">
                        {Math.round(totals.proteinG)}g
                      </div>
                      <div className="text-xs text-teal-700">Protein</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-900">
                        {Math.round(totals.carbsG)}g
                      </div>
                      <div className="text-xs text-teal-700">Carbs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-900">
                        {Math.round(totals.fatG)}g
                      </div>
                      <div className="text-xs text-teal-700">Fat</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleLogMeal}
                    disabled={isLogging}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 h-12 text-base font-semibold"
                  >
                    {isLogging ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Logging...
                      </>
                    ) : (
                      'Log Meal'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setFoods([]);
                      setError(null);
                      analyzeFood();
                    }}
                    variant="outline"
                    className="px-6 h-12"
                  >
                    Retake
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
