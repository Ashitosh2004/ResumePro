import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, ArrowRight, AlertCircle, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScoreMeter } from '@/components/ScoreMeter';
import { ScoreBreakdownChart } from '@/components/ScoreBreakdownChart';
import { ScoreExplanation } from '@/components/ScoreExplanation';
import { CredibilityCheckCard } from '@/components/CredibilityCheck';
import { FeedbackCard } from '@/components/FeedbackCard';
import { KeywordChips } from '@/components/KeywordChips';
import { ResumeComparison } from '@/components/ResumeComparison';
import { AnalyzingLoader } from '@/components/AnalyzingLoader';
import { IndustrySelector } from '@/components/IndustrySelector';
import { JobDescriptionMatcher } from '@/components/JobDescriptionMatcher';
import { CoverLetterGenerator } from '@/components/CoverLetterGenerator';
import { StepIndicator } from '@/components/StepIndicator';
import { FileUpload } from '@/components/FileUpload';
import { analyzeResume, type AnalysisResult } from '@/lib/resumeAnalyzer';

const STEPS = [
  { number: 1, title: 'Input', description: 'Paste resume' },
  { number: 2, title: 'Analysis', description: 'ATS scoring' },
  { number: 3, title: 'Review', description: 'Detailed feedback' },
  { number: 4, title: 'Improve', description: 'Optimized resume' },
];

const Index = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [industry, setIndustry] = useState('general');
  const [jobDescription, setJobDescription] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const resultsRef = useRef<HTMLDivElement>(null);

  const characterCount = resumeText.length;
  const minCharacters = 100;
  const isValidLength = characterCount >= minCharacters;

  const currentStep = result ? 4 : isAnalyzing ? 2 : resumeText.length > 50 ? 1 : 1;

  const handleAnalyze = async () => {
    if (!isValidLength) {
      setError(`Please enter at least ${minCharacters} characters for a meaningful analysis.`);
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeResume(resumeText, industry, jobDescription);
      setResult(analysisResult);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setResult(null);
    setError('');
    setJobDescription('');
    setShowAdvanced(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ResumePro Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-semibold text-foreground">
              Resume<span className="text-primary">Pro</span>
            </span>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 pt-8 pb-6 md:pt-12 md:pb-8">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Professional Resume Analyzer • Like Hiring Companies Use
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
            ATS Resume Analyzer
            <br />
            <span className="text-primary">& Optimizer</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Get recruiter-level analysis, credibility check, and instant improvements for your resume.
          </p>
        </motion.div>
      </section>

      {/* Step Indicator */}
      <section className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </motion.div>
      </section>

      {/* STEP 1: Input Section */}
      <section className="container max-w-4xl mx-auto px-4 pb-8">
        <motion.div
          className="glass-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              <h2 className="font-display font-semibold text-foreground">Input Your Resume</h2>
            </div>
            <span className={`text-sm ${isValidLength ? 'text-muted-foreground' : 'text-score-medium'}`}>
              {characterCount.toLocaleString()} chars
              {!isValidLength && ` (min ${minCharacters})`}
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setInputMode('paste')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${inputMode === 'paste'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              📝 Paste Text
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${inputMode === 'upload'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              📄 Upload File
            </button>
          </div>

          {/* Paste Mode */}
          {inputMode === 'paste' && (
            <textarea
              id="resume-input"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Copy and paste your entire resume here...

Example:
John Doe
Software Engineer | john@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 3+ years building web applications...

EXPERIENCE
Software Engineer | Tech Company | 2021 - Present
• Developed user-facing features using React and Node.js
• Collaborated with design team to improve UX..."
              className="w-full h-48 md:h-56 p-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed"
              disabled={isAnalyzing}
            />
          )}

          {/* Upload Mode */}
          {inputMode === 'upload' && (
            <FileUpload
              onTextExtracted={(text) => setResumeText(text)}
              onError={(err) => setError(err)}
            />
          )}

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Options (Industry & Job Description)
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Target Industry
                    </label>
                    <IndustrySelector selected={industry} onSelect={setIndustry} />
                  </div>
                  <JobDescriptionMatcher
                    jobDescription={jobDescription}
                    onJobDescriptionChange={setJobDescription}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 flex items-center gap-2 text-score-low text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="hero"
              size="xl"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="gap-2"
            >
              {isAnalyzing ? (
                'Analyzing...'
              ) : (
                <>
                  Analyze Resume
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {result && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleReset}
              >
                Start Over
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Loading State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.section
            className="container max-w-4xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalyzingLoader />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            ref={resultsRef}
            className="container max-w-6xl mx-auto px-4 pb-20 space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* STEP 2: ATS Score Section */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                <h2 className="font-display text-xl font-semibold text-foreground">ATS Score & Breakdown</h2>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Score Meter */}
                <motion.div
                  className="glass-card p-6 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-display font-medium text-foreground mb-4 text-sm">
                    Your ATS Score
                  </h3>
                  <ScoreMeter score={result.score} />
                </motion.div>

                {/* Score Breakdown */}
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="font-display font-medium text-foreground mb-4 flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Score Breakdown
                  </h3>
                  <ScoreBreakdownChart breakdown={result.scoreBreakdown} />
                </motion.div>


              </div>

              {/* Score Explanation */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ScoreExplanation explanation={result.scoreExplanation} score={result.score} />
              </motion.div>
            </section>

            {/* STEP 3: Detailed Analysis Section */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                <h2 className="font-display text-xl font-semibold text-foreground">Detailed Analysis</h2>
              </motion.div>

              {/* Credibility Check */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <CredibilityCheckCard credibility={result.credibilityCheck} />
              </motion.div>





              {/* Missing Keywords */}
              <motion.div
                className="glass-card p-6 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
              >
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Keyword & Skill Gap Analysis
                </h3>
                <KeywordChips keywords={result.missingKeywords} />
              </motion.div>

              {/* Feedback Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Professional Feedback
                </h3>
                <div className="space-y-3">
                  {result.feedback.map((item, index) => (
                    <FeedbackCard key={index} feedback={item} index={index} />
                  ))}
                </div>
              </motion.div>
            </section>

            {/* STEP 4: Improved Resume Section */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
              >
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
                <h2 className="font-display text-xl font-semibold text-foreground">Your Improved Resume</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <ResumeComparison
                  original={resumeText}
                  improved={result.improvedResume}
                />
              </motion.div>

              {/* Cover Letter Generator */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <CoverLetterGenerator
                  resumeText={result.improvedResume}
                  jobDescription={jobDescription}
                />
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="border-t border-border/50 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Professional ATS Resume Analyzer • Trusted by Job Seekers Worldwide
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
