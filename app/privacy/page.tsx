'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, EyeOff, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <span className="badge badge-emerald text-xs mb-3">Privacy & Trust</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              At <strong>FolioAI</strong>, we take your data privacy seriously. This Policy describes how we handle the information you provide when uploading resumes and creating portfolios.
            </p>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">1. Information We Collect</h2>
            <p>
              When you upload a resume, we extract document text and send it to our secure LLM endpoint (powered by OpenAI GPT-4o) solely for the purpose of structuring your profile. We also collect basic profile info (name, email) and analytics view data on your public portfolios.
            </p>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">2. How Data is Processed</h2>
            <p>
              All processing is done transiently. We do not use your resume contents to train AI models. Your resume data is stored in your private database tables on Supabase, protected by Row Level Security (RLS) policies.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-6">
              <div className="bento-card p-5">
                <Lock className="w-6 h-6 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">DPDP Act Compliant</h3>
                <p className="text-xs text-slate-500">We respect the Digital Personal Data Protection Act guidelines regarding consent and purpose limitation.</p>
              </div>
              <div className="bento-card p-5">
                <EyeOff className="w-6 h-6 text-cyan-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Full Deletion Rights</h3>
                <p className="text-xs text-slate-500">You can trigger permanent deletion of your data and portfolios from your account settings at any time.</p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mt-6 mb-2">3. Third Party Disclosures</h2>
            <p>
              We do not sell, trade, or distribute your personal information to third parties. Resume parsing requests are sent securely to OpenAI and database operations are managed by Supabase.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <p>© 2026 FolioAI. Secure, transparent, and privacy-first.</p>
      </footer>
    </div>
  );
}
