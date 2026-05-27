'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Database, ExternalLink, ChevronDown, ChevronUp,
  FileText, Brain, Star, Zap, BarChart3, Target,
  Users, Code2, Search, BookOpen
} from 'lucide-react';
import { SKILLS_INDEX, CATEGORY_CONFIG, type SkillCategory } from '@/lib/data/skills-index';

const DATASETS = [
  {
    id: 'ds1',
    name: '54k Structured Resume Dataset',
    author: 'Suriya Ganesh',
    url: 'https://www.kaggle.com/datasets/suriyaganesh/resume-dataset-structured',
    size: '38 MB',
    records: '54,000 resumes',
    license: 'MIT',
    color: '#6366f1',
    icon: Users,
    emoji: '👥',
    description: 'Structured data from 54,000 real resumes extracted with OCR + LLMs. Contains 5 relational tables: people, skills, experience, education, and abilities.',
    tables: ['people.csv', 'skills.csv', 'person_skills.csv', 'experience.csv', 'education.csv'],
    powers: [
      { feature: 'Skill Autocomplete', desc: 'Master skill list from person_skills.csv' },
      { feature: 'Skill Constellation', desc: 'Co-occurrence graph from skill pairs' },
      { feature: 'Theme Detection', desc: 'Role → theme mapping calibration' },
      { feature: 'Shadow Resume', desc: 'Real experience pattern analysis' },
      { feature: 'AI Recruiter Score', desc: 'Scoring rubric baseline' },
    ],
  },
  {
    id: 'ds2',
    name: 'Updated Resume Dataset',
    author: 'Jillani SofTech',
    url: 'https://www.kaggle.com/datasets/jillanisofttech/updated-resume-dataset',
    size: '390 KB',
    records: '25 tech categories',
    license: 'CC0 Public Domain',
    color: '#06b6d4',
    icon: Code2,
    emoji: '⌨️',
    description: 'Resume text categorized by 25 tech specializations. Designed for ML-based resume screening and role classification.',
    tables: ['UpdatedResumeDataSet.csv'],
    powers: [
      { feature: 'Role Auto-Detection', desc: 'Validates GPT-detected role against 25 categories' },
      { feature: 'Theme Selection', desc: 'Tech category → visual theme mapping' },
      { feature: 'Portfolio Battle Arena', desc: 'Fair same-role battle matching' },
      { feature: 'AI Recruiter', desc: 'Role-specific scoring calibration' },
    ],
  },
  {
    id: 'ds3',
    name: 'Resume Dataset (NeuralFrame AI)',
    author: 'Saugata Roy Arghya',
    url: 'https://www.kaggle.com/datasets/saugataroyarghya/resume-dataset',
    size: '3.7 MB',
    records: 'Multi-field structured',
    license: 'CC BY-NC 4.0',
    color: '#10b981',
    icon: BookOpen,
    emoji: '📋',
    description: 'Curated by NeuralFrame AI for Bitfest 2025 Datathon. Includes career objectives, certifications, and job matching features from open-source + proprietary sources.',
    tables: ['resume_data.csv'],
    powers: [
      { feature: 'Career Objective Generator', desc: 'Real career objective patterns for bio suggestions' },
      { feature: 'Certification Recommendations', desc: 'Cert → role pattern mapping' },
      { feature: 'Achievement Timeline', desc: 'Real career milestone formatting' },
      { feature: 'Job Match Score', desc: 'Candidate profiling calibration' },
    ],
  },
  {
    id: 'ds4',
    name: 'Resume Dataset PDF',
    author: 'Hadi K P',
    url: 'https://www.kaggle.com/datasets/hadikp/resume-data-pdf',
    size: '2 GB',
    records: '10+ role categories',
    license: 'MIT',
    color: '#f59e0b',
    icon: FileText,
    emoji: '📄',
    description: 'Actual PDF resume files organized into role-specific folders (Data Science, React Developer, Java Developer, DevOps, etc.). Converted from images via OCR.',
    tables: ['Data Science/', 'React Developer/', 'Java Developer/', 'DevOps Engineer/', '...10+ folders'],
    powers: [
      { feature: 'PDF Parser Testing', desc: 'Validated our custom extractor on real PDFs' },
      { feature: 'Portfolio Templates', desc: 'Inspired template structures per role' },
      { feature: 'Upload Validation', desc: 'Edge cases discovered from real PDFs' },
      { feature: 'Role-Adaptive Themes', desc: 'Layout patterns per role category' },
    ],
  },
  {
    id: 'ds5',
    name: 'Project Portfolio Dataset',
    author: 'gacevedob',
    url: 'https://www.kaggle.com/datasets/gacevedob/project-portfolio-dataset',
    size: '9.4 MB',
    records: '12,139 cost records · 6 projects',
    license: 'CC BY-SA 4.0',
    color: '#ec4899',
    icon: BarChart3,
    emoji: '📊',
    description: '6 engineering projects with Performance Measurement Baselines, time-phased costs, and progress over 109 weeks. Unique real-world project delivery data.',
    tables: ['project_portfolio.xlsx'],
    powers: [
      { feature: 'Project Impact Metrics', desc: 'Real cost/progress patterns for achievement bullets' },
      { feature: 'Achievement Timeline', desc: 'Realistic project duration calibration' },
      { feature: 'Career Time Capsule', desc: 'Future goal timeline calibration' },
      { feature: 'AI Recruiter Score', desc: 'Project quality scoring baselines' },
    ],
  },
];

