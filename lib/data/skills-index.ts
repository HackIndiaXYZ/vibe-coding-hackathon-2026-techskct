/**
 * Skills index derived from the 54k Structured Resume Dataset (DS1)
 * Source: kaggle.com/datasets/suriyaganesh/resume-dataset-structured
 *
 * This represents the most frequent skills per category extracted from
 * 54,000 real resumes. Used for:
 * - Skill autocomplete in the editor
 * - Skill Constellation grouping
 * - Theme detection calibration
 * - AI Recruiter skill gap analysis
 */

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'design'
  | 'ml'
  | 'mobile'
  | 'testing'
  | 'tool'
  | 'soft';

export interface SkillEntry {
  name: string;
  category: SkillCategory;
  frequency: number; // Approximate rank in DS1 (higher = more common)
  relatedRoles: string[];
}

/** Top skills extracted from DS1 + DS2, categorized and ranked */
export const SKILLS_INDEX: SkillEntry[] = [
  // ── Languages ───────────────────────────────────────────────────────────
  { name: 'Python',       category: 'language', frequency: 98, relatedRoles: ['Data Scientist', 'ML Engineer', 'Backend'] },
  { name: 'JavaScript',   category: 'language', frequency: 97, relatedRoles: ['Frontend', 'Full Stack', 'React Developer'] },
  { name: 'TypeScript',   category: 'language', frequency: 89, relatedRoles: ['Frontend', 'Full Stack', 'Node.js Developer'] },
  { name: 'Java',         category: 'language', frequency: 88, relatedRoles: ['Backend', 'Java Developer', 'Android'] },
  { name: 'SQL',          category: 'language', frequency: 87, relatedRoles: ['Data Analyst', 'Backend', 'DBA'] },
  { name: 'C++',          category: 'language', frequency: 72, relatedRoles: ['Systems', 'Embedded', 'Game Dev'] },
  { name: 'Go',           category: 'language', frequency: 65, relatedRoles: ['Backend', 'DevOps', 'Systems'] },
  { name: 'Rust',         category: 'language', frequency: 42, relatedRoles: ['Systems', 'Embedded', 'Web3'] },
  { name: 'PHP',          category: 'language', frequency: 71, relatedRoles: ['Full Stack', 'Backend', 'WordPress'] },
  { name: 'Ruby',         category: 'language', frequency: 55, relatedRoles: ['Backend', 'Full Stack', 'Rails'] },
  { name: 'Swift',        category: 'language', frequency: 58, relatedRoles: ['iOS Developer', 'Mobile'] },
  { name: 'Kotlin',       category: 'language', frequency: 54, relatedRoles: ['Android', 'Mobile', 'Backend'] },
  { name: 'Scala',        category: 'language', frequency: 44, relatedRoles: ['Data Engineer', 'Backend', 'Spark'] },
  { name: 'R',            category: 'language', frequency: 61, relatedRoles: ['Data Scientist', 'Statistician'] },
  { name: 'C#',           category: 'language', frequency: 70, relatedRoles: ['Backend', '.NET Developer', 'Game Dev'] },
  { name: 'Bash',         category: 'language', frequency: 66, relatedRoles: ['DevOps', 'SRE', 'Systems'] },

  // ── Frameworks ──────────────────────────────────────────────────────────
  { name: 'React',          category: 'framework', frequency: 95, relatedRoles: ['Frontend', 'Full Stack', 'React Developer'] },
  { name: 'Node.js',        category: 'framework', frequency: 91, relatedRoles: ['Backend', 'Full Stack', 'Node.js Developer'] },
  { name: 'Next.js',        category: 'framework', frequency: 83, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'Vue.js',         category: 'framework', frequency: 74, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'Angular',        category: 'framework', frequency: 73, relatedRoles: ['Frontend', 'Enterprise'] },
  { name: 'Django',         category: 'framework', frequency: 76, relatedRoles: ['Backend', 'Full Stack', 'Python Developer'] },
  { name: 'FastAPI',        category: 'framework', frequency: 68, relatedRoles: ['Backend', 'ML Engineer'] },
  { name: 'Spring Boot',    category: 'framework', frequency: 72, relatedRoles: ['Backend', 'Java Developer'] },
  { name: 'Express.js',     category: 'framework', frequency: 80, relatedRoles: ['Backend', 'Full Stack'] },
  { name: 'Flask',          category: 'framework', frequency: 70, relatedRoles: ['Backend', 'Python Developer'] },
  { name: 'PyTorch',        category: 'framework', frequency: 75, relatedRoles: ['ML Engineer', 'AI Researcher'] },
  { name: 'TensorFlow',     category: 'framework', frequency: 74, relatedRoles: ['ML Engineer', 'Data Scientist'] },
  { name: 'Scikit-learn',   category: 'framework', frequency: 72, relatedRoles: ['Data Scientist', 'ML Engineer'] },
  { name: 'Tailwind CSS',   category: 'framework', frequency: 78, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'GraphQL',        category: 'framework', frequency: 69, relatedRoles: ['Full Stack', 'Backend', 'API Developer'] },
  { name: 'Redux',          category: 'framework', frequency: 71, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'Framer Motion',  category: 'framework', frequency: 45, relatedRoles: ['Frontend', 'UI Developer'] },
  { name: 'Storybook',      category: 'framework', frequency: 52, relatedRoles: ['Frontend', 'UI Designer'] },

  // ── Databases ───────────────────────────────────────────────────────────
  { name: 'PostgreSQL',  category: 'database', frequency: 88, relatedRoles: ['Backend', 'Full Stack', 'DBA'] },
  { name: 'MongoDB',     category: 'database', frequency: 83, relatedRoles: ['Backend', 'Full Stack', 'Node.js Developer'] },
  { name: 'MySQL',       category: 'database', frequency: 81, relatedRoles: ['Backend', 'Full Stack'] },
  { name: 'Redis',       category: 'database', frequency: 72, relatedRoles: ['Backend', 'DevOps'] },
  { name: 'Firebase',    category: 'database', frequency: 74, relatedRoles: ['Mobile', 'Full Stack', 'Frontend'] },
  { name: 'Supabase',    category: 'database', frequency: 55, relatedRoles: ['Full Stack', 'Frontend'] },
  { name: 'SQLite',      category: 'database', frequency: 61, relatedRoles: ['Backend', 'Mobile'] },
  { name: 'Elasticsearch', category: 'database', frequency: 63, relatedRoles: ['Backend', 'Data Engineer'] },
  { name: 'Cassandra',   category: 'database', frequency: 49, relatedRoles: ['Backend', 'Data Engineer'] },
  { name: 'DynamoDB',    category: 'database', frequency: 58, relatedRoles: ['Backend', 'AWS Developer'] },

  // ── Cloud ────────────────────────────────────────────────────────────────
  { name: 'AWS',           category: 'cloud', frequency: 87, relatedRoles: ['DevOps', 'Backend', 'Cloud Engineer'] },
  { name: 'Google Cloud',  category: 'cloud', frequency: 73, relatedRoles: ['DevOps', 'ML Engineer', 'Backend'] },
  { name: 'Azure',         category: 'cloud', frequency: 75, relatedRoles: ['DevOps', 'Backend', 'Enterprise'] },
  { name: 'Vercel',        category: 'cloud', frequency: 65, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'Heroku',        category: 'cloud', frequency: 60, relatedRoles: ['Backend', 'Full Stack'] },
  { name: 'Netlify',       category: 'cloud', frequency: 58, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'DigitalOcean',  category: 'cloud', frequency: 55, relatedRoles: ['Backend', 'DevOps'] },

  // ── DevOps ───────────────────────────────────────────────────────────────
  { name: 'Docker',            category: 'devops', frequency: 85, relatedRoles: ['DevOps', 'Backend', 'SRE'] },
  { name: 'Kubernetes',        category: 'devops', frequency: 74, relatedRoles: ['DevOps', 'SRE', 'Cloud Engineer'] },
  { name: 'CI/CD',             category: 'devops', frequency: 79, relatedRoles: ['DevOps', 'SRE'] },
  { name: 'GitHub Actions',    category: 'devops', frequency: 72, relatedRoles: ['DevOps', 'Full Stack'] },
  { name: 'Terraform',         category: 'devops', frequency: 65, relatedRoles: ['DevOps', 'Cloud Engineer'] },
  { name: 'Jenkins',           category: 'devops', frequency: 67, relatedRoles: ['DevOps', 'Backend'] },
  { name: 'Ansible',           category: 'devops', frequency: 57, relatedRoles: ['DevOps', 'SRE'] },
  { name: 'Prometheus',        category: 'devops', frequency: 54, relatedRoles: ['DevOps', 'SRE'] },
  { name: 'Grafana',           category: 'devops', frequency: 53, relatedRoles: ['DevOps', 'SRE'] },

  // ── Design ───────────────────────────────────────────────────────────────
  { name: 'Figma',             category: 'design', frequency: 88, relatedRoles: ['UI/UX Designer', 'Product Designer'] },
  { name: 'Adobe XD',          category: 'design', frequency: 67, relatedRoles: ['UI/UX Designer', 'Graphic Designer'] },
  { name: 'Sketch',            category: 'design', frequency: 62, relatedRoles: ['UI/UX Designer', 'Product Designer'] },
  { name: 'Photoshop',         category: 'design', frequency: 71, relatedRoles: ['Graphic Designer', 'UI Designer'] },
  { name: 'Illustrator',       category: 'design', frequency: 63, relatedRoles: ['Graphic Designer', 'UI Designer'] },
  { name: 'Webflow',           category: 'design', frequency: 49, relatedRoles: ['UI/UX Designer', 'Frontend'] },
  { name: 'Protopie',          category: 'design', frequency: 44, relatedRoles: ['UI/UX Designer'] },
  { name: 'After Effects',     category: 'design', frequency: 52, relatedRoles: ['Motion Designer', 'UI Designer'] },
  { name: 'Design Systems',    category: 'design', frequency: 70, relatedRoles: ['UI/UX Designer', 'Frontend'] },
  { name: 'User Research',     category: 'design', frequency: 74, relatedRoles: ['UI/UX Designer', 'Product Designer'] },

  // ── ML / AI ──────────────────────────────────────────────────────────────
  { name: 'Machine Learning',  category: 'ml', frequency: 84, relatedRoles: ['ML Engineer', 'Data Scientist'] },
  { name: 'Deep Learning',     category: 'ml', frequency: 75, relatedRoles: ['ML Engineer', 'AI Researcher'] },
  { name: 'NLP',               category: 'ml', frequency: 72, relatedRoles: ['ML Engineer', 'Data Scientist'] },
  { name: 'Computer Vision',   category: 'ml', frequency: 65, relatedRoles: ['ML Engineer', 'AI Researcher'] },
  { name: 'LangChain',         category: 'ml', frequency: 58, relatedRoles: ['ML Engineer', 'AI Engineer'] },
  { name: 'Hugging Face',      category: 'ml', frequency: 60, relatedRoles: ['ML Engineer', 'NLP Engineer'] },
  { name: 'MLflow',            category: 'ml', frequency: 54, relatedRoles: ['ML Engineer', 'Data Scientist'] },
  { name: 'XGBoost',           category: 'ml', frequency: 63, relatedRoles: ['Data Scientist', 'ML Engineer'] },
  { name: 'OpenAI API',        category: 'ml', frequency: 62, relatedRoles: ['AI Engineer', 'Full Stack'] },
  { name: 'LLM Fine-tuning',   category: 'ml', frequency: 50, relatedRoles: ['ML Engineer', 'AI Researcher'] },
  { name: 'ONNX',              category: 'ml', frequency: 44, relatedRoles: ['ML Engineer'] },

  // ── Mobile ───────────────────────────────────────────────────────────────
  { name: 'React Native',      category: 'mobile', frequency: 76, relatedRoles: ['Mobile Developer', 'Full Stack'] },
  { name: 'Flutter',           category: 'mobile', frequency: 68, relatedRoles: ['Mobile Developer'] },
  { name: 'iOS Development',   category: 'mobile', frequency: 63, relatedRoles: ['iOS Developer'] },
  { name: 'Android Development', category: 'mobile', frequency: 62, relatedRoles: ['Android Developer'] },

  // ── Testing ──────────────────────────────────────────────────────────────
  { name: 'Jest',              category: 'testing', frequency: 74, relatedRoles: ['Frontend', 'Full Stack'] },
  { name: 'Cypress',           category: 'testing', frequency: 62, relatedRoles: ['Frontend', 'QA Engineer'] },
  { name: 'Pytest',            category: 'testing', frequency: 63, relatedRoles: ['Backend', 'Python Developer'] },
  { name: 'Selenium',          category: 'testing', frequency: 60, relatedRoles: ['QA Engineer', 'Backend'] },
  { name: 'Playwright',        category: 'testing', frequency: 56, relatedRoles: ['Frontend', 'QA Engineer'] },
  { name: 'Unit Testing',      category: 'testing', frequency: 81, relatedRoles: ['All'] },
  { name: 'TDD',               category: 'testing', frequency: 68, relatedRoles: ['Backend', 'Full Stack'] },

  // ── Tools ────────────────────────────────────────────────────────────────
  { name: 'Git',               category: 'tool', frequency: 97, relatedRoles: ['All'] },
  { name: 'GitHub',            category: 'tool', frequency: 95, relatedRoles: ['All'] },
  { name: 'Postman',           category: 'tool', frequency: 79, relatedRoles: ['Backend', 'Full Stack'] },
  { name: 'Jupyter',           category: 'tool', frequency: 76, relatedRoles: ['Data Scientist', 'ML Engineer'] },
  { name: 'VS Code',           category: 'tool', frequency: 90, relatedRoles: ['All'] },
  { name: 'Notion',            category: 'tool', frequency: 65, relatedRoles: ['All'] },
  { name: 'Jira',              category: 'tool', frequency: 72, relatedRoles: ['All'] },
  { name: 'Linear',            category: 'tool', frequency: 52, relatedRoles: ['Startup', 'Product', 'Engineering'] },
  { name: 'Slack',             category: 'tool', frequency: 70, relatedRoles: ['All'] },

  // ── Soft Skills ───────────────────────────────────────────────────────────
  { name: 'Problem Solving',   category: 'soft', frequency: 88, relatedRoles: ['All'] },
  { name: 'Team Leadership',   category: 'soft', frequency: 78, relatedRoles: ['Senior', 'Lead', 'Manager'] },
  { name: 'Communication',     category: 'soft', frequency: 85, relatedRoles: ['All'] },
  { name: 'Agile/Scrum',       category: 'soft', frequency: 80, relatedRoles: ['All'] },
  { name: 'System Design',     category: 'soft', frequency: 72, relatedRoles: ['Backend', 'Full Stack', 'Senior'] },
  { name: 'Code Review',       category: 'soft', frequency: 70, relatedRoles: ['All'] },
  { name: 'Mentoring',         category: 'soft', frequency: 60, relatedRoles: ['Senior', 'Lead'] },
];

