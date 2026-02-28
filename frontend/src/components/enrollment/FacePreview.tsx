import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FacePreviewProps {
  imageSrc: string;
  onRetake: () => void;
  onConfirm: () => void;
}

const FacePreview: React.FC<FacePreviewProps> = ({ imageSrc, onRetake, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-background aspect-[4/3]">
        <img src={imageSrc} alt="Captured face" className="w-full h-full object-cover" />
        {/* Simulated face bounding box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-40 h-48 border-2 border-accent rounded-xl"
          style={{ boxShadow: '0 0 15px hsl(168 76% 42% / 0.3)' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"
        >
          <Check className="h-3 w-3" /> Face Detected
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onRetake} className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" /> Retake
        </Button>
        <Button onClick={onConfirm} className="flex-1 gradient-primary border-0">
          <Check className="mr-2 h-4 w-4" /> Confirm Face
        </Button>
      </div>
    </motion.div>
  );
};

export default FacePreview;
