import { useState, useEffect } from 'react';
import { Barcode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    }
  }, [initialData, open]);

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

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    onClose();
  };

  const applyTemplate = (template: any) => {
    setName(template.name);
    setMealType(template.meal_type);
    setCalories(template.calories.toString());
    setProtein(template.protein_g.toString());
    setCarbs(template.carbs_g.toString());
    setFat(template.fat_g.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
          {onScanClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onScanClick}
              className="absolute right-12 top-6 border-vitality-emerald/30 text-vitality-emerald hover:bg-vitality-lime/10"
            >
              <Barcode className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>
          )}
        </DialogHeader>

        {templates.length > 0 && (
          <div className="space-y-3 px-1">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Add Favorites</Label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {templates.slice(0, 5).map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="flex-shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-vitality-lime/10 hover:border-vitality-emerald/30 transition-all text-left"
                >
                  <p className="text-xs font-bold text-vitality-slate truncate max-w-[100px]">{template.name}</p>
                  <p className="text-[10px] text-slate-400">{template.calories} kcal</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Breast"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
              <SelectTrigger id="meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || !calories}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Add Meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
