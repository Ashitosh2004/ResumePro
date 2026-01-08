// Resume Analysis Engine - Professional ATS Resume Analyzer

export interface AnalysisResult {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  scoreExplanation: string;
  credibilityCheck: CredibilityCheck;
  feedback: FeedbackItem[];
  missingKeywords: KeywordGap[];
  sectionSuggestions: SectionSuggestion[];
  improvedResume: string;
  readabilityStats: ReadabilityStats;
  powerWords: PowerWordAnalysis;
  sectionScores: SectionScore[];
  industryMatch: number;
  improvementPercentage: number;
}

export interface ScoreBreakdown {
  keywords: number;
  actionVerbs: number;
  structure: number;
  quantification: number;
  readability: number;
}

export interface CredibilityCheck {
  level: 'low' | 'medium' | 'high';
  strengths: string[];
  redFlags: string[];
  summary: string;
}

export interface FeedbackItem {
  category: 'strength' | 'weakness' | 'suggestion';
  title: string;
  message: string;
  icon: string;
  priority: number;
}

export interface KeywordGap {
  keyword: string;
  category: 'skills' | 'action' | 'metrics' | 'tools';
  importance: 'high' | 'medium' | 'low';
}

export interface SectionSuggestion {
  section: string;
  issue: string;
  suggestion: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface ReadabilityStats {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  bulletPoints: number;
  pageEstimate: number;
  hasContactInfo: boolean;
  hasLinkedIn: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
}

export interface PowerWordAnalysis {
  found: string[];
  missing: string[];
  score: number;
}

export interface SectionScore {
  section: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-work' | 'missing';
  tips: string[];
}

// ChatGPT 3.5 API Configuration
const CHATGPT_API_URL = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQnBYN0haRnpBSFdpSkhRVkZQeXlVMUg4WjA4ZmxTaVowZTZjNHdKTkFUSHRSNGtaaEdJWUJhd0NCM3NXSl9FTjBPdkNaQV93OC1zamxWUGM3RFJmeVZKLTFXenc9PQ==";

const POWER_WORDS = [
  'led', 'managed', 'directed', 'supervised', 'coordinated', 'orchestrated', 'spearheaded',
  'achieved', 'exceeded', 'surpassed', 'accomplished', 'delivered', 'attained', 'earned',
  'developed', 'created', 'designed', 'built', 'launched', 'established', 'pioneered', 'initiated',
  'improved', 'enhanced', 'optimized', 'streamlined', 'transformed', 'revitalized', 'accelerated',
  'analyzed', 'evaluated', 'assessed', 'identified', 'researched', 'investigated', 'discovered',
  'presented', 'negotiated', 'collaborated', 'persuaded', 'influenced', 'advocated', 'mentored',
  'implemented', 'automated', 'integrated', 'engineered', 'architected', 'configured', 'deployed',
  'increased', 'decreased', 'reduced', 'saved', 'generated', 'boosted', 'maximized', 'minimized'
];

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  technology: ['agile', 'scrum', 'devops', 'cloud', 'api', 'microservices', 'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'machine learning', 'ai', 'data', 'python', 'javascript', 'react', 'node', 'sql', 'nosql', 'git', 'ci/cd'],
  finance: ['financial analysis', 'risk management', 'compliance', 'audit', 'forecasting', 'budgeting', 'p&l', 'roi', 'kpi', 'excel', 'bloomberg', 'trading', 'portfolio', 'regulatory', 'due diligence'],
  marketing: ['seo', 'sem', 'social media', 'content strategy', 'analytics', 'campaign', 'brand', 'digital marketing', 'crm', 'hubspot', 'salesforce', 'google analytics', 'conversion', 'roi', 'engagement'],
  healthcare: ['patient care', 'hipaa', 'ehr', 'clinical', 'medical', 'healthcare', 'compliance', 'quality assurance', 'patient outcomes', 'diagnosis', 'treatment', 'care coordination'],
  sales: ['revenue', 'quota', 'pipeline', 'crm', 'salesforce', 'negotiation', 'client relationships', 'prospecting', 'closing', 'account management', 'territory', 'upselling', 'cross-selling'],
  general: ['project management', 'team leadership', 'communication', 'problem-solving', 'strategic planning', 'budget management', 'stakeholder management', 'cross-functional', 'deadline-driven']
};

function calculateReadabilityStats(text: string): ReadabilityStats {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const bullets = (text.match(/[•\-\*]/g) || []).length;

  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com|linkedin/i.test(text);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
    bulletPoints: bullets,
    pageEstimate: Math.ceil(words.length / 500),
    hasContactInfo: hasEmail || hasPhone,
    hasLinkedIn,
    hasEmail,
    hasPhone
  };
}

function analyzePowerWords(text: string): PowerWordAnalysis {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];

  POWER_WORDS.forEach(word => {
    if (lowerText.includes(word)) {
      found.push(word);
    } else {
      missing.push(word);
    }
  });

  const priorityMissing = missing.slice(0, 15);
  const score = Math.min(100, Math.round((found.length / 20) * 100));

  return { found, missing: priorityMissing, score };
}

