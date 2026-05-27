'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Sparkles, ExternalLink, Github, Linkedin,
  MapPin, Star, Briefcase, GraduationCap, Award,
  Code2, Palette, Brain, ChevronRight, Loader2,
  Eye, Users, GitFork, Zap, CheckCircle2, Globe
} from 'lucide-react';
import { PORTFOLIO_TEMPLATES, TEMPLATE_META, type PortfolioTemplate } from '@/lib/data/portfolio-templates';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const STYLE_CONFIG: Record<string, {
  bg: string; accent: string; cardBg: string; cardBorder: string;
  tagBg: string; tagText: string; previewIcon: any; previewLabel: string; shimmer: string;
}> = {
  'dark-minimal': {
    bg: 'linear-gradient(135deg, #0a0f1a 0%, #0d1a12 100%)',
    accent: '#00FF94',
    cardBg: 'rgba(0,255,148,0.04)',
    cardBorder: 'rgba(0,255,148,0.12)',
    tagBg: 'rgba(0,255,148,0.1)',
    tagText: '#00FF94',
    previewIcon: Code2,
    previewLabel: 'Full Stack · Dark Minimal',
    shimmer: 'rgba(0,255,148,0.06)',
  },
  'light-editorial': {
    bg: 'linear-gradient(135deg, #fdfcfb 0%, #fff0f0 100%)',
    accent: '#FF6B6B',
    cardBg: 'rgba(255,107,107,0.04)',
    cardBorder: 'rgba(255,107,107,0.15)',
    tagBg: 'rgba(255,107,107,0.1)',
    tagText: '#FF6B6B',
    previewIcon: Palette,
    previewLabel: 'Designer · Light Editorial',
    shimmer: 'rgba(255,107,107,0.06)',
  },
  'dark-techy': {
    bg: 'linear-gradient(135deg, #0c0a1a 0%, #110d2a 100%)',
    accent: '#7C3AED',
    cardBg: 'rgba(124,58,237,0.06)',
    cardBorder: 'rgba(124,58,237,0.2)',
    tagBg: 'rgba(124,58,237,0.12)',
    tagText: '#a78bfa',
    previewIcon: Brain,
    previewLabel: 'ML Engineer · Dark Techy',
    shimmer: 'rgba(124,58,237,0.08)',
  },
  'neon-cyberpunk': {
    bg: 'linear-gradient(135deg, #000d1a 0%, #001a2e 100%)',
    accent: '#00D9FF',
    cardBg: 'rgba(0,217,255,0.04)',
    cardBorder: 'rgba(0,217,255,0.18)',
    tagBg: 'rgba(0,217,255,0.1)',
    tagText: '#00D9FF',
    previewIcon: Code2,
    previewLabel: 'DevOps · Neon Cyberpunk',
    shimmer: 'rgba(0,217,255,0.06)',
  },
  'pastel-creative': {
    bg: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
    accent: '#A855F7',
    cardBg: 'rgba(168,85,247,0.06)',
    cardBorder: 'rgba(168,85,247,0.18)',
    tagBg: 'rgba(168,85,247,0.1)',
    tagText: '#A855F7',
    previewIcon: Palette,
    previewLabel: 'Mobile Dev · Pastel Creative',
    shimmer: 'rgba(168,85,247,0.06)',
  },
  'midnight-finance': {
    bg: 'linear-gradient(135deg, #0a0500 0%, #1a0e00 100%)',
    accent: '#F7931A',
    cardBg: 'rgba(247,147,26,0.05)',
    cardBorder: 'rgba(247,147,26,0.18)',
    tagBg: 'rgba(247,147,26,0.1)',
    tagText: '#F7931A',
    previewIcon: Code2,
    previewLabel: 'Blockchain · Midnight Finance',
    shimmer: 'rgba(247,147,26,0.06)',
  },
  'forest-green': {
    bg: 'linear-gradient(135deg, #021a08 0%, #051a0a 100%)',
    accent: '#22C55E',
    cardBg: 'rgba(34,197,94,0.05)',
    cardBorder: 'rgba(34,197,94,0.18)',
    tagBg: 'rgba(34,197,94,0.1)',
    tagText: '#22C55E',
    previewIcon: Code2,
    previewLabel: 'Game Dev · Forest Green',
    shimmer: 'rgba(34,197,94,0.06)',
  },
  'red-hacker': {
    bg: 'linear-gradient(135deg, #0d0000 0%, #1a0000 100%)',
    accent: '#EF4444',
    cardBg: 'rgba(239,68,68,0.05)',
    cardBorder: 'rgba(239,68,68,0.2)',
    tagBg: 'rgba(239,68,68,0.1)',
    tagText: '#EF4444',
    previewIcon: Code2,
    previewLabel: 'Security · Red Hacker',
    shimmer: 'rgba(239,68,68,0.06)',
  },
  'ocean-blue': {
    bg: 'linear-gradient(135deg, #00111a 0%, #001a28 100%)',
    accent: '#0EA5E9',
    cardBg: 'rgba(14,165,233,0.05)',
    cardBorder: 'rgba(14,165,233,0.18)',
    tagBg: 'rgba(14,165,233,0.1)',
    tagText: '#0EA5E9',
    previewIcon: Users,
    previewLabel: 'Product Manager · Ocean Blue',
    shimmer: 'rgba(14,165,233,0.06)',
  },
  'warm-editorial': {
    bg: 'linear-gradient(135deg, #1a0f00 0%, #2a1500 100%)',
    accent: '#F97316',
    cardBg: 'rgba(249,115,22,0.05)',
    cardBorder: 'rgba(249,115,22,0.18)',
    tagBg: 'rgba(249,115,22,0.1)',
    tagText: '#F97316',
    previewIcon: Code2,
    previewLabel: 'Content Creator · Warm Editorial',
    shimmer: 'rgba(249,115,22,0.06)',
  },
  'rose-gold': {
    bg: 'linear-gradient(135deg, #1a0010 0%, #1a0018 100%)',
    accent: '#EC4899',
    cardBg: 'rgba(236,72,153,0.05)',
    cardBorder: 'rgba(236,72,153,0.18)',
    tagBg: 'rgba(236,72,153,0.1)',
    tagText: '#EC4899',
    previewIcon: Code2,
    previewLabel: 'Quant Finance · Rose Gold',
    shimmer: 'rgba(236,72,153,0.06)',
  },
  'clinical-white': {
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)',
    accent: '#06B6D4',
    cardBg: 'rgba(6,182,212,0.05)',
    cardBorder: 'rgba(6,182,212,0.18)',
    tagBg: 'rgba(6,182,212,0.1)',
    tagText: '#0891B2',
    previewIcon: Code2,
    previewLabel: 'Healthcare IT · Clinical White',
    shimmer: 'rgba(6,182,212,0.06)',
  },
  'holographic': {
    bg: 'linear-gradient(135deg, #0a0015 0%, #150025 50%, #001520 100%)',
    accent: '#8B5CF6',
    cardBg: 'rgba(139,92,246,0.06)',
    cardBorder: 'rgba(139,92,246,0.2)',
    tagBg: 'rgba(139,92,246,0.12)',
    tagText: '#A78BFA',
    previewIcon: Code2,
    previewLabel: 'AR/VR · Holographic',
    shimmer: 'rgba(139,92,246,0.08)',
  },
};

