import { motion } from 'framer-motion';
import type { KeywordGap } from '@/lib/resumeAnalyzer';

interface KeywordChipsProps {
  keywords: KeywordGap[];
}

export function KeywordChips({ keywords }: KeywordChipsProps) {
  const groupedKeywords = {
    skills: keywords.filter(k => k.category === 'skills'),
    action: keywords.filter(k => k.category === 'action'),
    metrics: keywords.filter(k => k.category === 'metrics'),
  };

  const categoryLabels = {
    skills: { label: 'Missing Skills', icon: '🛠️' },
    action: { label: 'Action Verbs to Add', icon: '⚡' },
    metrics: { label: 'Metrics & Impact', icon: '📈' },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {(Object.keys(groupedKeywords) as Array<keyof typeof groupedKeywords>).map((category) => {
        const categoryKeywords = groupedKeywords[category];
        if (categoryKeywords.length === 0) return null;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{categoryLabels[category].icon}</span>
              <h4 className="font-display font-medium text-foreground">
                {categoryLabels[category].label}
              </h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {categoryKeywords.length} missing
              </span>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {categoryKeywords.map((keyword, index) => (
                <motion.span
                  key={`${keyword.keyword}-${index}`}
                  variants={item}
                  className={`keyword-chip 
                    ${category === 'skills' ? 'keyword-chip-skills' : ''}
                    ${category === 'action' ? 'keyword-chip-action' : ''}
                    ${category === 'metrics' ? 'keyword-chip-metrics' : ''}
                    ${keyword.importance === 'high' ? 'ring-2 ring-primary/30' : ''}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {keyword.keyword}
                  {keyword.importance === 'high' && (
                    <span className="ml-1 text-xs opacity-60">★</span>
                  )}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
