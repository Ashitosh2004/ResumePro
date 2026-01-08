import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ScoreExplanationProps {
  explanation: string;
  score: number;
}

export function ScoreExplanation({ explanation, score }: ScoreExplanationProps) {
  const getScoreLevel = () => {
    if (score >= 85) return { label: 'Excellent', color: 'text-score-high', bg: 'bg-score-high/10' };
    if (score >= 70) return { label: 'Good', color: 'text-primary', bg: 'bg-primary/10' };
    if (score >= 50) return { label: 'Needs Work', color: 'text-score-medium', bg: 'bg-score-medium/10' };
    return { label: 'Critical', color: 'text-score-low', bg: 'bg-score-low/10' };
  };

  const level = getScoreLevel();

  return (
    <motion.div
      className={`p-4 rounded-xl ${level.bg} border border-border/50`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <Info className={`w-5 h-5 ${level.color} shrink-0 mt-0.5`} />
        <div>
          <span className={`text-xs font-medium ${level.color} uppercase tracking-wide`}>
            ATS Assessment: {level.label}
          </span>
          <p className="text-sm text-foreground mt-1 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
