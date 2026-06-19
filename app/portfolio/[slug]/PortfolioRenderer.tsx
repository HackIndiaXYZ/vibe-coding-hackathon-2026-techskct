'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  MapPin, Mail, Globe, ExternalLink, Star, Award, Eye,
  Share2, ArrowUpRight, Link2, CheckCircle2, ChevronDown,
  Briefcase, GraduationCap, Code2, Zap, Copy, Check,
  Mic, MicOff, Volume2, VolumeX, X, Send, Bot, PhoneCall, PhoneOff, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Types ─── */
interface Experience { company: string; role: string; duration: string; location?: string; type?: string; description?: string; tech?: string[]; achievements?: string[]; }
interface Project { id?: string; title: string; tagline?: string; description?: string; tech?: string[]; category?: string; status?: string; github?: string | null; live_url?: string; thumbnail?: string; stars?: number; featured?: boolean; }
interface Education { institution: string; degree: string; duration: string; grade?: string; }
interface Certification { name: string; issuer: string; year: number; }
interface PortfolioData {
  name?: string; title?: string; summary?: string; email?: string; phone?: string;
  location?: string; avatar?: string; availability?: string;
  social?: { github?: string; linkedin?: string; twitter?: string; dribbble?: string; kaggle?: string; portfolio?: string };
  skills?: string[]; skillGroups?: { primary?: string[]; secondary?: string[]; tools?: string[]; learning?: string[] };
  experience?: Experience[]; projects?: Project[]; education?: Education[];
  certifications?: Certification[];
  stats?: { github_repos?: number; github_stars?: number; years_experience?: number; projects_shipped?: number };
  accentColor?: string; theme?: string;
}
interface Portfolio { id: string; slug: string; title: string; theme: string; data: PortfolioData; published: boolean; views: number; }