function TemplatePreviewCard({ template, isSelected, onSelect }: {
  template: PortfolioTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const cfg = STYLE_CONFIG[template.template_style];
  const meta = TEMPLATE_META[template.template_style];
  const Icon = cfg.previewIcon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className="cursor-pointer relative rounded-2xl overflow-hidden"
      style={{
        border: isSelected ? `2px solid ${cfg.accent}` : '2px solid rgba(255,255,255,0.06)',
        boxShadow: isSelected ? `0 0 30px ${cfg.accent}22` : 'none',
      }}
    >
      {/* Template preview header */}
      <div className="relative h-48 overflow-hidden" style={{ background: cfg.bg }}>
        {/* Shimmer orbs */}
        <div className="absolute w-32 h-32 rounded-full -top-8 -right-8 blur-2xl opacity-40"
          style={{ background: cfg.accent }} />
        <div className="absolute w-24 h-24 rounded-full bottom-0 left-8 blur-3xl opacity-20"
          style={{ background: cfg.accent }} />

        {/* Mini portfolio preview */}
        <div className="absolute inset-0 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={template.profile.avatar}
              alt={template.profile.name}
              className="w-10 h-10 rounded-full ring-2"
              style={{ ringColor: cfg.accent }}
            />
            <div>
              <div className="text-sm font-bold" style={{
                color: template.template_style === 'light-editorial' ? '#1a1a1a' : '#fff'
              }}>
                {template.profile.name}
              </div>
              <div className="text-[10px]" style={{ color: cfg.accent }}>
                {template.profile.title}
              </div>
            </div>
          </div>

          {/* Mini skill pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {template.skills.primary.slice(0, 4).map((s, i) => (
              <span key={`${i}-${s}`} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: cfg.tagBg, color: cfg.tagText, border: `1px solid ${cfg.accent}30` }}>
                {s}
              </span>
            ))}
          </div>

          {/* Mini stat row */}
          <div className="flex gap-3 mt-auto">
            {[
              { icon: '⭐', val: template.stats.github_stars },
              { icon: '🚀', val: template.stats.projects_shipped },
              { icon: '📁', val: template.stats.github_repos },
            ].map(stat => (
              <div key={stat.icon} className="flex items-center gap-1">
                <span className="text-[10px]">{stat.icon}</span>
                <span className="text-[10px] font-bold" style={{
                  color: template.template_style === 'light-editorial' ? '#444' : '#fff'
                }}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Style badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold"
          style={{ background: `${cfg.accent}20`, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}>
          {meta.label}
        </div>

        {/* Selected checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: cfg.accent }}
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 bg-slate-900/90">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="font-bold text-white text-sm">{template.profile.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{template.profile.title}</div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
            template.profile.availability === 'Open to work'
              ? 'bg-emerald-500/15 text-emerald-400'
              : template.profile.availability === 'Freelance available'
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-slate-700 text-slate-400'
          }`}>
            {template.profile.availability}
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
          {template.profile.bio}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Stars',      val: template.stats.github_stars,    icon: Star },
            { label: 'Projects',   val: template.stats.projects_shipped, icon: Zap },
            { label: 'Experience', val: `${template.stats.years_experience}y`, icon: Briefcase },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}` }}>
              <div className="text-sm font-black text-white">{s.val}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />
          <span>{template.profile.location}</span>
          <span className="ml-auto" style={{ color: cfg.tagText }}>{meta.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

function FullPreview({ template }: { template: PortfolioTemplate }) {
  const cfg = STYLE_CONFIG[template.template_style];
  const isLight = template.template_style === 'light-editorial';
  const textColor = isLight ? '#1a1a1a' : '#ffffff';
  const subColor = isLight ? '#555' : '#94a3b8';
  const cardBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: cfg.bg, border: `1px solid ${cfg.cardBorder}` }}>
      {/* Header */}
      <div className="p-8 border-b" style={{ borderColor: cardBorder }}>
        <div className="flex items-start gap-5">
          <img src={template.profile.avatar} alt={template.profile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2"
            style={{ outlineColor: cfg.accent }} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black" style={{ color: textColor }}>{template.profile.name}</h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: `${cfg.accent}15`, color: cfg.accent }}>
                {template.profile.availability}
              </span>
            </div>
            <div className="text-base font-semibold mb-2" style={{ color: cfg.accent }}>
              {template.profile.title}
            </div>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: subColor }}>{template.profile.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: subColor }}>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{template.profile.location}</span>
              <a href={`mailto:${template.profile.email}`} style={{ color: cfg.accent }}>{template.profile.email}</a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            { label: 'GitHub Stars',    val: template.stats.github_stars.toLocaleString() },
            { label: 'Repos',           val: template.stats.github_repos },
            { label: 'Projects Shipped',val: template.stats.projects_shipped },
            { label: 'Years Exp.',      val: `${template.stats.years_experience}+` },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl text-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="text-xl font-black" style={{ color: cfg.accent }}>{s.val}</div>
              <div className="text-[10px] mt-0.5" style={{ color: subColor }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="p-6 border-b" style={{ borderColor: cardBorder }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: subColor }}>Skills</div>
        <div className="space-y-3">
          {[
            { label: 'Primary',   skills: template.skills.primary },
            { label: 'Secondary', skills: template.skills.secondary },
            { label: 'Learning',  skills: template.skills.learning },
          ].map(group => (
            <div key={group.label} className="flex items-start gap-3">
              <span className="text-[10px] w-16 shrink-0 mt-1" style={{ color: subColor }}>{group.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((s, i) => (
                  <span key={`${group.label}-${i}-${s}`} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: cfg.tagBg, color: cfg.tagText, border: `1px solid ${cfg.accent}25` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="p-6 border-b" style={{ borderColor: cardBorder }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: subColor }}>Featured Projects</div>
        <div className="grid gap-4">
          {template.projects.filter(p => p.featured).map(p => (
            <div key={p.id} className="rounded-xl overflow-hidden"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <img src={p.thumbnail} alt={p.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="font-bold text-sm" style={{ color: textColor }}>{p.title}</div>
                    <div className="text-[11px]" style={{ color: cfg.accent }}>{p.tagline}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.stars > 0 && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: cfg.tagBg, color: cfg.tagText }}>
                        <Star className="w-2.5 h-2.5" /> {p.stars}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      {p.status}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: subColor }}>{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tech.slice(0, 4).map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: cfg.shimmer, color: subColor }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="p-6">
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: subColor }}>Experience</div>
        <div className="space-y-4">
          {template.experience.map((e, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: cfg.accent }} />
              <div>
                <div className="font-bold text-sm" style={{ color: textColor }}>{e.role}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs" style={{ color: cfg.accent }}>{e.company}</span>
                  <span className="text-[10px]" style={{ color: subColor }}>{e.duration} · {e.type}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: subColor }}>{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [using, setUsing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Derive previewTemplate from selectedId to ensure they stay in sync
  const selectedTemplate = PORTFOLIO_TEMPLATES.find(t => t.id === selectedId);

  const handleUseTemplate = async () => {
    if (!selectedTemplate) { toast.error('Select a template first'); return; }
    setUsing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in first'); router.push('/login'); return; }

      const res = await fetch('/api/use-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplate.id, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Portfolio created from template! ✨');
      router.push(`/editor/${data.portfolioId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to use template');
    } finally {
      setUsing(false);
    }
  };

  const stagger = { visible: { transition: { staggerChildren: 0.1 } }, hidden: {} };
  const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4 sticky top-0 z-20">
        <Link href="/upload" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-white">Portfolio Templates</span>
        </div>
        {selectedTemplate && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Selected: <span className="text-white font-semibold">{selectedTemplate.profile.name}</span>
            </span>
            <button
              onClick={handleUseTemplate}
              disabled={using}
              className="btn-primary text-sm gap-2"
            >
              {using ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {using ? 'Creating…' : 'Use this Template'}
            </button>
          </div>
        )}
      </div>

      <div className="container-page py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-5 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-300">13 handcrafted templates</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Start with a <span className="gradient-text">Template</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Pick a template from our curated portfolio collection. Each one is fully editable — swap in your own info in minutes.
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left — template cards */}
          <div className="xl:w-[55%]">
            <motion.div
              variants={stagger} initial="hidden" animate="visible"
              className="grid md:grid-cols-2 xl:grid-cols-1 gap-4"
            >
              {PORTFOLIO_TEMPLATES.map(template => (
                <motion.div key={template.id} variants={item}>
                  <TemplatePreviewCard
                    template={template}
                    isSelected={selectedId === template.id}
                    onSelect={() => setSelectedId(template.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — full preview */}
          <div className="xl:flex-1 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">
                      Full Preview — {selectedTemplate.profile.name}
                    </h3>
                    <button
                      onClick={handleUseTemplate}
                      disabled={using}
                      className="btn-primary text-xs py-1.5 gap-1.5"
                    >
                      {using ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                      Use Template
                    </button>
                  </div>
                  <FullPreview template={selectedTemplate} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bento-card p-12 text-center h-64 flex flex-col items-center justify-center"
                >
                  <Eye className="w-10 h-10 text-slate-600 mb-4" />
                  <p className="text-slate-500">Click a template on the left to preview it here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-12 bento-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <div className="font-bold text-white mb-1">Have your own resume?</div>
            <div className="text-sm text-slate-400">Upload a PDF or DOCX and AI will build a custom portfolio for you.</div>
          </div>
          <Link href="/upload" className="btn-secondary shrink-0">
            <ArrowLeft className="w-4 h-4" /> Upload Resume Instead
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
