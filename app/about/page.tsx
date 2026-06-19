'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Users, Brain, Heart } from 'lucide-react';

export default function AboutPage() {
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
          <span className="badge badge-indigo text-xs mb-3">Our Mission</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
            Reimagining the Professional Story
          </h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              In today's digital era, a static PDF resume is no longer sufficient to represent your skills, experience, and unique achievements. <strong>FolioAI</strong> was built to help candidates instantly stand out in recruitment by converting resumes into dynamic, interactive portfolios.
            </p>
            
            <p>
              Powered by advanced GPT-4o models, FolioAI parses any standard resume document, extracts structured career data, and maps it into one of five beautifully designed, role-adaptive themes.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-6">
              <div className="bento-card p-5">
                <Brain className="w-6 h-6 text-cyan-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">AI-Enhanced Analysis</h3>
                <p className="text-xs text-slate-500">Auto-evaluates resumes against industry standards, simulating mock recruiter feedback.</p>
              </div>
              <div className="bento-card p-5">
                <Users className="w-6 h-6 text-violet-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Tailored for Job Seekers</h3>
                <p className="text-xs text-slate-500">Includes native ATS checkers, matching optimizations, and voice simulation features.</p>
              </div>
            </div>

            <p className="pt-6">
              FolioAI is built for final year projects, hackathons, and early-career developers. Our team is passionate about human-centered AI, building tools that are ethical, accessibility-compliant, and focused on empowering applicants in the job market.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <p>© 2026 FolioAI. Made with <Heart className="w-3 h-3 inline text-rose-500 mx-0.5" /> for professional growth.</p>
      </footer>
    </div>
  );
}
