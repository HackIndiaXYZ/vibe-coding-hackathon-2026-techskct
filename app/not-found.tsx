'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Zap, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-indigo w-96 h-96 absolute top-[-100px] left-[-100px] opacity-40" />
      <div className="orb orb-violet w-72 h-72 absolute bottom-[-60px] right-[-60px] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="text-center relative z-10 max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-8 glow-lg"
        >
          <Compass className="w-12 h-12 text-white" />
        </motion.div>

        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          This page doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary btn-lg">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-secondary btn-lg">
            <Zap className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
