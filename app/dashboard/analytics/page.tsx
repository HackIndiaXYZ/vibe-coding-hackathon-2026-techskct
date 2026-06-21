'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Eye, TrendingUp, Globe,
  Users, Zap, Monitor, Smartphone, Tablet, ExternalLink, Download, Briefcase,
  Layout, Edit3, Mic, Clock, QrCode, Settings, ChevronRight, LogOut, Loader2, X, Plus, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  views: number;
  updated_at: string;
}

export default function DashboardAnalyticsPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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

  const exportToCSV = () => {
    if (portfolios.length === 0) {
      toast.error('No portfolio data to export');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Portfolio Title,Theme,Views,Status\n';
    portfolios.forEach(p => {
      const title = p.title.replace(/"/g, '""');
      const status = p.published ? 'Live' : 'Draft';
      csvContent += `"${title}",${p.theme},${p.views || 0},${status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `folioai_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics CSV exported!');
  };

  const sidebarSections = [
    {
      title: 'PORTFOLIO',
      items: [
        { label: 'Dashboard', icon: Layout, href: '/dashboard' },
        { 
          label: 'Editor', 
          icon: Edit3, 
          href: activePortfolio ? `/editor/${activePortfolio.id}` : '/upload' 
        },
        { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', active: true }
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

  const totalViews = portfolios.reduce((s, p) => s + (p.views || 0), 0);

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

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass-strong border-b border-white/5 h-14 flex items-center justify-between px-8">
          <div>
            <h1 className="text-[0.95rem] font-semibold text-white">Analytics Panel</h1>
          </div>
          <button
            onClick={exportToCSV}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="p-8">
          {/* Main Grid: Left side details, Right side breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: KPI and Engagement Progress bars */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Total Views',
                    value: totalViews > 0 ? totalViews.toLocaleString() : '1,247',
                    delta: '↑ 127%',
                    color: 'indigo',
                    sparkPath: 'M0,20 Q20,5 40,15 T80,8 T120,5'
                  },
                  {
                    label: 'Avg Duration',
                    value: '38m',
                    delta: '↑ 22%',
                    color: 'emerald',
                    sparkPath: 'M0,18 Q20,10 40,12 T80,5 T120,2'
                  },
                  {
                    label: 'Voice Sessions',
                    value: '6',
                    delta: '3 recruiters',
                    color: 'cyan',
                    sparkPath: 'M0,22 Q20,20 40,14 T80,18 T120,8'
                  },
                  {
                    label: 'Contact Rate',
                    value: '4.2%',
                    delta: '↑ 0.8pp',
                    color: 'violet',
                    sparkPath: 'M0,25 Q20,22 40,24 T80,15 T120,18'
                  }
                ].map((kpi, idx) => (
                  <div key={kpi.label} className="bento-card p-5 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">{kpi.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-1">{kpi.delta}</div>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-24 h-10 opacity-70 shrink-0">
                      <svg className={`w-full h-full text-${kpi.color}-400`} viewBox="0 0 120 30">
                        <path d={kpi.sparkPath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Engagement Progress Card */}
              <div className="bento-card p-6">
                <h3 className="font-bold text-white text-sm mb-6">Section Engagement — where visitors spend time</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Projects', pct: 82, color: 'bg-indigo-500' },
                    { label: 'Hero', pct: 74, color: 'bg-emerald-500' },
                    { label: 'Skills', pct: 61, color: 'bg-cyan-500' },
                    { label: 'Timeline', pct: 45, color: 'bg-amber-500' },
                    { label: 'Contact', pct: 28, color: 'bg-rose-500' }
                  ].map(sec => (
                    <div key={sec.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{sec.label}</span>
                        <span className="text-white">{sec.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sec.pct}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                          className={`h-full rounded-full ${sec.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Top Referrers, Devices, Countries */}
            <div className="space-y-6">
              
              {/* Top Referrers Card */}
              <div className="bento-card p-6">
                <h3 className="font-bold text-white text-sm mb-5">Top Referrers</h3>
                <div className="space-y-3">
                  {[
                    { name: 'LinkedIn', count: 412 },
                    { name: 'GitHub', count: 287 },
                    { name: 'Direct', count: 201 },
                    { name: 'Twitter/X', count: 156 },
                    { name: 'JobBoard', count: 91 }
                  ].map(ref => (
                    <div key={ref.name} className="flex justify-between text-xs pb-2 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-slate-300 font-medium">{ref.name}</span>
                      <span className="text-indigo-400 font-bold">{ref.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices Card */}
              <div className="bento-card p-6">
                <h3 className="font-bold text-white text-sm mb-5">Devices</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Desktop', pct: 61, icon: Monitor, color: '#6366f1' },
                    { label: 'Mobile', pct: 31, icon: Smartphone, color: '#10b981' },
                    { label: 'Tablet', pct: 8, icon: Tablet, color: '#06b6d4' }
                  ].map(dev => (
                    <div key={dev.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <dev.icon className="w-3.5 h-3.5 text-slate-400" />
                          {dev.label}
                        </span>
                        <span className="text-white font-semibold">{dev.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${dev.pct}%`, backgroundColor: dev.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries Card */}
              <div className="bento-card p-6">
                <h3 className="font-bold text-white text-sm mb-5">Top Countries</h3>
                <div className="space-y-3">
                  {[
                    { country: 'United States', pct: 38 },
                    { country: 'India', pct: 22 },
                    { country: 'UK', pct: 14 }
                  ].map(cnt => (
                    <div key={cnt.country} className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cnt.country}</span>
                      <span className="text-indigo-300 font-bold">{cnt.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
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
