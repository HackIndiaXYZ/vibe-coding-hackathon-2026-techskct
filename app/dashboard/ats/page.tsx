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
  ArrowRight, Copy, Check, RefreshCw, Star, Info
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { icon: Layout,    label: 'Portfolios',  href: '/dashboard' },
  { icon: BarChart3, label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: FileText,  label: 'ATS Checker', href: '/dashboard/ats', active: true },
  { icon: Settings,  label: 'Settings',    href: '/dashboard/settings' },
];

export default function AtsCheckerPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [copiedLetter, setCopiedLetter] = useState(false);
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
      // Auto fill resume text from parsed experience/skills summaries
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
            <h1 className="text-2xl font-black text-white">ATS Compatibility Audit</h1>
            <p className="text-sm text-slate-500">Scan your resume against ATS algorithms and target job descriptions.</p>
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

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full btn-primary py-3 justify-center text-sm font-semibold rounded-xl"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? 'Analyzing Resume...' : 'Analyze Compatibility'}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {!analysis && !analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bento-card p-8 flex flex-col items-center justify-center text-center h-[500px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                    <Info className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">Ready to Audit</h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Enter your resume text and target Job Description on the left, then click "Analyze Compatibility".
                  </p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bento-card p-8 flex flex-col items-center justify-center text-center h-[500px]"
                >
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                  <h3 className="font-bold text-white text-lg mb-2">Running Parser Simulation</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Simulating ATS layout checks and checking keyword density with GPT-4o...
                  </p>
                </motion.div>
              )}

              {analysis && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Gauge score and general compatibility */}
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bento-card p-6 flex flex-col items-center justify-center text-center sm:col-span-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">ATS Score</span>
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="absolute w-full h-full transform -rotate-90">
                          <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="56" cy="56" r="48"
                            stroke="url(#atsGrad)" strokeWidth="8" fill="transparent"
                            strokeDasharray={301.6}
                            strokeDashoffset={301.6 - (301.6 * (analysis.score || 70)) / 100}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-3xl font-black text-white">{analysis.score}<span className="text-xs text-slate-500 font-normal">/100</span></span>
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

                  {/* Formatting checklist & keyword matches */}
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
                      <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Keyword density (Top)</h3>
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

                  {/* Actionable recommendations */}
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

                  {/* AI Cover letter generator panel */}
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
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
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
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
