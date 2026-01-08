import { motion } from 'framer-motion';
import type { ScoreBreakdown } from '@/lib/resumeAnalyzer';

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown;
}

const categories = [
  { key: 'keywords', label: 'Keywords & Skills', max: 25, icon: '🔑' },
  { key: 'structure', label: 'Structure & Readability', max: 20, icon: '📋' },
  { key: 'quantification', label: 'Metrics & Impact', max: 20, icon: '📊' },
  { key: 'readability', label: 'Projects & Experience', max: 20, icon: '💼' },
  { key: 'actionVerbs', label: 'Action Verbs', max: 15, icon: '⚡' },
] as const;

export function ScoreBreakdownChart({ breakdown }: ScoreBreakdownChartProps) {
  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-score-high';
    if (percentage >= 60) return 'bg-score-medium';
    return 'bg-score-low';
  };

  return (
    <div className="space-y-4">
      {categories.map(({ key, label, max, icon }, index) => {
        const value = breakdown[key];
        const percentage = (value / max) * 100;
        
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-foreground font-medium">
                <span>{icon}</span>
                {label}
              </span>
              <span className="text-muted-foreground">
                {value}/{max} <span className="text-xs">({Math.round(percentage)}%)</span>
              </span>
            </div>
            
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getBarColor(percentage)}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}
      
      <motion.div 
        className="pt-4 border-t border-border mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Score</span>
          <span className="font-display font-bold text-lg text-primary">
            {breakdown.keywords + breakdown.actionVerbs + breakdown.structure + breakdown.quantification + breakdown.readability}/100
          </span>
        </div>
      </motion.div>
    </div>
  );
}
