'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Save, Eye, Globe, ArrowLeft, Sparkles, Loader2,
  Monitor, Tablet, Smartphone, Bot, BarChart3,
  ChevronRight, CheckCircle2, User, Briefcase, Code2,
  GraduationCap, Award, Star, Clock, Swords, EyeOff,
  Plus, Trash2, ChevronDown, ChevronUp, Link2, Mail,
  MapPin, Phone, ExternalLink, Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { PortfolioData } from '@/types';

type Device = 'desktop' | 'tablet' | 'mobile';
type Section = 'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'settings';

const SECTIONS: { id: Section; label: string; icon: any; color: string }[] = [
  { id: 'profile',    label: 'Profile',    icon: User,          color: 'text-indigo-400' },
  { id: 'skills',     label: 'Skills',     icon: Code2,         color: 'text-cyan-400' },
  { id: 'experience', label: 'Experience', icon: Briefcase,     color: 'text-violet-400' },
  { id: 'projects',   label: 'Projects',   icon: Star,          color: 'text-amber-400' },
  { id: 'education',  label: 'Education',  icon: GraduationCap, color: 'text-emerald-400' },
  { id: 'settings',   label: 'Settings',   icon: Settings,      color: 'text-rose-400' },
];

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: 'w-full',
  tablet:  'w-[768px]',
  mobile:  'w-[375px]',
};

/* ─── tiny helpers ─── */
const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) => (
  <div>
    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} className="input-field text-xs w-full" />
  </div>
);

