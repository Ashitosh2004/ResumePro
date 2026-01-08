import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, Target } from 'lucide-react';

interface ImprovementTrackerProps {
  originalScore: number;
  improvementPercentage: number;
  industryMatch: number;
}

export function ImprovementTracker({ originalScore, improvementPercentage, industryMatch }: ImprovementTrackerProps) {
  const projectedScore = Math.min(98, originalScore + (originalScore * improvementPercentage / 100));
  
  return (
    <motion.div
      className="glass-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display font-medium text-foreground mb-4 flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-primary" />
        Improvement Potential
      </h3>
      
      <div className="space-y-3">
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-xs text-muted-foreground">Current</span>
          <span className="text-lg font-bold text-foreground">{originalScore}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-score-high/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowUp className="w-3 h-3 text-score-high" />
            Potential
          </span>
          <span className="text-lg font-bold text-score-high">+{improvementPercentage}%</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-primary/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Target className="w-3 h-3 text-primary" />
            Industry
          </span>
          <span className="text-lg font-bold text-primary">{industryMatch}%</span>
        </motion.div>
      </div>
      
      <motion.p 
        className="mt-3 text-xs text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Target: <span className="font-medium text-primary">{Math.round(projectedScore)}+</span> score
      </motion.p>
    </motion.div>
  );
}
