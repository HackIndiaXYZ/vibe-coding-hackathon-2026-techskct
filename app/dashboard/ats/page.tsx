'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Plus, BarChart3, Globe, LogOut, Eye, Edit3,
  Trash2, ExternalLink, Upload, Loader2, Sparkles,
  FileText, Settings, Layout, CheckCircle2, AlertTriangle,
  ArrowRight, Copy, Check, RefreshCw, Star, Info, Award,
  Compass, BarChart, BookOpen, ChevronRight, HelpCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { icon: Layout,    label: 'Portfolios',  href: '/dashboard' },
  { icon: BarChart3, label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: FileText,  label: 'ATS Checker', href: '/dashboard/ats', active: true },
  { icon: Settings,  label: 'Settings',    href: '/dashboard/settings' },
];

const PREDEFINED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist / ML Engineer',
  'DevOps / SRE',
  'Product Manager',
  'Developer Advocate / Technical Writer'
];

type TabType = 'ats' | 'gap' | 'roadmap';

export default function AtsCheckerPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('ats');

  // API Call States
  const [analyzing, setAnalyzing] = useState(false);
  const [auditingGap, setAuditingGap] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  // Result States
  const [analysis, setAnalysis] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Skill Gap configuration
  const [targetRole, setTargetRole] = useState(PREDEFINED_ROLES[0]);
  const [customRole, setCustomRole] = useState('');

  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);

    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', u.id)
      .order('updated_at', { ascending: false });

    setPortfolios(data || []);
    if (data && data.length > 0) {
      setSelectedPortfolioId(data[0].id);
      setResumeText(generateResumeTextFromData(data[0].data));
    }
    setLoading(false);
  };

  const generateResumeTextFromData = (data: any) => {
    if (!data) return '';
    const name = data.name || '';
    const title = data.title || '';
    const summary = data.summary || '';
    const skills = Array.isArray(data.skills) ? data.skills.join(', ') : '';
    
    const experienceText = Array.isArray(data.experience)
      ? data.experience.map((exp: any) => 
          `${exp.role} at ${exp.company} (${exp.duration})\n${exp.description || ''}\nAchievements: ${Array.isArray(exp.achievements) ? exp.achievements.join('; ') : ''}`
        ).join('\n\n')
      : '';

    const educationText = Array.isArray(data.education)
      ? data.education.map((edu: any) => `${edu.degree} from ${edu.institution} (${edu.duration})`).join('\n')
      : '';

    return `${name}\n${title}\n\nSUMMARY:\n${summary}\n\nSKILLS:\n${skills}\n\nEXPERIENCE:\n${experienceText}\n\nEDUCATION:\n${educationText}`;
  };

  const handlePortfolioChange = (e: any) => {
    const id = e.target.value;
    setSelectedPortfolioId(id);
    const p = portfolios.find(item => item.id === id);
    if (p) {
      setResumeText(generateResumeTextFromData(p.data));
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      toast.error('Please input or generate some resume text first');
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    setCoverLetter('');

    try {
      const res = await fetch('/api/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ATS analysis failed');
      setAnalysis(data.result);
      toast.success('ATS Analysis completed!');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSkillGapAudit = async () => {
    const p = portfolios.find(item => item.id === selectedPortfolioId);
    const skillsList = p?.data?.skills || (resumeText.match(/[a-zA-Z\d+#.]+/g) || []);
    const role = customRole.trim() || targetRole;

    if (!role) {
      toast.error('Please specify a target role');
      return;
    }

    setAuditingGap(true);
    setGapAnalysis(null);

    try {
      const res = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills: skillsList, targetRole: role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed');
      setGapAnalysis(data.result);
      toast.success('Skill gap audit completed!');
    } catch (err: any) {
      toast.error(err.message || 'Audit failed');
    } finally {
      setAuditingGap(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    const p = portfolios.find(item => item.id === selectedPortfolioId);
    const skillsList = p?.data?.skills || (resumeText.match(/[a-zA-Z\d+#.]+/g) || []);
    const role = customRole.trim() || targetRole;

    if (!role) {
      toast.error('Please specify a target role');
      return;
    }

    setGeneratingRoadmap(true);
    setRoadmapData(null);

    try {
      const res = await fetch('/api/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills: skillsList, targetRole: role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap');
      setRoadmapData(data.result);
      toast.success('Career Roadmap generated!');
    } catch (err: any) {
      toast.error(err.message || 'Roadmap generation failed');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first');
      return;
    }
    
    const p = portfolios.find(item => item.id === selectedPortfolioId);
    const pData = p ? p.data : { summary: resumeText };

    setGeneratingLetter(true);
    setCoverLetter('');

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData: pData, jobDescription })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter');
      setCoverLetter(data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err: any) {
      toast.error(err.message || 'Cover letter generation failed');
    } finally {
      setGeneratingLetter(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
    toast.success('Copied cover letter to clipboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col justify-between p-6 glass-strong shrink-0">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-md"><span className="gradient-text">Folio</span><span className="text-white">AI</span></span>
          </Link>

          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[11px] text-slate-500">
            <span className="text-slate-300 font-semibold block mb-0.5">Beta Version</span>
            Let us know if you find any issues with parsing.
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Career Accelerator Hub</h1>
            <p className="text-sm text-slate-500">Evaluate ATS scores, audit skill gaps, and generate AI roadmap guides.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Resume Source Data
              </h2>

              <div className="space-y-4">
                {portfolios.length > 0 && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Select Portfolio Data</label>
                    <select
                      value={selectedPortfolioId}
                      onChange={handlePortfolioChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {portfolios.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Resume Text (Parsed)</label>
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    rows={12}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                    placeholder="Paste your plain resume text here..."
                  />
                </div>
              </div>
            </div>

            {activeTab === 'ats' ? (
              <div className="bento-card p-6">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan-400" /> Target Job Description (Optional)
                </h2>
                <div>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Paste the target job posting to analyze keyword density and match recommendations..."
                  />
                </div>
              </div>
            ) : (
              <div className="bento-card p-6 space-y-4">
                <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" /> Target Career Role
                </h2>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Select Career Direction</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors mb-3"
                  >
                    {PREDEFINED_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Or Specify Custom Role</label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    className="input-field w-full text-xs"
                    placeholder="e.g. Flutter Developer, Cloud Architect"
                  />
                </div>
              </div>
            )}

            {activeTab === 'ats' ? (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full btn-primary py-3 justify-center text-sm font-semibold rounded-xl"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {analyzing ? 'Analyzing Resume...' : 'Analyze Compatibility'}
              </button>
            ) : activeTab === 'gap' ? (
              <button
                onClick={handleSkillGapAudit}
                disabled={auditingGap}
                className="w-full btn-primary py-3 justify-center text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-emerald-500/20"
              >
                {auditingGap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                {auditingGap ? 'Auditing Skills...' : 'Audit Skill Gap'}
              </button>
            ) : (
              <button
                onClick={handleGenerateRoadmap}
                disabled={generatingRoadmap}
                className="w-full btn-primary py-3 justify-center text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:shadow-indigo-500/20"
              >
                {generatingRoadmap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                {generatingRoadmap ? 'Charting Pathway...' : 'Generate Roadmap'}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs Selector */}
            <div className="flex gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl">
              {[
                { id: 'ats',     label: 'ATS Scorecard', icon: FileText,  color: 'text-indigo-400' },
                { id: 'gap',     label: 'Skill Gap Audit', icon: Award,     color: 'text-emerald-400' },
                { id: 'roadmap', label: 'Career Roadmap', icon: Compass,   color: 'text-violet-400' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as TabType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === t.id
                      ? 'bg-slate-950 text-white shadow'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Tab 1: ATS SCORECARD */}
              {activeTab === 'ats' && (
                <motion.div
                  key="ats-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {!analysis && !analyzing && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                        <Info className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Ready to Audit</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Enter your resume text and target Job Description on the left, then click "Analyze Compatibility".
                      </p>
                    </div>
                  )}

                  {analyzing && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                      <h3 className="font-bold text-white text-lg mb-2">Running Parser Simulation</h3>
                      <p className="text-sm text-slate-500 max-w-xs">
                        Simulating ATS layout checks and checking keyword density with GPT-4o...
                      </p>
                    </div>
                  )}

                  {analysis && !analyzing && (
                    <>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bento-card p-6 flex flex-col items-center justify-center text-center sm:col-span-1">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">ATS Score</span>
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                              <circle
                                cx="48" cy="48" r="40"
                                stroke="url(#atsGrad)" strokeWidth="6" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (analysis.score || 70)) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="text-2xl font-black text-white">{analysis.score}<span className="text-xs text-slate-500 font-normal">/100</span></span>
                          </div>
                        </div>

                        <div className="bento-card p-6 sm:col-span-2 flex flex-col justify-center">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Layout Compatibility</span>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-black text-emerald-400">{analysis.layoutCompatibility?.score}%</span>
                            <span className="text-xs text-slate-400">Parsing stability rating</span>
                          </div>
                          <div className="space-y-2">
                            {analysis.layoutCompatibility?.issues?.length > 0 ? (
                              analysis.layoutCompatibility.issues.map((issue: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{issue}</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" /> Perfect layout parsing compatibility!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bento-card p-6">
                          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Formatting Checks</h3>
                          <div className="space-y-3">
                            {analysis.formattingChecks?.map((chk: any) => (
                              <div key={chk.name} className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-white truncate">{chk.name}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{chk.details}</div>
                                </div>
                                {chk.pass ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bento-card p-6">
                          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Keyword matches</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywordAnalysis?.foundKeywords?.map((kw: string) => (
                              <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                {kw}
                              </span>
                            ))}
                            {analysis.keywordAnalysis?.missingKeywords?.map((kw: string) => (
                              <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bento-card p-6">
                        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Recommendations</h3>
                        <ul className="space-y-2">
                          {analysis.recommendations?.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">{idx + 1}</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {jobDescription && (
                        <div className="bento-card p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-white text-sm">Cover Letter Generator</h3>
                              <p className="text-[11px] text-slate-500">Auto-tailor a cover letter based on your matched experience.</p>
                            </div>
                            <button
                              onClick={handleGenerateCoverLetter}
                              disabled={generatingLetter}
                              className="btn-primary text-xs py-2"
                            >
                              {generatingLetter ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              {generatingLetter ? 'Generating...' : 'Generate Letter'}
                            </button>
                          </div>

                          {coverLetter && (
                            <div className="bg-slate-950 border border-white/5 rounded-xl p-4 relative">
                              <button
                                onClick={copyCoverLetter}
                                className="absolute top-3 right-3 p-1.5 bg-slate-900 border border-white/10 rounded hover:text-white text-slate-400 transition-colors"
                              >
                                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <pre className="text-xs text-slate-400 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-8">
                                {coverLetter}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Tab 2: SKILL GAP AUDIT */}
              {activeTab === 'gap' && (
                <motion.div
                  key="gap-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {!gapAnalysis && !auditingGap && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                        <Award className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Audit Skill Gaps</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Select your target career path on the left and click "Audit Skill Gap" to identify missing tools and technologies.
                      </p>
                    </div>
                  )}

                  {auditingGap && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                      <h3 className="font-bold text-white text-lg mb-2">Comparing Competencies</h3>
                      <p className="text-sm text-slate-500 max-w-xs">
                        Comparing current skills against professional tech stack taxonomy...
                      </p>
                    </div>
                  )}

                  {gapAnalysis && !auditingGap && (
                    <>
                      {/* Gap match score ring */}
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bento-card p-6 flex flex-col items-center justify-center text-center sm:col-span-1">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Role Match</span>
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                              <circle
                                cx="48" cy="48" r="40"
                                stroke="url(#gapGrad)" strokeWidth="6" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (gapAnalysis.matchPercentage || 50)) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="text-2xl font-black text-white">{gapAnalysis.matchPercentage || 0}%</span>
                          </div>
                        </div>

                        <div className="bento-card p-6 sm:col-span-2 flex flex-col justify-center">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Core Strengths Detected</span>
                          <div className="flex flex-wrap gap-2">
                            {gapAnalysis.strengths?.map((str: string) => (
                              <span key={str} className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                {str}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Missing skills list */}
                      <div className="bento-card p-6">
                        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Missing Skills & Tools</h3>
                        <div className="space-y-4">
                          {gapAnalysis.missingSkills?.map((ms: any, idx: number) => (
                            <div key={idx} className="flex gap-3 p-3 bg-white/3 border border-white/5 rounded-xl items-start">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 mt-0.5 ${
                                ms.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                                ms.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                                'bg-slate-500/10 text-slate-400 border border-slate-500/25'
                              }`}>
                                {ms.priority}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white">{ms.skill}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{ms.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Tab 3: CAREER ROADMAP */}
              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {!roadmapData && !generatingRoadmap && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/20">
                        <Compass className="w-8 h-8 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Build Career Roadmap</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Enter your target role on the left and click "Generate Roadmap" to chart out a step-by-step technical learning pathway.
                      </p>
                    </div>
                  )}

                  {generatingRoadmap && (
                    <div className="bento-card p-8 flex flex-col items-center justify-center text-center h-[430px]">
                      <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                      <h3 className="font-bold text-white text-lg mb-2">Charting Pathway Guide</h3>
                      <p className="text-sm text-slate-500 max-w-xs">
                        Synthesizing step-by-step milestones and study project suggestions...
                      </p>
                    </div>
                  )}

                  {roadmapData && !generatingRoadmap && (
                    <div className="space-y-6">
                      <div className="bento-card p-6">
                        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-5 border-b border-white/5 pb-2">
                          Transition Guide to {roadmapData.targetRole}
                        </h3>

                        {/* Interactive Timeline layout */}
                        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-white/5 pl-8">
                          {roadmapData.roadmap?.map((step: any, idx: number) => (
                            <div key={idx} className="relative group">
                              {/* Step circle indicator */}
                              <div className="absolute -left-11 w-6 h-6 rounded-full bg-slate-900 border-2 border-violet-500 flex items-center justify-center text-[10px] font-bold text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-md">
                                {step.step || (idx + 1)}
                              </div>

                              <div className="bento-card p-5 space-y-3">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                  <div>
                                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                                    <span className="text-[10px] font-medium text-slate-500">{step.duration}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {step.skills?.map((sk: string) => (
                                    <span key={sk} className="px-2 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/15">
                                      {sk}
                                    </span>
                                  ))}
                                </div>

                                <div className="text-xs text-slate-400 leading-relaxed">
                                  <span className="font-bold text-slate-300 block mb-0.5">Recommended Project:</span>
                                  {step.project}
                                </div>

                                <div className="text-xs text-slate-500 leading-relaxed border-t border-white/3 pt-2">
                                  <span className="font-semibold text-slate-400 block mb-0.5">Target Milestone:</span>
                                  {step.milestone}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* SVG Gradients definitions */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="gapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
