import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobDescriptionMatcherProps {
  jobDescription: string;
  onJobDescriptionChange: (jd: string) => void;
}

export function JobDescriptionMatcher({ jobDescription, onJobDescriptionChange }: JobDescriptionMatcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              Job Description Matching
            </h3>
            <p className="text-sm text-muted-foreground">
              {jobDescription ? 'Job description added' : 'Optional: Paste a job description for tailored analysis'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {jobDescription && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Active
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 text-sm text-muted-foreground">
                <FileSearch className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p>
                  Paste the job description you're applying for. We'll analyze keyword matches, 
                  identify gaps, and tailor your improvement suggestions specifically for this role.
                </p>
              </div>
              
              <textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud technologies. The ideal candidate will have strong communication skills and experience leading cross-functional teams..."
                className="w-full h-40 p-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/60 text-sm"
              />
              
              <div className="flex justify-end gap-2">
                {jobDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onJobDescriptionChange('')}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
