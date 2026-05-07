import { useRef, useState } from 'react';
import { Share2, Download, Utensils, Zap, Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface SocialShareCardProps {
  open: boolean;
  onClose: () => void;
  data: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal: number;
    streak: number;
    userName: string;
    date: string;
  };
}

export function SocialShareCard({ open, onClose, data }: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `CalorieTracker-Progress-${data.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image saved to your device!');
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareContent = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'progress.png', { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'My CalorieTracker Progress',
            text: `I hit my goals today on CalorieTracker! 🔥 Current streak: ${data.streak} days.`,
          });
        } else {
          downloadImage();
        }
      });
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Sharing not supported on this browser.');
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = Math.min(100, Math.round((data.calories / data.goal) * 100));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="flex flex-col items-center gap-6 p-4">
          {/* The Shareable Card */}
          <div 
            ref={cardRef}
            className="w-[320px] aspect-[9/16] bg-gradient-to-br from-vitality-slate to-[#0f172a] rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl"
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-vitality-emerald/20 blur-[60px] rounded-full -mr-20 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-vitality-lime/10 blur-[60px] rounded-full -ml-20 -mb-10"></div>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 bg-vitality-emerald rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-vitality-emerald uppercase tracking-[0.2em]">CalorieTracker</p>
                <p className="text-xs font-bold text-white/60">{data.date}</p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8 relative z-10">
              <h2 className="text-3xl font-black text-white leading-tight">
                DAILY<br />
                <span className="text-vitality-emerald uppercase">WIN.</span>
              </h2>
            </div>

            {/* Main Stats */}
            <div className="flex-grow flex flex-col justify-center relative z-10">
              <div className="mb-10 text-center">
                <div className="relative inline-block">
                   {/* Progress Ring Background */}
                   <svg className="w-48 h-48 -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="16"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="transparent"
                        stroke="url(#emeraldGradient)"
                        strokeWidth="16"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#84cc16" />
                        </linearGradient>
                      </defs>
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                      <p className="text-4xl font-black text-white tabular-nums">{data.calories}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Kcal Eaten</p>
                   </div>
                </div>
              </div>

              {/* Macros Row */}
              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <p className="text-lg font-black text-white">{data.protein}g</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase">Protein</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <p className="text-lg font-black text-white">{data.carbs}g</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase">Carbs</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <p className="text-lg font-black text-white">{data.fat}g</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase">Fat</p>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-vitality-emerald/20 border border-vitality-emerald/30 rounded-3xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-vitality-emerald rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-vitality-emerald uppercase tracking-widest">Streak</p>
                    <p className="text-lg font-black text-white">{data.streak} Days</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                   {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full border-2 border-vitality-slate flex items-center justify-center ${i < data.streak % 7 ? 'bg-vitality-emerald text-white' : 'bg-white/10 text-white/20'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-white/10 text-center relative z-10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Health Optimized by AI</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full">
            <Button 
              onClick={shareContent} 
              disabled={isGenerating}
              className="flex-1 h-14 rounded-2xl bg-white text-vitality-slate hover:bg-slate-50 font-bold"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button 
              onClick={downloadImage} 
              disabled={isGenerating}
              className="flex-1 h-14 rounded-2xl bg-vitality-emerald text-white hover:bg-vitality-emerald/90 font-bold"
            >
              <Download className="w-5 h-5 mr-2" />
              Save
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
