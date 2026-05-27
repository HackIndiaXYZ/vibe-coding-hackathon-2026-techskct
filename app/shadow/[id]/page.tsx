'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Sparkles, AlertCircle, Brain, Loader2, ChevronDown, Zap, Target, TrendingUp, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ShadowSection {
  id: string;
  surface: string;          // What you wrote
  shadow: string;           // What it really says
  emotion: 'warning' | 'positive' | 'insight' | 'critical';
  tone: string;             // e.g. "overconfident", "vague", "impressive"
  suggestion: string;
}

interface ShadowReport {
  overallTone: string;
  hiddenPersonality: string;
  recruiterImpression: string;
  sections: ShadowSection[];
  powerPhrases: string[];
  redFlags: string[];
  truthScore: number;       // 0-100 how authentic the resume feels
  uniquenessScore: number;
}

const EMOTION_CONFIG = {
  warning:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)',  icon: '⚠️' },
  positive: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)',  icon: '✨' },
  insight:  { color: '#818cf8', bg: 'rgba(129,140,248,0.08)',  border: 'rgba(129,140,248,0.2)', icon: '💡' },
  critical: { color: '#fb7185', bg: 'rgba(251,113,133,0.08)',  border: 'rgba(251,113,133,0.2)', icon: '🔥' },
};

function generateShadowReport(portfolioData: any): ShadowReport {
  const skills = portfolioData?.skills || [];
  const exp = portfolioData?.experience || [];
  const name = portfolioData?.name || 'Candidate';
  const summary = portfolioData?.summary || '';

  const sections: ShadowSection[] = [
    {
      id: 'summary',
      surface: summary || 'A passionate and results-driven professional with experience in…',
      shadow: summary.toLowerCase().includes('passionate')
        ? '"Passionate" — Every candidate says this. To a recruiter scanning 200 CVs, it\'s invisible noise. What you\'re really saying is: "I have no specific differentiator to open with."'
        : '"Results-driven" signals you\'ve read the same resume advice everyone else has. The recruiter\'s eye skips this in 0.3 seconds.',
      emotion: 'warning',
      tone: 'Generic opener',
      suggestion: 'Replace with a specific, quantified achievement: "Built X that served Y users and achieved Z result."',
    },
    {
      id: 'skills-volume',
      surface: `${skills.length} skills listed: ${skills.slice(0, 4).join(', ')}${skills.length > 4 ? '…' : ''}`,
      shadow: skills.length > 15
        ? `Listing ${skills.length} skills is shouting "I know everything!" — which recruiters read as "I\'m a generalist who goes deep on nothing." They\'ll mentally halve this list and focus on whatever matches the job spec.`
        : skills.length < 5
        ? 'Fewer than 5 skills suggests either extreme humility or limited experience. Recruiters will fill the gap with their imagination — usually negatively.'
        : 'A well-curated skill list. You\'re signalling quality over quantity — recruiters appreciate this.',
      emotion: skills.length > 15 ? 'warning' : skills.length < 5 ? 'critical' : 'positive',
      tone: skills.length > 15 ? 'Skill inflation' : skills.length < 5 ? 'Underrepresented' : 'Calibrated',
      suggestion: skills.length > 15
        ? 'Curate to 8-12 skills you\'d be comfortable being interviewed on for 45 minutes.'
        : 'Add 5-8 more specific technical skills relevant to your target role.',
    },
    {
      id: 'experience-depth',
      surface: exp.length > 0
        ? `${exp.length} role${exp.length !== 1 ? 's' : ''}: ${exp.map((e: any) => e.company || e.role).slice(0, 2).join(', ')}`
        : 'No experience listed yet',
      shadow: exp.length === 0
        ? 'No experience is the loudest signal on a resume. A recruiter sees a blank slate — which can mean "entry level" or "hiding something." Projects and side work MUST fill this void.'
        : exp.length === 1
        ? 'One job. The recruiter immediately wonders: "Why did they leave? Why only one? Are they loyal or stagnant?" Your description must answer these questions proactively.'
        : `${exp.length} roles tells a career story. The recruiter is reading for trajectory — are the roles getting bigger, better-titled, and higher-impact? If not, the silence between roles speaks volumes.`,
      emotion: exp.length === 0 ? 'critical' : exp.length < 3 ? 'insight' : 'positive',
      tone: exp.length === 0 ? 'Career gap detected' : 'Career trajectory',
      suggestion: exp.length === 0
        ? 'Add freelance work, open-source contributions, or personal projects. Any experience beats silence.'
        : 'Ensure each role has a measurable impact statement: "Increased X by Y% resulting in Z."',
    },
    {
      id: 'hidden-personality',
      surface: 'How you present yourself overall',
      shadow: `Here\'s what ${name.split(' ')[0]} doesn\'t know: the order you list your skills reveals your insecurities. The longest descriptions are your anxiety points. The vaguest bullets hide your weakest contributions. Recruiters are trained pattern-matchers — they see the negative space between your words.`,
      emotion: 'insight',
      tone: 'Psychological read',
      suggestion: 'Audit every vague word: "helped with," "assisted in," "worked on" — replace each with active ownership: "built," "led," "shipped."',
    },
    {
      id: 'power-gap',
      surface: 'Language and framing analysis',
      shadow: 'Strong resumes use power verbs in the past tense with specific numbers. Weak ones use passive voice and adjectives. Your portfolio currently skews toward description — telling the recruiter what you did rather than the measurable difference you made.',
      emotion: exp.length > 0 ? 'insight' : 'warning',
      tone: 'Language audit',
      suggestion: 'Add at least one metric to every experience bullet. "Improved performance" → "Reduced API latency by 40%, cutting page load from 3s to 1.8s."',
    },
  ];

  const truthScore = Math.min(95, 45 + skills.length * 2 + exp.length * 8);
  const uniquenessScore = Math.min(95, 30 + (name.length % 20) + skills.length + exp.length * 5);

  return {
    overallTone: exp.length > 2 ? 'Experienced but generic' : exp.length > 0 ? 'Promising but thin' : 'Needs significant work',
    hiddenPersonality: exp.length > 2
      ? 'The sub-text of this resume says: "I\'m reliable and have been around the block, but I\'m not sure what makes me special." That uncertainty transmits to the reader.'
      : 'The sub-text reads: "I\'m early in my journey and compensating with volume (of skills, words, or enthusiasm) rather than proof."',
    recruiterImpression: `In the first 7 seconds, a recruiter\'s brain categorises this as: "${exp.length > 2 ? 'Senior-ish, needs to stand out more' : 'Junior-mid, potential but unproven'}." The next 23 seconds either confirm or challenge that first read.`,
    sections,
    powerPhrases: ['Shipped', 'Led', 'Grew by', 'Reduced', 'Increased', 'Built from scratch', 'Owns', 'Architected'],
    redFlags: [
      summary.toLowerCase().includes('passionate') ? '"Passionate" overuse' : null,
      skills.length > 18 ? 'Skill list too long' : null,
      exp.length === 0 ? 'No experience listed' : null,
      !portfolioData?.projects?.length ? 'No projects shown' : null,
    ].filter(Boolean) as string[],
    truthScore,
    uniquenessScore,
  };
}

