import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, X, Zap, ZapOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onDetected: (product: any) => void;
}

export function BarcodeScanner({ open, onClose, onDetected }: BarcodeScannerProps) {
  const [loading, setLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => stopScanning();
  }, [open]);

  const startScanning = async () => {
    setLoading(true);
    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        toast.error('No camera found');
        onClose();
        return;
      }

      // Priority for back camera
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      const selectedDeviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;
      
      const controls = await reader.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result) => {
        if (result) {
          handleDetected(result.getText());
        }
      });
      controlsRef.current = controls;
      setLoading(false);
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Could not start camera');
      onClose();
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleFlash = async () => {
    if (!videoRef.current?.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    
    try {
      // @ts-ignore - torch is not in standard types yet
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }]
      });
      setFlashOn(!flashOn);
    } catch (err) {
      console.error('Flash not supported:', err);
      toast.error('Flash not supported on this device');
    }
  };

  const handleDetected = async (barcode: string) => {
    stopScanning();
    setLoading(true);
    try {
      // Tier 1: Local Custom Foods (UAE specific)
      const { data: localFood } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle();

      if (localFood) {
        onDetected({
          name: localFood.name_en,
          calories: Math.round(localFood.calories_per_100g),
          protein_g: Math.round(localFood.protein_per_100g),
          carbs_g: Math.round(localFood.carbs_per_100g),
          fat_g: Math.round(localFood.fat_per_100g),
          source: 'local'
        });
        return;
      }

      // Tier 2: Open Food Facts UAE
      const uaeResponse = await fetch(`https://ae.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const uaeData = await uaeResponse.json();

      if (uaeData.status === 1) {
        const product = uaeData.product;
        onDetected({
          name: product.product_name || 'Unknown Product',
          calories: Math.round((product.nutriments['energy-kcal_100g'] || 0)),
          protein_g: Math.round(product.nutriments.proteins_100g || 0),
          carbs_g: Math.round(product.nutriments.carbohydrates_100g || 0),
          fat_g: Math.round(product.nutriments.fat_100g || 0),
          source: 'off-uae'
        });
        return;
      }

      // Tier 3: Open Food Facts Global
      const globalResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const globalData = await globalResponse.json();
      
      if (globalData.status === 1) {
        const product = globalData.product;
        onDetected({
          name: product.product_name || 'Unknown Product',
          calories: Math.round((product.nutriments['energy-kcal_100g'] || 0)),
          protein_g: Math.round(product.nutriments.proteins_100g || 0),
          carbs_g: Math.round(product.nutriments.carbohydrates_100g || 0),
          fat_g: Math.round(product.nutriments.fat_100g || 0),
          source: 'off-global'
        });
      } else {
        toast.error('Product not found in our global database.');
        onClose();
      }
    } catch (err) {
      toast.error('Error fetching product data');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black rounded-[2.5rem] border-none shadow-2xl">
        <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-vitality-emerald animate-spin mb-4" />
              <p className="text-white font-black tracking-widest uppercase text-xs">Analyzing...</p>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 relative">
              {/* Corner Markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-vitality-emerald rounded-tl-xl animate-pulse" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-vitality-emerald rounded-tr-xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-vitality-emerald rounded-bl-xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-vitality-emerald rounded-bl-xl animate-pulse" />
              
              {/* Scanning Line */}
              <div className="absolute left-0 right-0 h-1 bg-vitality-emerald/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-line top-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex gap-3 z-30">
            <button 
              onClick={toggleFlash}
              className={`p-3 rounded-full text-white backdrop-blur-md transition-all ${flashOn ? 'bg-vitality-amber shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {flashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-10 bg-white rounded-t-[3rem] -mt-10 relative z-10 text-center">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
          <h3 className="text-2xl font-black text-vitality-slate mb-2">Scan Barcode</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Position the barcode within the frame.<br />
            Works best with <span className="text-vitality-emerald font-bold">UAE supermarket brands</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
