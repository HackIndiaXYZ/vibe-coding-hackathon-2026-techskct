'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Loader2, Zap, TrendingUp, AlertCircle, CheckCircle2, Star, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RecruiterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
      if (!data) { router.push('/dashboard'); return; }
      setPortfolio(data);
    };
    load();
  }, []);

  const runSimulation = async () => {
    if (!portfolio?.data) return;
    setLoading(true);
    try {
      const res = await fetch('/api/recruiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData: portfolio.data }),
      });
      const data = await res.json();
      setReport(data.report);
    } catch {}
    setLoading(false);
  };

  const scoreColor = (s: number) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-rose-400';
  const scoreGlow  = (s: number) => s >= 80 ? 'glow-emerald' : s >= 60 ? 'glow-amber' : 'glow-rose';

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <Link href={`/editor/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Editor
        </Link>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">AI Recruiter Simulation</span>
        </div>
      </div>

      <div className="container-page py-12">
        {!report ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg mx-auto"
          >
            <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 glow-cyan">
              <Bot className="w-12 h-12 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">AI Recruiter <span className="gradient-text">Simulation</span></h1>
            <p className="text-slate-400 leading-relaxed mb-8">
              Get an honest hiring assessment from an AI trained on real recruiter patterns. Receive a score, detailed feedback, and job matches.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: '🎯', label: 'Hiring Score 0-100' },
                { icon: '💡', label: 'Strengths & Gaps' },
                { icon: '💼', label: 'Job Matches' },
              ].map(f => (
                <div key={f.label} className="bento-card p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-xs text-slate-400">{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={runSimulation}
              disabled={loading || !portfolio}
              className="btn-primary btn-lg glow-md"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              {loading ? 'Analyzing Portfolio…' : 'Run AI Simulation'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {/* Score ring */}
            <div className="bento-card p-8 text-center">
              <div className={`text-8xl font-black mb-2 ${scoreColor(report.score)}`}>{report.score}</div>
              <div className="text-slate-400 text-sm mb-4">out of 100</div>
              <p className="text-white font-semibold text-lg">{report.verdict}</p>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">{report.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bento-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white">Strengths</h3>
                </div>
                <ul className="space-y-2.5">
                  {report.strengths?.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div className="bento-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white">Areas to Improve</h3>
                </div>
                <ul className="space-y-2.5">
                  {report.gaps?.map((g: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Job matches */}
            {report.jobMatches?.length > 0 && (
              <div className="bento-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white">Job Matches</h3>
                </div>
                <div className="space-y-3">
                  {report.jobMatches.map((j: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 glass rounded-xl">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{j.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{j.reason}</div>
                      </div>
                      <div className={`text-sm font-bold ${j.match >= 80 ? 'text-emerald-400' : j.match >= 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {j.match}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Link href={`/editor/${id}`} className="btn-secondary btn-lg">Back to Editor</Link>
              <button onClick={runSimulation} className="btn-primary btn-lg">
                <Bot className="w-5 h-5" /> Run Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
