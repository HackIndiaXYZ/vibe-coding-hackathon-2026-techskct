'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, Zap, CheckCircle2, KeyRound, Eye, EyeOff, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type Step = 'email' | 'sent' | 'reset';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Step 1 — send reset email
  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password?step=reset`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setStep('sent');
    }
  };

  // Step 3 — update new password (after clicking email link)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated! Please log in.');
      window.location.href = '/login';
    }
  };

  // Auto-detect reset mode from URL
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('step') === 'reset' && step === 'email') {
    setStep('reset');
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
    exit:   { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen mesh-bg flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 border-r border-white/5">
        <div className="orb orb-violet w-80 h-80 absolute top-[-80px] left-[-80px] opacity-50" />
        <div className="orb orb-cyan w-60 h-60 absolute bottom-[10%] right-[-40px] opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-white">FolioAI</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center glow-violet">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Happens to<br />everyone 🔐
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We'll send a secure link to your email. Click it, set a new password, and you're back in action.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: '📧', label: 'Secure email link sent instantly' },
              { icon: '🔒', label: 'Link expires after 1 hour' },
              { icon: '✅', label: 'No old password needed' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-slate-300 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs relative z-10">Secure password reset · FolioAI</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="orb orb-indigo w-64 h-64 absolute top-0 right-0 opacity-20 lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <AnimatePresence mode="wait">
            {/* ── Step 1: Enter email ── */}
            {step === 'email' && (
              <motion.div
                key="email"
                variants={containerVariants}
                initial="hidden" animate="visible" exit="exit"
              >
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                    <KeyRound className="w-7 h-7 text-violet-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">Forgot Password?</h1>
                  <p className="text-slate-400">No worries. Enter your email and we'll send a reset link.</p>
                </div>

                <form onSubmit={handleSendReset} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 tracking-wide">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                  Remember it?{' '}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* ── Step 2: Email sent ── */}
            {step === 'sent' && (
              <motion.div
                key="sent"
                variants={containerVariants}
                initial="hidden" animate="visible" exit="exit"
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 glow-emerald"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-3">Check your email!</h2>
                <p className="text-slate-400 mb-2">We sent a reset link to</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl mb-6">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-semibold text-sm">{email}</span>
                </div>

                <div className="bento-card p-5 text-left mb-6 space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What to do next</p>
                  {[
                    '1. Open the email from FolioAI',
                    '2. Click "Reset Password" button',
                    '3. You\'ll be redirected back here',
                    '4. Set your new password',
                  ].map(s => (
                    <div key={s} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSendReset}
                    disabled={loading}
                    className="btn-secondary w-full justify-center"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Resend email
                  </button>
                  <Link href="/login" className="btn-ghost w-full justify-center text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </Link>
                </div>

                <p className="text-xs text-slate-600 mt-4">Didn't receive it? Check spam or try a different email.</p>
              </motion.div>
            )}

            {/* ── Step 3: Set new password ── */}
            {step === 'reset' && (
              <motion.div
                key="reset"
                variants={containerVariants}
                initial="hidden" animate="visible" exit="exit"
              >
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <Lock className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">Set New Password</h1>
                  <p className="text-slate-400">Choose a strong password you'll remember.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 tracking-wide">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="input-field pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            password.length >= i * 3
                              ? i <= 1 ? 'bg-rose-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-emerald-400' : 'bg-emerald-500'
                              : 'bg-white/8'
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 tracking-wide">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Same password again"
                        className="input-field pl-10"
                        required
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-rose-400 mt-1">Passwords don't match</p>
                    )}
                  </div>

                  <button type="submit" disabled={loading || password !== confirmPassword} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {loading ? 'Updating…' : 'Update Password'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