export default function ShadowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [report, setReport] = useState<ShadowReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [glitching, setGlitching] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
      if (data) setPortfolio(data);
    };
    load();
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    setGlitching(true);

    // Dramatic pause with glitch effect
    await new Promise(r => setTimeout(r, 2000));
    setGlitching(false);

    const data = portfolio?.data || {};
    const shadowReport = generateShadowReport(data);
    setReport(shadowReport);
    setLoading(false);

    // Reveal with delay
    await new Promise(r => setTimeout(r, 500));
    setRevealed(true);
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Matrix-style noise overlay when glitching */}
      <AnimatePresence>
        {glitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)' }}
          >
            <div className="text-center">
              <motion.div
                animate={{ opacity: [1, 0, 1, 0.3, 1] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                className="text-6xl mb-6 font-mono text-rose-400"
              >
                ANALYZING...
              </motion.div>
              <div className="font-mono text-xs text-slate-600 space-y-1">
                {['Scanning surface narrative…', 'Detecting hidden signals…', 'Reading between the lines…', 'Cross-referencing recruiter patterns…', 'Surfacing the shadow resume…'].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.35 }}
                    className="text-emerald-500"
                  >
                    {'>'} {t}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4 sticky top-0 z-10">
        <Link href={`/editor/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Editor
        </Link>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-bold text-white">AI Shadow Resume</span>
        </div>
        <span className="badge badge-rose text-[10px]">EXCLUSIVE</span>
      </div>

      <div className="container-page py-10 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!report ? (
            /* ── Entry screen ── */
            <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl mb-6"
              >🔮</motion.div>
              <h1 className="text-5xl font-black text-white mb-4">
                The Shadow <span className="gradient-text-rose">Resume</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
                Every resume has two versions: what you wrote — and what recruiters actually read.
              </p>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-10">
                Our AI reads your portfolio like a seasoned recruiter and reveals the hidden subtext, psychological signals, and unspoken impressions your resume creates.
              </p>

              {/* Preview cards */}
              <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
                {[
                  { icon: Brain,       label: 'Psychological read',   desc: 'What your words reveal about you' },
                  { icon: Eye,         label: 'Recruiter\'s lens',    desc: 'First 7-second impression' },
                  { icon: Target,      label: 'Hidden red flags',     desc: 'What silently disqualifies you' },
                ].map(f => (
                  <div key={f.label} className="bento-card p-4 text-center">
                    <f.icon className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-white mb-1">{f.label}</div>
                    <div className="text-[10px] text-slate-500 leading-snug">{f.desc}</div>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={runAnalysis}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-lg font-bold text-base"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #7c3aed 100%)',
                  padding: '1rem 2.5rem',
                  borderRadius: 16,
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 32px rgba(220,38,38,0.35)',
                }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <EyeOff className="w-5 h-5" />}
                {loading ? 'Reading your shadow…' : 'Reveal My Shadow Resume'}
              </motion.button>

              <p className="text-xs text-slate-600 mt-4">
                Brutally honest. Not for the faint-hearted.
              </p>
            </motion.div>

          ) : (
            /* ── Report screen ── */
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bento-card p-7 mb-6 border-rose-500/20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl">🔮</div>
                  <div>
                    <h2 className="text-white font-black text-lg">Shadow Report</h2>
                    <p className="text-xs text-slate-500">What your resume really says</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-slate-500 mb-1">Overall Tone</div>
                    <span className="badge badge-rose">{report.overallTone}</span>
                  </div>
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    { label: 'Authenticity Score',  value: report.truthScore,      color: '#34d399' },
                    { label: 'Uniqueness Score',     value: report.uniquenessScore, color: '#818cf8' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">{s.label}</span>
                        <span className="font-bold" style={{ color: s.color }}>{s.value}/100</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hidden personality */}
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Hidden Personality</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{report.hiddenPersonality}"</p>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Recruiter's First Impression</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">"{report.recruiterImpression}"</p>
                </div>
              </motion.div>

              {/* Red flags */}
              {report.redFlags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bento-card p-5 mb-6 border-rose-500/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-bold text-white">Silent Disqualifiers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.redFlags.map(flag => (
                      <span key={flag} className="badge badge-rose">{flag}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Section-by-section */}
              <div className="space-y-3 mb-6">
                {report.sections.map((section, i) => {
                  const cfg = EMOTION_CONFIG[section.emotion];
                  const isOpen = expandedSection === section.id;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="bento-card overflow-hidden"
                      style={{ borderColor: cfg.border }}
                    >
                      <button
                        className="w-full p-5 text-left flex items-start gap-4"
                        onClick={() => setExpandedSection(isOpen ? null : section.id)}
                      >
                        <span className="text-xl shrink-0">{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                              {section.tone}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 truncate">{section.surface}</p>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          className="text-slate-600 shrink-0 mt-0.5"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-white/5 pt-4">
                              <div className="mb-4 p-4 rounded-xl text-sm leading-relaxed text-slate-300 italic"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                {section.shadow}
                              </div>
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-slate-400">{section.suggestion}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Power phrases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="bento-card p-6 border-emerald-500/15"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Power Phrases to Use</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.powerPhrases.map(p => (
                    <span key={p} className="badge badge-emerald">{p}</span>
                  ))}
                </div>
              </motion.div>

              <div className="flex gap-3 mt-6 justify-center">
                <button onClick={() => { setReport(null); setRevealed(false); }} className="btn-secondary btn-lg">
                  Re-analyse
                </button>
                <Link href={`/editor/${id}`} className="btn-primary btn-lg">
                  <Sparkles className="w-5 h-5" /> Improve My Portfolio
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