const Textarea = ({ label, value, onChange, rows = 3, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) => (
  <div>
    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} className="input-field text-xs w-full resize-none" />
  </div>
);

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/6 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-300 hover:bg-white/3 transition-colors">
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      {open && <div className="p-3 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════════ */

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [device, setDevice] = useState<Device>('desktop');
  const [section, setSection] = useState<Section>('profile');
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => { loadPortfolio(); }, []);

  const loadPortfolio = async () => {
    const { data: p } = await supabase.from('portfolios').select('*').eq('id', id).single();
    if (!p) { router.push('/dashboard'); return; }
    setPortfolio(p);
    setData(p.data || {});
    setLoading(false);
  };

  const update = (patch: Partial<PortfolioData>) => setData(prev => prev ? { ...prev, ...patch } : null);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('portfolios')
      .update({ data, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error('Save failed'); else toast.success('Saved ✓');
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    const next = !portfolio.published;
    const { error } = await supabase.from('portfolios').update({ published: next }).eq('id', id);
    if (!error) {
      setPortfolio((p: any) => ({ ...p, published: next }));
      toast.success(next ? '🚀 Portfolio is live!' : 'Unpublished');
    }
    setPublishing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this portfolio? This cannot be undone.')) return;
    setDeleting(true);
    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) { toast.error('Delete failed'); setDeleting(false); return; }
    toast.success('Portfolio deleted');
    router.push('/dashboard');
  };

  const handleAIEnhance = async () => {
    if (!data) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'summary', content: data.summary }),
      });
      const result = await res.json();
      if (result.enhanced) { update({ summary: result.enhanced }); toast.success('Summary enhanced!'); }
    } catch { toast.error('AI enhancement failed'); }
    setAiLoading(false);
  };

  /* ── Experience helpers ── */
  const addExp = () => update({ experience: [...(data?.experience || []), { company: '', role: '', duration: '', type: 'Full-time', location: '', description: '', tech: [], achievements: [] }] });
  const updateExp = (i: number, patch: any) => update({ experience: (data?.experience || []).map((e, idx) => idx === i ? { ...e, ...patch } : e) });
  const removeExp = (i: number) => update({ experience: (data?.experience || []).filter((_, idx) => idx !== i) });

  /* ── Project helpers ── */
  const addProject = () => update({ projects: [...(data?.projects || []), { title: '', tagline: '', description: '', tech: [], category: 'Web App', status: 'Completed', github: null, live_url: '', featured: false }] });
  const updateProject = (i: number, patch: any) => update({ projects: (data?.projects || []).map((p, idx) => idx === i ? { ...p, ...patch } : p) });
  const removeProject = (i: number) => update({ projects: (data?.projects || []).filter((_, idx) => idx !== i) });

  /* ── Education helpers ── */
  const addEdu = () => update({ education: [...(data?.education || []), { institution: '', degree: '', duration: '', grade: '' }] });
  const updateEdu = (i: number, patch: any) => update({ education: (data?.education || []).map((e, idx) => idx === i ? { ...e, ...patch } : e) });
  const removeEdu = (i: number) => update({ education: (data?.education || []).filter((_, idx) => idx !== i) });

  /* ── Cert helpers ── */
  const addCert = () => update({ certifications: [...(data?.certifications || []), { name: '', issuer: '', year: new Date().getFullYear() }] });
  const updateCert = (i: number, patch: any) => update({ certifications: (data?.certifications || []).map((c, idx) => idx === i ? { ...c, ...patch } : c) });
  const removeCert = (i: number) => update({ certifications: (data?.certifications || []).filter((_, idx) => idx !== i) });

  if (loading) return (
    <div className="min-h-screen mesh-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center glow-sm animate-pulse">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-xs text-slate-500">Loading your portfolio…</span>
      </div>
    </div>
  );

  return (
    <div className="h-screen mesh-bg flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-4 gap-3 shrink-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-semibold text-white truncate">{portfolio?.title || 'Portfolio Editor'}</span>
          {portfolio?.published && <span className="badge-live text-[10px] shrink-0">Live</span>}
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-0.5 p-1 glass rounded-xl shrink-0">
          {(['desktop', 'tablet', 'mobile'] as Device[]).map(d => {
            const Icon = d === 'desktop' ? Monitor : d === 'tablet' ? Tablet : Smartphone;
            return (
              <button key={d} onClick={() => setDevice(d)}
                className={`p-1.5 rounded-lg transition-all ${device === d ? 'gradient-bg text-white glow-xs' : 'text-slate-500 hover:text-white'}`}>
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/portfolio/${portfolio?.slug}`} target="_blank" className="btn-ghost text-xs gap-1.5 py-2">
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
          <button onClick={handleSave} disabled={saving} className="btn-secondary text-xs gap-1.5 py-2">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>
          <button onClick={handlePublish} disabled={publishing}
            className={`text-xs py-2 px-3 rounded-lg font-semibold gap-1.5 flex items-center transition-all ${portfolio?.published
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
              : 'btn-primary'}`}>
            {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            {portfolio?.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Section nav (icons) ── */}
        <div className="w-12 glass-strong border-r border-white/5 flex flex-col items-center py-3 gap-1.5 shrink-0">
          {SECTIONS.map(({ id: sid, label, icon: Icon, color }) => (
            <button key={sid} onClick={() => setSection(sid)}
              title={label}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${section === sid ? 'gradient-bg text-white glow-xs' : `${color} opacity-40 hover:opacity-100 hover:bg-white/5`}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="flex-1" />
          <div className="w-8 h-px bg-white/8 my-1" />
          <Link href={`/analytics/${id}`} title="Analytics" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
            <BarChart3 className="w-4 h-4" />
          </Link>
          <Link href={`/recruiter/${id}`} title="AI Recruiter" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
            <Bot className="w-4 h-4" />
          </Link>
          <Link href={`/constellation/${id}`} title="Skill Constellation" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
            <Star className="w-4 h-4" />
          </Link>
          <Link href={`/shadow/${id}`} title="Shadow Resume" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <EyeOff className="w-4 h-4" />
          </Link>
          <Link href={`/capsule/${id}`} title="Time Capsule" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
            <Clock className="w-4 h-4" />
          </Link>
          <Link href="/battle" title="Battle Arena" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <Swords className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Edit panel ── */}
        <div className="w-72 glass-strong border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
          {/* Section header */}
          <div className="px-4 py-3 border-b border-white/5 shrink-0">
            {(() => { const s = SECTIONS.find(s => s.id === section)!; const Icon = s.icon; return (
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-sm font-bold text-white">{s.label}</span>
              </div>
            );})()}
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {/* ─── PROFILE ─── */}
            {section === 'profile' && data && (
              <>
                <CollapsibleSection title="Basic Info">
                  <Input label="Full Name" value={data.name || ''} onChange={v => update({ name: v })} />
                  <Input label="Title / Role" value={data.title || ''} onChange={v => update({ title: v })} placeholder="e.g. Full Stack Developer" />
                  <Input label="Email" value={data.email || ''} onChange={v => update({ email: v })} type="email" />
                  <Input label="Phone" value={(data as any).phone || ''} onChange={v => update({ phone: v } as any)} />
                  <Input label="Location" value={data.location || ''} onChange={v => update({ location: v })} placeholder="City, Country" />
                  <Input label="Availability" value={data.availability || ''} onChange={v => update({ availability: v })} placeholder="Open to work" />
                </CollapsibleSection>

                <CollapsibleSection title="Professional Summary">
                  <Textarea label="" value={data.summary || ''} onChange={v => update({ summary: v })} rows={5} placeholder="Write a compelling 2-4 sentence summary..." />
                  <button onClick={handleAIEnhance} disabled={aiLoading} className="btn-primary w-full justify-center text-xs py-2">
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {aiLoading ? 'Enhancing…' : 'AI Enhance'}
                  </button>
                </CollapsibleSection>

                <CollapsibleSection title="Social Links" defaultOpen={false}>
                  <Input label="GitHub" value={data.social?.github || ''} onChange={v => update({ social: { ...data.social, github: v } })} placeholder="github.com/username" />
                  <Input label="LinkedIn" value={data.social?.linkedin || ''} onChange={v => update({ social: { ...data.social, linkedin: v } })} placeholder="linkedin.com/in/username" />
                  <Input label="Twitter / X" value={data.social?.twitter || ''} onChange={v => update({ social: { ...data.social, twitter: v } })} placeholder="twitter.com/username" />
                  <Input label="Portfolio Website" value={data.social?.portfolio || ''} onChange={v => update({ social: { ...data.social, portfolio: v } })} placeholder="yoursite.com" />
                  <Input label="Dribbble" value={data.social?.dribbble || ''} onChange={v => update({ social: { ...data.social, dribbble: v } })} placeholder="dribbble.com/username" />
                  <Input label="Kaggle" value={data.social?.kaggle || ''} onChange={v => update({ social: { ...data.social, kaggle: v } })} placeholder="kaggle.com/username" />
                </CollapsibleSection>

                <CollapsibleSection title="Stats" defaultOpen={false}>
                  <Input label="Years of Experience" value={String(data.stats?.years_experience || '')} onChange={v => update({ stats: { ...data.stats, years_experience: parseInt(v) || 0 } })} type="number" />
                  <Input label="Projects Shipped" value={String(data.stats?.projects_shipped || '')} onChange={v => update({ stats: { ...data.stats, projects_shipped: parseInt(v) || 0 } })} type="number" />
                  <Input label="GitHub Repos" value={String(data.stats?.github_repos || '')} onChange={v => update({ stats: { ...data.stats, github_repos: parseInt(v) || 0 } })} type="number" />
                  <Input label="GitHub Stars" value={String(data.stats?.github_stars || '')} onChange={v => update({ stats: { ...data.stats, github_stars: parseInt(v) || 0 } })} type="number" />
                </CollapsibleSection>
              </>
            )}

            {/* ─── SKILLS ─── */}
            {section === 'skills' && data && (
              <>
                <CollapsibleSection title="Primary Skills">
                  <Textarea label="Main skills (comma separated)"
                    value={(data.skillGroups?.primary || []).join(', ')}
                    onChange={v => update({ skillGroups: { ...data.skillGroups, primary: v.split(',').map(s => s.trim()).filter(Boolean) } })}
                    rows={3} placeholder="React, TypeScript, Node.js..." />
                </CollapsibleSection>
                <CollapsibleSection title="Secondary Skills">
                  <Textarea label="Other skills (comma separated)"
                    value={(data.skillGroups?.secondary || []).join(', ')}
                    onChange={v => update({ skillGroups: { ...data.skillGroups, secondary: v.split(',').map(s => s.trim()).filter(Boolean) } })}
                    rows={3} />
                </CollapsibleSection>
                <CollapsibleSection title="Tools & Platforms" defaultOpen={false}>
                  <Textarea label="Tools (comma separated)"
                    value={(data.skillGroups?.tools || []).join(', ')}
                    onChange={v => update({ skillGroups: { ...data.skillGroups, tools: v.split(',').map(s => s.trim()).filter(Boolean) } })}
                    rows={2} />
                </CollapsibleSection>
                <CollapsibleSection title="Currently Learning" defaultOpen={false}>
                  <Textarea label="Learning (comma separated)"
                    value={(data.skillGroups?.learning || []).join(', ')}
                    onChange={v => update({ skillGroups: { ...data.skillGroups, learning: v.split(',').map(s => s.trim()).filter(Boolean) } })}
                    rows={2} />
                </CollapsibleSection>
              </>
            )}

            {/* ─── EXPERIENCE ─── */}
            {section === 'experience' && data && (
              <>
                {(data.experience || []).map((exp, i) => (
                  <div key={i} className="border border-white/6 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-white/2">
                      <span className="text-xs font-semibold text-white truncate">{exp.role || `Job ${i + 1}`} {exp.company && `@ ${exp.company}`}</span>
                      <button onClick={() => removeExp(i)} className="p-1 text-slate-600 hover:text-rose-400 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <Input label="Job Title" value={exp.role} onChange={v => updateExp(i, { role: v })} />
                      <Input label="Company" value={exp.company} onChange={v => updateExp(i, { company: v })} />
                      <Input label="Duration" value={exp.duration} onChange={v => updateExp(i, { duration: v })} placeholder="Jan 2022 – Present" />
                      <Input label="Location" value={exp.location || ''} onChange={v => updateExp(i, { location: v })} />
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Type</label>
                        <select value={exp.type || 'Full-time'} onChange={e => updateExp(i, { type: e.target.value })} className="input-field text-xs w-full">
                          {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <Textarea label="Description" value={exp.description || ''} onChange={v => updateExp(i, { description: v })} rows={3} />
                      <Textarea label="Tech Stack (comma separated)" value={(exp.tech || []).join(', ')} onChange={v => updateExp(i, { tech: v.split(',').map(s => s.trim()).filter(Boolean) })} rows={2} />
                      <Textarea
                        label="Key Achievements (one per line)"
                        value={(exp.achievements || []).join('\n')}
                        onChange={v => updateExp(i, { achievements: v.split('\n').map(s => s.trim()).filter(Boolean) })}
                        rows={3}
                        placeholder="e.g. Led design of new API architecture&#10;Reduced load time by 35%"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={addExp} className="btn-secondary w-full justify-center text-xs py-2 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </>
            )}

            {/* ─── PROJECTS ─── */}
            {section === 'projects' && data && (
              <>
                {(data.projects || []).map((p, i) => (
                  <div key={i} className="border border-white/6 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-white/2">
                      <span className="text-xs font-semibold text-white truncate">{p.title || `Project ${i + 1}`}</span>
                      <button onClick={() => removeProject(i)} className="p-1 text-slate-600 hover:text-rose-400 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <Input label="Project Name" value={p.title} onChange={v => updateProject(i, { title: v })} />
                      <Input label="Tagline" value={p.tagline || ''} onChange={v => updateProject(i, { tagline: v })} placeholder="One-line description" />
                      <Textarea label="Description" value={p.description || ''} onChange={v => updateProject(i, { description: v })} rows={3} />
                      <Textarea label="Tech Stack (comma separated)" value={(p.tech || []).join(', ')} onChange={v => updateProject(i, { tech: v.split(',').map(s => s.trim()).filter(Boolean) })} rows={2} />
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                        <select value={p.category || 'Web App'} onChange={e => updateProject(i, { category: e.target.value })} className="input-field text-xs w-full">
                          {['Web App', 'Mobile', 'API', 'ML / AI', 'CLI', 'Library', 'Design', 'Other'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                        <select value={p.status || 'Completed'} onChange={e => updateProject(i, { status: e.target.value })} className="input-field text-xs w-full">
                          {['Live', 'In Development', 'Completed', 'Archived'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <Input label="GitHub URL" value={p.github || ''} onChange={v => updateProject(i, { github: v })} placeholder="github.com/user/repo" />
                      <Input label="Live URL" value={p.live_url || ''} onChange={v => updateProject(i, { live_url: v })} placeholder="project.com" />
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input type="checkbox" checked={p.featured || false} onChange={e => updateProject(i, { featured: e.target.checked })} className="w-3.5 h-3.5 rounded" />
                        Featured project
                      </label>
                    </div>
                  </div>
                ))}
                <button onClick={addProject} className="btn-secondary w-full justify-center text-xs py-2 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </>
            )}

            {/* ─── EDUCATION ─── */}
            {section === 'education' && data && (
              <>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Education</p>
                {(data.education || []).map((e, i) => (
                  <div key={i} className="border border-white/6 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-white/2">
                      <span className="text-xs font-semibold text-white truncate">{e.institution || `Institution ${i + 1}`}</span>
                      <button onClick={() => removeEdu(i)} className="p-1 text-slate-600 hover:text-rose-400 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <Input label="Institution" value={e.institution} onChange={v => updateEdu(i, { institution: v })} />
                      <Input label="Degree" value={e.degree} onChange={v => updateEdu(i, { degree: v })} placeholder="B.Sc. Computer Science" />
                      <Input label="Duration" value={e.duration} onChange={v => updateEdu(i, { duration: v })} placeholder="2018 – 2022" />
                      <Input label="Grade / GPA" value={e.grade || ''} onChange={v => updateEdu(i, { grade: v })} placeholder="3.8 / 4.0" />
                    </div>
                  </div>
                ))}
                <button onClick={addEdu} className="btn-secondary w-full justify-center text-xs py-2 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>

                <div className="h-px bg-white/5 my-2" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Certifications</p>
                {(data.certifications || []).map((c, i) => (
                  <div key={i} className="border border-white/6 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-white/2">
                      <span className="text-xs font-semibold text-white truncate">{c.name || `Cert ${i + 1}`}</span>
                      <button onClick={() => removeCert(i)} className="p-1 text-slate-600 hover:text-rose-400 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <Input label="Certification Name" value={c.name} onChange={v => updateCert(i, { name: v })} />
                      <Input label="Issuer" value={c.issuer} onChange={v => updateCert(i, { issuer: v })} />
                      <Input label="Year" value={String(c.year)} onChange={v => updateCert(i, { year: parseInt(v) || new Date().getFullYear() })} type="number" />
                    </div>
                  </div>
                ))}
                <button onClick={addCert} className="btn-secondary w-full justify-center text-xs py-2 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Certification
                </button>
              </>
            )}

            {/* ─── SETTINGS ─── */}
            {section === 'settings' && (
              <div className="space-y-4">
                <div className="bento-card p-4">
                  <div className="text-xs font-semibold text-white mb-1">Portfolio URL</div>
                  <div className="text-xs text-slate-400 font-mono bg-black/20 rounded-lg p-2.5 break-all">
                    folioai.app/portfolio/{portfolio?.slug}
                  </div>
                </div>
                <div className="bento-card p-4">
                  <div className="text-xs font-semibold text-white mb-1">Status</div>
                  <div className={`text-xs font-semibold ${portfolio?.published ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {portfolio?.published ? '🟢 Published · Live' : '⚫ Draft · Not published'}
                  </div>
                </div>
                <button onClick={handlePublish} disabled={publishing}
                  className={`w-full text-xs py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${portfolio?.published
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'btn-primary'}`}>
                  {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                  {portfolio?.published ? 'Unpublish Portfolio' : 'Publish Portfolio'}
                </button>
                <Link href={`/recruiter/${id}`} className="btn-secondary w-full justify-center text-xs py-2.5">
                  <Bot className="w-3.5 h-3.5" /> Run AI Recruiter Simulation
                </Link>
                <div className="h-px bg-white/5" />
                <div className="bento-card p-4 border-rose-500/20">
                  <div className="text-xs font-bold text-rose-400 mb-1">Danger Zone</div>
                  <p className="text-[10px] text-slate-500 mb-3">This will permanently delete your portfolio and all its data.</p>
                  <button onClick={handleDelete} disabled={deleting}
                    className="w-full text-xs py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all">
                    {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Delete Portfolio
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Save bar */}
          <div className="p-3 border-t border-white/5 shrink-0">
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center text-xs py-2.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-950/30">
          <motion.div layout className={`${DEVICE_WIDTHS[device]} h-full min-h-[600px] transition-all duration-300`}>
            <div className="device-frame-browser h-full">
              <div className="device-frame-browser-bar">
                <div className="device-frame-browser-dot bg-rose-500/70" />
                <div className="device-frame-browser-dot bg-amber-500/70" />
                <div className="device-frame-browser-dot bg-emerald-500/70" />
                <div className="flex-1 mx-3 h-5 bg-white/5 rounded flex items-center px-2.5">
                  <span className="text-[11px] text-slate-500">folioai.app/portfolio/{portfolio?.slug}</span>
                </div>
                <Link href={`/portfolio/${portfolio?.slug}`} target="_blank" className="p-1 text-slate-600 hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              {/* Mini preview inside browser frame */}
              <div className="h-full overflow-auto transition-colors duration-300" style={{ background: MINI_THEMES[data?.theme || 'developer']?.bg || '#050d08' }}>
                <PortfolioMiniPreview data={data} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini themes mapping ─── */
const MINI_THEMES: Record<string, {
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
  terminalBar?: boolean;
  isLight?: boolean;
}> = {
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
    terminalBar: true,
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
  },
};

/* ─── Mini preview renders a scaled-down version of the actual portfolio ─── */
function PortfolioMiniPreview({ data }: { data: PortfolioData | null }) {
  if (!data) return null;
  const activeTheme = data.theme || 'developer';
  const cfg = MINI_THEMES[activeTheme] || MINI_THEMES.developer;
  const allSkills = [...(data.skillGroups?.primary || []), ...(data.skillGroups?.secondary || []), ...(data.skills || [])].filter(Boolean).slice(0, 16);

  return (
    <div className={`p-6 transition-colors duration-300 ${cfg.fontClass}`} style={{ color: cfg.text }}>
      {/* Terminal bar for developer */}
      {cfg.terminalBar && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-t-xl mb-0" style={{ background: '#0a1a10' }}>
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full" style={{ background: cfg.accent }} />
          <span className="text-[9px] ml-2" style={{ color: 'rgba(0, 255, 148, 0.4)' }}>portfolio.sh</span>
        </div>
      )}
      {/* Hero */}
      <div className="p-5 rounded-xl mb-4 transition-all" style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}` }}>
        {cfg.terminalBar && <div className="text-[10px] mb-1" style={{ color: 'rgba(0, 255, 148, 0.4)' }}>$ whoami</div>}
        <h1 className="text-xl font-black mb-0.5" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{data.name || 'Your Name'}</h1>
        <div className="text-sm font-semibold mb-2" style={{ color: cfg.accent }}>{data.title || 'Software Engineer'}</div>
        {data.availability && (
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-semibold mb-2 animate-pulse"
            style={{ background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30`, color: cfg.accent }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.accent }} />
            {data.availability}
          </span>
        )}
        <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: cfg.subText }}>{data.summary}</p>
      </div>
      {/* Skills */}
      {allSkills.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: cfg.accent }}>
            <div className="h-px flex-1" style={{ background: `${cfg.accent}20` }} />Skills<div className="h-px flex-1" style={{ background: `${cfg.accent}20` }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allSkills.map((s, i) => (
              <span key={`${i}-${s}`} className="text-[9px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: `${cfg.accent}08`, border: `1px solid ${cfg.accent}20`, color: cfg.accent }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: cfg.accent }}>Experience</div>
          <div className="space-y-2">
            {data.experience.slice(0, 3).map((e, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}` }}>
                <div className="text-[10px] font-bold" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{e.role}</div>
                <div className="text-[9px]" style={{ color: cfg.accent }}>{e.company} · {e.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: cfg.accent }}>Projects</div>
          <div className="grid grid-cols-2 gap-2">
            {data.projects.slice(0, 4).map((p, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}` }}>
                <div className="text-[10px] font-bold" style={{ color: cfg.isLight ? '#1a1a1a' : '#fff' }}>{p.title}</div>
                <div className="text-[9px] line-clamp-1" style={{ color: cfg.subText }}>{p.tagline}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