const SKILL_CATEGORIES = Object.entries(CATEGORY_CONFIG) as [SkillCategory, typeof CATEGORY_CONFIG[SkillCategory]][];

export default function DatasetsPage() {
  const [expandedId, setExpandedId] = useState<string | null>('ds1');
  const [searchSkill, setSearchSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  const filteredSkills = SKILLS_INDEX
    .filter(s =>
      (activeCategory === 'all' || s.category === activeCategory) &&
      (!searchSkill || s.name.toLowerCase().includes(searchSkill.toLowerCase()))
    )
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 60);

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4 sticky top-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-white">AI Dataset Explorer</span>
        </div>
      </div>

      <div className="container-page py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-5 border border-indigo-500/20">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-300">5 Kaggle datasets · 54,000+ resumes analyzed</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            What Powers <span className="gradient-text">FolioAI?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Every AI feature — skill suggestions, theme detection, recruiter scores — is trained on and calibrated against real-world resume data from these 5 Kaggle datasets.
          </p>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Total Resumes',       val: '54,000+', icon: FileText,  color: 'text-indigo-400' },
            { label: 'Unique Skills',        val: '500+',    icon: Zap,       color: 'text-cyan-400' },
            { label: 'Job Categories',       val: '25',      icon: Target,    color: 'text-emerald-400' },
            { label: 'Project Cost Records', val: '12,139',  icon: BarChart3, color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="bento-card p-5 text-center">
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <div className="text-2xl font-black text-white">{s.val}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid xl:grid-cols-[1fr_400px] gap-8">
          {/* Left — datasets accordion */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Datasets</h2>
            {DATASETS.map((ds, idx) => {
              const Icon = ds.icon;
              const isOpen = expandedId === ds.id;
              return (
                <motion.div
                  key={ds.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bento-card overflow-hidden"
                  style={{ borderColor: isOpen ? `${ds.color}30` : 'rgba(255,255,255,0.06)' }}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : ds.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/2 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${ds.color}15`, border: `1px solid ${ds.color}30` }}>
                      {ds.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm mb-0.5 truncate">{ds.name}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{ds.records}</span>
                        <span>·</span>
                        <span>{ds.size}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.5 rounded" style={{ background: `${ds.color}15`, color: ds.color }}>
                          {ds.license}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-slate-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-5" style={{ borderTop: `1px solid ${ds.color}20` }}>
                          <p className="text-sm text-slate-400 leading-relaxed pt-4">{ds.description}</p>

                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Tables */}
                            <div>
                              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Files / Tables</div>
                              <div className="space-y-1.5">
                                {ds.tables.map(t => (
                                  <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                                    <FileText className="w-3 h-3 shrink-0" style={{ color: ds.color }} />
                                    <span className="font-mono">{t}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Powers */}
                            <div>
                              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Powers These Features</div>
                              <div className="space-y-2">
                                {ds.powers.map(p => (
                                  <div key={p.feature}>
                                    <div className="text-xs font-semibold text-white">{p.feature}</div>
                                    <div className="text-[10px] text-slate-500">{p.desc}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <a
                              href={ds.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary text-xs py-2 gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View on Kaggle
                            </a>
                            <span className="text-xs text-slate-600">by {ds.author}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right — skill explorer */}
          <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Skill Index</h2>
              <p className="text-xs text-slate-500 mb-4">Extracted from DS1 · {SKILLS_INDEX.length} skills indexed</p>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search skills…"
                  value={searchSkill}
                  onChange={e => setSearchSkill(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-all ${
                    activeCategory === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  All
                </button>
                {SKILL_CATEGORIES.map(([cat, cfg]) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-all ${
                      activeCategory === cat
                        ? 'text-white border'
                        : 'text-slate-500 hover:text-white'
                    }`}
                    style={activeCategory === cat ? { background: `${cfg.color}20`, borderColor: `${cfg.color}40`, color: cfg.color } : {}}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                ))}
              </div>

              {/* Skills grid */}
              <div className="flex flex-wrap gap-1.5 max-h-[55vh] overflow-y-auto pr-1">
                <AnimatePresence>
                  {filteredSkills.map((skill, i) => {
                    const cfg = CATEGORY_CONFIG[skill.category];
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: i * 0.01 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-default"
                        style={{
                          background: `${cfg.color}12`,
                          border: `1px solid ${cfg.color}25`,
                          color: cfg.color,
                        }}
                        title={`Category: ${cfg.label} | Frequency rank: ${skill.frequency}/100`}
                      >
                        <span>{skill.name}</span>
                        <span className="text-[9px] opacity-60 font-normal">
                          {skill.frequency}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <p className="text-[10px] text-slate-600 mt-3">
                Showing {filteredSkills.length} skills · Number = frequency rank (higher = more common in DS1)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
