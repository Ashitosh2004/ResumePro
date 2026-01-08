import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreMeterProps {
  score: number;
  size?: number;
}

export function ScoreMeter({ score, size = 200 }: ScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score <= 40) return 'text-score-low';
    if (score <= 70) return 'text-score-medium';
    return 'text-score-high';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 40) return 'Needs Work';
    if (score <= 70) return 'Getting There';
    return 'Looking Good!';
  };

  const getStrokeColor = (score: number) => {
    if (score <= 40) return 'stroke-score-low';
    if (score <= 70) return 'stroke-score-medium';
    return 'stroke-score-high';
  };

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        
        {/* Score circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={getStrokeColor(score)}
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Glow effect */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className={`${getStrokeColor(score)} opacity-20 blur-sm`}
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={`text-5xl font-display font-bold ${getScoreColor(score)}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {animatedScore}
        </motion.span>
        <motion.span 
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ATS Score
        </motion.span>
        <motion.span 
          className={`text-xs font-medium mt-2 ${getScoreColor(score)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {getScoreLabel(score)}
        </motion.span>
      </div>
    </motion.div>
  );
}
