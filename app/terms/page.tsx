'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen mesh-bg text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-white/5 h-14 flex items-center px-6 glass-strong justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 gradient-bg rounded flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm"><span className="gradient-text">Folio</span><span className="text-white">AI</span></span>
        </Link>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 text-slate-300">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-cyan text-xs mb-3">Service Guidelines</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
            Terms of Service
          </h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              By accessing and using **FolioAI**, you agree to abide by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">1. Use of Service</h2>
            <p>
              FolioAI provides a platform to convert resumes into interactive websites. You must not upload offensive, copyright-infringing, or malicious content. You are responsible for maintaining the accuracy and safety of your generated links.
            </p>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">2. Intellectual Property</h2>
            <p>
              You retain full ownership of all resume contents and structured data you submit. FolioAI owns the templates, code parser engine, and underlying system designs.
            </p>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">3. Platform Limitations</h2>
            <p>
              As a tool in Beta testing, FolioAI is provided "as is" without warranties of uptime, absolute data longevity, or scoring correctness. We reserve the right to limit API usage or delete inactive demo accounts.
            </p>

            <div className="p-4 glass rounded-xl border border-white/5 space-y-2.5 mt-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Fair API usage rules apply to resume parsing.
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Portfolios must be created using authentic profiles only.
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <p>© 2026 FolioAI. Clear rules, better career tools.</p>
      </footer>
    </div>
  );
}
