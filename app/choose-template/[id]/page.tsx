'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, CheckCircle2, ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const THEMES = [
  {
    id: 'developer',
    name: 'Terminal Dark',
    tagline: 'Clean, code-first aesthetic',
    emoji: '⌨️',
    accent: '#00FF94',
    bg: '#050d08',
    cardBg: 'rgba(0,255,148,0.05)',
    border: 'rgba(0,255,148,0.2)',
    roles: ['Software Engineer', 'Full Stack', 'Backend Dev', 'Frontend Dev'],
    preview: TerminalPreview,
  },
  {
    id: 'designer',
    name: 'Editorial Light',
    tagline: 'Creative, portfolio-first layout',
    emoji: '🎨',
    accent: '#FF6B6B',
    bg: '#fdf9f9',
    cardBg: 'rgba(255,107,107,0.05)',
    border: 'rgba(255,107,107,0.2)',
    roles: ['UI/UX Designer', 'Product Designer', 'Creative Director'],
    preview: DesignerPreview,
  },
  {
    id: 'scientist',
    name: 'Neural Dark',
    tagline: 'Data-heavy, research-grade',
    emoji: '🧠',
    accent: '#7C3AED',
    bg: '#0c0a1a',
    cardBg: 'rgba(124,58,237,0.06)',
    border: 'rgba(124,58,237,0.25)',
    roles: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
    preview: ScientistPreview,
  },
  {
    id: 'executive',
    name: 'Executive Pro',
    tagline: 'Professional, leadership-first',
    emoji: '💼',
    accent: '#F59E0B',
    bg: '#0a0e1a',
    cardBg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.2)',
    roles: ['CTO', 'Product Manager', 'Engineering Lead', 'Director'],
    preview: ExecutivePreview,
  },
  {
    id: 'marketer',
    name: 'Gradient Wave',
    tagline: 'Bold, modern SaaS aesthetic',
    emoji: '🌊',
    accent: '#06B6D4',
    bg: '#06091a',
    cardBg: 'rgba(6,182,212,0.05)',
    border: 'rgba(6,182,212,0.2)',
    roles: ['Growth Engineer', 'Marketing Lead', 'Creative', 'Founder'],
    preview: GradientPreview,
  },
  {
    id: 'neon-cyberpunk',
    name: 'Cyber DevOps',
    tagline: 'Retro-future code visualizer',
    emoji: '⚡',
    accent: '#00D9FF',
    bg: '#000d1a',
    cardBg: 'rgba(0, 217, 255, 0.05)',
    border: 'rgba(0, 217, 255, 0.2)',
    roles: ['DevOps Engineer', 'SRE', 'Cloud Engineer'],
    preview: CyberpunkPreview,
  },
  {
    id: 'pastel-creative',
    name: 'Pastel Creative',
    tagline: 'Playful, content-first canvas',
    emoji: '🌸',
    accent: '#A855F7',
    bg: '#faf5ff',
    cardBg: 'rgba(168, 85, 247, 0.05)',
    border: 'rgba(168, 85, 247, 0.2)',
    roles: ['Mobile Developer', 'iOS Dev', 'Creative Engineer'],
    preview: PastelPreview,
  },
  {
    id: 'midnight-finance',
    name: 'Midnight Web3',
    tagline: 'Premium cryptographically themed',
    emoji: '🪙',
    accent: '#F7931A',
    bg: '#0a0500',
    cardBg: 'rgba(247, 147, 26, 0.05)',
    border: 'rgba(247, 147, 26, 0.2)',
    roles: ['Web3 Dev', 'Solidity Engineer', 'Blockchain'],
    preview: FinancePreview,
  },
  {
    id: 'forest-green',
    name: 'Forest Play',
    tagline: 'Nature-toned game sandbox',
    emoji: '🌲',
    accent: '#22C55E',
    bg: '#021a08',
    cardBg: 'rgba(34, 197, 94, 0.05)',
    border: 'rgba(34, 197, 94, 0.2)',
    roles: ['Game Dev', 'Unity Engineer', '3D Generalist'],
    preview: ForestPreview,
  },
  {
    id: 'red-hacker',
    name: 'Red Security',
    tagline: 'High-contrast security console',
    emoji: '🛡️',
    accent: '#EF4444',
    bg: '#0d0000',
    cardBg: 'rgba(239, 68, 68, 0.05)',
    border: 'rgba(239, 68, 68, 0.2)',
    roles: ['Security Analyst', 'Pen Tester', 'Ethical Hacker'],
    preview: HackerPreview,
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Product',
    tagline: 'Fluid product management design',
    emoji: '🌊',
    accent: '#0EA5E9',
    bg: '#00111a',
    cardBg: 'rgba(14, 165, 233, 0.05)',
    border: 'rgba(14, 165, 233, 0.2)',
    roles: ['Product Manager', 'Project Lead', 'Agile Coach'],
    preview: OceanPreview,
  },
  {
    id: 'warm-editorial',
    name: 'Warm Editorial',
    tagline: 'Sleek copy & content showcase',
    emoji: '✍️',
    accent: '#F97316',
    bg: '#1a0f00',
    cardBg: 'rgba(249, 115, 22, 0.05)',
    border: 'rgba(249, 115, 22, 0.2)',
    roles: ['Technical Writer', 'DevRel', 'Content Strategist'],
    preview: EditorialPreview,
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold Quant',
    tagline: 'Polished data & mathematical view',
    emoji: '📈',
    accent: '#EC4899',
    bg: '#1a0010',
    cardBg: 'rgba(236, 72, 153, 0.05)',
    border: 'rgba(236, 72, 153, 0.2)',
    roles: ['Quant Researcher', 'Financial Analyst', 'Risk Eng'],
    preview: RosePreview,
  },
  {
    id: 'clinical-white',
    name: 'Clinical Health',
    tagline: 'Clean, structured healthcare view',
    emoji: '🏥',
    accent: '#06B6D4',
    bg: '#f0f9ff',
    cardBg: 'rgba(6, 182, 212, 0.05)',
    border: 'rgba(6, 182, 212, 0.2)',
    roles: ['Bioinformatics', 'Health Tech', 'Data Analyst'],
    preview: ClinicalPreview,
  },
  {
    id: 'holographic',
    name: 'Holographic XR',
    tagline: 'Iridescent AR/VR interface',
    emoji: '🔮',
    accent: '#8B5CF6',
    bg: '#0a0015',
    cardBg: 'rgba(139, 92, 246, 0.06)',
    border: 'rgba(139, 92, 246, 0.25)',
    roles: ['AR/VR Developer', 'Unity Dev', 'Graphics Engineer'],
    preview: HolographicPreview,
  },
];