/* ─── Theme Configurations ─── */
interface ThemeConfig {
  bg: string;
  text: string;
  subText: string;
  accent: string;
  gradientText: string;
  fontClass: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentGlow: string;
  glowOpacity: number;
  isLight?: boolean;
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  developer: {
    bg: '#050d08',
    text: '#86efac',
    subText: 'rgba(134, 239, 172, 0.65)',
    accent: '#00FF94',
    gradientText: 'linear-gradient(135deg, #00FF94 0%, #86efac 100%)',
    fontClass: 'font-mono',
    cardBg: 'rgba(0, 255, 148, 0.03)',
    cardBorder: 'rgba(0, 255, 148, 0.15)',
    badgeBg: 'rgba(0, 255, 148, 0.08)',
    badgeBorder: 'rgba(0, 255, 148, 0.2)',
    badgeText: '#00FF94',
    accentGlow: 'rgba(0, 255, 148, 0.08)',
    glowOpacity: 0.1,
  },
  designer: {
    bg: '#fdf9f9',
    text: '#1a1a1a',
    subText: '#555555',
    accent: '#FF6B6B',
    gradientText: 'linear-gradient(135deg, #FF6B6B 0%, #ff8e8e 100%)',
    fontClass: 'font-serif',
    cardBg: 'rgba(255, 107, 107, 0.03)',
    cardBorder: 'rgba(255, 107, 107, 0.15)',
    badgeBg: 'rgba(255, 107, 107, 0.08)',
    badgeBorder: 'rgba(255, 107, 107, 0.2)',
    badgeText: '#FF6B6B',
    accentGlow: 'rgba(255, 107, 107, 0.08)',
    glowOpacity: 0.08,
    isLight: true,
  },
  scientist: {
    bg: '#0c0a1a',
    text: '#f0f4ff',
    subText: '#94a3b8',
    accent: '#7C3AED',
    gradientText: 'linear-gradient(135deg, #7C3AED 0%, #a78bfa 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(124, 58, 237, 0.05)',
    cardBorder: 'rgba(124, 58, 237, 0.2)',
    badgeBg: 'rgba(124, 58, 237, 0.12)',
    badgeBorder: 'rgba(124, 58, 237, 0.25)',
    badgeText: '#a78bfa',
    accentGlow: 'rgba(124, 58, 237, 0.08)',
    glowOpacity: 0.1,
  },
  executive: {
    bg: '#0a0e1a',
    text: '#ffffff',
    subText: '#94a3b8',
    accent: '#F59E0B',
    gradientText: 'linear-gradient(135deg, #F59E0B 0%, #fbbf24 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(245, 158, 11, 0.04)',
    cardBorder: 'rgba(245, 158, 11, 0.18)',
    badgeBg: 'rgba(245, 158, 11, 0.08)',
    badgeBorder: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.08)',
    glowOpacity: 0.08,
  },
  marketer: {
    bg: '#06091a',
    text: '#ffffff',
    subText: '#a5b4fc',
    accent: '#06B6D4',
    gradientText: 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(6, 182, 212, 0.04)',
    cardBorder: 'rgba(6, 182, 212, 0.18)',
    badgeBg: 'rgba(6, 182, 212, 0.08)',
    badgeBorder: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#06B6D4',
    accentGlow: 'rgba(6, 182, 212, 0.08)',
    glowOpacity: 0.08,
  },
  'neon-cyberpunk': {
    bg: '#000d1a',
    text: '#e0f7ff',
    subText: '#7dd3fc',
    accent: '#00D9FF',
    gradientText: 'linear-gradient(135deg, #00D9FF 0%, #7dd3fc 100%)',
    fontClass: 'font-mono',
    cardBg: 'rgba(0, 217, 255, 0.04)',
    cardBorder: 'rgba(0, 217, 255, 0.18)',
    badgeBg: 'rgba(0, 217, 255, 0.08)',
    badgeBorder: 'rgba(0, 217, 255, 0.2)',
    badgeText: '#00D9FF',
    accentGlow: 'rgba(0, 217, 255, 0.1)',
    glowOpacity: 0.1,
  },
  'pastel-creative': {
    bg: '#faf5ff',
    text: '#3b0764',
    subText: '#6b21a8',
    accent: '#A855F7',
    gradientText: 'linear-gradient(135deg, #A855F7 0%, #c084fc 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(168, 85, 247, 0.05)',
    cardBorder: 'rgba(168, 85, 247, 0.18)',
    badgeBg: 'rgba(168, 85, 247, 0.1)',
    badgeBorder: 'rgba(168, 85, 247, 0.2)',
    badgeText: '#A855F7',
    accentGlow: 'rgba(168, 85, 247, 0.08)',
    glowOpacity: 0.08,
    isLight: true,
  },
  'midnight-finance': {
    bg: '#0a0500',
    text: '#fff7ed',
    subText: '#fdba74',
    accent: '#F7931A',
    gradientText: 'linear-gradient(135deg, #F7931A 0%, #fbbf24 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(247, 147, 26, 0.05)',
    cardBorder: 'rgba(247, 147, 26, 0.18)',
    badgeBg: 'rgba(247, 147, 26, 0.1)',
    badgeBorder: 'rgba(247, 147, 26, 0.2)',
    badgeText: '#F7931A',
    accentGlow: 'rgba(247, 147, 26, 0.08)',
    glowOpacity: 0.08,
  },
  'forest-green': {
    bg: '#021a08',
    text: '#f0fdf4',
    subText: '#86efac',
    accent: '#22C55E',
    gradientText: 'linear-gradient(135deg, #22C55E 0%, #86efac 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(34, 197, 94, 0.05)',
    cardBorder: 'rgba(34, 197, 94, 0.18)',
    badgeBg: 'rgba(34, 197, 94, 0.1)',
    badgeBorder: 'rgba(34, 197, 94, 0.2)',
    badgeText: '#22C55E',
    accentGlow: 'rgba(34, 197, 94, 0.08)',
    glowOpacity: 0.08,
  },
  'red-hacker': {
    bg: '#0d0000',
    text: '#fff1f2',
    subText: '#fca5a5',
    accent: '#EF4444',
    gradientText: 'linear-gradient(135deg, #EF4444 0%, #f87171 100%)',
    fontClass: 'font-mono',
    cardBg: 'rgba(239, 68, 68, 0.05)',
    cardBorder: 'rgba(239, 68, 68, 0.2)',
    badgeBg: 'rgba(239, 68, 68, 0.1)',
    badgeBorder: 'rgba(239, 68, 68, 0.2)',
    badgeText: '#EF4444',
    accentGlow: 'rgba(239, 68, 68, 0.08)',
    glowOpacity: 0.1,
  },
  'ocean-blue': {
    bg: '#00111a',
    text: '#f0f9ff',
    subText: '#7dd3fc',
    accent: '#0EA5E9',
    gradientText: 'linear-gradient(135deg, #0EA5E9 0%, #38bdf8 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(14, 165, 233, 0.05)',
    cardBorder: 'rgba(14, 165, 233, 0.18)',
    badgeBg: 'rgba(14, 165, 233, 0.1)',
    badgeBorder: 'rgba(14, 165, 233, 0.2)',
    badgeText: '#0EA5E9',
    accentGlow: 'rgba(14, 165, 233, 0.08)',
    glowOpacity: 0.08,
  },
  'warm-editorial': {
    bg: '#1a0f00',
    text: '#fff7ed',
    subText: '#fdba74',
    accent: '#F97316',
    gradientText: 'linear-gradient(135deg, #F97316 0%, #fb923c 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(249, 115, 22, 0.05)',
    cardBorder: 'rgba(249, 115, 22, 0.18)',
    badgeBg: 'rgba(249, 115, 22, 0.1)',
    badgeBorder: 'rgba(249, 115, 22, 0.2)',
    badgeText: '#F97316',
    accentGlow: 'rgba(249, 115, 22, 0.08)',
    glowOpacity: 0.08,
  },
  'rose-gold': {
    bg: '#1a0010',
    text: '#fff1f2',
    subText: '#f9a8d4',
    accent: '#EC4899',
    gradientText: 'linear-gradient(135deg, #EC4899 0%, #f472b6 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(236, 72, 153, 0.05)',
    cardBorder: 'rgba(236, 72, 153, 0.18)',
    badgeBg: 'rgba(236, 72, 153, 0.1)',
    badgeBorder: 'rgba(236, 72, 153, 0.2)',
    badgeText: '#EC4899',
    accentGlow: 'rgba(236, 72, 153, 0.08)',
    glowOpacity: 0.08,
  },
  'clinical-white': {
    bg: '#f0f9ff',
    text: '#0c4a6e',
    subText: '#0369a1',
    accent: '#06B6D4',
    gradientText: 'linear-gradient(135deg, #06B6D4 0%, #0ea5e9 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(6, 182, 212, 0.05)',
    cardBorder: 'rgba(6, 182, 212, 0.18)',
    badgeBg: 'rgba(6, 182, 212, 0.1)',
    badgeBorder: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#0891B2',
    accentGlow: 'rgba(6, 182, 212, 0.08)',
    glowOpacity: 0.08,
    isLight: true,
  },
  holographic: {
    bg: '#0a0015',
    text: '#f5f3ff',
    subText: '#c4b5fd',
    accent: '#8B5CF6',
    gradientText: 'linear-gradient(135deg, #8B5CF6 0%, #c084fc 50%, #06B6D4 100%)',
    fontClass: 'font-sans',
    cardBg: 'rgba(139, 92, 246, 0.06)',
    cardBorder: 'rgba(139, 92, 246, 0.2)',
    badgeBg: 'rgba(139, 92, 246, 0.12)',
    badgeBorder: 'rgba(139, 92, 246, 0.25)',
    badgeText: '#A78BFA',
    accentGlow: 'rgba(139, 92, 246, 0.1)',
    glowOpacity: 0.1,
  },
};