function localAnalysis(text: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const readabilityStats = calculateReadabilityStats(text);
  const powerWords = analyzePowerWords(text);

  // More generous keyword scoring - start with base of 12 instead of 5
  let keywords = 12;
  const techKeywords = ['python', 'javascript', 'react', 'sql', 'java', 'html', 'css', 'git', 'aws', 'docker',
    'agile', 'project management', 'leadership', 'communication', 'data', 'analysis', 'marketing', 'sales'];
  techKeywords.forEach(k => { if (lowerText.includes(k)) keywords += 1.5; });
  keywords = Math.min(25, keywords);

  // More generous action verb scoring - start with base of 8 instead of 3
  let actionScore = 8;
  powerWords.found.forEach(() => { actionScore += 0.5; });
  actionScore = Math.min(15, actionScore);

  // More generous structure scoring - start with base of 12 instead of 5
  let structure = 12;
  if (readabilityStats.hasEmail) structure += 3;
  if (readabilityStats.hasPhone) structure += 2;
  if (lowerText.includes('experience') || lowerText.includes('work history')) structure += 3;
  if (lowerText.includes('education')) structure += 3;
  if (lowerText.includes('skills')) structure += 2;
  structure = Math.min(25, structure);

  // More generous quantification - start with base of 5 instead of 2
  const numbers = (text.match(/\d+%|\$\d+|\d+\+|\d+ years|\d+ team|\d+ projects/gi) || []).length;
  let quantification = 5 + Math.min(10, numbers * 2);

  // More generous readability - start with base of 10 instead of 5
  let readability = 10;
  if (readabilityStats.wordCount >= 200 && readabilityStats.wordCount <= 800) readability += 4;
  if (readabilityStats.bulletPoints >= 5) readability += 3;
  if (readabilityStats.avgWordsPerSentence <= 25) readability += 3;
  readability = Math.min(20, readability);

  const score = Math.round(keywords + actionScore + structure + quantification + readability);

  return {
    score: Math.max(55, score), // Minimum score of 55 for any resume with basic content
    scoreBreakdown: {
      keywords: Math.round(keywords),
      actionVerbs: Math.round(actionScore),
      structure: Math.round(structure),
      quantification: Math.round(quantification),
      readability: Math.round(readability)
    },
    scoreExplanation: score >= 70
      ? 'Your resume shows a solid foundation with good structure and relevant content. Focus on adding more quantified achievements and industry-specific keywords to reach the 85+ range and stand out to recruiters.'
      : 'Your resume has good potential! The basic structure is in place. To boost your score, focus on adding quantified metrics (numbers, percentages), using stronger action verbs, and including more industry-relevant keywords.',
    credibilityCheck: {
      level: score >= 70 ? 'medium' : 'medium', // Most students get 'medium'
      strengths: [
        readabilityStats.hasContactInfo ? 'Contact information is clearly present' : 'Resume structure is visible',
        powerWords.found.length > 5 ? 'Uses action verbs effectively' : 'Basic formatting is in place',
        'Shows effort and organization'
      ],
      redFlags: score < 65 ? ['Could benefit from more quantified achievements', 'Opportunity to add more industry keywords'] : ['Minor optimization opportunities available'],
      summary: score >= 70
        ? 'This resume has good potential and would likely pass initial screening. With optimization of metrics and keywords, it will be highly competitive for your target roles.'
        : 'This resume shows promise and has a solid foundation. With enhancements to quantification and keyword optimization, it will be competitive for entry-level and student positions.'
    },
    feedback: [
      {
        category: 'strength',
        icon: '✅',
        title: 'Good Foundation',
        message: 'Your resume has a clear structure with identifiable sections. This is essential for ATS systems to parse your information correctly.',
        priority: 1
      },
      {
        category: score >= 65 ? 'strength' : 'suggestion',
        icon: score >= 65 ? '💪' : '💡',
        title: score >= 65 ? 'Content Present' : 'Enhance Content',
        message: score >= 65
          ? 'You have relevant content and experience listed. Great start!'
          : 'Add more details about your projects, internships, or academic work to showcase your capabilities.',
        priority: 1
      },
      {
        category: 'suggestion',
        icon: '📊',
        title: 'Add Quantification',
        message: `Currently ${numbers} quantified metrics found. Aim for numbers in 60%+ of your bullet points. Examples: "Led team of 3", "Improved performance by 40%", "Completed 5+ projects"`,
        priority: 2
      },
      {
        category: 'suggestion',
        icon: '🎯',
        title: 'Optimize Keywords',
        message: 'Include industry-specific keywords from job descriptions. This helps ATS systems match your resume to open positions.',
        priority: 3
      },
      {
        category: 'suggestion',
        icon: '⚡',
        title: 'Strengthen Action Verbs',
        message: 'Use powerful action verbs like "Developed", "Implemented", "Achieved", "Led", "Optimized" to start your bullet points.',
        priority: 4
      }
    ],
    missingKeywords: [
      { keyword: 'Developed', category: 'action', importance: 'high' },
      { keyword: 'Implemented', category: 'action', importance: 'high' },
      { keyword: 'Achieved', category: 'action', importance: 'high' },
      { keyword: 'Collaborated', category: 'action', importance: 'medium' },
      { keyword: 'Team Size', category: 'metrics', importance: 'high' },
      { keyword: 'Project Duration', category: 'metrics', importance: 'medium' },
      { keyword: 'Results/Impact', category: 'metrics', importance: 'high' }
    ],
    sectionSuggestions: [
      {
        section: 'Summary',
        issue: 'Could be more impactful',
        suggestion: 'Create a 2-3 sentence professional summary highlighting your experience, key skills, and career goals.',
        priority: 'high'
      },
      {
        section: 'Experience',
        issue: 'Opportunity to add more detail',
        suggestion: 'Use the format: "Action verb + what you did + tools/methods + quantified result" for each bullet point.',
        priority: 'high'
      },
      {
        section: 'Skills',
        issue: 'Can be better organized',
        suggestion: 'Group skills into categories: Technical Skills, Tools & Platforms, Soft Skills for better ATS parsing.',
        priority: 'medium'
      }
    ],
    readabilityStats,
    powerWords,
    sectionScores: [
      { section: 'Contact Info', score: readabilityStats.hasContactInfo ? 85 : 60, status: readabilityStats.hasContactInfo ? 'good' : 'needs-work', tips: ['Include phone, email, and LinkedIn URL'] },
      { section: 'Summary', score: 65, status: 'needs-work', tips: ['Add a 2-3 sentence professional summary', 'Highlight key achievements and skills'] },
      { section: 'Experience', score: 60, status: 'needs-work', tips: ['Add quantified metrics to bullets', 'Start each bullet with action verbs', 'Include tools and technologies used'] },
      { section: 'Skills', score: 65, status: 'needs-work', tips: ['Organize into categories', 'Include both technical and soft skills', 'Match keywords from job descriptions'] },
      { section: 'Education', score: 75, status: 'good', tips: ['Include GPA if above 3.5', 'Add relevant coursework', 'List academic achievements'] }
    ],
    industryMatch: 60,
    improvedResume: text,
    improvementPercentage: 0
  };
}

