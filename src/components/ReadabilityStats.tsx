import { motion } from 'framer-motion';
import { FileText, MessageSquare, List, BookOpen, Mail, Phone, Linkedin, CheckCircle, XCircle } from 'lucide-react';
import type { ReadabilityStats as ReadabilityStatsType } from '@/lib/resumeAnalyzer';

interface ReadabilityStatsProps {
  stats: ReadabilityStatsType;
}

export function ReadabilityStats({ stats }: ReadabilityStatsProps) {
  const statItems = [
    { icon: FileText, label: 'Words', value: stats.wordCount.toLocaleString(), ideal: '400-600' },
    { icon: MessageSquare, label: 'Sentences', value: stats.sentenceCount, ideal: '30-50' },
    { icon: BookOpen, label: 'Avg. Words/Sentence', value: stats.avgWordsPerSentence, ideal: '15-20' },
    { icon: List, label: 'Bullet Points', value: stats.bulletPoints, ideal: '15-25' },
    { icon: FileText, label: 'Est. Pages', value: stats.pageEstimate, ideal: '1-2' },
  ];

  const contactItems = [
    { icon: Mail, label: 'Email', present: stats.hasEmail },
    { icon: Phone, label: 'Phone', present: stats.hasPhone },
    { icon: Linkedin, label: 'LinkedIn', present: stats.hasLinkedIn },
  ];

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Readability Stats
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="text-center p-3 rounded-xl bg-muted/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <item.icon className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xl font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-[10px] text-muted-foreground/70">Ideal: {item.ideal}</p>
          </motion.div>
        ))}
      </div>
      
      <h4 className="font-medium text-foreground mb-3 text-sm">Contact Information</h4>
      <div className="flex flex-wrap gap-3">
        {contactItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              item.present 
                ? 'bg-score-high/10 text-score-high' 
                : 'bg-score-low/10 text-score-low'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {item.present ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
