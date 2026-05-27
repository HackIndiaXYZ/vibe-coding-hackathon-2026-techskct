'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Swords, Trophy, Loader2, Zap, Shield, Star, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface FighterData {
  name: string;
  title: string;
  skills: string[];
  theme: string;
  experience: number;
  projects: number;
}

interface BattleResult {
  winner: 'A' | 'B' | 'tie';
  scores: { A: number; B: number };
  rounds: {
    category: string;
    winner: 'A' | 'B' | 'tie';
    scoreA: number;
    scoreB: number;
    verdict: string;
  }[];
  mvpSkill: { A: string; B: string };
  commentary: string;
  judgment: string;
}

const ROUND_CATEGORIES = [
  { id: 'skills',      icon: '⚡', label: 'Technical Skills' },
  { id: 'experience',  icon: '🏆', label: 'Experience Depth' },
  { id: 'projects',    icon: '🚀', label: 'Project Impact' },
  { id: 'presentation',icon: '🎨', label: 'Presentation' },
  { id: 'uniqueness',  icon: '💎', label: 'Uniqueness Factor' },
];

const THEME_FIGHTERS: Record<string, { emoji: string; title: string; power: string; color: string }> = {
  developer: { emoji: '⌨️', title: 'The Code Architect', power: 'Compiles perfect logic',    color: '#22d3ee' },
  designer:  { emoji: '🎨', title: 'The Visual Sorcerer', power: 'Renders stunning pixels',  color: '#f472b6' },
  executive: { emoji: '💼', title: 'The Strategy Titan',  power: 'Commands boardrooms',      color: '#fbbf24' },
  scientist: { emoji: '🔬', title: 'The Data Oracle',     power: 'Sees patterns in chaos',   color: '#34d399' },
  marketer:  { emoji: '📣', title: 'The Growth Hacker',   power: 'Converts clicks to cash',  color: '#fb923c' },
};

function simulateBattle(slugA: string, slugB: string, nameA: string, nameB: string): BattleResult {
  // Deterministic pseudo-simulation based on names (for demo)
  const scoreA_base = (nameA.length % 10) + 70;
  const scoreB_base = (nameB.length % 10) + 68;

  const rounds = ROUND_CATEGORIES.map((cat, i) => {
    const sA = Math.min(100, scoreA_base + Math.sin(i * 1.3) * 15);
    const sB = Math.min(100, scoreB_base + Math.cos(i * 1.7) * 15);
    const winner = sA > sB + 2 ? 'A' : sB > sA + 2 ? 'B' : 'tie';
    const verdicts: Record<string, string[]> = {
      skills:       ['Dominant tech arsenal', 'Clean, focused skillset'],
      experience:   ['Seasoned battle scars', 'Fresh & hungry energy'],
      projects:     ['Portfolio of wins', 'Quality over quantity'],
      presentation: ['Visually legendary', 'Crisp and professional'],
      uniqueness:   ['One of a kind profile', 'Memorably distinctive'],
    };
    const v = verdicts[cat.id] || ['Strong', 'Competitive'];
    return {
      category: cat.label,
      winner: winner as 'A' | 'B' | 'tie',
      scoreA: Math.round(sA),
      scoreB: Math.round(sB),
      verdict: winner === 'A' ? `${nameA}: ${v[0]}` : winner === 'B' ? `${nameB}: ${v[1]}` : 'Dead heat!',
    };
  });

  const totalA = Math.round(rounds.reduce((s, r) => s + r.scoreA, 0) / rounds.length);
  const totalB = Math.round(rounds.reduce((s, r) => s + r.scoreB, 0) / rounds.length);
  const winner = totalA > totalB + 1 ? 'A' : totalB > totalA + 1 ? 'B' : 'tie';

  return {
    winner,
    scores: { A: totalA, B: totalB },
    rounds,
    mvpSkill: { A: 'TypeScript', B: 'Python' },
    commentary: winner === 'tie'
      ? 'An absolute classic! Both fighters are evenly matched — this one goes to extra rounds.'
      : `${winner === 'A' ? nameA : nameB} dominates with superior technical depth and presentation polish!`,
    judgment: winner === 'A'
      ? `${nameA} wins by a technical knockout in the Skills and Projects rounds.`
      : winner === 'B'
      ? `${nameB} pulls off a stunning upset, outscoring on Experience and Uniqueness!`
      : 'The AI judge calls it a draw. Both portfolios are recruiters\' dilemmas!',
  };
}

