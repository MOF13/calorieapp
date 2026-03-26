import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { feetInchesToCm, cmToFeetInches, lbsToKg, kgToLbs } from '@/utils/calculations';

interface BasicInfoStepProps {
  data: any;
  updateData: (data: any) => void;
}

export default function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const [useMetric, setUseMetric] = useState(false);
  const [heightFeet, setHeightFeet] = useState(data.heightCm ? cmToFeetInches(data.heightCm).feet : 5);
  const [heightInches, setHeightInches] = useState(data.heightCm ? cmToFeetInches(data.heightCm).inches : 8);
  const [heightCm, setHeightCm] = useState(data.heightCm || 173);
  const [weightLbs, setWeightLbs] = useState(data.weightKg ? kgToLbs(data.weightKg) : 154);
  const [weightKg, setWeightKg] = useState(data.weightKg || 70);

  useEffect(() => {
    if (!data.heightCm) {
      updateData({ heightCm: 173 });
    }
    if (!data.weightKg) {
      updateData({ weightKg: 70 });
    }
  }, []);

  const handleHeightChange = (feet: number, inches: number) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    const cm = feetInchesToCm(feet, inches);
    setHeightCm(cm);
    updateData({ heightCm: cm });
  };

  const handleHeightCmChange = (cm: number) => {
    setHeightCm(cm);
    const { feet, inches } = cmToFeetInches(cm);
    setHeightFeet(feet);
    setHeightInches(inches);
    updateData({ heightCm: cm });
  };

  const handleWeightChange = (value: number, isLbs: boolean) => {
    if (isLbs) {
      setWeightLbs(value);
      const kg = lbsToKg(value);
      setWeightKg(kg);
      updateData({ weightKg: kg });
    } else {
      setWeightKg(value);
      const lbs = kgToLbs(value);
      setWeightLbs(lbs);
      updateData({ weightKg: value });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
        <p className="text-sm sm:text-base text-gray-600">Tell us a bit about yourself to personalize your experience</p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div>
          <Label htmlFor="age" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
            How old are you?
          </Label>
          <Input
            id="age"
            type="number"
            min="13"
            max="100"
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || undefined })}
            placeholder="Enter your age"
            className="text-base sm:text-lg h-11 sm:h-12"
          />
        </div>

        <div>
          <Label className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
            What's your biological sex?
          </Label>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => updateData({ sex: 'male' })}
              className={`flex flex-col items-center justify-center border-2 rounded-lg p-3 sm:p-4 transition-all ${
                data.sex === 'male'
                  ? 'border-emerald-600 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-500'
              }`}
            >
              <span className="text-sm sm:text-base font-medium text-gray-900">Male</span>
            </button>
            <button
              type="button"
              onClick={() => updateData({ sex: 'female' })}
              className={`flex flex-col items-center justify-center border-2 rounded-lg p-3 sm:p-4 transition-all ${
                data.sex === 'female'
                  ? 'border-emerald-600 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-500'
              }`}
            >
              <span className="text-sm sm:text-base font-medium text-gray-900">Female</span>
            </button>
            <button
              type="button"
              onClick={() => updateData({ sex: 'other' })}
              className={`flex flex-col items-center justify-center border-2 rounded-lg p-3 sm:p-4 transition-all ${
                data.sex === 'other'
                  ? 'border-emerald-600 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-500'
              }`}
            >
              <span className="text-sm sm:text-base font-medium text-gray-900">Other</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Label className="text-sm sm:text-base font-semibold text-gray-900">
              What's your height?
            </Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm ${!useMetric ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>ft/in</span>
              <Switch
                checked={useMetric}
                onCheckedChange={setUseMetric}
              />
              <span className={`text-xs sm:text-sm ${useMetric ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>cm</span>
            </div>
          </div>

          {!useMetric ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="feet" className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 block">Feet</Label>
                <Select
                  value={heightFeet.toString()}
                  onValueChange={(value) => handleHeightChange(parseInt(value), heightInches)}
                >
                  <SelectTrigger id="feet" className="h-11 sm:h-12 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[4, 5, 6, 7].map((ft) => (
                      <SelectItem key={ft} value={ft.toString()}>{ft} ft</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inches" className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 block">Inches</Label>
                <Select
                  value={heightInches.toString()}
                  onValueChange={(value) => handleHeightChange(heightFeet, parseInt(value))}
                >
                  <SelectTrigger id="inches" className="h-11 sm:h-12 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i} in</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <Input
              type="number"
              min="120"
              max="220"
              value={heightCm}
              onChange={(e) => handleHeightCmChange(parseInt(e.target.value) || 0)}
              placeholder="Enter height in cm"
              className="text-base sm:text-lg h-11 sm:h-12"
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Label className="text-sm sm:text-base font-semibold text-gray-900">
              What's your current weight?
            </Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm ${!useMetric ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>lbs</span>
              <Switch
                checked={useMetric}
                onCheckedChange={setUseMetric}
              />
              <span className={`text-xs sm:text-sm ${useMetric ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>kg</span>
            </div>
          </div>

          {!useMetric ? (
            <Input
              type="number"
              min="50"
              max="500"
              step="0.1"
              value={weightLbs}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0, true)}
              placeholder="Enter weight in lbs"
              className="text-base sm:text-lg h-11 sm:h-12"
            />
          ) : (
            <Input
              type="number"
              min="25"
              max="250"
              step="0.1"
              value={weightKg}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0, false)}
              placeholder="Enter weight in kg"
              className="text-base sm:text-lg h-11 sm:h-12"
            />
          )}
        </div>
      </div>
    </div>
  );
}