/* ─── Animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } } };
const fadeLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', bounce: 0.3 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ─── Animated section wrapper ─── */
function SectionWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Skill chip ─── */
function SkillChip({ label, level = 'secondary', cfg }: { label: string; level?: 'primary' | 'secondary' | 'tool' | 'learning'; cfg: ThemeConfig }) {
  const styles = {
    primary:   { background: `${cfg.accent}15`, border: `${cfg.accent}30`, text: cfg.accent },
    secondary: { background: cfg.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: cfg.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)', text: cfg.isLight ? '#444' : '#94a3b8' },
    tool:      { background: `rgba(6,182,212,0.1)`, border: `rgba(6,182,212,0.2)`, text: '#67e8f9' },
    learning:  { background: `rgba(245,158,11,0.1)`, border: `rgba(245,158,11,0.2)`, text: '#fde68a' },
  };
  const st = styles[level] || styles.secondary;
  return (
    <motion.span variants={scaleIn} whileHover={{ scale: 1.06, y: -1 }}
      className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-lg font-medium border cursor-default transition-all"
      style={{ background: st.background, borderColor: st.border, color: st.text }}>
      {label}
    </motion.span>
  );
}

/* ─── Stat card ─── */
function StatCard({ value, label, cfg }: { value: string | number; label: string; cfg: ThemeConfig }) {
  return (
    <motion.div variants={scaleIn} className="p-4 rounded-2xl border text-center transition-all"
      style={{ background: cfg.cardBg, borderColor: cfg.cardBorder }}>
      <div className="text-2xl font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: cfg.subText }}>{label}</div>
    </motion.div>
  );
}

/* ─── Social link ─── */
function SocialBtn({ href, icon: Icon, label, cfg }: { href?: string; icon: any; label: string; cfg: ThemeConfig }) {
  if (!href) return null;
  const url = href.startsWith('http') ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
      style={{ color: cfg.isLight ? '#555' : '#94a3b8' }}>
      <Icon className="w-3.5 h-3.5" style={{ color: cfg.accent }} />{label}
    </a>
  );
}

