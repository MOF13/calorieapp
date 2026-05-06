import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onDetected: (product: any) => void;
}

export function BarcodeScanner({ open, onClose, onDetected }: BarcodeScannerProps) {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

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

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      await reader.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result) => {
        if (result) {
          handleDetected(result.getText());
        }
      });
      setLoading(false);
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Could not start camera');
      onClose();
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      // The zxing browser reader doesn't have a simple stop(), 
      // but we can try to reset it or just let the effect cleanup handle the video stream.
      // Re-initializing the reader for every open is safer.
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleDetected = async (barcode: string) => {
    stopScanning();
    setLoading(true);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1) {
        const product = data.product;
        onDetected({
          name: product.product_name || 'Unknown Product',
          calories: Math.round((product.nutriments['energy-kcal_100g'] || 0)),
          protein_g: Math.round(product.nutriments.proteins_100g || 0),
          carbs_g: Math.round(product.nutriments.carbohydrates_100g || 0),
          fat_g: Math.round(product.nutriments.fat_100g || 0),
        });
      } else {
        toast.error('Product not found');
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black rounded-[2.5rem] border-none">
        <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-vitality-emerald animate-spin mb-4" />
              <p className="text-white font-bold">Processing...</p>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-vitality-emerald/50 rounded-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-vitality-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-line"></div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-30"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 bg-white rounded-t-[2.5rem] -mt-8 relative z-10">
          <h3 className="text-xl font-black text-vitality-slate mb-2">Scan Barcode</h3>
          <p className="text-sm text-slate-500 font-medium">Position the barcode within the frame to automatically log nutrition details.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
