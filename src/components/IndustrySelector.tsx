import { motion } from 'framer-motion';
import { Briefcase, Code, DollarSign, TrendingUp, HeartPulse, Users } from 'lucide-react';

interface IndustrySelectorProps {
  selected: string;
  onSelect: (industry: string) => void;
}

const industries = [
  { id: 'general', label: 'General', icon: Briefcase },
  { id: 'technology', label: 'Technology', icon: Code },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  { id: 'healthcare', label: 'Healthcare', icon: HeartPulse },
  { id: 'sales', label: 'Sales', icon: Users },
];

export function IndustrySelector({ selected, onSelect }: IndustrySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {industries.map((industry, index) => {
        const Icon = industry.icon;
        const isSelected = selected === industry.id;
        
        return (
          <motion.button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            {industry.label}
          </motion.button>
        );
      })}
    </div>
  );
}
