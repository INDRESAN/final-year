import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, FlipHorizontal, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onUpload: (imageSrc: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onUpload }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isReady, setIsReady] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) onCapture(imageSrc);
  }, [onCapture]);

  const handleFlip = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-background aspect-[4/3]">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode, width: 640, height: 480 }}
          onUserMedia={() => setIsReady(true)}
          onUserMediaError={() => setIsReady(false)}
          className="w-full h-full object-cover"
          mirrored={facingMode === 'user'}
        />
        {/* Face detection overlay */}
        <AnimatePresence>
          {isReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-48 h-56 border-2 border-primary/60 rounded-2xl"
                style={{
                  boxShadow: '0 0 20px hsl(217 91% 60% / 0.2), inset 0 0 20px hsl(217 91% 60% / 0.05)',
                }}
              >
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
              </motion.div>
              <p className="absolute bottom-4 text-xs text-muted-foreground bg-background/70 px-3 py-1 rounded-full">
                Position face within frame
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={capture} disabled={!isReady} className="flex-1 gradient-primary border-0">
          <Camera className="mr-2 h-4 w-4" /> Capture
        </Button>
        <Button variant="outline" size="icon" onClick={handleFlip}>
          <FlipHorizontal className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default WebcamCapture;
