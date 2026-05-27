'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Upload, FileText, X, CheckCircle2, Loader2,
  ArrowLeft, Sparkles, Brain, Palette, Globe, BarChart3
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type Step = 'upload' | 'processing' | 'done';

const PROCESSING_STEPS = [
  { icon: Brain,    label: 'Parsing resume with GPT-4o',       delay: 0 },
  { icon: Sparkles, label: 'Enhancing content & highlights',   delay: 1.2 },
  { icon: Palette,  label: 'Selecting role-adaptive theme',    delay: 2.4 },
  { icon: Globe,    label: 'Building your live portfolio',      delay: 3.6 },
  { icon: BarChart3,label: 'Setting up analytics',             delay: 4.8 },
];

export default function UploadPage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFile = useCallback((f: File) => {
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please sign in first'); router.push('/login'); return; }

    setStep('processing');

    // Animate through processing steps
    PROCESSING_STEPS.forEach((_, i) => {
      setTimeout(() => setCurrentProcessingStep(i), i * 1200);
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPortfolioId(data.portfolioId);
      // After processing animation, redirect to template chooser
      setTimeout(() => router.push(`/choose-template/${data.portfolioId}`), 6000);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      setStep('upload');
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 h-14 flex items-center px-6 glass-strong">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-6 h-6 gradient-bg rounded flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm"><span className="gradient-text">Folio</span><span className="text-white">AI</span></span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {/* ── UPLOAD ─────────────────────────────────────── */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 badge badge-indigo mb-5 text-xs">
                    <Sparkles className="w-3 h-3" />
                    GPT-4o • 60 seconds • 5 themes
                  </div>
                  <h1 className="text-4xl font-black text-white mb-3">
                    Upload Your <span className="gradient-text">Resume</span>
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Drop your PDF or DOCX below. AI will parse it, enhance your content, and build a stunning portfolio.
                  </p>
                </div>

                {/* Drop zone */}
                <motion.div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  animate={{ scale: dragging ? 1.02 : 1 }}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                    file
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : dragging
                      ? 'border-indigo-400/70 bg-indigo-500/8'
                      : 'border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />

                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="font-semibold text-white text-sm mb-1">{file.name}</p>
                        <p className="text-xs text-slate-500 mb-4">
                          {(file.size / 1024).toFixed(0)} KB • {file.name.split('.').pop()?.toUpperCase()}
                        </p>
                        <button
                          onClick={e => { e.stopPropagation(); setFile(null); }}
                          className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-3 h-3" /> Remove file
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center mb-4 transition-colors ${
                          dragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/15'
                        }`}>
                          <Upload className={`w-7 h-7 transition-colors ${dragging ? 'text-indigo-400' : 'text-slate-600'}`} />
                        </div>
                        <p className="font-semibold text-white text-sm mb-1">
                          {dragging ? 'Release to upload' : 'Drop your resume here'}
                        </p>
                        <p className="text-xs text-slate-500">or click to browse</p>
                        <div className="flex items-center gap-2 mt-4">
                          {['PDF', 'DOCX', 'DOC'].map(ext => (
                            <span key={ext} className="badge badge-slate text-[10px]">{ext}</span>
                          ))}
                          <span className="text-[10px] text-slate-600">Max 10MB</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Upload button */}
                <motion.button
                  onClick={handleUpload}
                  disabled={!file}
                  whileHover={file ? { scale: 1.02 } : {}}
                  whileTap={file ? { scale: 0.98 } : {}}
                  className={`btn-primary w-full justify-center py-4 text-base mt-5 ${!file ? 'opacity-40 cursor-not-allowed' : 'glow-md'}`}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate My Portfolio
                </motion.button>

                {/* Template divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>

                {/* Start from template CTA */}
                <Link
                  href="/templates"
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:glow-xs">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Start from a Template</div>
                      <div className="text-xs text-slate-500">3 handcrafted portfolios — edit to make it yours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-indigo text-[10px]">3 templates</span>
                    <Globe className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Link>

                {/* What happens next */}
                <div className="mt-6 bento-card p-5">
                  <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wide uppercase">What happens next</p>
                  <div className="space-y-2.5">
                    {PROCESSING_STEPS.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                          <s.icon className="w-2.5 h-2.5 text-indigo-400" />
                        </div>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PROCESSING ──────────────────────────────────── */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Animated logo */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 gradient-bg rounded-2xl glow-lg animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
                    <motion.circle
                      cx="50" cy="50" r="46"
                      fill="none" stroke="#6366f1" strokeWidth="2"
                      strokeDasharray="289"
                      initial={{ strokeDashoffset: 289 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 6, ease: 'linear' }}
                      strokeLinecap="round"
                      style={{ transformOrigin: 'center', rotate: -90 }}
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-black text-white mb-3">Building Your Portfolio</h2>
                <p className="text-slate-400 text-sm mb-10">GPT-4o is crafting your story…</p>

                {/* Steps */}
                <div className="space-y-3 max-w-sm mx-auto text-left">
                  {PROCESSING_STEPS.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: currentProcessingStep >= i ? 1 : 0.3, x: 0 }}
                      transition={{ delay: s.delay, duration: 0.5 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        currentProcessingStep >= i ? 'glass border border-indigo-500/20' : ''
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        currentProcessingStep > i
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : currentProcessingStep === i
                          ? 'bg-indigo-500/20 border border-indigo-500/40 glow-xs'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        {currentProcessingStep > i
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          : currentProcessingStep === i
                          ? <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                          : <s.icon className="w-3 h-3 text-slate-600" />
                        }
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        currentProcessingStep >= i ? 'text-white' : 'text-slate-600'
                      }`}>
                        {s.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── DONE ──────────────────────────────────────── */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-24 h-24 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 glow-emerald"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </motion.div>
                <h2 className="text-4xl font-black text-white mb-3">Portfolio Created! 🎉</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Your portfolio is ready. Edit, customize and publish it with one click.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => portfolioId && router.push(`/editor/${portfolioId}`)}
                    className="btn-primary btn-lg glow-md"
                  >
                    <Sparkles className="w-5 h-5" />
                    Open Portfolio Editor
                  </button>
                  <Link href="/dashboard" className="btn-secondary btn-lg">
                    Back to Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
