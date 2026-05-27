'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail) {
      toast.error('Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!trimmedPassword) {
      toast.error('Password is required');
      return;
    }
    
    if (trimmedPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email: trimmedEmail, 
      password: trimmedPassword 
    });
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email first. Check your inbox for a verification link.', { duration: 6000 });
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Wrong email or password. Please try again.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success(`Welcome back, ${trimmedEmail}! 👋`);
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setOauthLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(`${provider} sign-in failed: ${error.message}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 border-r border-white/5">
        {/* BG effects */}
        <div className="orb orb-indigo w-80 h-80 absolute top-[-80px] left-[-80px] opacity-50" />
        <div className="orb orb-violet w-60 h-60 absolute bottom-[10%] right-[-40px] opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center glow-sm">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">Folio</span><span className="text-white">AI</span>
            </span>
          </Link>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          {/* Floating card mockup */}
          <div className="device-frame-browser mb-8 max-w-sm">
            <div className="device-frame-browser-bar">
              <div className="device-frame-browser-dot bg-rose-500/70" />
              <div className="device-frame-browser-dot bg-amber-500/70" />
              <div className="device-frame-browser-dot bg-emerald-500/70" />
              <div className="flex-1 mx-3 h-4 bg-white/5 rounded text-[10px] text-slate-500 flex items-center px-2">folioai.app/you</div>
            </div>
            <div className="bg-slate-950 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">YN</div>
                <div>
                  <div className="h-3 w-24 bg-white/80 rounded mb-1.5" />
                  <div className="h-2 w-32 bg-indigo-400/50 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="h-2 bg-white/7 rounded w-5/6" />
                <div className="h-2 bg-white/5 rounded w-4/5" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-indigo-900/60 rounded-full border border-indigo-800/50" />
                <div className="h-6 w-14 bg-violet-900/60 rounded-full border border-violet-800/50" />
                <div className="h-6 w-18 bg-cyan-900/60 rounded-full border border-cyan-800/50" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-3">Your career, beautifully presented.</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Upload your resume and get a stunning portfolio website powered by GPT-4o — in under 60 seconds.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              'AI-generated portfolio in 60 seconds',
              '5 role-adaptive themes',
              'AI Recruiter Simulation',
              'Real-time analytics',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-slate-600 relative z-10"
        >
          © 2025 FolioAI. All rights reserved.
        </motion.p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Back button */}
        <div className="absolute top-6 right-6 lg:hidden">
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
        <div className="absolute top-6 left-6 hidden lg:block">
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg"><span className="gradient-text">Folio</span><span className="text-white">AI</span></span>
          </div>

          <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-3xl font-black text-white mb-1.5">
            Welcome back
          </motion.h1>
          <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-slate-400 text-sm mb-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up free
            </Link>
          </motion.p>

          {/* OAuth buttons */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading}
              className="btn-secondary justify-center text-sm py-2.5 gap-2.5"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              disabled={!!oauthLoading}
              className="btn-secondary justify-center text-sm py-2.5 gap-2.5"
            >
              {oauthLoading === 'github' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              )}
              GitHub
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-slate-600 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </motion.div>

          {/* Email form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block tracking-wide">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmail(email.trim())}
                  placeholder="you@company.com"
                  required
                  disabled={loading}
                  className="input-field pl-10 disabled:opacity-50"
                />
              </div>
            </motion.div>

            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400 tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="input-field pl-10 pr-10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