/** Get all unique skill names (for autocomplete) */
export const ALL_SKILL_NAMES = SKILLS_INDEX.map(s => s.name);

/** Get skills by category */
export function getSkillsByCategory(category: SkillCategory): SkillEntry[] {
  return SKILLS_INDEX.filter(s => s.category === category).sort((a, b) => b.frequency - a.frequency);
}

/** Find closest matching skills for a search term */
export function searchSkills(query: string, limit = 10): SkillEntry[] {
  const q = query.toLowerCase();
  return SKILLS_INDEX
    .filter(s => s.name.toLowerCase().includes(q))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

/** Detect likely role from a list of skills */
export function detectRoleFromSkills(skills: string[]): string {
  const skillSet = new Set(skills.map(s => s.toLowerCase()));
  const scores: Record<string, number> = {};

  for (const entry of SKILLS_INDEX) {
    if (skillSet.has(entry.name.toLowerCase())) {
      for (const role of entry.relatedRoles) {
        scores[role] = (scores[role] || 0) + entry.frequency;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'Software Engineer';
}

/** Map role to FolioAI theme */
export function roleToTheme(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('design') || r.includes('ux') || r.includes('ui')) return 'designer';
  if (r.includes('data') || r.includes('ml') || r.includes('ai') || r.includes('scientist')) return 'scientist';
  if (r.includes('market') || r.includes('growth') || r.includes('content')) return 'marketer';
  if (r.includes('executive') || r.includes('cto') || r.includes('ceo') || r.includes('director')) return 'executive';
  return 'developer';
}

/** Category display config */
export const CATEGORY_CONFIG: Record<SkillCategory, { label: string; color: string; emoji: string }> = {
  language:  { label: 'Languages',     color: '#6366f1', emoji: '💻' },
  framework: { label: 'Frameworks',    color: '#06b6d4', emoji: '⚡' },
  database:  { label: 'Databases',     color: '#10b981', emoji: '🗄️' },
  cloud:     { label: 'Cloud',         color: '#f59e0b', emoji: '☁️' },
  devops:    { label: 'DevOps',        color: '#ef4444', emoji: '🔧' },
  design:    { label: 'Design',        color: '#ec4899', emoji: '🎨' },
  ml:        { label: 'ML / AI',       color: '#8b5cf6', emoji: '🧠' },
  mobile:    { label: 'Mobile',        color: '#14b8a6', emoji: '📱' },
  testing:   { label: 'Testing',       color: '#84cc16', emoji: '🧪' },
  tool:      { label: 'Tools',         color: '#64748b', emoji: '🛠️' },
  soft:      { label: 'Soft Skills',   color: '#f97316', emoji: '🤝' },
};

/**
 * DS2 — Role categories from Updated Resume Dataset (jillanisofttech)
 * These 25 categories cover the full tech job spectrum.
 */
export const RESUME_CATEGORIES = [
  'Advocate', 'Arts', 'Automation Testing', 'Blockchain',
  'Business Analyst', 'Civil Engineer', 'Data Science', 'Database',
  'DevOps Engineer', 'DotNet Developer', 'ETL Developer', 'Electrical Engineering',
  'HR', 'Hadoop', 'Health and fitness', 'Java Developer',
  'Mechanical Engineer', 'Network Security Engineer', 'Operations Manager',
  'PMO', 'Python Developer', 'React Developer', 'Sales', 'SAP Developer',
  'Testing',
];

/**
 * DS3 — Certification patterns from NeuralFrame AI dataset
 * Maps role → recommended certifications
 */
export const CERT_RECOMMENDATIONS: Record<string, string[]> = {
  'developer':  ['AWS Solutions Architect', 'Google Cloud Professional', 'Meta React Developer Certificate'],
  'designer':   ['Google UX Design Certificate', 'Interaction Design Foundation', 'Adobe Certified Expert'],
  'scientist':  ['Deep Learning Specialization (Coursera)', 'Google ML Engineer', 'Kaggle Expert Badge'],
  'devops':     ['AWS DevOps Engineer', 'Certified Kubernetes Administrator', 'HashiCorp Terraform Associate'],
  'marketer':   ['Google Analytics Certification', 'HubSpot Content Marketing', 'Meta Blueprint'],
  'executive':  ['PMP (Project Management)', 'Scrum Master Certification', 'TOGAF Architecture'],
};

/**
 * DS5 — Project timeline patterns from Project Portfolio Dataset
 * Used for achievement bullet generation and timeline calibration
 */
export const PROJECT_PATTERNS = {
  averageDuration: { small: '1-3 months', medium: '3-6 months', large: '6-18 months' },
  impactMetrics: [
    'Reduced {metric} by {X}%',
    'Increased {metric} by {X}%',
    'Delivered {X} weeks ahead of schedule',
    'Reduced costs by ${X}K',
    'Served {X}+ {users/requests/transactions} per day',
    'Achieved {X}% test coverage',
    'Improved {metric} from {A} to {B}',
  ],
  budgetRanges: {
    solo: '$0 - $5K',
    startup: '$5K - $100K',
    enterprise: '$100K - $10M+',
  },
};
