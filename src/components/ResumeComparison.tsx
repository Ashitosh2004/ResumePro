import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Check, Copy, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';

interface ResumeComparisonProps {
  original: string;
  improved: string;
}

export function ResumeComparison({ original, improved }: ResumeComparisonProps) {
  const [activeTab, setActiveTab] = useState<'original' | 'improved'>('improved');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = activeTab === 'improved' ? improved : original;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([improved], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'improved-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess('txt');
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(improved, 180);
    doc.setFont('helvetica');
    doc.setFontSize(11);
    
    let yPosition = 20;
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 15, yPosition);
      yPosition += 6;
    });
    
    doc.save('improved-resume.pdf');
    setDownloadSuccess('pdf');
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  const linkedInTips = [
    "Use your improved summary as your LinkedIn 'About' section",
    "Add all keywords from your skills section to LinkedIn",
    "Update your headline to match your target role",
    "Align job descriptions with your improved bullet points",
  ];

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tab Header */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('original')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative
            ${activeTab === 'original' 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          Original Resume
          {activeTab === 'original' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="tab-indicator"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('improved')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative
            ${activeTab === 'improved' 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          ✨ Improved Version
          {activeTab === 'improved' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="tab-indicator"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'improved' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px] max-h-[500px] overflow-y-auto"
        >
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
            {activeTab === 'original' ? original : improved}
          </pre>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div 
        className="border-t border-border p-4 bg-muted/30 flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-score-high" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
        
        {activeTab === 'improved' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTxt}
              className="gap-2"
            >
              {downloadSuccess === 'txt' ? (
                <>
                  <Check className="w-4 h-4 text-score-high" />
                  Downloaded!
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Download .txt
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPdf}
              className="gap-2"
            >
              {downloadSuccess === 'pdf' ? (
                <>
                  <Check className="w-4 h-4" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download .pdf
                </>
              )}
            </Button>
          </>
        )}
      </motion.div>

      {/* LinkedIn Tips */}
      {activeTab === 'improved' && (
        <motion.div 
          className="border-t border-border p-4 bg-primary/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-medium text-foreground text-sm flex items-center gap-2 mb-3">
            <Linkedin className="w-4 h-4 text-primary" />
            LinkedIn Optimization Tips
          </h4>
          <ul className="grid sm:grid-cols-2 gap-2">
            {linkedInTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