/* ─────────────────────────── Preview Components ─────────────────────────── */

function CyberpunkPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#000d1a', fontFamily: 'monospace' }}>
      <div className="text-[10px] text-cyan-400 font-bold flex justify-between">
        <span>$ sys_status</span>
        <span className={active ? 'animate-pulse' : ''}>ONLINE</span>
      </div>
      <div className="space-y-1 my-2">
        <div className="h-1 bg-cyan-950 rounded overflow-hidden">
          <motion.div className="h-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: active ? '75%' : 0 }} />
        </div>
        <div className="h-1 bg-cyan-950 rounded overflow-hidden">
          <motion.div className="h-full bg-cyan-300" initial={{ width: 0 }} animate={{ width: active ? '55%' : 0 }} />
        </div>
      </div>
      <div className="text-[8px] text-cyan-500">CLOUD NODE ACTIVE</div>
    </div>
  );
}

function PastelPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#faf5ff' }}>
      <motion.div className="w-8 h-8 rounded-full bg-purple-200/50 absolute top-2 right-2 blur-md"
        animate={active ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 3 }} />
      <div className="w-6 h-6 rounded-full bg-pink-200/40 absolute bottom-2 left-2 blur-md" />
      <div className="text-[10px] font-black text-purple-950">App Canvas</div>
      <div className="w-full h-10 bg-white border border-purple-100 rounded-lg p-1 flex items-center gap-1 shadow-sm">
        <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center text-[8px] text-white">📱</div>
        <div>
          <div className="text-[7px] font-bold text-purple-950">Mobile UI</div>
          <div className="text-[5px] text-purple-400">Design System</div>
        </div>
      </div>
      <div className="text-[7px] text-purple-500 font-medium">Creative Sandbox</div>
    </div>
  );
}

function FinancePreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#0a0500' }}>
      <div className="text-[10px] text-orange-400 font-bold">Web3 Ledger</div>
      <div className="h-16 flex items-end justify-between px-2 gap-1 relative z-10">
        {[20, 45, 30, 60, 50, 75].map((h, i) => (
          <motion.div
            key={i}
            className="w-2 bg-orange-500/80 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: active ? `${h}%` : 0 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <div className="text-[7px] text-orange-200 font-semibold">Solidity Dev</div>
    </div>
  );
}

function ForestPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#021a08' }}>
      <div className="text-[10px] text-emerald-400 font-bold">Game Sandbox</div>
      <div className="relative w-full h-16 flex items-center justify-center">
        <motion.div
          animate={active ? { y: [-4, 4, -4], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-xl"
        >
          🎮
        </motion.div>
      </div>
      <div className="text-[8px] text-emerald-500 font-mono">Unity 3D Engine</div>
    </div>
  );
}

function HackerPreview({ active }: { active: boolean }) {
  const [log, setLog] = useState('> system_load');
  useEffect(() => {
    if (!active) { setLog('> system_load'); return; }
    const logs = ['> scanning...', '> port 80 open', '> firewall bypassed', '> root access granted'];
    let idx = 0;
    const t = setInterval(() => {
      setLog(logs[idx]);
      idx = (idx + 1) % logs.length;
    }, 1000);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#0d0000', fontFamily: 'monospace' }}>
      <div className="text-[10px] text-red-500 font-bold">Red Sec Terminal</div>
      <div className="text-[9px] text-red-400 font-semibold my-2">
        {log}
      </div>
      <div className="text-[7px] text-red-600">SECURE SHELL ACTIVE</div>
    </div>
  );
}

function OceanPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#00111a' }}>
      <div className="text-[10px] text-sky-400 font-bold">Product Blueprint</div>
      <div className="space-y-1.5 my-2">
        {['Roadmap Q3', 'Sprint Backlog'].map((t, i) => (
          <div key={t} className="p-1 rounded bg-sky-950/40 border border-sky-900/30 flex items-center justify-between text-[8px] text-sky-200">
            <span>{t}</span>
            <motion.span animate={active ? { scale: [1, 1.2, 1] } : {}} className="text-[7px]">✓</motion.span>
          </div>
        ))}
      </div>
      <div className="text-[7px] text-sky-500">Agile Board</div>
    </div>
  );
}

function EditorialPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#1a0f00' }}>
      <div className="text-[10px] text-orange-400 font-serif font-black">Typographic Journal</div>
      <div className="space-y-1 my-1">
        <h4 className="text-[9px] font-bold text-white leading-tight font-serif">"AI Writing: The Next Creative Wave"</h4>
        <p className="text-[6px] text-orange-200/70 font-sans line-clamp-2">How copy and documentation are transformed by GPT engines.</p>
      </div>
      <div className="text-[7px] text-orange-400 font-serif">DevRel Hub</div>
    </div>
  );
}

function RosePreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#1a0010' }}>
      <div className="text-[10px] text-pink-400 font-bold">Quantitative Index</div>
      <div className="relative w-full h-16 flex items-center justify-center">
        <svg className="w-full h-12">
          <motion.path
            d="M 10 30 Q 30 10 50 35 T 90 5"
            fill="none"
            stroke="#EC4899"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          />
        </svg>
      </div>
      <div className="text-[7px] text-pink-300 font-medium">Risk Analysis Suite</div>
    </div>
  );
}

function ClinicalPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#f0f9ff' }}>
      <div className="text-[10px] text-sky-950 font-bold flex items-center gap-1">🧬 Health Bio</div>
      <div className="relative w-full h-14 flex items-center justify-center">
        <svg className="w-full h-10">
          <motion.path
            d="M 5 20 L 30 20 L 35 5 L 40 35 L 45 15 L 50 20 L 90 20"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.5"
            animate={active ? { pathLength: [0, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />
        </svg>
      </div>
      <div className="text-[7px] text-sky-700 font-semibold">Bioinformatics Suite</div>
    </div>
  );
}

function HolographicPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative p-3 flex flex-col justify-between" style={{ background: '#0a0015' }}>
      <div className="text-[10px] text-purple-400 font-bold">Holo Spatial XR</div>
      <div className="relative w-full h-16 flex items-center justify-center">
        <motion.div
          animate={active ? { rotateY: 360, rotateX: 360 } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="w-8 h-8 rounded border border-dashed border-purple-500/50 flex items-center justify-center text-sm"
        >
          🔮
        </motion.div>
      </div>
      <div className="text-[7px] text-purple-300 font-mono">AR/VR Graphics</div>
    </div>
  );
}

function TerminalPreview({ active }: { active: boolean }) {
  const [cursor, setCursor] = useState(true);
  const lines = ['> Arjun Kumar', '> Full Stack Developer', '> React · Node · TypeScript', '> Open to work ✓'];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!active) { setVisible(0); return; }
    const t = setInterval(() => setVisible(v => (v < lines.length - 1 ? v + 1 : v)), 600);
    const c = setInterval(() => setCursor(b => !b), 500);
    return () => { clearInterval(t); clearInterval(c); };
  }, [active]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: '#050d08', fontFamily: 'monospace' }}>
      {/* Terminal bar */}
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: '#0a1a10' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="text-[9px] text-emerald-500/60 ml-2">portfolio.sh</span>
      </div>
      {/* Content */}
      <div className="p-4 space-y-1.5">
        {lines.slice(0, visible + 1).map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="text-[10px]" style={{ color: i === 0 ? '#00FF94' : i === 2 ? '#64748b' : '#86efac' }}>
            {line}{i === visible && <span style={{ opacity: cursor ? 1 : 0, color: '#00FF94' }}>█</span>}
          </motion.div>
        ))}
        <div className="mt-3 flex flex-wrap gap-1">
          {['React', 'Node.js', 'TypeScript'].map(s => (
            <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }} transition={{ delay: 2 }}
              className="text-[8px] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.3)', color: '#00FF94' }}>
              {s}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: active ? 1 : 0 }} transition={{ delay: 2.5, duration: 0.8 }}
          className="h-0.5 rounded-full mt-2"
          style={{ background: 'linear-gradient(90deg,#00FF94,transparent)', transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
}

function DesignerPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative" style={{ background: '#fdf9f9' }}>
      {/* Floating blobs */}
      <motion.div animate={active ? { x: [0, 10, 0], y: [0, -8, 0] } : {}} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute w-16 h-16 rounded-full -top-4 -right-4 blur-xl"
        style={{ background: 'rgba(255,107,107,0.4)' }} />
      <motion.div animate={active ? { x: [0, -8, 0], y: [0, 8, 0] } : {}} transition={{ repeat: Infinity, duration: 5, delay: 1 }}
        className="absolute w-12 h-12 rounded-full bottom-4 left-2 blur-xl"
        style={{ background: 'rgba(255,107,107,0.2)' }} />
      {/* Content */}
      <div className="relative z-10 p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-10 h-10 rounded-full mb-2 border-2 overflow-hidden"
          style={{ borderColor: '#FF6B6B' }}>
          <img src="https://i.pravatar.cc/80?img=47" alt="" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }} transition={{ delay: 0.3 }}>
          <div className="text-[11px] font-black" style={{ color: '#1a1a1a' }}>Priya Nair</div>
          <div className="text-[9px] font-semibold" style={{ color: '#FF6B6B' }}>UI/UX Designer</div>
        </motion.div>
        <motion.div className="mt-2 grid grid-cols-2 gap-1" initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.6 }}>
          {['Figma', 'React', 'CSS', 'Motion'].map(s => (
            <div key={s} className="text-[8px] px-1.5 py-0.5 rounded-full text-center"
              style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B' }}>{s}</div>
          ))}
        </motion.div>
        <motion.div className="mt-2 grid grid-cols-2 gap-1"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }} transition={{ delay: 0.9 }}>
          {['Project 1', 'Project 2'].map((p, i) => (
            <div key={p} className="rounded-lg overflow-hidden">
              <img src={`https://picsum.photos/seed/des${i}/60/40`} alt="" className="w-full h-6 object-cover" />
              <div className="text-[7px] p-0.5" style={{ color: '#666' }}>{p}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ScientistPreview({ active }: { active: boolean }) {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: 10 + (i % 4) * 25, y: 20 + Math.floor(i / 4) * 40, id: i
  }));
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative" style={{ background: '#0c0a1a' }}>
      {/* Animated neural lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {nodes.map((n, i) => nodes.slice(i + 1, i + 3).map(m => (
          <motion.line key={`${n.id}-${m.id}`} x1={`${n.x}%`} y1={`${n.y}%`} x2={`${m.x}%`} y2={`${m.y}%`}
            stroke="#7C3AED" strokeWidth="0.5"
            animate={active ? { opacity: [0.2, 0.8, 0.2] } : {}}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3 }} />
        )))}
        {nodes.map(n => (
          <motion.circle key={n.id} cx={`${n.x}%`} cy={`${n.y}%`} r="2" fill="#7C3AED"
            animate={active ? { r: [2, 3, 2], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 + n.id * 0.2 }} />
        ))}
      </svg>
      <div className="relative z-10 p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.4 }}>
          <div className="text-[11px] font-black text-white mb-0.5">Vikram Sharma</div>
          <div className="text-[9px] font-semibold" style={{ color: '#a78bfa' }}>ML Engineer · IIT Bombay</div>
        </motion.div>
        <div className="mt-3 space-y-1.5">
          {[['Python', 90], ['PyTorch', 85], ['NLP', 78]].map(([s, p]) => (
            <div key={s}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[8px] text-slate-400">{s}</span>
                <span className="text-[8px]" style={{ color: '#7C3AED' }}>{p}%</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: 'rgba(124,58,237,0.2)' }}>
                <motion.div className="h-full rounded-full" style={{ background: '#7C3AED' }}
                  initial={{ width: 0 }} animate={{ width: active ? `${p}%` : 0 }} transition={{ delay: 0.8, duration: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExecutivePreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: '#0a0e1a' }}>
      <div className="h-full p-4 flex flex-col">
        <motion.div className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: active ? 1 : 0, x: active ? 0 : -20 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>👔</div>
          <div>
            <div className="text-[10px] font-black text-white">Alex Chen</div>
            <div className="text-[8px]" style={{ color: '#F59E0B' }}>CTO · 12 yrs exp</div>
          </div>
        </motion.div>
        {/* Timeline */}
        <div className="space-y-2 flex-1">
          {[['Google', '2020-Now'], ['Meta', '2017-20'], ['Stripe', '2015-17']].map(([co, yr], i) => (
            <motion.div key={co} className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: active ? 1 : 0, x: active ? 0 : -10 }}
              transition={{ delay: 0.3 + i * 0.2 }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#F59E0B' }} />
              <div>
                <div className="text-[9px] font-semibold text-white">{co}</div>
                <div className="text-[7px] text-slate-500">{yr}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="h-px w-full my-2" style={{ background: 'rgba(245,158,11,0.2)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: active ? 1 : 0 }} transition={{ delay: 1, duration: 0.8 }}
        />
        <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 1.2 }}>
          {['Leadership', 'Strategy', 'Scale'].map(t => (
            <span key={t} className="text-[7px] px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function GradientPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative" style={{ background: '#06091a' }}>
      {/* Animated gradient orbs */}
      <motion.div className="absolute inset-0"
        animate={active ? { background: ['linear-gradient(135deg,rgba(6,182,212,0.2) 0%,rgba(124,58,237,0.2) 100%)', 'linear-gradient(225deg,rgba(6,182,212,0.2) 0%,rgba(124,58,237,0.2) 100%)'] } : {}}
        transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }} />
      <div className="relative z-10 p-4 h-full flex flex-col items-center justify-center text-center">
        <motion.div className="text-2xl mb-2" animate={active ? { rotate: [0, 5, -5, 0] } : {}} transition={{ repeat: Infinity, duration: 3 }}>🌊</motion.div>
        <motion.div className="text-[11px] font-black text-white mb-0.5"
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.3 }}>
          Jamie Rivera
        </motion.div>
        <motion.div className="text-[8px] mb-3"
          style={{ background: 'linear-gradient(135deg,#06B6D4,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.5 }}>
          Growth Engineer · Founder
        </motion.div>
        <div className="flex gap-1.5">
          {['💡', '🚀', '📈'].map((e, i) => (
            <motion.div key={e} className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }} transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}>
              {e}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────────────── */

const STEPS = ['Upload', 'Choose Theme', 'Editor', 'Publish'];

export default function ChooseTemplatePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const activeId = hovered || selected;

  const handleConfirm = async () => {
    if (!selected) { toast.error('Please select a theme'); return; }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ theme: selected })
        .eq('id', id);
      if (error) throw error;
      toast.success('Theme applied! Opening editor…');
      router.push(`/editor/${id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save theme');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Top nav */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-6 sticky top-0 z-30">
        <button onClick={() => router.push('/upload')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        {/* Stepper */}
        <div className="flex items-center gap-0 mx-auto">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                i === 1 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : i < 1 ? 'text-emerald-400' : 'text-slate-600'
              }`}>
                {i < 1 ? <CheckCircle2 className="w-3 h-3" /> : <span>{i + 1}</span>}
                {step}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-1 ${i < 1 ? 'bg-emerald-500/40' : 'bg-white/8'}`} />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          className="btn-primary text-sm gap-2 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {saving ? 'Applying…' : 'Use This Theme'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="container-page py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-5 border border-indigo-500/20">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-300">Step 2 of 4 · Choose your portfolio theme</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-3">
            Pick Your <span className="gradient-text">Visual Style</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Hover to preview live animations. Everything is fully editable after — this just sets the look and feel.
          </p>
        </motion.div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {THEMES.map((theme, idx) => {
            const Preview = theme.preview;
            const isSelected = selected === theme.id;
            const isActive = activeId === theme.id;
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onMouseEnter={() => setHovered(theme.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(isSelected ? null : theme.id)}
                className="cursor-pointer rounded-2xl overflow-hidden relative"
                style={{
                  border: isSelected
                    ? `2px solid ${theme.accent}`
                    : `2px solid ${isActive ? theme.border : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isSelected ? `0 0 30px ${theme.accent}33` : isActive ? `0 0 15px ${theme.accent}15` : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Selected badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: theme.accent }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Live preview */}
                <div className="h-44 p-2" style={{ background: theme.bg }}>
                  <Preview active={isActive} />
                </div>

                {/* Info */}
                <div className="p-4 bg-slate-900/95">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{theme.emoji}</span>
                    <span className="font-bold text-white text-sm">{theme.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{theme.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {theme.roles.slice(0, 2).map(r => (
                      <span key={r} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${theme.accent}15`, color: theme.accent }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
            >
              <div className="glass-strong border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl">
                <div>
                  <div className="text-sm font-bold text-white">
                    {THEMES.find(t => t.id === selected)?.emoji} {THEMES.find(t => t.id === selected)?.name} selected
                  </div>
                  <div className="text-xs text-slate-400">Click "Use This Theme" to continue to the editor</div>
                </div>
                <button onClick={handleConfirm} disabled={saving} className="btn-primary gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {saving ? 'Applying…' : 'Continue to Editor'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
