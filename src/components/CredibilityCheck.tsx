import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CredibilityCheck } from '@/lib/resumeAnalyzer';

interface CredibilityCheckProps {
  credibility: CredibilityCheck;
}

export function CredibilityCheckCard({ credibility }: CredibilityCheckProps) {
  const getLevelConfig = (level: CredibilityCheck['level']) => {
    switch (level) {
      case 'high':
        return { 
          icon: CheckCircle, 
          color: 'text-score-high', 
          bg: 'bg-score-high/10',
          border: 'border-score-high/30',
          label: 'High Credibility'
        };
      case 'medium':
        return { 
          icon: AlertTriangle, 
          color: 'text-score-medium', 
          bg: 'bg-score-medium/10',
          border: 'border-score-medium/30',
          label: 'Medium Credibility'
        };
      case 'low':
        return { 
          icon: XCircle, 
          color: 'text-score-low', 
          bg: 'bg-score-low/10',
          border: 'border-score-low/30',
          label: 'Low Credibility'
        };
    }
  };

  const config = getLevelConfig(credibility.level);
  const IconComponent = config.icon;

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Recruiter Credibility Check
      </h3>

      {/* Level Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.border} border mb-4`}>
        <IconComponent className={`w-5 h-5 ${config.color}`} />
        <span className={`font-medium ${config.color}`}>{config.label}</span>
      </div>

      {/* Summary */}
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {credibility.summary}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-score-high/5 border border-score-high/20">
          <h4 className="text-sm font-medium text-score-high mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Strengths
          </h4>
          <ul className="space-y-1">
            {credibility.strengths.map((strength, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-score-high">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        <div className="p-4 rounded-xl bg-score-low/5 border border-score-low/20">
          <h4 className="text-sm font-medium text-score-low mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Red Flags
          </h4>
          <ul className="space-y-1">
            {credibility.redFlags.map((flag, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-score-low">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
