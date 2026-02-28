import React from 'react';
import { motion } from 'framer-motion';

interface SimilarityGaugeProps {
  score: number; // 0-1
  size?: number;
}

const SimilarityGauge = React.forwardRef<HTMLDivElement, SimilarityGaugeProps>(({ score, size = 160 }, ref) => {
  const percentage = Math.round(score * 100);
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // half circle
  const filled = circumference * score;
  const center = size / 2;

  const getColor = () => {
    if (percentage >= 80) return 'hsl(142 71% 45%)';
    if (percentage >= 60) return 'hsl(38 92% 50%)';
    return 'hsl(0 84% 60%)';
  };

  const getLabel = () => {
    if (percentage >= 80) return 'High Match';
    if (percentage >= 60) return 'Partial Match';
    return 'Low Match';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke="hsl(217 33% 17%)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${getColor()})` }}
        />
        {/* Score text */}
        <motion.text
          x={center}
          y={center - 8}
          textAnchor="middle"
          className="fill-foreground text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage}%
        </motion.text>
        <text x={center} y={center + 14} textAnchor="middle" className="fill-muted-foreground text-xs">
          {getLabel()}
        </text>
      </svg>
    </div>
  );
});
SimilarityGauge.displayName = 'SimilarityGauge';

export default SimilarityGauge;