/* ─── Spotlight Card (Mouse Tracking) ─── */
function SpotlightCard({ children, cfg, className = '', style = {} }: { children: React.ReactNode; cfg: ThemeConfig; className?: string; style?: React.CSSProperties }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group ${className}`}
      style={{
        background: cfg.cardBg,
        borderColor: cfg.cardBorder,
        ...style
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              ${cfg.accent}12,
              transparent 80%
            )
          `,
          border: `1px solid ${cfg.accent}30`
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Floating particle ─── */
function Particle({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.15 }}
      animate={{ y: [-10, 10, -10], opacity: [0.1, 0.4, 0.1] }}
      transition={{ repeat: Infinity, duration: 4 + delay, delay, ease: 'easeInOut' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THE DYNAMIC PORTFOLIO TEMPLATE
═══════════════════════════════════════════════════════════════════ */
export default function PortfolioRenderer({ portfolio }: { portfolio: Portfolio }) {
  const d: PortfolioData = portfolio.data || {};
  const [copied, setCopied] = useState(false);
  const [cursor, setCursor] = useState(true);
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Read active theme configurations dynamically
  const activeTheme = portfolio.theme || d.theme || 'developer';
  const baseCfg = THEME_CONFIGS[activeTheme] || THEME_CONFIGS.developer;

  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setIsLightMode(baseCfg.isLight || false);
  }, [activeTheme, baseCfg.isLight]);

  const cfg = {
    ...baseCfg,
    bg: isLightMode ? (activeTheme === 'designer' ? '#fdf9f9' : '#f8fafc') : (activeTheme === 'designer' ? '#181212' : baseCfg.bg),
    text: isLightMode ? '#0f172a' : (activeTheme === 'designer' ? '#f5f5f5' : baseCfg.text),
    subText: isLightMode ? '#475569' : (activeTheme === 'designer' ? 'rgba(245, 245, 245, 0.7)' : baseCfg.subText),
    cardBg: isLightMode ? 'rgba(0, 0, 0, 0.02)' : baseCfg.cardBg,
    cardBorder: isLightMode ? 'rgba(0, 0, 0, 0.08)' : baseCfg.cardBorder,
    badgeBg: isLightMode ? 'rgba(0, 0, 0, 0.04)' : baseCfg.badgeBg,
    badgeBorder: isLightMode ? 'rgba(0, 0, 0, 0.08)' : baseCfg.badgeBorder,
    badgeText: isLightMode ? '#4f46e5' : baseCfg.badgeText,
    isLight: isLightMode,
  };

  useEffect(() => {
    const t = setInterval(() => setCursor(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  const allSkills = [
    ...(d.skillGroups?.primary || []),
    ...(d.skillGroups?.secondary || []),
    ...(d.skills || []),
  ].filter(Boolean);
  const featuredProjects = d.projects?.filter(p => p.featured) || [];
  const allProjects = d.projects || [];
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : allProjects;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${cfg.fontClass}`} style={{ background: cfg.bg, color: cfg.text }}>
      
      {/* ── Background decorations ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern for developer/scientist/executive */}
        {!cfg.isLight && (
          <div style={{
            backgroundImage: `linear-gradient(${cfg.accent}03 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}03 1px, transparent 1px)`,
            backgroundSize: '60px 60px', width: '100%', height: '100%'
          }} />
        )}
        
        {/* Radial glows */}
        <motion.div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: cfg.accentGlow }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 12 }} />
        <motion.div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: `${cfg.accent}03` }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 15, delay: 3 }} />
        
        {/* Floating blobs for designer theme */}
        {activeTheme === 'designer' && (
          <>
            <motion.div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full blur-3xl"
              style={{ background: 'rgba(255,182,193,0.2)' }}
              animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 8 }} />
            <motion.div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'rgba(255,192,203,0.15)' }}
              animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 10, delay: 2 }} />
          </>
        )}

        {/* Floating particles */}
        {[
          { x: 10, y: 20, size: 4, delay: 0 }, { x: 80, y: 15, size: 3, delay: 1.5 },
          { x: 60, y: 70, size: 5, delay: 0.8 }, { x: 25, y: 80, size: 3, delay: 2.2 },
          { x: 90, y: 50, size: 4, delay: 1.1 }, { x: 45, y: 35, size: 2, delay: 3 },
        ].map((p, i) => <Particle key={i} {...p} color={cfg.accent} />)}
      </div>

      {/* ── Floating top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="px-3 py-1.5 rounded-full text-[11px] flex items-center gap-2"
          style={{ background: cfg.isLight ? 'rgba(255,255,255,0.7)' : 'rgba(8,12,20,0.8)', border: cfg.isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', color: cfg.isLight ? '#333' : '#94a3b8' }}>
          <Eye className="w-3 h-3" style={{ color: cfg.accent }} /> {portfolio.views || 0} views
        </motion.div>
        
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <motion.button onClick={() => setIsLightMode(!isLightMode)} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="flex items-center justify-center w-7 h-7 rounded-full transition-colors text-xs"
            style={{ background: cfg.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)', border: cfg.isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', color: cfg.isLight ? '#333' : '#fff' }}>
            {isLightMode ? '🌙' : '☀️'}
          </motion.button>

          <motion.button onClick={copyLink} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-colors"
            style={{ background: cfg.isLight ? 'rgba(255,255,255,0.7)' : 'rgba(8,12,20,0.8)', border: cfg.isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', color: cfg.isLight ? '#333' : '#94a3b8' }}>
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Share'}
          </motion.button>
        </div>
      </div>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl">

          {/* Developer layout code prompt bar */}
          {activeTheme === 'developer' && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-t-xl mb-6 max-w-sm" style={{ background: '#0a1a10', border: '1px solid rgba(0,255,148,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] ml-2 text-emerald-500/60 font-mono">portfolio.sh</span>
            </div>
          )}

          {/* Availability pill */}
          {d.availability && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8"
              style={{ background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30`, color: cfg.accent }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.accent }} />
              {d.availability}
              {d.location && <><span className="opacity-40 mx-1">·</span><MapPin className="w-3 h-3" />{d.location}</>}
            </motion.div>
          )}

          {/* Name */}
          <div className="overflow-hidden mb-2">
            <motion.h1 initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-none tracking-tight"
              style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>
              {d.name || 'Your Name'}
              <span style={{ opacity: cursor ? 1 : 0, color: cfg.accent }}>.</span>
            </motion.h1>
          </div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
            className="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-6"
            style={{ background: cfg.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {d.title || 'Software Engineer'}
          </motion.div>

          {/* Summary */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
            className="text-base md:text-lg leading-relaxed max-w-2xl mb-10"
            style={{ color: cfg.subText }}>
            {d.summary || 'Building things that matter.'}
          </motion.p>

          {/* Social links */}
          <motion.div className="flex flex-wrap items-center gap-6 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <SocialBtn href={d.social?.github} icon={Globe} label="GitHub" cfg={cfg} />
            <SocialBtn href={d.social?.linkedin} icon={Link2} label="LinkedIn" cfg={cfg} />
            <SocialBtn href={d.social?.portfolio} icon={ExternalLink} label="Portfolio" cfg={cfg} />
            <SocialBtn href={d.email ? `mailto:${d.email}` : undefined} icon={Mail} label={d.email || 'Email'} cfg={cfg} />
            {d.social?.kaggle && <SocialBtn href={d.social.kaggle} icon={Code2} label="Kaggle" cfg={cfg} />}
          </motion.div>

          {/* Job-Fit Matcher Hero CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="mb-12">
            <button
              onClick={() => setIsJobMatcherOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105 border cursor-pointer hover:shadow-lg"
              style={{
                background: `${cfg.accent}15`,
                borderColor: `${cfg.accent}30`,
                color: cfg.accent,
                boxShadow: `0 4px 20px ${cfg.accent}10`
              }}
            >
              <Briefcase className="w-4 h-4" /> Are you a recruiter? Check My Job Match
            </button>
          </motion.div>

          {/* Stats */}
          {d.stats && (
            <SectionWrapper className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
              {d.stats.years_experience !== undefined && d.stats.years_experience > 0 && <StatCard value={`${d.stats.years_experience}+`} label="Years Exp" cfg={cfg} />}
              {d.stats.projects_shipped !== undefined && d.stats.projects_shipped > 0 && <StatCard value={d.stats.projects_shipped} label="Projects" cfg={cfg} />}
              {d.stats.github_repos !== undefined && d.stats.github_repos > 0 && <StatCard value={d.stats.github_repos} label="Repos" cfg={cfg} />}
              {d.stats.github_stars !== undefined && d.stats.github_stars > 0 && <StatCard value={d.stats.github_stars.toLocaleString()} label="Stars" cfg={cfg} />}
            </SectionWrapper>
          )}

          {/* Scroll cue */}
          <motion.div className="mt-16 flex items-center gap-2 text-xs"
            style={{ color: cfg.isLight ? '#888' : '#475569' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <ChevronDown className="w-4 h-4" /> Scroll to explore
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ SKILLS SECTION ═══════════════ */}
      {(allSkills.length > 0 || d.skillGroups?.tools?.length || d.skillGroups?.learning?.length) && (
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-5xl mx-auto">
            <SectionWrapper>
              <motion.div variants={fadeLeft} className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg,transparent,${cfg.accent}50)` }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>Skills & Expertise</span>
                <div className="h-px flex-1" style={{ background: cfg.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)' }} />
              </motion.div>

              {d.skillGroups?.primary && d.skillGroups.primary.length > 0 && (
                <motion.div variants={fadeUp} className="mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: cfg.accent }}>Core Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {d.skillGroups.primary.map(s => <SkillChip key={s} label={s} level="primary" cfg={cfg} />)}
                  </div>
                </motion.div>
              )}
              {d.skillGroups?.secondary && d.skillGroups.secondary.length > 0 && (
                <motion.div variants={fadeUp} className="mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>Secondary</div>
                  <div className="flex flex-wrap gap-2">
                    {d.skillGroups.secondary.map(s => <SkillChip key={s} label={s} level="secondary" cfg={cfg} />)}
                  </div>
                </motion.div>
              )}
              {!d.skillGroups && allSkills.length > 0 && (
                <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                  {allSkills.map(s => <SkillChip key={s} label={s} level="primary" cfg={cfg} />)}
                </motion.div>
              )}
              <div className="flex flex-wrap gap-8 mt-6">
                {d.skillGroups?.tools && d.skillGroups.tools.length > 0 && (
                  <motion.div variants={fadeUp}>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 mb-3">Tools & Systems</div>
                    <div className="flex flex-wrap gap-2">
                      {d.skillGroups.tools.map(s => <SkillChip key={s} label={s} level="tool" cfg={cfg} />)}
                    </div>
                  </motion.div>
                )}
                {d.skillGroups?.learning && d.skillGroups.learning.length > 0 && (
                  <motion.div variants={fadeUp}>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mb-3">Learning</div>
                    <div className="flex flex-wrap gap-2">
                      {d.skillGroups.learning.map(s => <SkillChip key={s} label={s} level="learning" cfg={cfg} />)}
                    </div>
                  </motion.div>
                )}
              </div>
            </SectionWrapper>
          </div>
        </section>
      )}

      {/* ═══════════════ EXPERIENCE SECTION ═══════════════ */}
      {d.experience && d.experience.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24" style={{ background: cfg.isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-5xl mx-auto">
            <SectionWrapper>
              <motion.div variants={fadeLeft} className="flex items-center gap-4 mb-12">
                <Briefcase className="w-5 h-5" style={{ color: cfg.accent }} />
                <h2 className="text-3xl font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>Experience</h2>
              </motion.div>
              <div className="space-y-0">
                {d.experience.map((e, i) => (
                  <motion.div key={i} variants={fadeUp}
                    className="relative flex gap-6 pb-10 last:pb-0">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center shrink-0">
                      <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 z-10"
                        style={{
                          background: i === 0 ? cfg.gradientText : cfg.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${cfg.accent}30`,
                          color: i === 0 ? (cfg.isLight && activeTheme === 'designer' ? '#fff' : '#fff') : cfg.accent
                        }}
                        whileHover={{ scale: 1.1 }}>
                        {e.company?.[0] || '?'}
                      </motion.div>
                      {i < d.experience!.length - 1 && (
                        <div className="w-px flex-1 mt-2" style={{ background: cfg.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-1 pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{e.role}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold" style={{ color: cfg.accent }}>{e.company}</span>
                            {e.location && <><span className="text-slate-500">·</span><span className="text-xs flex items-center gap-1" style={{ color: cfg.subText }}><MapPin className="w-3 h-3" />{e.location}</span></>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {e.type && <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${cfg.accent}30`, color: cfg.accent, background: `${cfg.accent}08` }}>{e.type}</span>}
                          <span className="text-xs" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>{e.duration}</span>
                        </div>
                      </div>
                      {e.description && <p className="text-sm leading-relaxed mb-3" style={{ color: cfg.isLight ? '#444' : '#b4c6ef' }}>{e.description}</p>}
                      {e.achievements && e.achievements.length > 0 && (
                        <ul className="space-y-1.5 mb-3">
                          {e.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm" style={{ color: cfg.isLight ? '#444' : '#b4c6ef' }}>
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: cfg.accent }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                      {e.tech && e.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {e.tech.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: `${cfg.accent}08`, border: `1px solid ${cfg.accent}15`, color: cfg.accent }}>{t}</span>)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </section>
      )}

      {/* ═══════════════ PROJECTS SECTION ═══════════════ */}
      {displayProjects.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-5xl mx-auto">
            <SectionWrapper>
              <motion.div variants={fadeLeft} className="flex items-center justify-between gap-4 mb-12">
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5" style={{ color: cfg.accent }} />
                  <h2 className="text-3xl font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>Projects</h2>
                </div>
                {allProjects.length > displayProjects.length && (
                  <span className="text-xs" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>{allProjects.length} total</span>
                )}
              </motion.div>

              {/* Featured project — large */}
              {displayProjects[0] && (
                <SpotlightCard cfg={cfg} className="mb-6 cursor-pointer">
                  <div className="p-7 md:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {displayProjects[0].featured && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                              style={{ background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30`, color: cfg.accent }}>
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {displayProjects[0].status && (
                            <span className="text-[10px] px-2 py-1 rounded-full border"
                              style={{ borderColor: displayProjects[0].status === 'Live' ? 'rgba(34,197,94,0.3)' : cfg.cardBorder, color: displayProjects[0].status === 'Live' ? '#4ade80' : cfg.accent }}>
                              {displayProjects[0].status === 'Live' && '🟢 '}{displayProjects[0].status}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black mb-1" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{displayProjects[0].title}</h3>
                        {displayProjects[0].tagline && <p className="font-medium mb-3" style={{ color: cfg.accent }}>{displayProjects[0].tagline}</p>}
                        {displayProjects[0].description && <p className="text-sm leading-relaxed max-w-xl" style={{ color: cfg.subText }}>{displayProjects[0].description}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {displayProjects[0].github && (
                          <a href={displayProjects[0].github!.startsWith('http') ? displayProjects[0].github! : `https://${displayProjects[0].github}`}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2.5 rounded-xl transition-all hover:scale-105"
                            style={{ background: cfg.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: `1px solid ${cfg.cardBorder}` }}>
                            <Globe className="w-4 h-4" style={{ color: cfg.accent }} />
                          </a>
                        )}
                        {displayProjects[0].live_url && (
                          <a href={displayProjects[0].live_url.startsWith('http') ? displayProjects[0].live_url : `https://${displayProjects[0].live_url}`}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2.5 rounded-xl transition-all hover:scale-105"
                            style={{ background: `${cfg.accent}10`, border: `1px solid ${cfg.accent}30` }}>
                            <ArrowUpRight className="w-4 h-4" style={{ color: cfg.accent }} />
                          </a>
                        )}
                      </div>
                    </div>
                    {displayProjects[0].tech && displayProjects[0].tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {displayProjects[0].tech.map(t => (
                          <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                            style={{ background: `${cfg.accent}08`, border: `1px solid ${cfg.accent}15`, color: cfg.accent }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              )}

              {/* Remaining projects grid */}
              {displayProjects.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayProjects.slice(1).map((p, i) => (
                    <SpotlightCard key={p.title} cfg={cfg} className="cursor-pointer">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{p.title}</h3>
                            {p.tagline && <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: cfg.accent }}>{p.tagline}</p>}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {p.stars !== undefined && p.stars > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                                style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                                <Star className="w-2.5 h-2.5" />{p.stars}
                              </span>
                            )}
                            {p.live_url && (
                              <a href={p.live_url.startsWith('http') ? p.live_url : `https://${p.live_url}`}
                                target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-colors" style={{ color: cfg.accent }}>
                                <ArrowUpRight className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {p.description && <p className="text-[11px] leading-relaxed line-clamp-2 mb-3" style={{ color: cfg.isLight ? '#666' : '#94a3b8' }}>{p.description}</p>}
                        <div className="flex flex-wrap gap-1">
                          {p.tech?.slice(0, 4).map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                              style={{ background: `${cfg.accent}08`, border: `1px solid ${cfg.accent}12`, color: cfg.accent }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </SectionWrapper>
          </div>
        </section>
      )}

      {/* ═══════════════ EDUCATION + CERTIFICATIONS ═══════════════ */}
      {((d.education && d.education.length > 0) || (d.certifications && d.certifications.length > 0)) && (
        <section className="px-6 md:px-16 lg:px-24 py-24" style={{ background: cfg.isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {d.education && d.education.length > 0 && (
                <SectionWrapper>
                  <motion.div variants={fadeLeft} className="flex items-center gap-3 mb-8">
                    <GraduationCap className="w-5 h-5" style={{ color: cfg.accent }} />
                    <h2 className="text-2xl font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>Education</h2>
                  </motion.div>
                  <div className="space-y-4">
                    {d.education.map((e, i) => (
                      <SpotlightCard key={i} cfg={cfg} className="flex gap-4 p-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: `${cfg.accent}10`, border: `1px solid ${cfg.accent}20` }}>
                          🎓
                        </div>
                        <div>
                          <div className="font-bold text-sm" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{e.degree}</div>
                          <div className="text-xs mt-0.5" style={{ color: cfg.accent }}>{e.institution}</div>
                          <div className="text-[11px] mt-1" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>{e.duration} {e.grade && `· ${e.grade}`}</div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                </SectionWrapper>
              )}
              {d.certifications && d.certifications.length > 0 && (
                <SectionWrapper>
                  <motion.div variants={fadeLeft} className="flex items-center gap-3 mb-8">
                    <Award className="w-5 h-5" style={{ color: cfg.accent }} />
                    <h2 className="text-2xl font-black" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>Certifications</h2>
                  </motion.div>
                  <div className="space-y-3">
                    {d.certifications.map((c, i) => (
                      <SpotlightCard key={i} cfg={cfg} className="flex items-center gap-4 p-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{c.name}</div>
                          <div className="text-[11px]" style={{ color: cfg.isLight ? '#666' : '#64748b' }}>{c.issuer} · {c.year}</div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                </SectionWrapper>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FOOTER / CONTACT ═══════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-5xl mx-auto">
          <SectionWrapper>
            <motion.div variants={fadeUp}
              className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
              style={{ background: `${cfg.accent}05`, border: `1px solid ${cfg.accent}15` }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${cfg.accent}08 0%, transparent 70%)` }} />
              <motion.div variants={fadeUp} className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: cfg.accent }}>Let's work together</div>
                <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>
                  Got a project in mind?
                </h2>
                <p className="text-base max-w-xl mx-auto mb-8" style={{ color: cfg.subText }}>
                  {d.availability || 'I\'m always open to discussing new opportunities, interesting projects, and creative collaborations.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {d.email && (
                    <a href={`mailto:${d.email}`}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                      style={{ background: cfg.gradientText }}>
                      <Mail className="w-4 h-4" /> {d.email}
                    </a>
                  )}
                  {d.social?.linkedin && (
                    <a href={d.social.linkedin.startsWith('http') ? d.social.linkedin : `https://${d.social.linkedin}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                      style={{ background: cfg.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', border: `1px solid ${cfg.cardBorder}`, color: cfg.isLight ? '#1a1a1a' : '#fff' }}>
                      <Link2 className="w-4 h-4" style={{ color: cfg.accent }} /> LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </SectionWrapper>
          <motion.div className="text-center mt-10 text-[11px]" style={{ color: cfg.isLight ? '#888' : '#475569' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Built with <span style={{ color: cfg.accent }}>FolioAI</span> · {portfolio.views || 0} views
          </motion.div>
        </div>
      </section>

      {/* Floating Job Match Button on Bottom-Left */}
      <motion.button
        onClick={() => setIsJobMatcherOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg cursor-pointer transition-transform hover:scale-105"
        style={{
          background: cfg.gradientText,
          boxShadow: `0 8px 30px ${cfg.accent}30`,
          border: `1px solid ${cfg.accent}50`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Briefcase className="w-6 h-6 text-white" />
      </motion.button>

      {/* Siri-Style AI Voice Assistant floating widget */}
      <VoiceAssistant portfolioData={d} cfg={cfg} />

      {/* Job-Fit Matcher modal */}
      <JobMatcher isOpen={isJobMatcherOpen} onClose={() => setIsJobMatcherOpen(false)} portfolioData={d} cfg={cfg} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIRI-STYLE AI VOICE ASSISTANT FLOAT WIDGET
   ═══════════════════════════════════════════════════════════════════════════ */
function VoiceAssistant({ portfolioData, cfg }: { portfolioData: PortfolioData; cfg: ThemeConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [textInput, setTextInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const toggleOpen = () => {
    if (isOpen) {
      stopListening();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      const greeting = `Hi! I'm the AI clone representing ${portfolioData.name || 'this professional'}. Ask me anything about their experience, projects, or skills!`;
      setMessages([{ role: 'assistant', text: greeting }]);
      speakText(greeting);
    }
    setIsOpen(!isOpen);
  };

  const speakText = async (text: string) => {
    setIsPlaying(false);
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          portfolioData,
          tts: true
        })
      });
      if (!res.ok) throw new Error();
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        setIsPlaying(true);
        audioElementRef.current.play().catch(() => setIsPlaying(false));
      }
    } catch {
      console.warn('TTS failed');
    }
  };

  const startListening = async () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await handleAudioUpload(audioBlob);
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      console.error(err);
      toast.error('Microphone access denied. Try typing your question!');
      setShowChat(true);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'user_audio.webm');

      const res = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      const { transcript } = await res.json();

      if (transcript && transcript.trim()) {
        await sendTextMessage(transcript);
      } else {
        setIsProcessing(false);
      }
    } catch {
      toast.error('Could not transcribe audio. Try typing!');
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setTextInput('');

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          portfolioData,
          history: newMessages.map(m => ({ role: m.role, content: m.text })),
          tts: true
        })
      });
      if (!res.ok) throw new Error();

      const responseText = decodeURIComponent(res.headers.get('X-Response-Text') || 'Here is what I found.');
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        setIsPlaying(true);
        setIsProcessing(false);
        audioElementRef.current.play().catch(() => setIsPlaying(false));
      }
    } catch {
      toast.error('AI Voice assistant is currently offline.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <audio
        ref={audioElementRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Floating Action Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg cursor-pointer transition-transform hover:scale-105"
        style={{
          background: cfg.gradientText,
          boxShadow: `0 8px 30px ${cfg.accent}30`,
          border: `1px solid ${cfg.accent}50`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="mic" className="relative flex items-center justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <Mic className="w-6 h-6 text-white animate-pulse" />
              <span className="absolute -inset-2 rounded-full border border-white/30 animate-ping opacity-60 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Siri Call Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[330px] md:w-[380px] h-[480px] max-h-[80vh] rounded-3xl backdrop-blur-xl border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            style={{
              background: cfg.isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 10, 20, 0.85)',
              color: cfg.isLight ? '#1a1a1a' : '#fff'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30` }}>
                  <Bot className="w-4 h-4" style={{ color: cfg.accent }} />
                </div>
                <div>
                  <div className="text-sm font-black">{portfolioData.name || 'AI Clone'}</div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Voice Agent
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {showChat ? 'Voice View' : 'Chat View'}
                </button>
              </div>
            </div>

            {/* Chat History / Visualizer Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col" ref={scrollRef}>
              {showChat ? (
                messages.map((m, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'text-white font-medium'
                          : cfg.isLight ? 'bg-black/5' : 'bg-white/5'
                      }`}
                      style={{
                        background: m.role === 'user' ? cfg.gradientText : undefined
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                  <div className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">
                    {isListening ? 'Listening...' : isProcessing ? 'Analyzing...' : isPlaying ? 'Speaking...' : 'Ready'}
                  </div>

                  {/* Siri Orb / Equalizer Waveform */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Breathing Orb: Idle State */}
                    {!isListening && !isProcessing && !isPlaying && (
                      <motion.div
                        className="w-20 h-20 rounded-full blur-md"
                        style={{
                          background: `radial-gradient(circle, ${cfg.accent}40 0%, transparent 70%)`
                        }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      />
                    )}

                    {/* Rippling Waves: Listening State */}
                    {isListening && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="absolute w-20 h-20 rounded-full border border-red-500/40"
                          animate={{ scale: [1, 2], opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                        />
                        <motion.div
                          className="absolute w-20 h-20 rounded-full border border-red-500/20"
                          animate={{ scale: [1, 2], opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        />
                        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center glow-rose">
                          <Mic className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                    )}

                    {/* Thinking Double Ring Loader */}
                    {isProcessing && (
                      <div className="relative w-20 h-20">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-dashed"
                          style={{ borderColor: cfg.accent }}
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                        />
                        <motion.div
                          className="absolute inset-2 rounded-full border border-dashed opacity-50"
                          style={{ borderColor: cfg.accent }}
                          animate={{ rotate: -360 }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                      </div>
                    )}

                    {/* Dynamic neon soundwave equalizer: Speaking State */}
                    {isPlaying && (
                      <div className="flex items-center gap-1 h-12">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <motion.div
                            key={bar}
                            className="w-1 rounded-full"
                            style={{ background: cfg.accent }}
                            animate={{
                              height: bar === 1 || bar === 5 ? [8, 24, 8] : bar === 2 || bar === 4 ? [14, 40, 14] : [18, 48, 18]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: bar === 1 || bar === 5 ? 0.6 : bar === 2 || bar === 4 ? 0.8 : 0.7,
                              delay: bar * 0.1,
                              ease: 'easeInOut'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Latest AI Text Output */}
                  <div className="mt-8 px-4 text-center max-w-[260px] h-16 overflow-y-auto scrollbar-thin">
                    <p className="text-xs leading-relaxed text-slate-400 italic">
                      {messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].text : ''}
                    </p>
                  </div>
                </div>
              )}

              {isProcessing && showChat && (
                <div className="self-start flex items-center gap-1 p-2 rounded-xl bg-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="p-4 border-t border-white/5 bg-black/10 flex flex-col gap-3">
              {showChat ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); sendTextMessage(textInput); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="input-field text-xs flex-1"
                    disabled={isProcessing}
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                    style={{ background: cfg.gradientText }}
                    disabled={isProcessing || !textInput.trim()}
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="btn-danger w-32 justify-center text-xs py-2 rounded-full flex items-center gap-2 glow-rose animate-pulse"
                    >
                      <PhoneOff className="w-4 h-4" /> Stop & Send
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      disabled={isProcessing}
                      className="btn-primary w-32 justify-center text-xs py-2 rounded-full flex items-center gap-2 glow-md"
                      style={{ background: cfg.gradientText }}
                    >
                      <PhoneCall className="w-4 h-4" /> Start Talking
                    </button>
                  )}
                  {isPlaying && (
                    <button
                      onClick={() => { if (audioElementRef.current) { audioElementRef.current.pause(); setIsPlaying(false); } }}
                      className="btn-secondary text-[10px] px-3 py-1.5 rounded-full"
                    >
                      Mute Voice
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI RECRUITER JOB-FIT MATCHER MODAL
   ═══════════════════════════════════════════════════════════════════════════ */
function JobMatcher({ isOpen, onClose, portfolioData, cfg }: { isOpen: boolean; onClose: () => void; portfolioData: PortfolioData; cfg: ThemeConfig }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    score: number;
    summary: string;
    highlights: string[];
    gaps: string[];
    questions: string[];
  } | null>(null);

  const handleAnalyzeFit = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setMatchResult(null);
    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData,
          jobDescription
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMatchResult(data.result);
    } catch {
      toast.error('AI match analysis is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Question copied to clipboard!');
  };

  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const score = matchResult?.score || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col overflow-hidden shadow-2xl z-10"
            style={{
              background: cfg.isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 20, 0.9)',
              color: cfg.isLight ? '#1a1a1a' : '#fff'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30` }}>
                  <Briefcase className="w-4 h-4" style={{ color: cfg.accent }} />
                </div>
                <div>
                  <h3 className="text-sm font-black">AI Recruiter Job-Fit Matcher</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Verify semantic alignment in 5 seconds</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!matchResult ? (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Paste Job Description
                  </div>
                  <textarea
                    className="input-field text-xs w-full h-56 resize-none p-4"
                    placeholder="Paste the target job description details, qualifications, or tech stack requirements here to see how my profile matches..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="btn-secondary text-xs px-4 py-2" disabled={loading}>
                      Cancel
                    </button>
                    <button
                      onClick={handleAnalyzeFit}
                      disabled={loading || !jobDescription.trim()}
                      className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5 font-bold cursor-pointer"
                      style={{ background: cfg.gradientText }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Fit...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Analyze Fit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score overview row */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white/3 border border-white/5 shrink-0">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          fill="transparent"
                          stroke={cfg.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}
                          strokeWidth={strokeWidth}
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r={radius}
                          fill="transparent"
                          stroke={cfg.accent}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">{score}%</span>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Match</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="text-sm font-bold" style={{ color: cfg.accent }}>Fit Assessment</h4>
                      <p className="text-xs leading-relaxed text-slate-300">{matchResult.summary}</p>
                    </div>
                  </div>

                  {/* Bullet points mapping */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Matching Highlights */}
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> Matching Strengths
                      </div>
                      <ul className="space-y-2.5">
                        {matchResult.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Identified Gaps */}
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Zap className="w-4 h-4 shrink-0" /> Gap Areas / Missing Skills
                      </div>
                      <ul className="space-y-2.5">
                        {matchResult.gaps.map((g, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Custom interview questions */}
                  <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Interview Questions
                    </div>
                    <div className="space-y-3">
                      {matchResult.questions.map((q, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/3 border border-white/5 text-xs text-slate-300">
                          <span className="flex-1">{q}</span>
                          <button
                            onClick={() => copyToClipboard(q)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setMatchResult(null)}
                      className="text-xs font-bold hover:underline cursor-pointer"
                      style={{ color: cfg.accent }}
                    >
                      ← Test Another Job
                    </button>
                    <button onClick={onClose} className="btn-primary text-xs px-5 py-2 font-bold cursor-pointer" style={{ background: cfg.gradientText }}>
                      Close Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
