import { motion } from 'framer-motion';
import type { FeedbackItem } from '@/lib/resumeAnalyzer';

interface FeedbackCardProps {
  feedback: FeedbackItem;
  index: number;
}

export function FeedbackCard({ feedback, index }: FeedbackCardProps) {
  const getCategoryStyles = (category: FeedbackItem['category']) => {
    switch (category) {
      case 'strength':
        return 'border-l-score-high bg-score-high/5';
      case 'weakness':
        return 'border-l-score-low bg-score-low/5';
      case 'suggestion':
        return 'border-l-primary bg-primary/5';
    }
  };

  const getCategoryLabel = (category: FeedbackItem['category']) => {
    switch (category) {
      case 'strength':
        return 'Strength';
      case 'weakness':
        return 'Needs Improvement';
      case 'suggestion':
        return 'Recommendation';
    }
  };

  return (
    <motion.div
      className={`rounded-xl p-4 border-l-4 ${getCategoryStyles(feedback.category)}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" role="img" aria-label={feedback.category}>
          {feedback.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-display font-semibold text-foreground text-sm">
              {feedback.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${feedback.category === 'strength' ? 'bg-score-high/20 text-score-high' : ''}
              ${feedback.category === 'weakness' ? 'bg-score-low/20 text-score-low' : ''}
              ${feedback.category === 'suggestion' ? 'bg-primary/20 text-primary' : ''}
            `}>
              {getCategoryLabel(feedback.category)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feedback.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