async function callChatGPT(prompt: string, systemPrompt: string = ""): Promise<string> {
  try {
    // Combine system prompt and user prompt for the API
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    console.log("Calling ChatGPT 3.5 API...");

    const response = await fetch(CHATGPT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    const data = await response.json();

    if (data.status === 'success' && data.text) {
      return data.text;
    } else {
      console.error("ChatGPT API error:", data);
      throw new Error(data.error || "API request failed");
    }
  } catch (err) {
    console.error("ChatGPT call failed:", err);
    throw err;
  }
}

function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Continue to other methods
      }
    }

    // Try to extract from code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {
        // Continue
      }
    }

    return null;
  }
}

export async function analyzeResume(
  text: string,
  industry: string = 'general',
  jobDescription: string = ''
): Promise<AnalysisResult> {
  try {
    console.log("Calling ChatGPT 3.5 for resume analysis...");

    const industryKeywords = INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.general;

    const systemPrompt = `You are a professional ATS (Applicant Tracking System) engine used by enterprise companies.

YOUR ROLE:
You parse resumes and job descriptions to calculate accurate match scores that help recruiters identify qualified candidates.

SCORING METHODOLOGY (Total: 100 points):

1. KEYWORD MATCH (40 points):
   - Extract key terms from job description
   - Count exact and semantic matches in resume
   - Prioritize job-specific technical terms, tools, and domain keywords
   - Penalize missing critical keywords heavily
   
2. SKILLS MATCH (25 points):
   - Compare required skills vs. resume skills
   - Technical skills: programming languages, frameworks, tools
   - Soft skills: leadership, communication, teamwork
   - Award points for skill depth and relevance
   
3. EXPERIENCE RELEVANCE (20 points):
   - Match job requirements (years, role type, industry)
   - Evaluate project/work experience alignment
   - Consider role progression and responsibilities
   - Penalize significant mismatches
   
4. FORMATTING & STRUCTURE (10 points):
   - ATS-parseable format (no tables, images, columns)
   - Clear section headers (Contact, Summary, Experience, Skills, Education)
   - Consistent formatting and readability
   - Professional presentation
   
5. ACHIEVEMENTS & METRICS (5 points):
   - Quantified accomplishments (%, $, numbers)
   - Impact statements with measurable results
   - Awards, certifications, recognitions
   - Concrete evidence of value delivered

SCORING CALIBRATION:
- 90-100: Excellent Fit - Resume perfectly tailored, all key requirements met
- 75-89: Strong Fit - Most requirements met, minor gaps
- 60-74: Moderate Fit - Some requirements met, notable gaps
- 45-59: Weak Fit - Few requirements met, significant gaps
- 0-44: Poor Fit - Minimal alignment with job requirements

CRITICAL RULES:
1. NEVER give 100 unless resume is perfectly tailored to the job description
2. WITHOUT job description: Score based on general quality (max 75)
3. WITH job description: Score based on job-specific match
4. Be STRICT on keyword matching - missing critical keywords = major penalty
5. Generic summaries ("seeking opportunity") = penalty
6. Quantified achievements = bonus points
7. ATS-unfriendly formatting = penalty

HONESTY REQUIREMENTS:
- If resume doesn't match job, score it low (30-50)
- If resume is generic, score reflects that (40-60)
- If resume is well-tailored, score reflects that (75-90)
- Reserve 90+ for exceptional, perfectly matched resumes`;

    const analysisPrompt = `${systemPrompt}

ANALYZE THIS RESUME:
${text}

${jobDescription ? `JOB DESCRIPTION TO MATCH AGAINST:\n${jobDescription}\n\nIMPORTANT: Score this resume based on how well it matches THIS SPECIFIC JOB.` : 'NO JOB DESCRIPTION PROVIDED: Score based on general resume quality (max score: 75)'}

TARGET INDUSTRY: ${industry}
INDUSTRY KEYWORDS: ${industryKeywords.join(', ')}

ANALYSIS STEPS:
1. Parse the resume - extract all skills, keywords, experience
2. ${jobDescription ? 'Parse the job description - extract requirements, must-have skills, keywords' : 'Evaluate general quality'}
3. Calculate weighted score:
   - Keyword match: ${jobDescription ? '40%' : '30%'}
   - Skills match: ${jobDescription ? '25%' : '25%'}
   - Experience relevance: ${jobDescription ? '20%' : '20%'}
   - Formatting & structure: 10%
   - Achievements & metrics: ${jobDescription ? '5%' : '15%'}
4. Identify missing critical keywords
5. Provide specific improvement suggestions

SCORING INSTRUCTIONS:
- Count ACTUAL keyword matches (be precise)
- Compare ACTUAL skills listed vs. required
- Evaluate ACTUAL experience relevance
- Be HONEST - if resume doesn't match job, score it 30-50
- If resume is generic with no job description, score 50-65
- If resume matches job well, score 75-85
- Reserve 90+ for exceptional matches only

OUTPUT FORMAT (JSON only, no markdown):
{
  "score": <0-100, be ACCURATE and STRICT>,
  "scoreBreakdown": {
    "keywords": <0-40 points: actual keyword match percentage>,
    "actionVerbs": <0-25 points: skills alignment>,
    "structure": <0-10 points: formatting quality>,
    "quantification": <0-5 points: achievements with metrics>,
    "readability": <0-20 points: experience relevance>
  },
  "scoreExplanation": "<HONEST: 'This resume scores X/100 because...' List specific matches and gaps>",
  "credibilityCheck": {
    "level": "<low (0-44) | medium (45-74) | high (75-100)>",
    "strengths": ["<specific match 1>", "<specific match 2>"],
    "redFlags": ["<missing requirement 1>", "<missing requirement 2>", "<gap 3>"],
    "summary": "<DIRECT: 'This resume is a [category] for this role because...' Be specific about fit>"
  },
  "feedback": [
    {"category": "strength", "icon": "✅", "title": "Matching Qualification", "message": "<what matches job requirements>", "priority": 1},
    {"category": "weakness", "icon": "⚠️", "title": "Missing Requirement", "message": "<critical gap vs job description>", "priority": 1},
    {"category": "weakness", "icon": "📊", "title": "Skill Gap", "message": "<missing skill from job requirements>", "priority": 2},
    {"category": "suggestion", "icon": "💡", "title": "Keyword Optimization", "message": "<add these job-specific keywords>", "priority": 3}
  ],
  "missingKeywords": [
    {"keyword": "<relevant keyword>", "category": "<skills|action|metrics|tools>", "importance": "<high|medium|low>"}
  ],
  "sectionSuggestions": [
    {"section": "<section name>", "issue": "<what could be better>", "suggestion": "<specific actionable fix>", "priority": "<high|medium|low>"}
  ],
  "sectionScores": [
    {"section": "Contact Info", "score": <70-100 if present>, "status": "<excellent|good|needs-work>", "tips": ["<helpful tip>"]},
    {"section": "Summary", "score": <50-90>, "status": "<excellent|good|needs-work>", "tips": ["<how to improve>"]},
    {"section": "Experience", "score": <50-90>, "status": "<excellent|good|needs-work>", "tips": ["<specific suggestion>"]},
    {"section": "Skills", "score": <50-90>, "status": "<excellent|good|needs-work>", "tips": ["<what to add>"]},
    {"section": "Education", "score": <60-100>, "status": "<excellent|good|needs-work>", "tips": ["<enhancement idea>"]}
  ],
  "industryMatch": <number 55-90, be encouraging>
}`;

    const resumeOptimizationPrompt = `You are an ELITE ATS Resume Optimization Engine used by enterprise recruiters.

YOUR MISSION:
Transform resumes to maximize ATS scores by aligning content with job requirements while maintaining 100% honesty.

═══════════════════════════════════════════════════════════
CORE OPTIMIZATION STRATEGY
═══════════════════════════════════════════════════════════

${jobDescription ? `
JOB-SPECIFIC OPTIMIZATION (Job Description Provided):
1. Extract ALL keywords from job description
2. Match resume content to job requirements
3. Incorporate job-specific terminology naturally
4. Highlight relevant experience that matches job needs
5. Reorder/emphasize skills that match job requirements
6. Use exact phrases from job description where applicable

CRITICAL: This resume MUST be tailored to the specific job description.
` : `
GENERAL OPTIMIZATION (No Job Description):
1. Enhance clarity and ATS parseability
2. Add industry-standard keywords
3. Improve structure and formatting
4. Quantify achievements
5. Use professional action verbs
`}

═══════════════════════════════════════════════════════════
STRICT HONESTY RULES
═══════════════════════════════════════════════════════════

YOU MUST NOT:
❌ Invent skills, tools, or technologies not mentioned
❌ Add fake companies, job titles, or experiences
❌ Inflate years of experience or seniority
❌ Create unrealistic metrics or achievements
❌ Add certifications or degrees not present

YOU MAY:
✅ Rephrase existing content using job-specific keywords
✅ Reorganize sections to highlight relevant experience
✅ Expand vague descriptions with logical details
✅ Add realistic quantification where logically implied
✅ Improve grammar, formatting, and professional tone
✅ Use synonyms that match job description terminology

═══════════════════════════════════════════════════════════
KEYWORD OPTIMIZATION
═══════════════════════════════════════════════════════════

${jobDescription ? `
EXTRACT keywords from job description and INCORPORATE them naturally:
- Technical skills (programming languages, frameworks, tools)
- Soft skills (leadership, communication, teamwork)
- Domain knowledge (industry-specific terms)
- Certifications and qualifications
- Action verbs used in job description

EXAMPLE:
Job says: "Experience with React.js and modern JavaScript frameworks"
Resume transformation:
❌ "Built websites using web technologies"
✅ "Developed responsive web applications using React.js and modern JavaScript frameworks"
` : `
Use industry-standard keywords:
- Programming languages: Java, Python, JavaScript, etc.
- Frameworks: React, Node.js, Spring Boot, etc.
- Tools: Git, Docker, AWS, etc.
- Methodologies: Agile, Scrum, DevOps, etc.
`}

═══════════════════════════════════════════════════════════
ATS-FRIENDLY FORMATTING
═══════════════════════════════════════════════════════════

REQUIRED STRUCTURE:
[FULL NAME]
[City, State/Country]
[Email] | [Phone] | [LinkedIn] | [GitHub/Portfolio]

PROFESSIONAL SUMMARY
[2-3 sentences highlighting experience, key skills, and career focus${jobDescription ? ' - MUST align with job requirements' : ''}]

${jobDescription ? 'RELEVANT ' : ''}EXPERIENCE / PROFESSIONAL EXPERIENCE
[Company/Organization] | [Job Title] | [Dates]
• [Achievement with metrics${jobDescription ? ' - use keywords from job description' : ''}]
• [Achievement with metrics]
• [Achievement with metrics]

PROJECTS${jobDescription ? ' (Highlight projects relevant to job)' : ''}
[Project Name] | [Technologies - match job requirements if applicable]
• [What was built and impact]
• [Key features and results with metrics]

EDUCATION
[Degree] in [Field] | [University] | [Graduation Date]
${jobDescription ? '[Relevant coursework matching job requirements]' : '[Relevant coursework, GPA if >3.5]'}

TECHNICAL SKILLS${jobDescription ? ' (Prioritize skills from job description)' : ''}
Programming Languages: [List - prioritize job-required languages]
Frameworks & Libraries: [List - match job requirements]
Tools & Platforms: [List - include job-mentioned tools]
${jobDescription ? 'Databases: [List - match job tech stack]' : ''}

CERTIFICATIONS${jobDescription ? ' (List certifications mentioned in job)' : ''}
[Only list actual certifications - do not invent]

═══════════════════════════════════════════════════════════
QUALITY CONTROL - MANDATORY
═══════════════════════════════════════════════════════════

BEFORE OUTPUTTING:
✓ Grammar check (past tense for previous roles, present for current)
✓ Spelling check (especially technical terms)
✓ Keyword density check${jobDescription ? ' (job-specific keywords appear naturally)' : ''}
✓ Quantification check (realistic metrics: 20-50% improvements, not 300%)
✓ Consistency check (dates, formatting, capitalization)
✓ ATS compatibility check (no tables, columns, images)
✓ Honesty check (all claims are truthful and verifiable)

═══════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════

Your output MUST:
✓ Be 400-600 words (comprehensive but concise)
✓ Include ALL standard sections
✓ Have 3-5 bullet points per experience/project
✓ Contain quantified metrics in 50%+ of bullets
✓ ${jobDescription ? 'Match job description keywords naturally throughout' : 'Use industry-standard terminology'}
✓ Be ATS-parseable (clean text format)
✓ Sound professional and confident
✓ Be 100% honest and verifiable

Return ONLY the optimized resume. No explanations. Plain text only.`;

    const improvePrompt = `${resumeOptimizationPrompt}

ORIGINAL RESUME:
${text}

${jobDescription ? `TARGET JOB:\n${jobDescription}` : ''}

TARGET INDUSTRY: ${industry}
RELEVANT KEYWORDS: ${industryKeywords.slice(0, 10).join(', ')}

═══════════════════════════════════════════════════════════
CRITICAL INSTRUCTIONS FOR HIGH-QUALITY OUTPUT
═══════════════════════════════════════════════════════════

You MUST generate a COMPREHENSIVE, DETAILED, PROFESSIONAL resume.
Do NOT just make minor edits - TRANSFORM the resume completely.

MANDATORY REQUIREMENTS:
1. Add FULL contact details (if missing, infer from context: email format, phone placeholder, LinkedIn/GitHub URLs)
2. Create a COMPELLING 3-4 sentence professional summary
3. Expand ALL experience/projects with 3-5 detailed bullet points EACH
4. Add specific technologies, tools, and frameworks
5. Include quantified metrics in 60%+ of bullets
6. Organize skills into clear categories with 8-12 items each
7. Add relevant sections: Certifications, Achievements, Additional Information

EXPANSION RULES:
- If original says "developed a project" → Expand to full project description with tech stack, features, and impact
- If original says "computer proficiency" → Expand to specific programming languages and tools
- If original says "coding skills" → List specific languages (Java, Python, JavaScript, etc.)
- If original says "MS Word" → Expand to full Microsoft Office Suite + other productivity tools
- If original mentions education → Add CGPA/GPA (infer 7.5-8.5 range if not provided), relevant coursework

EXAMPLE TRANSFORMATION:

INPUT (Weak):
"Ravi Kumar
Skills: Computer proficiency, Coding
Projects: College project"

OUTPUT (Strong):
"Ravi Kumar
New Delhi, India
Email: ravi.kumar.dev@gmail.com
Phone: +91-9XXXXXXXXX
LinkedIn: linkedin.com/in/ravikumar

PROFESSIONAL SUMMARY
Motivated Computer Science graduate with a B.Tech degree and hands-on experience in software development, web technologies, and database management. Skilled in Java, Python, and JavaScript with a proven ability to build functional applications and solve complex problems. Eager to contribute to innovative projects and grow as a software engineer in a dynamic team environment.

EDUCATION
Bachelor of Technology in Computer Science Engineering
[University Name], New Delhi
2018 – 2022
CGPA: 7.8 / 10
Relevant Coursework: Data Structures, Algorithms, Database Management Systems, Web Technologies, Operating Systems

TECHNICAL SKILLS
Programming Languages: Java, Python, JavaScript, C++
Web Technologies: HTML5, CSS3, JavaScript, Bootstrap
Frameworks & Libraries: React.js (basic), Node.js (basic)
Databases: MySQL, MongoDB (basic)
Tools & Platforms: Git, GitHub, VS Code, Eclipse, Microsoft Office Suite
Concepts: Object-Oriented Programming, Data Structures & Algorithms, SDLC

PROJECTS
Student Management System
• Developed a Java-based desktop application to manage student records, attendance, and grade tracking
• Implemented CRUD operations using MySQL database with 500+ student records
• Designed user-friendly interface using Java Swing, reducing data entry time by 30%
• Applied OOP principles including inheritance, polymorphism, and encapsulation

Personal Portfolio Website
• Created a responsive portfolio website using HTML5, CSS3, and JavaScript
• Implemented smooth scrolling, animations, and contact form functionality
• Optimized for mobile devices with responsive design principles
• Deployed on GitHub Pages with 100% uptime

ADDITIONAL INFORMATION
• Strong analytical and problem-solving abilities
• Quick learner with adaptability to new technologies
• Effective team player with good communication skills
• Participated in college technical events and coding competitions"

═══════════════════════════════════════════════════════════
QUALITY CONTROL - CRITICAL
═══════════════════════════════════════════════════════════

BEFORE OUTPUTTING, YOU MUST:

1. GRAMMAR & SPELLING CHECK:
   ✓ Check every sentence for grammar errors
   ✓ Ensure subject-verb agreement
   ✓ Use proper tense (past tense for previous roles, present for current)
   ✓ Check spelling of all technical terms
   ✓ Verify punctuation (periods, commas, semicolons)
   ✓ Ensure consistent capitalization

2. QUANTIFICATION ACCURACY:
   ✓ All numbers must be realistic and believable
   ✓ Percentages should be reasonable (not "improved by 500%")
   ✓ Team sizes should match role level (fresher: 2-5, mid: 5-10, senior: 10+)
   ✓ Project counts should be believable (fresher: 2-5, not 50+)
   ✓ User counts should match project scope
   
   REALISTIC METRICS:
   - Performance improvements: 20-50% (not 200%)
   - Team size: 2-10 people (not 50)
   - Project duration: 1-6 months for students (not 2 years)
   - User base: 50-1000 for student projects (not 1 million)
   - Database records: 100-5000 for student projects (not 10 million)

3. CONSISTENCY CHECK:
   ✓ Dates are in consistent format (e.g., "Jan 2023 - Present")
   ✓ Bullet points start with action verbs consistently
   ✓ Section headers are consistently formatted
   ✓ Technology names are spelled correctly (JavaScript not Javascript)
   ✓ No contradictions (e.g., "fresher" but "10 years experience")

4. PROFESSIONAL LANGUAGE:
   ✓ No informal language ("worked on stuff", "did things")
   ✓ No exaggerations ("world-class", "revolutionary")
   ✓ No vague terms without context ("many", "several" - use numbers)
   ✓ Professional tone throughout

5. TECHNICAL ACCURACY:
   ✓ Technology names spelled correctly (React.js, Node.js, MongoDB)
   ✓ Frameworks paired with correct languages
   ✓ Tools mentioned are actually used together
   ✓ No impossible combinations (e.g., "React with PHP backend" for student)

COMMON ERRORS TO AVOID:
❌ "Improved performance by 300%" → ✅ "Improved performance by 35%"
❌ "Managed team of 50 developers" (for fresher) → ✅ "Collaborated with team of 5"
❌ "Built app with 10 million users" (student) → ✅ "Built app supporting 500+ users"
❌ "Reduced bugs by 99%" → ✅ "Reduced bugs by 25%"
❌ "Developed in React and Angular" (for one project) → ✅ "Developed using React"
❌ "Working on project" (past role) → ✅ "Worked on project"
❌ "Implement feature" → ✅ "Implemented feature"

GRAMMAR EXAMPLES:
❌ "Developing web applications using React" (past role) → ✅ "Developed web applications using React"
❌ "Manage team of developers" (past) → ✅ "Managed team of developers"
❌ "Create database schema" → ✅ "Created database schema"
❌ "Build responsive website" → ✅ "Built responsive website"

═══════════════════════════════════════════════════════════
SPECIFIC ENHANCEMENT STRATEGIES
═══════════════════════════════════════════════════════════

FOR FRESHERS/STUDENTS:
1. Infer reasonable details from limited information
2. Add academic projects with full tech stack
3. Include relevant coursework (5-6 courses)
4. Add CGPA (7.5-8.5 range if not mentioned)
5. Expand generic skills into specific technologies
6. Add certifications section (online courses: Coursera, Udemy, etc.)
7. Include achievements (academic ranks, competitions, hackathons)

FOR PROFESSIONALS:
1. Expand job responsibilities into achievement bullets
2. Add metrics: percentages, team sizes, project counts
3. Include technologies used in each role
4. Add leadership and collaboration examples
5. Quantify impact wherever possible

CONTACT INFORMATION INFERENCE:
- Email: [firstname.lastname.dev@gmail.com] or [firstname.lastname@email.com]
- Phone: +91-9XXXXXXXXX (India) or appropriate country code
- LinkedIn: linkedin.com/in/[firstname][lastname]
- GitHub: github.com/[firstname][lastname] (for tech roles)
- Location: [City mentioned or infer from context]

SKILL EXPANSION MAPPING:
- "Computer proficiency" → Java, Python, JavaScript, C++, HTML, CSS
- "Coding skills" → Programming Languages: Java, Python, JavaScript
- "MS Word" → Microsoft Office Suite (Word, Excel, PowerPoint), Google Workspace
- "Internet savvy" → Web Technologies, Online Research, Digital Communication
- "Quick learner" → Adaptability, Self-motivated, Continuous Learning

PROJECT EXPANSION:
- "College project" → Give it a name (e.g., "Library Management System", "E-Commerce Platform")
- Add tech stack: Languages, frameworks, databases used
- Add 3-5 bullet points with features, implementation details, and impact
- Include metrics: number of users, records, performance improvements

═══════════════════════════════════════════════════════════
FINAL OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════

Your output MUST be:
✓ At least 2x longer than the input (minimum 400-500 words)
✓ Include ALL standard sections with rich content
✓ Have 3-5 bullet points per project/experience
✓ Include specific technologies and tools
✓ Contain quantified metrics in 60%+ of bullets
✓ Be formatted professionally with clear sections
✓ Sound confident and achievement-oriented
✓ Be 100% honest (no fake companies or degrees)

Return ONLY the improved resume. No explanations. No markdown formatting. Plain text only.`;

    // Make both API calls in parallel
    const [analysisResponse, improvedResumeResponse] = await Promise.all([
      callChatGPT(analysisPrompt, systemPrompt),
      callChatGPT(improvePrompt, "")
    ]);

    const analysis = extractJSON(analysisResponse);
    let improvedResume = improvedResumeResponse.trim();

    // Clean up the improved resume if it has code blocks
    if (improvedResume.startsWith("```")) {
      improvedResume = improvedResume.replace(/```[\w]*\n?/g, '').trim();
    }

    if (!analysis) {
      console.error("Failed to parse AI response, using local analysis");
      const localResult = localAnalysis(text);
      localResult.improvedResume = improvedResume || text;
      return localResult;
    }

    const readabilityStats = calculateReadabilityStats(text);
    const powerWords = analyzePowerWords(text);

    // Calculate improvement percentage
    const originalScore = analysis.score || 60;
    const potentialGain = Math.min(35, 100 - originalScore);
    const improvementPercentage = Math.round((potentialGain / originalScore) * 100);

    return {
      score: Math.min(100, Math.max(0, Number(analysis.score) || 60)),
      scoreBreakdown: {
        keywords: Math.min(25, Math.max(0, Number(analysis.scoreBreakdown?.keywords) || 12)),
        actionVerbs: Math.min(15, Math.max(0, Number(analysis.scoreBreakdown?.actionVerbs) || 8)),
        structure: Math.min(20, Math.max(0, Number(analysis.scoreBreakdown?.structure) || 12)),
        quantification: Math.min(20, Math.max(0, Number(analysis.scoreBreakdown?.quantification) || 8)),
        readability: Math.min(20, Math.max(0, Number(analysis.scoreBreakdown?.readability) || 12))
      },
      scoreExplanation: String(analysis.scoreExplanation || 'Resume analyzed against professional ATS criteria.'),
      credibilityCheck: {
        level: ['low', 'medium', 'high'].includes(analysis.credibilityCheck?.level)
          ? analysis.credibilityCheck.level
          : 'medium',
        strengths: Array.isArray(analysis.credibilityCheck?.strengths)
          ? analysis.credibilityCheck.strengths.map(String)
          : ['Resume structure is present'],
        redFlags: Array.isArray(analysis.credibilityCheck?.redFlags)
          ? analysis.credibilityCheck.redFlags.map(String)
          : ['No major red flags identified'],
        summary: String(analysis.credibilityCheck?.summary || 'Resume requires optimization.')
      },
      feedback: Array.isArray(analysis.feedback) ? analysis.feedback.slice(0, 8).map((f: any) => ({
        category: ['strength', 'weakness', 'suggestion'].includes(f.category) ? f.category : 'suggestion',
        title: String(f.title || 'Feedback'),
        message: String(f.message || ''),
        icon: String(f.icon || '📋'),
        priority: Number(f.priority) || 5
      })) : [],
      missingKeywords: Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords.slice(0, 15).map((k: any) => ({
        keyword: String(k.keyword || ''),
        category: ['skills', 'action', 'metrics', 'tools'].includes(k.category) ? k.category : 'skills',
        importance: ['high', 'medium', 'low'].includes(k.importance) ? k.importance : 'medium'
      })) : [],
      sectionSuggestions: Array.isArray(analysis.sectionSuggestions) ? analysis.sectionSuggestions.slice(0, 6).map((s: any) => ({
        section: String(s.section || ''),
        issue: String(s.issue || ''),
        suggestion: String(s.suggestion || ''),
        priority: ['critical', 'high', 'medium', 'low'].includes(s.priority) ? s.priority : 'medium'
      })) : [],
      sectionScores: Array.isArray(analysis.sectionScores) ? analysis.sectionScores.map((s: any) => ({
        section: String(s.section || ''),
        score: Math.min(100, Math.max(0, Number(s.score) || 60)),
        status: ['excellent', 'good', 'needs-work', 'missing'].includes(s.status) ? s.status : 'needs-work',
        tips: Array.isArray(s.tips) ? s.tips.map(String) : []
      })) : [],
      readabilityStats,
      powerWords,
      industryMatch: Math.min(100, Math.max(0, Number(analysis.industryMatch) || 60)),
      improvedResume: improvedResume || text,
      improvementPercentage
    };
  } catch (error) {
    console.error("AI Analysis failed, using local fallback:", error);
    return localAnalysis(text);
  }
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string = '',
  roleName: string = ''
): Promise<string> {
  try {
    const prompt = `Write a professional, compelling cover letter based on:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Company: ${companyName || 'the company'}
Role: ${roleName || 'this position'}

Requirements:
1. Opening paragraph: Hook with enthusiasm and key qualification
2. Body paragraphs: Match 2-3 specific achievements from resume to job requirements
3. Include specific metrics and accomplishments
4. Show knowledge of the company/industry
5. Strong closing with call to action
6. Professional tone, 3-4 paragraphs
7. Do NOT use placeholders like [Your Name] - write complete sentences

Write ONLY the cover letter text, no explanations.`;

    const response = await callChatGPT(prompt, "You are an expert professional cover letter writer. Write compelling, professional cover letters that highlight achievements and match job requirements.");
    return response.trim();
  } catch (error) {
    console.error("Cover letter generation failed:", error);
    return `Dear Hiring Manager,

I am writing to express my strong interest in ${roleName || 'this position'} at ${companyName || 'your company'}. Based on the job requirements, I believe my experience and skills make me an excellent candidate.

[Please paste specific achievements from your resume that match the job description]

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background can benefit your organization.

Best regards,
[Your Name]`;
  }
}

export { INDUSTRY_KEYWORDS };
