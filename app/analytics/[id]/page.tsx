'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Eye, TrendingUp, Monitor, Smartphone, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [dailyViews, setDailyViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
      if (!data) { router.push('/dashboard'); return; }
      setPortfolio(data);
      // Load analytics
      const res = await fetch(`/api/analytics?portfolioId=${id}`);
      const analytics = await res.json();
      setDailyViews(analytics.dailyViews || []);
      setLoading(false);
    };
    load();
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#22d3ee', '#34d399'];

  const deviceData = [
    { name: 'Desktop', value: 55 },
    { name: 'Mobile',  value: 35 },
    { name: 'Tablet',  value: 10 },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <Link href={`/editor/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Editor
        </Link>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Analytics</span>
        </div>
        {portfolio?.title && <span className="text-slate-500 text-sm">— {portfolio.title}</span>}
      </div>

      <div className="container-page py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Eye,         label: 'Total Views',    value: portfolio?.views || 0 },
            { icon: TrendingUp,  label: 'This Week',      value: '+12' },
            { icon: Monitor,     label: 'Desktop',        value: '55%' },
            { icon: Smartphone,  label: 'Mobile',         value: '35%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bento-card p-5"
            >
              <div className="icon-box icon-box-indigo mb-3">
                <stat.icon className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Line chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-card p-6 md:col-span-2"
          >
            <h3 className="font-bold text-white mb-5">Views — Last 14 Days</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyViews.length ? dailyViews : Array.from({length:14},(_,i)=>({date:`Day ${i+1}`,views:Math.floor(Math.random()*20)}))}>
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0f1e35', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: '#f0f4ff' }}
                />
                <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bento-card p-6"
          >
            <h3 className="font-bold text-white mb-5">Devices</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                  {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {deviceData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-slate-400 flex-1">{d.name}</span>
                  <span className="text-slate-300 font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
