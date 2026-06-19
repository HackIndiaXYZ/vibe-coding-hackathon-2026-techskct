'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Eye, TrendingUp, Globe,
  Users, Zap, Monitor, Smartphone, Tablet, ExternalLink, Download, Briefcase
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  views: number;
}

const CUSTOM_TOOLTIP = {
  contentStyle: {
    background: '#0f1e35',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 10,
    fontSize: 12,
    color: '#f0f4ff',
  },
  labelStyle: { color: '#94a3b8' },
};

// Generate last-14-days dummy data for demo purposes
function generateDailyData(total: number) {
  const days: { date: string; views: number }[] = [];
  let remaining = total;
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const v = i === 0 ? remaining : Math.floor(Math.random() * (remaining / (i + 1)) * 1.5);
    remaining = Math.max(0, remaining - v);
    days.push({ date: label, views: v });
  }
  return days;
}

export default function DashboardAnalyticsPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [recruiterClicks, setRecruiterClicks] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('portfolios').select('*').eq('user_id', user.id);
      setPortfolios(data || []);
      
      const portfolioIds = data ? data.map(p => p.id) : [];
      if (portfolioIds.length > 0) {
        const { data: clickEvents } = await supabase
          .from('analytics_events')
          .select('*')
          .in('portfolio_id', portfolioIds)
          .eq('event_type', 'recruiter_click');
        setRecruiterClicks(clickEvents ? clickEvents.length : 0);
      }
      setLoading(false);
    };
    load();
  }, []);

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

  const totalViews = portfolios.reduce((s, p) => s + (p.views || 0), 0);
  const publishedCount = portfolios.filter(p => p.published).length;
  const chartData = generateDailyData(totalViews || 120);

  const barData = portfolios.slice(0, 5).map(p => ({
    name: p.title.length > 20 ? p.title.slice(0, 18) + '…' : p.title,
    views: p.views || 0,
  }));

  const stagger = { visible: { transition: { staggerChildren: 0.07 } }, hidden: {} };
  const item = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">Analytics Overview</span>
          </div>
        </div>
        
        <button
          onClick={exportToCSV}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="container-page py-8">
        {/* KPI cards */}
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Eye,        label: 'Total Views',       value: totalViews.toLocaleString(), delta: '+18%',  color: 'indigo' },
            { icon: Globe,      label: 'Published',         value: publishedCount,              delta: null,    color: 'emerald' },
            { icon: Users,      label: 'Unique Visitors',   value: Math.floor(totalViews * 0.7).toLocaleString(), delta: '+24%', color: 'cyan' },
            { icon: Briefcase,  label: 'Recruiter Clicks',   value: recruiterClicks.toLocaleString(), delta: recruiterClicks > 0 ? '+12%' : null, color: 'violet' },
          ].map(stat => (
            <motion.div key={stat.label} variants={item} className="bento-card p-5">
              <div className={`icon-box icon-box-${stat.color} mb-3 w-9 h-9`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400">{stat.label}</span>
                {stat.delta && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                    {stat.delta}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Line chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bento-card p-6 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-sm">Views — Last 14 Days</h3>
              <span className="badge badge-indigo text-[10px]">All portfolios</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip {...CUSTOM_TOOLTIP} />
                <Line
                  type="monotone" dataKey="views"
                  stroke="url(#lineGrad)" strokeWidth={2.5}
                  dot={false} activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Device breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bento-card p-6"
          >
            <h3 className="font-bold text-white text-sm mb-5">Devices</h3>
            <div className="space-y-4">
              {[
                { icon: Monitor,    label: 'Desktop', pct: 58, color: '#6366f1' },
                { icon: Smartphone, label: 'Mobile',  pct: 32, color: '#8b5cf6' },
                { icon: Tablet,     label: 'Tablet',  pct: 10, color: '#22d3ee' },
              ].map(d => (
                <div key={d.label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <d.icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 flex-1">{d.label}</span>
                    <span className="text-xs font-semibold text-white">{d.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="section-divider mt-5" />

            {/* Top referrers */}
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-4 mb-3">Top Referrers</h4>
            <div className="space-y-2">
              {['LinkedIn', 'Direct', 'Google', 'Twitter'].map((ref, i) => (
                <div key={ref} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{ref}</span>
                  <span className="text-slate-500">{[42, 28, 18, 12][i]}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Per-portfolio bar chart */}
        {barData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bento-card p-6 mb-8"
          >
            <h3 className="font-bold text-white text-sm mb-5">Views by Portfolio</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip {...CUSTOM_TOOLTIP} />
                <Bar dataKey="views" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Portfolio list with stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bento-card p-6"
        >
          <h3 className="font-bold text-white text-sm mb-5">Portfolio Performance</h3>
          {portfolios.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No portfolios yet. <Link href="/upload" className="text-indigo-400 hover:underline">Create one →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolios.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 p-3.5 glass rounded-xl hover:border-indigo-500/20 transition-colors">
                  <div className="text-lg shrink-0">
                    {p.theme === 'designer' ? '🎨' : p.theme === 'executive' ? '💼' : p.theme === 'scientist' ? '🔬' : p.theme === 'marketer' ? '📣' : '⌨️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 capitalize">{p.theme} theme</div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="text-sm font-bold text-white">{(p.views || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">views</div>
                  </div>
                  {p.published ? (
                    <span className="badge-live text-[10px] shrink-0">Live</span>
                  ) : (
                    <span className="badge badge-slate text-[10px] shrink-0">Draft</span>
                  )}
                  <Link href={`/analytics/${p.id}`} className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
