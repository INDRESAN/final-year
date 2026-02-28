import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EmbeddingVisualizerProps {
  onGenerate: () => void;
  onWatermark: () => void;
  stage: 'idle' | 'generating' | 'generated' | 'watermarking' | 'complete';
  progress: number;
}

const EmbeddingVisualizer: React.FC<EmbeddingVisualizerProps> = ({
  onGenerate,
  onWatermark,
  stage,
  progress,
}) => {
  // Simulated embedding vector values
  const embeddingValues = Array.from({ length: 64 }, () => (Math.random() * 2 - 1).toFixed(3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Embedding vector visualization */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Cpu className="h-4 w-4 text-primary" />
          Embedding Vector (128-d)
        </div>

        {(stage === 'idle' || stage === 'generating') && (
          <div className="grid grid-cols-16 gap-0.5">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 rounded-sm bg-muted"
                animate={
                  stage === 'generating'
                    ? { backgroundColor: ['hsl(217 33% 17%)', 'hsl(217 91% 60%)', 'hsl(217 33% 17%)'] }
                    : {}
                }
                transition={{ duration: 0.6, delay: i * 0.02, repeat: stage === 'generating' ? Infinity : 0 }}
              />
            ))}
          </div>
        )}

        {(stage === 'generated' || stage === 'watermarking' || stage === 'complete') && (
          <div className="grid grid-cols-16 gap-0.5">
            {embeddingValues.map((val, i) => {
              const normalized = (parseFloat(val) + 1) / 2;
              const isWatermarked = stage === 'complete' && (i % 8 === 0 || i % 8 === 7);
              return (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="h-4 rounded-sm"
                  style={{
                    backgroundColor: isWatermarked
                      ? `hsl(168 76% ${30 + normalized * 40}%)`
                      : `hsl(217 91% ${20 + normalized * 50}%)`,
                    opacity: 0.5 + normalized * 0.5,
                  }}
                  title={`dim[${i}]: ${val}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {(stage === 'generating' || stage === 'watermarking') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              {stage === 'generating' ? 'Generating embedding...' : 'Applying watermark...'}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {stage === 'idle' && (
          <Button onClick={onGenerate} className="w-full gradient-primary border-0">
            <Cpu className="mr-2 h-4 w-4" /> Generate Embedding
          </Button>
        )}
        {stage === 'generated' && (
          <Button onClick={onWatermark} className="w-full glow-accent bg-accent text-accent-foreground hover:bg-accent/90 border-0">
            <ShieldCheck className="mr-2 h-4 w-4" /> Apply Watermark & Save
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmbeddingVisualizer;