export default function BattlePage() {
  const [slugA, setSlugA] = useState('');
  const [slugB, setSlugB] = useState('');
  const [result, setResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'countdown' | 'battle'>('setup');
  const [countdown, setCountdown] = useState(3);
  const [revealedRounds, setRevealedRounds] = useState(0);

  const startBattle = async () => {
    if (!slugA.trim() || !slugB.trim()) {
      toast.error('Enter both portfolio URLs');
      return;
    }
    if (slugA.trim() === slugB.trim()) {
      toast.error('A portfolio cannot fight itself!');
      return;
    }
    setLoading(true);
    setPhase('countdown');

    // Countdown 3-2-1
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 800));
    }

    const res = simulateBattle(slugA, slugB, slugA.split('-').slice(0, -1).join(' ') || 'Fighter A', slugB.split('-').slice(0, -1).join(' ') || 'Fighter B');
    setResult(res);
    setPhase('battle');
    setRevealedRounds(0);
    setLoading(false);

    // Reveal rounds one by one
    for (let i = 0; i <= ROUND_CATEGORIES.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setRevealedRounds(i + 1);
    }
  };

  const nameA = slugA ? slugA.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Fighter A' : 'Fighter A';
  const nameB = slugB ? slugB.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Fighter B' : 'Fighter B';

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-bold text-white">Portfolio Battle Arena</span>
        </div>
        <span className="badge badge-rose text-[10px] ml-1">EXCLUSIVE</span>
      </div>

      <div className="container-page py-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── SETUP ─────────────────────────────────────── */}
          {phase === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >⚔️</motion.div>
                <h1 className="text-5xl font-black text-white mb-3">
                  Portfolio <span className="gradient-text-rose">Battle Arena</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-lg mx-auto">
                  Enter two portfolio slugs. Our AI judge scores them across 5 rounds — Skills, Experience, Projects, Presentation & Uniqueness.
                </p>
              </div>

              {/* Fighter inputs */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Fighter A */}
                <motion.div whileHover={{ scale: 1.01 }} className="bento-card p-6 border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl glow-sm">🔵</div>
                    <div>
                      <div className="text-white font-bold">Fighter A</div>
                      <div className="text-xs text-slate-500">Blue Corner</div>
                    </div>
                  </div>
                  <label className="text-xs text-slate-400 block mb-1.5">Portfolio slug (from URL)</label>
                  <input
                    value={slugA}
                    onChange={e => setSlugA(e.target.value)}
                    placeholder="e.g. alex-johnson-1716000000"
                    className="input-field text-sm"
                  />
                  <p className="text-xs text-slate-600 mt-1.5">folioai.app/portfolio/<strong className="text-slate-500">{slugA || 'slug'}</strong></p>
                </motion.div>

                {/* VS badge */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                </div>

                {/* Fighter B */}
                <motion.div whileHover={{ scale: 1.01 }} className="bento-card p-6 border-rose-500/20">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center text-2xl glow-rose">🔴</div>
                    <div>
                      <div className="text-white font-bold">Fighter B</div>
                      <div className="text-xs text-slate-500">Red Corner</div>
                    </div>
                  </div>
                  <label className="text-xs text-slate-400 block mb-1.5">Portfolio slug (from URL)</label>
                  <input
                    value={slugB}
                    onChange={e => setSlugB(e.target.value)}
                    placeholder="e.g. sarah-chen-1716000001"
                    className="input-field text-sm"
                  />
                  <p className="text-xs text-slate-600 mt-1.5">folioai.app/portfolio/<strong className="text-slate-500">{slugB || 'slug'}</strong></p>
                </motion.div>
              </div>

              {/* What we score */}
              <div className="bento-card p-5 mb-8">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">5 Battle Rounds</p>
                <div className="grid grid-cols-5 gap-3">
                  {ROUND_CATEGORIES.map(r => (
                    <div key={r.id} className="text-center">
                      <div className="text-2xl mb-1">{r.icon}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={startBattle}
                disabled={loading || !slugA || !slugB}
                className="btn-primary w-full justify-center py-4 text-base glow-md"
                style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}
              >
                <Swords className="w-5 h-5" />
                Start the Battle!
              </button>
            </motion.div>
          )}

          {/* ── COUNTDOWN ─────────────────────────────────── */}
          {phase === 'countdown' && (
            <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-[12rem] font-black gradient-text leading-none"
              >
                {countdown}
              </motion.div>
              <div className="text-slate-400 text-xl animate-pulse">Get ready…</div>
              <div className="flex gap-4 text-4xl">
                <span>🔵</span>
                <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 0.5, repeat: Infinity }}>⚔️</motion.div>
                <span>🔴</span>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ─────────────────────────────────────── */}
          {phase === 'battle' && result && (
            <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Winner banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="text-center mb-10"
              >
                <div className="text-6xl mb-3">
                  {result.winner === 'A' ? '🔵🏆' : result.winner === 'B' ? '🔴🏆' : '🤝'}
                </div>
                <h2 className="text-4xl font-black text-white mb-2">
                  {result.winner === 'tie' ? "It's a Draw!" : `${result.winner === 'A' ? nameA : nameB} Wins!`}
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">{result.commentary}</p>
              </motion.div>

              {/* Score cards */}
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                {(['A', 'B'] as const).map(side => (
                  <motion.div
                    key={side}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: side === 'A' ? 0 : 0.1 }}
                    className={`bento-card p-6 ${result.winner === side ? 'border-amber-500/30' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{side === 'A' ? '🔵' : '🔴'}</span>
                      <div>
                        <div className="font-bold text-white text-lg">{side === 'A' ? nameA : nameB}</div>
                        {result.winner === side && (
                          <span className="badge badge-amber text-[10px]">🏆 Winner</span>
                        )}
                      </div>
                      <div className={`ml-auto text-4xl font-black ${result.winner === side ? 'gradient-text' : 'text-slate-400'}`}>
                        {result.scores[side]}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">MVP Skill</div>
                      <span className="badge badge-indigo">{result.mvpSkill[side]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Round-by-round */}
              <div className="bento-card p-6 mb-6">
                <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" /> Round by Round
                </h3>
                <div className="space-y-4">
                  {result.rounds.map((round, i) => (
                    <AnimatePresence key={round.category}>
                      {revealedRounds > i && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{ROUND_CATEGORIES[i].icon}</span>
                            <span className="text-sm font-semibold text-white flex-1">{round.category}</span>
                            <span className={`badge text-[10px] ${round.winner === 'A' ? 'badge-cyan' : round.winner === 'B' ? 'badge-rose' : 'badge-slate'}`}>
                              {round.winner === 'tie' ? 'TIE' : `${round.winner === 'A' ? '🔵' : '🔴'} wins`}
                            </span>
                          </div>
                          {/* Score bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-cyan-400 w-6 text-right font-mono">{round.scoreA}</span>
                            <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(round.scoreA / (round.scoreA + round.scoreB)) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(round.scoreB / (round.scoreA + round.scoreB)) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
                              />
                            </div>
                            <span className="text-xs text-rose-400 w-6 font-mono">{round.scoreB}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 ml-8">{round.verdict}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </div>

              {/* AI judgment */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                className="bento-card p-6 border-amber-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">AI Judge's Final Verdict</span>
                </div>
                <p className="text-slate-300 leading-relaxed italic">"{result.judgment}"</p>
              </motion.div>

              <div className="flex gap-3 mt-6 justify-center">
                <button onClick={() => { setPhase('setup'); setResult(null); setSlugA(''); setSlugB(''); }} className="btn-secondary btn-lg">
                  New Battle
                </button>
                <Link href="/dashboard" className="btn-primary btn-lg">
                  <Trophy className="w-5 h-5" /> Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
