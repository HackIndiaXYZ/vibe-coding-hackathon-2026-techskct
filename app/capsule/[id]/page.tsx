'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Lock, Unlock, Send, Sparkles, Trash2, PlusCircle, Calendar, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Capsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  recipient: 'self' | 'recruiter' | 'world';
  locked: boolean;
  mood: string;
}

const RECIPIENT_CONFIG = {
  self:      { label: 'My Future Self', icon: '🪞', color: '#818cf8' },
  recruiter: { label: 'Future Recruiter', icon: '💼', color: '#fbbf24' },
  world:     { label: 'The World',        icon: '🌍', color: '#34d399' },
};

const MOODS = [
  { emoji: '🔥', label: 'Fired Up' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '😤', label: 'Determined' },
  { emoji: '✨', label: 'Inspired' },
  { emoji: '🌙', label: 'Reflective' },
  { emoji: '💪', label: 'Confident' },
];

const PROMPTS = [
  'What goal do you want to have achieved by then?',
  'What salary milestone are you aiming for?',
  'Which company\'s offer letter do you want to hold?',
  'What skill do you predict will define your career?',
  'Write a message to the recruiter who\'ll hire you.',
  'What project will you be most proud of?',
];

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatUnlock(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const DEMO_CAPSULES: Capsule[] = [
  {
    id: 'demo-1',
    title: 'To the engineer I\'ll become',
    message: '',
    unlockDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    recipient: 'self',
    locked: true,
    mood: '🔥',
  },
];

export default function CapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [capsules, setCapsules] = useState<Capsule[]>(DEMO_CAPSULES);
  const [composing, setComposing] = useState(false);
  const [openCapsule, setOpenCapsule] = useState<Capsule | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [recipient, setRecipient] = useState<'self' | 'recruiter' | 'world'>('self');
  const [mood, setMood] = useState('🔥');
  const [promptIdx, setPromptIdx] = useState(0);
  const [portfolio, setPortfolio] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
      if (data) setPortfolio(data);
    };
    load();
    // Cycle prompts
    const t = setInterval(() => setPromptIdx(i => (i + 1) % PROMPTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSave = () => {
    if (!title.trim() || !message.trim() || !unlockDate) {
      toast.error('Fill in all fields!');
      return;
    }
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    if (new Date(unlockDate) <= minDate) {
      toast.error('Unlock date must be at least 1 day in the future');
      return;
    }

    const newCapsule: Capsule = {
      id: `capsule-${Date.now()}`,
      title,
      message,
      unlockDate: new Date(unlockDate).toISOString(),
      createdAt: new Date().toISOString(),
      recipient,
      locked: true,
      mood,
    };

    setCapsules(prev => [newCapsule, ...prev]);
    setComposing(false);
    setTitle(''); setMessage(''); setUnlockDate('');
    toast.success('🔒 Time capsule sealed!');
  };

  const tryOpen = (cap: Capsule) => {
    const days = daysUntil(cap.unlockDate);
    if (days > 0) {
      toast.error(`Still locked! Opens in ${days} days`);
      return;
    }
    setOpenCapsule(cap);
  };

  const deleteCapsule = (capId: string) => {
    setCapsules(prev => prev.filter(c => c.id !== capId));
    toast.success('Capsule destroyed');
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="min-h-screen mesh-bg">
      {/* Floating time particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['⏳','🌙','⭐','💫','🔮'].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 20}%` }}
            animate={{ y: [-20, 20, -20], rotate: [-10, 10, -10] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4 sticky top-0 z-10">
        <Link href={`/editor/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Editor
        </Link>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-white">Career Time Capsule</span>
        </div>
        <span className="badge badge-violet text-[10px]">EXCLUSIVE</span>
        <button
          onClick={() => setComposing(true)}
          className="ml-auto btn-primary text-xs py-1.5 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" /> New Capsule
        </button>
      </div>

      <div className="container-page py-10 max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4 inline-block"
          >⏳</motion.div>
          <h1 className="text-4xl font-black text-white mb-3">
            Career <span className="gradient-text">Time Capsule</span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={promptIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-slate-400 text-lg"
            >
              {PROMPTS[promptIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Capsules list */}
        <div className="space-y-4 mb-8">
          {capsules.map((cap, i) => {
            const days = daysUntil(cap.unlockDate);
            const unlocked = days === 0;
            const rcfg = RECIPIENT_CONFIG[cap.recipient];

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bento-card p-6 ${unlocked ? 'border-emerald-500/30' : 'border-violet-500/10'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Lock icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl ${unlocked ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-violet-500/10 border border-violet-500/20'}`}>
                    {unlocked ? '🔓' : cap.mood}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">{cap.title}</h3>
                      {unlocked && <span className="badge badge-emerald text-[10px]">Unlocked!</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span>{rcfg.icon}</span> {rcfg.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {unlocked ? 'Can be opened now!' : `Opens in ${days} day${days !== 1 ? 's' : ''}`}
                      </span>
                      <span>{formatUnlock(cap.unlockDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => tryOpen(cap)}
                      className={`text-xs py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        unlocked
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                          : 'btn-ghost'
                      }`}
                    >
                      {unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      {unlocked ? 'Open' : 'Locked'}
                    </button>
                    <button onClick={() => deleteCapsule(cap.id)} className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {!unlocked && (
                  <div className="mt-4">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, #8b5cf6, #6366f1)`,
                          width: `${Math.max(5, 100 - (days / 365) * 100)}%`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(5, 100 - (days / 365) * 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1 text-right">{days} days remaining</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Compose panel */}
        <AnimatePresence>
          {composing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bento-card p-7 border-violet-500/20"
            >
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Compose a Time Capsule
              </h3>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Capsule Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. To the engineer I'll become" className="input-field" />
                </div>

                {/* Recipient */}
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Who is this for?</label>
                  <div className="flex gap-3">
                    {(Object.entries(RECIPIENT_CONFIG) as [string, any][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setRecipient(key as any)}
                        className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${
                          recipient === key
                            ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                            : 'border-white/8 text-slate-400 hover:border-white/15'
                        }`}
                      >
                        <span className="text-xl">{cfg.icon}</span>
                        <span className="text-xs">{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Your mood right now</label>
                  <div className="flex gap-2 flex-wrap">
                    {MOODS.map(m => (
                      <button key={m.emoji} onClick={() => setMood(m.emoji)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all flex items-center gap-1.5 ${
                          mood === m.emoji ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/8 hover:border-white/15'
                        }`}
                      >
                        {m.emoji} <span className="text-xs text-slate-400">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Your message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={`${PROMPTS[promptIdx]}\n\nWrite anything — goals, fears, dreams, predictions...`}
                    className="input-field resize-none text-sm leading-relaxed"
                    rows={6}
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>This message is encrypted until your unlock date.</span>
                    <span>{message.length} chars</span>
                  </div>
                </div>

                {/* Unlock date */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Unlock Date</label>
                  <input
                    type="date"
                    value={unlockDate}
                    min={minDate.toISOString().split('T')[0]}
                    onChange={e => setUnlockDate(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setComposing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                    <Lock className="w-4 h-4" /> Seal the Capsule
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Open capsule modal */}
        <AnimatePresence>
          {openCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
              onClick={() => setOpenCapsule(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bento-card p-8 max-w-lg w-full border-emerald-500/30"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🔓</div>
                  <h3 className="text-xl font-black text-white">{openCapsule.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Written on {new Date(openCapsule.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="glass rounded-xl p-5 mb-6 border border-emerald-500/15">
                  <p className="text-slate-300 leading-relaxed italic whitespace-pre-wrap">
                    {openCapsule.message || 'This capsule is empty — you sealed it without a message.'}
                  </p>
                </div>
                <button onClick={() => setOpenCapsule(null)} className="btn-secondary w-full justify-center">
                  Seal Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
