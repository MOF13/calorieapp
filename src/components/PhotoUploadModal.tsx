import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { compressImage, fileToBase64 } from '@/utils/imageProcessing';

interface PhotoUploadModalProps {
  open: boolean;
  onClose: () => void;
  onPhotoSelected: (imageBase64: string, imageUrl: string) => void;
}

export function PhotoUploadModal({ open, onClose, onPhotoSelected }: PhotoUploadModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    try {
      setIsProcessing(true);

      const compressedFile = await compressImage(file, 2);
      const base64 = await fileToBase64(compressedFile);
      const imageUrl = URL.createObjectURL(compressedFile);

      onPhotoSelected(base64, imageUrl);
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meal Photo</DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          <div className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Processing image...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleCameraClick}
              className="w-full h-20 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-3 text-lg"
            >
              <Camera className="w-6 h-6" />
              Take Photo
            </Button>

            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="w-full h-20 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-3 text-lg"
            >
              <Upload className="w-6 h-6" />
              Upload Photo
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
          </div>
        )}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
        />

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
