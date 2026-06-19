'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {
  Zap, Upload, Palette, BarChart3, Globe, Mic, Bot,
  ChevronDown, ArrowRight, Sparkles, Star, Code2, Brain,
  Layers, Shield, CheckCircle2, Play, Users, Eye, TrendingUp,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';


/* ─── Data ──────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Brain, title: 'GPT-4o Resume Parsing',
    desc: 'Drop any PDF or DOCX. Our AI extracts every skill, role, achievement and structures your story in seconds.',
    color: 'indigo', size: 'large',
  },
  {
    icon: Palette, title: 'Role-Adaptive Themes',
    desc: '5 stunning themes auto-selected by AI based on your profession.',
    color: 'violet', size: 'small',
  },
  {
    icon: Bot, title: 'AI Recruiter Score',
    desc: 'Get a hiring score 0–100 with actionable feedback.',
    color: 'cyan', size: 'small',
  },
  {
    icon: Mic, title: 'Portfolio Voice Mode',
    desc: 'Let visitors talk to your portfolio via AI-powered voice chat.',
    color: 'emerald', size: 'small',
  },
  {
    icon: BarChart3, title: 'Live Analytics',
    desc: 'Views, devices, referrers & section engagement — all real-time.',
    color: 'amber', size: 'small',
  },
  {
    icon: Globe, title: 'One-Click Publish',
    desc: 'Shareable URL, QR card, SEO & Open Graph — instantly live.',
    color: 'rose', size: 'small',
  },
];

const THEMES = [
  { name: 'Developer', emoji: '⌨️', accent: '#22d3ee', from: 'from-cyan-950', to: 'to-slate-950', tag: 'Terminal Aesthetic' },
  { name: 'Designer', emoji: '🎨', accent: '#f472b6', from: 'from-pink-950', to: 'to-purple-950', tag: 'Portfolio Grid' },
  { name: 'Executive', emoji: '💼', accent: '#fbbf24', from: 'from-amber-950', to: 'to-stone-950', tag: 'Boardroom Clean' },
  { name: 'Scientist', emoji: '🔬', accent: '#34d399', from: 'from-emerald-950', to: 'to-teal-950', tag: 'Data-Heavy' },
  { name: 'Marketer', emoji: '📣', accent: '#fb923c', from: 'from-orange-950', to: 'to-red-950', tag: 'Campaign Bold' },
];

const STEPS = [
  { n: '01', icon: '📄', title: 'Upload Resume', desc: 'Drop your PDF or DOCX. Supports all formats, all layouts.' },
  { n: '02', icon: '✨', title: 'AI Builds It', desc: 'GPT-4o extracts, enhances and crafts your portfolio in 30 seconds.' },
  { n: '03', icon: '🚀', title: 'Publish & Share', desc: 'Live URL, QR card, analytics dashboard — all in one click.' },
];

const TESTIMONIALS = [
  {
    name: 'Aditya Rao', role: 'Graduate Developer', company: 'Beta Tester',
    avatar: 'AR', color: 'from-cyan-500 to-blue-600',
    text: '"FolioAI helped me turn my college resume into a live, professional web portfolio in seconds. The theme auto-selection worked perfectly."',
    stars: 5,
  },
  {
    name: 'Sneha Ramachandran', role: 'Freelance Designer', company: 'Independent',
    avatar: 'SR', color: 'from-pink-500 to-purple-600',
    text: '"The Designer theme is clean and showcases my Figma links beautifully. Highly recommended for creative profiles."',
    stars: 5,
  },
  {
    name: 'Karthik S.', role: 'SRE Intern', company: 'Beta Tester',
    avatar: 'KS', color: 'from-emerald-500 to-teal-600',
    text: '"The AI mock recruiter feedback gave me realistic points to refine on my resume before applying. Outstanding tool."',
    stars: 5,
  },
];

/* ─── Sub-components ─────────────────────────────────────────────── */

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
  hidden: {},
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/* ─── Navbar ─────────────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`navbar transition-all ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="container-page flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-md group-hover:glow-sm transition-all duration-300">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-[1.1rem] font-bold tracking-tight">
            <span className="gradient-text">Folio</span><span className="text-white">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {['Features', 'Themes', 'How it works'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost text-sm hidden sm:flex">Sign in</Link>
          <Link href="/register" className="btn-primary text-sm">
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ─── Hero Visual ─────────────────────────────────────────────────── */

