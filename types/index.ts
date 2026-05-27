export interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  availability?: string;
  summary: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    dribbble?: string;
    kaggle?: string;
  };
  skillGroups?: {
    primary: string[];
    secondary: string[];
    tools: string[];
    learning: string[];
  };
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    location?: string;
    type?: string;
    description: string;
    tech?: string[];
    achievements?: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    duration: string;
    grade?: string;
  }[];
  projects: {
    title: string;
    tagline?: string;
    description: string;
    tech: string[];
    category?: string;
    status?: string;
    github?: string;
    live_url?: string;
    stars?: number | null;
    featured?: boolean;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: number;
  }[];
  languages?: string[];
  stats?: {
    years_experience?: number;
    projects_shipped?: number;
    github_repos?: number;
    github_stars?: number;
  };
  accentColor?: string | null;
  theme: 'developer' | 'designer' | 'executive' | 'scientist' | 'marketer';
}

export interface Portfolio {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  theme: string;
  published: boolean;
  views: number;
  data: PortfolioData;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  portfolio_id: string;
  event_type: 'view' | 'section_click' | 'voice_start' | 'share' | 'download_qr';
  metadata?: Record<string, any>;
}

export interface RecruiterReport {
  score: number;
  verdict: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  jobMatches: { title: string; match: number; reason: string }[];
  salaryRange: { min: number; max: number; currency: string };
  summary: string;
}
