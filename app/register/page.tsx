'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      // Handle all known "already registered" variants from Supabase
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already been registered') ||
        error.message.toLowerCase().includes('user already exists') ||
        error.status === 422
      ) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
    } else if (data.user && (data.user.identities?.length === 0)) {
      // Supabase returns no error but empty identities when email is already taken
      // (happens when "Enable email confirmations" is ON)
      toast.error('This email is already registered. Please sign in instead.');
    } else if (data.session) {
      // Email confirmations disabled — user is immediately active
      toast.success(`Welcome to FolioAI, ${name.split(' ')[0]}! 🎉`);
      router.push('/dashboard');
    } else {
      // Email confirmation required — send them to login with a notice
      toast.success('Account created! Check your email to confirm, then sign in.', { duration: 6000 });
      router.push('/login');
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
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 border-r border-white/5">
        <div className="orb orb-indigo w-72 h-72 absolute top-[-60px] left-[-60px] opacity-50" />
        <div className="orb orb-cyan w-56 h-56 absolute bottom-[15%] right-[-30px] opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10"
        >
          <div className="mb-8 space-y-3">
            {[
              { n: '01', text: 'Create your free account' },
              { n: '02', text: 'Upload your resume (PDF or DOCX)' },
              { n: '03', text: 'AI builds your portfolio in 60 seconds' },
              { n: '04', text: 'Publish and share your live URL' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-mono font-bold text-indigo-400 w-6 shrink-0">{step.n}</span>
                <div className="w-px h-4 bg-indigo-500/30" />
                <span className="text-sm text-slate-300">{step.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="bento-card p-5 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">SC</div>
              <div>
                <div className="text-xs font-semibold text-white">Sarah Chen</div>
                <div className="text-[10px] text-slate-500">Senior Engineer · Stripe</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed italic">
              "Got 3 interview calls the week I published my FolioAI portfolio. Absolutely worth it."
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-slate-600 relative z-10"
        >
          © 2025 FolioAI. All rights reserved.
        </motion.p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="absolute top-6 left-6">
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
            Start for free
          </motion.h1>
          <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-slate-400 text-sm mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
          </motion.p>

          {/* OAuth */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleOAuth('google')} disabled={!!oauthLoading} className="btn-secondary justify-center text-sm py-2.5 gap-2.5">
              {oauthLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google
            </button>
            <button onClick={() => handleOAuth('github')} disabled={!!oauthLoading} className="btn-secondary justify-center text-sm py-2.5 gap-2.5">
              {oauthLoading === 'github' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              )}
              GitHub
            </button>
          </motion.div>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-slate-600 text-xs">or sign up with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </motion.div>

          <form onSubmit={handleRegister} className="space-y-4">
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block tracking-wide">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Johnson" required className="input-field pl-10" />
              </div>
            </motion.div>

            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block tracking-wide">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="input-field pl-10" />
              </div>
            </motion.div>

            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      password.length >= i * 3
                        ? i <= 1 ? 'bg-rose-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-indigo-500' : 'bg-emerald-500'
                        : 'bg-white/10'
                    }`} />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Create Free Account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          </form>

          <motion.p custom={8} variants={fadeUp} initial="hidden" animate="visible" className="text-center text-xs text-slate-600 mt-6">
            By signing up, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a> &{' '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