function HeroCard() {
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 0.5, -0.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glow underneath */}
      <div className="absolute inset-x-8 -bottom-8 h-16 bg-indigo-600/30 blur-2xl rounded-full" />

      {/* Browser frame */}
      <div className="device-frame-browser">
        {/* Browser bar */}
        <div className="device-frame-browser-bar">
          <div className="device-frame-browser-dot bg-rose-500/70" />
          <div className="device-frame-browser-dot bg-amber-500/70" />
          <div className="device-frame-browser-dot bg-emerald-500/70" />
          <div className="flex-1 mx-4 h-5 bg-white/5 rounded-md flex items-center px-3">
            <span className="text-xs text-slate-500">folioai.app/alex-johnson</span>
          </div>
        </div>

        {/* Portfolio preview */}
        <div className="bg-slate-950 min-h-64 relative overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-cyan-950 to-slate-900 p-5 border-b border-cyan-900/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">AJ</div>
              <div>
                <div className="h-4 w-28 bg-white/90 rounded mb-1.5" />
                <div className="h-2.5 w-40 bg-cyan-400/60 rounded" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {['TypeScript', 'React', 'Node.js'].map(t => (
                <span key={t} className="px-2 py-0.5 text-xs bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">{t}</span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-cyan-500 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-2 bg-white/20 rounded w-full" />
                <div className="h-2 bg-white/12 rounded w-4/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[80, 90, 70, 85].map((w, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-2">
                  <div className="h-1.5 bg-cyan-900 rounded mb-1.5">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded" style={{ width: `${w}%` }} />
                  </div>
                  <div className="h-1.5 bg-white/10 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Animated scanning line */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            animate={{ y: [60, 250, 60] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-6 top-16 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl border border-emerald-500/20"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">+127% views</div>
          <div className="text-[10px] text-slate-400">This week</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ x: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -left-6 bottom-20 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl border border-indigo-500/20"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-indigo-400" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">AI Enhanced</div>
          <div className="text-[10px] text-slate-400">GPT-4o powered</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Feature Card ───────────────────────────────────────────────── */

const COLOR_MAP: Record<string, { box: string; text: string; glow: string }> = {
  indigo:  { box: 'icon-box-indigo',  text: 'text-indigo-400',  glow: 'glow-sm' },
  violet:  { box: 'icon-box-violet',  text: 'text-violet-400',  glow: '' },
  cyan:    { box: 'icon-box-cyan',    text: 'text-cyan-400',    glow: '' },
  emerald: { box: 'icon-box-emerald', text: 'text-emerald-400', glow: '' },
  amber:   { box: 'icon-box-amber',   text: 'text-amber-400',   glow: '' },
  rose:    { box: 'icon-box-rose',    text: 'text-rose-400',    glow: '' },
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [activeTheme, setActiveTheme] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [dbStats, setDbStats] = useState({ portfolios: 12, views: 184 });
  const supabase = createClient();

  useEffect(() => {
    async function getStats() {
      try {
        const { count, error } = await supabase.from('portfolios').select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          const { data } = await supabase.from('portfolios').select('views');
          const viewsSum = data ? data.reduce((sum, p) => sum + (p.views || 0), 0) : 184;
          setDbStats({ portfolios: count || 12, views: viewsSum || 184 });
        }
      } catch (e) {
        console.error(e);
      }
    }
    getStats();
  }, []);

  return (
    <main className="min-h-screen mesh-bg text-white overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-14">
        {/* Orbs */}
        <div className="orb orb-indigo w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-60" />
        <div className="orb orb-violet w-[500px] h-[500px] top-[10%] right-[-5%] opacity-50" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-[5%] left-[30%] opacity-40" />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

        <div className="container-page w-full relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <motion.div style={{ y: heroY, opacity: heroOpacity }}>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Pill badge */}
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-xs font-medium text-indigo-300 tracking-wide">✨ Powered by GPT-4o • 5 Themes • Voice Mode</span>
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.div variants={fadeUp}>
                  <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight">
                    <span className="block text-white">Your Resume,</span>
                    <span className="block gradient-text mt-1">Reimagined.</span>
                  </h1>
                </motion.div>

                {/* Sub */}
                <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed max-w-lg">
                  Upload your PDF or DOCX resume. FolioAI's GPT-4o engine crafts a beautiful, role-adaptive portfolio website with AI editing, analytics, and voice mode — in under 60 seconds.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                  <Link href="/register" className="btn-primary btn-lg group">
                    <Upload className="w-4 h-4" />
                    Create Portfolio Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/portfolio/demo-developer" className="btn-secondary btn-lg gap-2">
                    <Play className="w-4 h-4" />
                    Live Demo
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div variants={fadeUp} className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['AR', 'SR', 'KS', 'AL', 'RJ'].map((init, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-[#020817] flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: `hsl(${i * 60 + 220}, 70%, 45%)`, zIndex: 5 - i }}
                      >
                        {init}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-400">
                    Currently in <span className="text-white font-semibold">Beta Testing</span> • Helping candidates stand out in recruitment
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Hero card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <HeroCard />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────────── */}
      <section className="py-10 border-y border-white/5">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: dbStats.portfolios, suffix: '', label: 'Portfolios Created' },
              { value: dbStats.views, suffix: '', label: 'Portfolio Views' },
              { value: 5, suffix: '', label: 'Active Themes' },
              { value: 100, suffix: '%', label: 'User Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black gradient-text mb-1">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 relative">
        <div className="container-page">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase mb-4">How it works</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black mb-5">
              From resume to portfolio <br />
              <span className="gradient-text">in 3 simple steps</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-xl mx-auto">
              No design skills required. No wasted hours. Just upload, let AI work, and ship.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-cyan-500/30" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bento-card p-8 group"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-3xl">{step.icon}</div>
                  <span className="text-xs font-mono font-bold text-indigo-400 mt-1.5">{step.n}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                <div className="mt-5 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ────────────────────────────────── */}
      <section id="features" className="py-28 relative">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="container-page relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4">Features</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black mb-5">
              Everything to make you <br />
              <span className="gradient-text">stand out</span>
            </motion.h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Large feature card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 bento-card p-8 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`icon-box icon-box-indigo mb-6 group-hover:glow-xs transition-all duration-300`}>
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">GPT-4o Resume Parsing</h3>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Drop any PDF or DOCX. Our AI extracts every skill, role, achievement and structures your entire professional story in seconds. Supports all resume formats worldwide.
              </p>
              <div className="mt-8 flex items-center gap-3">
                {['PDF', 'DOCX', 'Any format'].map(f => (
                  <span key={f} className="badge badge-indigo">{f}</span>
                ))}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {[FEATURES[1], FEATURES[2]].map((feat, i) => {
                const Icon = feat.icon;
                const c = COLOR_MAP[feat.color];
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="bento-card p-6 group flex-1"
                  >
                    <div className={`icon-box ${c.box} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-4.5 h-4.5 ${c.text}`} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom row */}
            {[FEATURES[3], FEATURES[4], FEATURES[5]].map((feat, i) => {
              const Icon = feat.icon;
              const c = COLOR_MAP[feat.color];
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bento-card p-6 group"
                >
                  <div className={`icon-box ${c.box} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-4.5 h-4.5 ${c.text}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── THEMES SHOWCASE ────────────────────────────────────── */}
      <section id="themes" className="py-28">
        <div className="container-page">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase mb-4">Themes</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black mb-5">
              5 <span className="gradient-text">Role-Adaptive</span> Themes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-xl mx-auto">
              AI detects your profession and picks the perfect theme. Every detail crafted for your industry.
            </motion.p>
          </motion.div>

          {/* Tab switcher */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {THEMES.map((t, i) => (
              <motion.button
                key={t.name}
                onClick={() => setActiveTheme(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTheme === i
                    ? 'gradient-bg text-white glow-sm shadow-xl'
                    : 'glass text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {t.emoji} {t.name}
              </motion.button>
            ))}
          </div>

          {/* Theme preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl bg-gradient-to-br ${THEMES[activeTheme].from} ${THEMES[activeTheme].to} p-px`}
            >
              <div className="rounded-2xl bg-slate-950 p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="text-7xl shrink-0">{THEMES[activeTheme].emoji}</div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-xs font-mono font-semibold tracking-widest" style={{ color: THEMES[activeTheme].accent }}>
                    {THEMES[activeTheme].tag}
                  </span>
                  <h3 className="text-3xl font-black text-white mt-2 mb-3">{THEMES[activeTheme].name} Theme</h3>
                  <p className="text-slate-400 leading-relaxed max-w-md">
                    {activeTheme === 0 && 'Dark code-editor aesthetic with terminal animations, skill graphs, and project cards with tech stack badges.'}
                    {activeTheme === 1 && 'Vibrant portfolio grid with Dribbble-style project cards, color palette showcase, and asymmetric layouts.'}
                    {activeTheme === 2 && 'Premium boardroom layout with leadership metrics, executive summary, and clean professional typography.'}
                    {activeTheme === 3 && 'Data-heavy layout with interactive Recharts visualizations, research highlights, and publication cards.'}
                    {activeTheme === 4 && 'Campaign showcase with KPI metrics dashboard, bold marketing-first design, and social proof sections.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <Link href="/register" className="btn-primary inline-flex text-sm">
                      Try This Theme <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href={`/portfolio/demo-${THEMES[activeTheme].name.toLowerCase()}`} className="btn-secondary inline-flex text-sm">
                      View Live Demo <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── AI FEATURES ────────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="orb orb-violet w-[400px] h-[400px] absolute right-[-100px] top-0 opacity-30" />
        <div className="container-page relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase mb-4">AI-Powered</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">
              Next-Gen <span className="gradient-text">Career Features</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🤖', title: 'AI Recruiter Simulation', badge: 'Unique',
                badgeColor: 'badge-cyan',
                desc: 'Get brutally honest feedback from an AI trained on real recruiter patterns. Hiring score, strengths/gaps, and job-match recommendations.',
                color: 'from-cyan-600/20 to-transparent',
              },
              {
                icon: '🎙️', title: 'Portfolio Voice Mode', badge: 'Innovative',
                badgeColor: 'badge-violet',
                desc: 'Visitors can talk to your portfolio. AI answers questions about your experience, skills and projects via real-time voice chat.',
                color: 'from-violet-600/20 to-transparent',
              },
              {
                icon: '📅', title: 'Achievement Timeline', badge: 'Auto-Generated',
                badgeColor: 'badge-emerald',
                desc: 'AI generates an animated career journey — education, first job, promotions, and key projects — all with scroll-reveal animations.',
                color: 'from-emerald-600/20 to-transparent',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="gradient-border p-px rounded-2xl group"
              >
                <div className={`rounded-2xl bg-gradient-to-b ${f.color} p-7 h-full bg-[var(--bg-card)] relative overflow-hidden`}
                  style={{ background: 'var(--bg-card)' }}>
                  <div className={`absolute inset-0 bg-gradient-to-b ${f.color} opacity-30`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-4xl">{f.icon}</span>
                      <span className={`badge ${f.badgeColor}`}>{f.badge}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-400 uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black">
              Loved by <span className="gradient-text-rose">professionals</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bento-card p-7 group hover-lift"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* BG */}
            <div className="absolute inset-0 gradient-bg-dark" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-cyan-600/20" />
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="orb orb-indigo w-80 h-80 absolute -top-20 -left-20 opacity-60" />
            <div className="orb orb-violet w-60 h-60 absolute -bottom-10 -right-10 opacity-50" />

            <div className="relative z-10 py-20 px-8 text-center">
              <span className="badge badge-indigo mb-6 text-xs">Free to start • No credit card</span>
              <h2 className="text-5xl md:text-6xl font-black mb-5">
                Your portfolio is<br />
                <span className="gradient-text">60 seconds away</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                Join 2,000+ professionals who transformed their resume into a portfolio that gets them hired.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-primary btn-lg glow-lg">
                  <Sparkles className="w-5 h-5" />
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/portfolio/demo-developer" className="btn-secondary btn-lg">
                  View Example Portfolio
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
                {['No credit card', 'Free forever plan', '5 premium themes'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-14">
        <div className="container-page">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold"><span className="gradient-text">Folio</span><span className="text-white">AI</span></span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Transform your resume into a stunning portfolio with the power of GPT-4o. Free to start.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Themes', href: '#themes' },
                  { label: 'How it works', href: '#how-it-works' }
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="text-slate-500 text-sm hover:text-white transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'About', href: '/about' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' }
                ].map(l => (
                  <li key={l.label}><Link href={l.href} className="text-slate-500 text-sm hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="section-divider" />
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-xs">
            <p>© 2026 FolioAI. Built with GPT-4o, Next.js & Supabase.</p>
            <p>Made with ❤️ for professionals everywhere.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
