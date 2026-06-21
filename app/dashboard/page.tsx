'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Plus, BarChart3, Globe, LogOut, Eye, Edit3,
  Trash2, ExternalLink, Upload, Loader2, TrendingUp,
  Sparkles, FileText, Settings, ChevronRight, MoreHorizontal,
  Layout, Clock, Users, Star, Briefcase, QrCode, X, Mic
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Portfolio {
  id: string;
  slug: string;
  title: string;
  theme: string;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

const THEME_CONFIG: Record<string, { icon: string; from: string; to: string; accent: string; tag: string }> = {
  developer: { icon: '⌨️', from: 'from-cyan-600',    to: 'to-blue-700',   accent: '#22d3ee', tag: 'Developer' },
  designer:  { icon: '🎨', from: 'from-pink-600',    to: 'to-purple-700', accent: '#f472b6', tag: 'Designer' },
  executive: { icon: '💼', from: 'from-amber-600',   to: 'to-orange-700', accent: '#fbbf24', tag: 'Executive' },
  scientist: { icon: '🔬', from: 'from-emerald-600', to: 'to-teal-700',   accent: '#34d399', tag: 'Scientist' },
  marketer:  { icon: '📣', from: 'from-orange-600',  to: 'to-red-700',    accent: '#fb923c', tag: 'Marketer' },
};

const NAV_ITEMS = [
  { icon: Layout,    label: 'Portfolios',  href: '/dashboard',          active: true },
  { icon: BarChart3, label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: FileText,  label: 'ATS Checker', href: '/dashboard/ats'       },
  { icon: Briefcase, label: 'Recruiter Hub', href: '/dashboard/recruiter' },
  { icon: Settings,  label: 'Settings',    href: '/dashboard/settings'  },
];

function TimeAgo({ date }: { date: string }) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return <>just now</>;
  if (diff < 3600) return <>{Math.floor(diff / 60)}m ago</>;
  if (diff < 86400) return <>{Math.floor(diff / 3600)}h ago</>;
  return <>{Math.floor(diff / 86400)}d ago</>;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);

  // LinkedIn generate states
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [generatingLinkedIn, setGeneratingLinkedIn] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const router = useRouter();
  const supabase = createClient();

  const generationSteps = [
    'Connecting to Profile...',
    'Extracting experience & education...',
    'Aligning professional theme...',
    'Generating custom project descriptions...',
    'Creating live portfolio...'
  ];

  useEffect(() => {
    loadData();
    const fn = () => setMenuOpen(null);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser({ email: user.email!, name: user.user_metadata?.full_name || user.email!.split('@')[0] });
    const { data } = await supabase.from('portfolios').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    const list = data || [];
    setPortfolios(list);
    if (list.length > 0) {
      setActivePortfolio(list[0]);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio permanently?')) return;
    setDeletingId(id);
    await supabase.from('portfolios').delete().eq('id', id);
    const updated = portfolios.filter(p => p.id !== id);
    setPortfolios(updated);
    if (activePortfolio?.id === id) {
      setActivePortfolio(updated.length > 0 ? updated[0] : null);
    }
    setDeletingId(null);
    toast.success('Portfolio deleted');
  };

  const togglePublish = async (portfolio: Portfolio) => {
    const { error } = await supabase.from('portfolios').update({ published: !portfolio.published }).eq('id', portfolio.id);
    if (!error) {
      const updated = portfolios.map(p => p.id === portfolio.id ? { ...p, published: !p.published } : p);
      setPortfolios(updated);
      if (activePortfolio?.id === portfolio.id) {
        setActivePortfolio({ ...activePortfolio, published: !activePortfolio.published });
      }
      toast.success(portfolio.published ? 'Unpublished' : '🚀 Portfolio is now live!');
    }
  };

  const handleLinkedInGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl) {
      toast.error('Please enter a valid LinkedIn URL');
      return;
    }
    setGeneratingLinkedIn(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    try {
      const res = await fetch('/api/linkedin-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkedinUrl, userId: (await supabase.auth.getUser()).data.user?.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      clearInterval(stepInterval);
      toast.success('Portfolio generated from LinkedIn successfully!');
      router.push(`/editor/${data.portfolioId}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      toast.error(err.message || 'Generation failed');
    } finally {
      setGeneratingLinkedIn(false);
    }
  };

  // Static mock daily views data for chart representation (last 14 days)
  const dailyViews = [24, 38, 28, 48, 42, 34, 58, 62, 52, 68, 74, 69, 78, 92];

  const sidebarSections = [
    {
      title: 'PORTFOLIO',
      items: [
        { label: 'Dashboard', icon: Layout, href: '/dashboard', active: true },
        { 
          label: 'Editor', 
          icon: Edit3, 
          href: activePortfolio ? `/editor/${activePortfolio.id}` : '/upload' 
        },
        { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' }
      ]
    },
    {
      title: 'AI TOOLS',
      items: [
        { label: 'Recruiter AI', icon: Users, href: '/dashboard/recruiter' },
        { label: 'Voice Mode', icon: Mic, href: '/dashboard/voice' },
        { label: 'AI Timeline', icon: Clock, href: '/dashboard/ats' }
      ]
    },
    {
      title: 'PUBLISH',
      items: [
        { 
          label: 'Publish', 
          icon: Globe, 
          onClick: () => {
            if (activePortfolio) {
              togglePublish(activePortfolio);
            } else {
              toast.error('No active portfolio');
            }
          } 
        },
        { 
          label: 'QR Card', 
          icon: QrCode, 
          onClick: () => {
            if (activePortfolio && activePortfolio.published) {
              setQrUrl(window.location.origin + `/portfolio/${activePortfolio.slug}`);
            } else {
              toast.error(activePortfolio ? 'Publish your portfolio to view QR Code' : 'No active portfolio');
            }
          }
        },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center glow-sm animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <p className="text-slate-500 text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-60 glass-strong border-r border-white/5 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center group-hover:glow-xs transition-all">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[0.95rem]">
              <span className="gradient-text">Folio</span><span className="text-white">AI</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Navigation Sections */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {sidebarSections.map(section => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">{section.title}</div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const content = (
                    <>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                    </>
                  );
                  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    item.active
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`;

                  if (item.onClick) {
                    return (
                      <button key={item.label} onClick={item.onClick} className={className}>
                        {content}
                      </button>
                    );
                  }
                  return (
                    <Link key={item.label} href={item.href || '#'} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-600 hover:text-rose-400 transition-colors shrink-0" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass-strong border-b border-white/5 h-14 flex items-center justify-between px-8">
          <div>
            <h1 className="text-[0.95rem] font-semibold text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/upload" className="btn-secondary text-xs py-2 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Upload Resume
            </Link>
            <Link href="/upload" className="btn-primary text-xs py-2">
              <Plus className="w-3.5 h-3.5" /> New Portfolio
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Active Portfolio Header details */}
          {activePortfolio && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 glass rounded-2xl border border-white/5">
              <div>
                <h2 className="text-xl font-black text-white">{activePortfolio.title}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activePortfolio.published ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {activePortfolio.published ? 'Your portfolio is live' : 'Portfolio is in Draft mode'}
                  <span className="text-slate-600">•</span>
                  <span>Last updated <TimeAgo date={activePortfolio.updated_at} /></span>
                </p>
              </div>
              <div className="flex gap-2">
                {activePortfolio.published && (
                  <a
                    href={`/portfolio/${activePortfolio.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Live
                  </a>
                )}
                <Link
                  href={`/editor/${activePortfolio.id}`}
                  className="btn-primary text-xs px-4 py-2"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Portfolio
                </Link>
              </div>
            </div>
          )}

          {/* Stats grid row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Views', value: activePortfolio ? (activePortfolio.views || 0).toLocaleString() : '0', sub: '↑ 127% this week', color: 'indigo' },
              { label: 'Recruiter Score', value: activePortfolio ? '84' : '0', sub: 'Top 12% of profiles', color: 'emerald' },
              { label: 'Avg Time on Page', value: activePortfolio ? '38m' : '0m', sub: '↑ 22% vs last week', color: 'cyan' },
              { label: 'Voice Sessions', value: activePortfolio ? '6' : '0', sub: '3 recruiter visits', color: 'violet' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bento-card p-5"
              >
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-medium text-slate-300 mt-1">{stat.label}</div>
                <div className={`text-[10px] mt-1 font-semibold ${
                  stat.color === 'emerald' ? 'text-emerald-400' : 'text-indigo-400'
                }`}>{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart row & Details row */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Daily Views Bar Chart */}
            <div className="bento-card p-6 md:col-span-2">
              <h3 className="font-bold text-white text-sm mb-6">Daily views — last 14 days</h3>
              <div className="flex items-end justify-between h-40 pt-4 px-2">
                {dailyViews.map((views, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    {/* Tooltip */}
                    <div className="absolute mb-16 bg-slate-950 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {views} views
                    </div>
                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(views / 100) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.03 }}
                      className="w-4 sm:w-6 bg-indigo-600 hover:bg-indigo-400 rounded-t-md transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-4 px-1">
                <span>14 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Sidebar column: URL & Status */}
            <div className="flex flex-col gap-4">
              {/* Portfolio URL Card */}
              <div className="bento-card p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Portfolio URL</h4>
                  <div className="text-sm font-mono text-indigo-400 break-all select-all">
                    {activePortfolio 
                      ? `${window.location.host}/portfolio/${activePortfolio.slug}`
                      : 'Create a portfolio first'
                    }
                  </div>
                </div>
                {activePortfolio && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/portfolio/${activePortfolio.slug}`);
                      toast.success('URL copied to clipboard!');
                    }}
                    className="btn-secondary text-[10px] py-1.5 mt-4 justify-center w-full"
                  >
                    Copy Link
                  </button>
                )}
              </div>

              {/* Status Card */}
              <div className="bento-card p-5 flex items-center gap-4 border-l-2 border-emerald-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {activePortfolio?.published ? 'Published' : 'Draft Mode'}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {activePortfolio?.published ? 'Live since 3 days ago' : 'Edit to publish your portfolio'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn import Widget */}
          <div className="bento-card p-7 mb-8 border border-indigo-500/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-indigo-500" />
            </div>

            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Import from LinkedIn
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mb-6 leading-relaxed">
              Generate a premium portfolio directly from your LinkedIn profile URL. Our AI extracts your experience, education, and skills to construct your site in under 60 seconds.
            </p>

            <form onSubmit={handleLinkedInGenerate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="input-field flex-1 text-sm bg-slate-950/50 border border-white/10"
                disabled={generatingLinkedIn}
                required
              />
              <button
                type="submit"
                disabled={generatingLinkedIn}
                className="btn-primary shrink-0 justify-center text-sm py-2 px-6"
              >
                {generatingLinkedIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                  </>
                ) : (
                  'Generate Portfolio'
                )}
              </button>
            </form>

            {/* Simulated generation progress bar */}
            {generatingLinkedIn && (
              <div className="mt-5 space-y-2 max-w-xl">
                <div className="flex justify-between text-[10px] font-semibold text-indigo-300">
                  <span>{generationSteps[generationStep]}</span>
                  <span>{Math.round(((generationStep + 1) / generationSteps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* List of other portfolios */}
          {portfolios.length > 1 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-white mb-4">Switch Portfolio Workspace</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {portfolios.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePortfolio(p)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      activePortfolio?.id === p.id
                        ? 'bg-indigo-600/10 border-indigo-500/40'
                        : 'glass border-white/5 hover:border-white/15'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 capitalize">{p.theme} Theme</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* QR Code Share Modal */}
      <AnimatePresence>
        {qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl text-center relative"
            >
              <button
                onClick={() => setQrUrl(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-2">Share Portfolio QR</h3>
              <p className="text-xs text-slate-400 mb-6">Scan this QR code with a mobile camera to view the live portfolio.</p>
              
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner border border-white/5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}`}
                  alt="Portfolio QR Code"
                  className="w-40 h-40"
                />
              </div>

              <div className="flex gap-2 bg-slate-950 border border-white/5 p-2 rounded-xl text-xs text-slate-300 font-mono break-all justify-between items-center mb-4">
                <span className="truncate max-w-[200px]">{qrUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrUrl);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 shrink-0 font-sans font-semibold text-[10px] uppercase bg-indigo-500/10 px-2 py-1.5 rounded"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
