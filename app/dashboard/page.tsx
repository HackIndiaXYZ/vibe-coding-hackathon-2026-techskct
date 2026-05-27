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
  Layout, Clock, Users, Star
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
  { icon: Star,      label: 'Templates',   href: '/templates'           },
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
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
    // Close menu on outside click
    const fn = () => setMenuOpen(null);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser({ email: user.email!, name: user.user_metadata?.full_name || user.email!.split('@')[0] });
    const { data } = await supabase.from('portfolios').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    setPortfolios(data || []);
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
    setPortfolios(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
    toast.success('Portfolio deleted');
  };

  const togglePublish = async (portfolio: Portfolio) => {
    const { error } = await supabase.from('portfolios').update({ published: !portfolio.published }).eq('id', portfolio.id);
    if (!error) {
      setPortfolios(prev => prev.map(p => p.id === portfolio.id ? { ...p, published: !p.published } : p));
      toast.success(portfolio.published ? 'Unpublished' : '🚀 Portfolio is now live!');
    }
  };

  const totalViews = portfolios.reduce((s, p) => s + (p.views || 0), 0);
  const publishedCount = portfolios.filter(p => p.published).length;

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

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.active
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
            </Link>
          ))}
        </nav>

        {/* New portfolio button */}
        <div className="px-3 pb-3">
          <Link href="/upload" className="btn-primary w-full justify-center text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" />
            New Portfolio
          </Link>
        </div>

        {/* User */}
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
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
          </div>
          <Link href="/upload" className="btn-primary text-xs py-2">
            <Plus className="w-3.5 h-3.5" />
            New Portfolio
          </Link>
        </div>

        <div className="p-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: FileText,   label: 'Total Portfolios', value: portfolios.length,              sub: 'All time',        color: 'indigo' },
              { icon: Globe,      label: 'Published',         value: publishedCount,                 sub: `${portfolios.length - publishedCount} drafts`, color: 'emerald' },
              { icon: Eye,        label: 'Total Views',       value: totalViews.toLocaleString(),    sub: 'Across all',      color: 'cyan' },
              { icon: TrendingUp, label: 'Growth',            value: '+24%',                         sub: 'vs last month',   color: 'violet' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bento-card p-5"
              >
                <div className={`icon-box icon-box-${stat.color} mb-3`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-medium text-slate-300 mt-0.5">{stat.label}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Your Portfolios</h2>
              <p className="text-xs text-slate-500 mt-0.5">{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Empty state */}
          {portfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bento-card p-16 text-center"
            >
              <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 glow-md">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Create your first portfolio</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                Upload your resume and let AI transform it into a stunning portfolio website in under 60 seconds.
              </p>
              <Link href="/upload" className="btn-primary btn-lg glow-md">
                <Upload className="w-5 h-5" />
                Upload Resume & Get Started
              </Link>
            </motion.div>
          ) : (
            <div className="portfolio-grid">
              {/* New portfolio card */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link
                  href="/upload"
                  className="bento-card h-full min-h-52 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 border-dashed transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">New Portfolio</p>
                    <p className="text-xs mt-1 text-slate-600">Upload a resume</p>
                  </div>
                </Link>
              </motion.div>

              {/* Portfolio cards */}
              <AnimatePresence>
                {portfolios.map((portfolio, i) => {
                  const theme = THEME_CONFIG[portfolio.theme] || THEME_CONFIG.developer;
                  return (
                    <motion.div
                      key={portfolio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bento-card group relative overflow-hidden"
                    >
                      {/* Theme banner */}
                      <div className={`h-28 bg-gradient-to-br ${theme.from} ${theme.to} relative overflow-hidden flex items-end p-4`}>
                        <div className="absolute inset-0 opacity-20 grid-pattern" />
                        <span className="text-3xl relative z-10">{theme.icon}</span>
                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          {portfolio.published
                            ? <span className="badge-live text-[10px]">Live</span>
                            : <span className="badge badge-slate text-[10px]">Draft</span>
                          }
                        </div>
                        {/* Menu button */}
                        <div className="absolute top-3 left-3">
                          <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === portfolio.id ? null : portfolio.id); }}
                            className="w-7 h-7 glass rounded-lg flex items-center justify-center text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown */}
                          <AnimatePresence>
                            {menuOpen === portfolio.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={e => e.stopPropagation()}
                                className="absolute left-0 top-9 w-44 glass-strong rounded-xl border border-white/10 overflow-hidden z-50 shadow-xl"
                              >
                                <Link href={`/editor/${portfolio.id}`} className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                  <Edit3 className="w-3.5 h-3.5" />Edit Portfolio
                                </Link>
                                <Link href={`/analytics/${portfolio.id}`} className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                  <BarChart3 className="w-3.5 h-3.5" />View Analytics
                                </Link>
                                <button onClick={() => togglePublish(portfolio)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                  <Globe className="w-3.5 h-3.5" />{portfolio.published ? 'Unpublish' : 'Publish'}
                                </button>
                                {portfolio.published && (
                                  <a href={`/portfolio/${portfolio.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />View Live
                                  </a>
                                )}
                                <div className="h-px bg-white/8 mx-2" />
                                <button
                                  onClick={() => handleDelete(portfolio.id)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                                  disabled={deletingId === portfolio.id}
                                >
                                  {deletingId === portfolio.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Content */}
                      <Link href={`/editor/${portfolio.id}`} className="block p-5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-white text-sm truncate group-hover:gradient-text transition-all">
                            {portfolio.title || 'Untitled Portfolio'}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 capitalize">{theme.tag} theme</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />{portfolio.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /><TimeAgo date={portfolio.updated_at} />
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                          <button
                            onClick={e => { e.preventDefault(); router.push(`/editor/${portfolio.id}`); }}
                            className="btn-secondary flex-1 justify-center text-xs py-2"
                          >
                            <Edit3 className="w-3 h-3" />Edit
                          </button>
                          <button
                            onClick={e => { e.preventDefault(); togglePublish(portfolio); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-semibold transition-all ${
                              portfolio.published
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20'
                                : 'gradient-bg text-white hover:opacity-90'
                            }`}
                          >
                            <Globe className="w-3 h-3" />
                            {portfolio.published ? 'Live' : 'Publish'}
                          </button>
                          <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(portfolio.id); }}
                            disabled={deletingId === portfolio.id}
                            title="Delete portfolio"
                            className="w-9 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all shrink-0"
                          >
                            {deletingId === portfolio.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
