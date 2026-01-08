import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Plus } from 'lucide-react';
import type { PowerWordAnalysis } from '@/lib/resumeAnalyzer';

interface PowerWordsAnalysisProps {
  powerWords: PowerWordAnalysis;
}

export function PowerWordsAnalysis({ powerWords }: PowerWordsAnalysisProps) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Power Words Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{powerWords.score}%</span>
          <span className="text-xs text-muted-foreground">strength</span>
        </div>
      </div>
      
      {/* Found Words */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-score-high" />
          Found ({powerWords.found.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {powerWords.found.slice(0, 12).map((word, index) => (
            <motion.span
              key={word}
              className="px-2.5 py-1 text-xs rounded-full bg-score-high/10 text-score-high font-medium capitalize"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              {word}
            </motion.span>
          ))}
          {powerWords.found.length > 12 && (
            <span className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              +{powerWords.found.length - 12} more
            </span>
          )}
        </div>
      </div>
      
      {/* Missing Words */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-score-medium" />
          Add These ({powerWords.missing.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {powerWords.missing.slice(0, 10).map((word, index) => (
            <motion.span
              key={word}
              className="px-2.5 py-1 text-xs rounded-full bg-score-medium/10 text-score-medium font-medium capitalize cursor-pointer hover:bg-score-medium/20 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              title={`Consider adding "${word}" to your resume`}
            >
              {word}
            </motion.span>
          ))}
          {powerWords.missing.length > 10 && (
            <span className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              +{powerWords.missing.length - 10} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
