import { useState, useEffect } from 'react';
import { Search, Loader2, Utensils, Globe, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchFoods } from '@/lib/db';
import { Button } from '@/components/ui/button';

interface FoodSearchProps {
  onSelect: (food: any) => void;
  onManualAdd?: () => void;
}

export function FoodSearch({ onSelect, onManualAdd }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchFoods(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food... (e.g. Shawarma or Apple)"
          className="pl-10 h-12 rounded-2xl border-slate-200 focus-visible:ring-vitality-emerald"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-vitality-emerald animate-spin" />
          </div>
        )}
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
        {results.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelect(food)}
            className="w-full p-4 bg-white border border-slate-100 rounded-2xl hover:border-vitality-emerald/30 hover:bg-vitality-lime/5 transition-all text-left group"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${food.is_off ? 'bg-blue-50 text-blue-500' : 'bg-vitality-lime/20 text-vitality-emerald'}`}>
                  {food.is_off ? <Globe className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-vitality-slate group-hover:text-vitality-emerald transition-colors">
                    {food.name_en} {food.name_ar && <span className="text-xs text-slate-400 font-normal">({food.name_ar})</span>}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {food.brand || (food.is_off ? 'Global Database' : 'Arabic Database')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-vitality-slate">{Math.round(food.calories_per_100g)} <span className="text-[10px] font-normal text-slate-400">kcal</span></p>
                <p className="text-[8px] text-slate-400 font-bold uppercase">per 100g</p>
              </div>
            </div>
          </button>
        ))}

        {hasSearched && results.length === 0 && !isLoading && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-vitality-slate">No results found</p>
              <p className="text-xs text-slate-400">Try searching with a different name or add it manually.</p>
            </div>
            {onManualAdd && (
              <Button 
                variant="outline" 
                onClick={onManualAdd}
                className="rounded-xl text-xs font-bold"
              >
                Add Custom Food
              </Button>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="py-12 text-center text-slate-400">
             <p className="text-xs font-medium italic">Start typing to search 3M+ global foods and local Arabic favorites.</p>
          </div>
        )}
      </div>
    </div>
  );
}
