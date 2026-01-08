import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, AlertCircle, XCircle, MinusCircle } from 'lucide-react';
import type { SectionScore } from '@/lib/resumeAnalyzer';

interface SectionScoresProps {
  sections: SectionScore[];
}

export function SectionScores({ sections }: SectionScoresProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getStatusIcon = (status: SectionScore['status']) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-score-high" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'needs-work': return <AlertCircle className="w-5 h-5 text-score-medium" />;
      case 'missing': return <XCircle className="w-5 h-5 text-score-low" />;
    }
  };

  const getStatusColor = (status: SectionScore['status']) => {
    switch (status) {
      case 'excellent': return 'bg-score-high';
      case 'good': return 'bg-primary';
      case 'needs-work': return 'bg-score-medium';
      case 'missing': return 'bg-score-low';
    }
  };

  const getStatusLabel = (status: SectionScore['status']) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'needs-work': return 'Needs Work';
      case 'missing': return 'Missing';
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display font-semibold text-foreground mb-4">
        Section-by-Section Analysis
      </h3>
      
      <div className="space-y-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.section}
            className="rounded-xl border border-border overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedSection(
                expandedSection === section.section ? null : section.section
              )}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(section.status)}
                <span className="font-medium text-foreground">{section.section}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getStatusColor(section.status)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${section.score}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{section.score}%</span>
                </div>
                
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  section.status === 'excellent' ? 'bg-score-high/20 text-score-high' :
                  section.status === 'good' ? 'bg-primary/20 text-primary' :
                  section.status === 'needs-work' ? 'bg-score-medium/20 text-score-medium' :
                  'bg-score-low/20 text-score-low'
                }`}>
                  {getStatusLabel(section.status)}
                </span>
                
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedSection === section.section ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            
            <AnimatePresence>
              {expandedSection === section.section && section.tips.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-muted/30"
                >
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Tips to Improve:</h4>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MinusCircle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
