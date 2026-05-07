import { useState, useEffect } from 'react';
import { Barcode, Search, ArrowLeft, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodSearch } from './FoodSearch';

interface AddMealDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (meal: {
    name: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) => void;
  templates?: any[];
  onScanClick?: () => void;
  initialData?: any;
}

export function AddMealDialog({ open, onClose, onAdd, templates = [], onScanClick, initialData }: AddMealDialogProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search');
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name || '');
      setCalories(initialData.calories?.toString() || '');
      setProtein(initialData.protein_g?.toString() || '');
      setCarbs(initialData.carbs_g?.toString() || '');
      setFat(initialData.fat_g?.toString() || '');
      setStep('edit');
    } else if (!initialData && open) {
      setStep('search');
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleSubmit = () => {
    if (!name || !calories) return;

    onAdd({
      name,
      meal_type: mealType,
      calories: parseInt(calories) || 0,
      protein_g: parseInt(protein) || 0,
      carbs_g: parseInt(carbs) || 0,
      fat_g: parseInt(fat) || 0,
    });

    onClose();
  };

  const handleSelectFood = (food: any) => {
    setName(food.name_en);
    setCalories(Math.round(food.calories_per_100g).toString());
    setProtein(Math.round(food.protein_per_100g).toString());
    setCarbs(Math.round(food.carbs_per_100g).toString());
    setFat(Math.round(food.fat_per_100g).toString());
    setStep('edit');
  };

  const applyTemplate = (template: any) => {
    setName(template.name);
    setMealType(template.meal_type);
    setCalories(template.calories.toString());
    setProtein(template.protein_g.toString());
    setCarbs(template.carbs_g.toString());
    setFat(template.fat_g.toString());
    setStep('edit');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
             {step === 'edit' && (
               <button 
                onClick={() => setStep('search')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
               >
                 <ArrowLeft className="w-5 h-5 text-slate-500" />
               </button>
             )}
             <DialogTitle className="text-2xl font-black text-vitality-slate">
               {step === 'search' ? 'Add Entry' : 'Log Details'}
             </DialogTitle>
          </div>
          
          {step === 'search' && onScanClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onScanClick}
              className="border-vitality-emerald/30 text-vitality-emerald hover:bg-vitality-lime/10 rounded-xl"
            >
              <Barcode className="w-4 h-4 mr-2" />
              Scan
            </Button>
          )}
        </DialogHeader>

        <div className="p-8 pt-6">
          {step === 'search' ? (
            <div className="space-y-6">
              {templates.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quick Add Favorites</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {templates.slice(0, 5).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className="flex-shrink-0 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-vitality-lime/10 hover:border-vitality-emerald/30 transition-all text-left"
                      >
                        <p className="text-xs font-bold text-vitality-slate truncate max-w-[120px]">{template.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{template.calories} kcal</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Search Database</Label>
                <FoodSearch 
                  onSelect={handleSelectFood} 
                  onManualAdd={() => setStep('edit')}
                />
              </div>

              <div className="pt-4 text-center">
                 <button 
                  onClick={() => setStep('edit')}
                  className="text-xs font-bold text-slate-400 hover:text-vitality-emerald transition-colors"
                 >
                   Or enter details manually →
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Food Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chicken Breast"
                  className="h-12 rounded-2xl border-slate-200 focus-visible:ring-vitality-emerald"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-type" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meal Type</Label>
                <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                  <SelectTrigger id="meal-type" className="h-12 rounded-2xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100">
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="0"
                    className="h-12 rounded-2xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protein" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    className="h-12 rounded-2xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carbs" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="0"
                    className="h-12 rounded-2xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fat" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="0"
                    className="h-12 rounded-2xl border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!name || !calories}
                  className="w-full h-14 rounded-2xl bg-vitality-emerald text-white hover:bg-vitality-emerald/90 text-lg font-black shadow-lg shadow-vitality-emerald/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Log Entry
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
}
