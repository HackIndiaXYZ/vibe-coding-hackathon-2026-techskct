'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Eye, TrendingUp, Globe,
  Users, Zap, Monitor, Smartphone, Tablet, ExternalLink, Download, Briefcase,
  Layout, Edit3, Mic, Clock, QrCode, Settings, ChevronRight, LogOut, Loader2, X, Plus, Sparkles, Volume2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  views: number;
  data: any;
  updated_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardVoicePage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  // Voice Chat States
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: "What's your strongest engineering area?" },
    { role: 'assistant', content: "Alex specializes in distributed systems and backend infrastructure — he built DistributeDB, a key-value store handling 100K req/s, and has led platform teams at two Series B startups." },
    { role: 'user', content: "Is he open to remote roles?" },
    { role: 'assistant', content: "Yes, Alex is actively looking for senior remote opportunities in distributed systems or platform engineering." }
  ]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'responding'>('idle');
  const [transcriptInput, setTranscriptInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const supabase = createClient();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser({ email: user.email!, name: user.user_metadata?.full_name || user.email!.split('@')[0] });

      const { data } = await supabase.from('portfolios').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      const list = data || [];
      setPortfolios(list);
      if (list.length > 0) {
        setActivePortfolio(list[0]);
      }
      setLoading(false);
    };
    load();

    // Initialize Web Speech Recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setStatus('listening');
          setTranscriptInput('');
        };

        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            handleNewQuestion(text);
          }
        };

        rec.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setStatus('idle');
          toast.error('Voice input failed. Try clicking a predefined question.');
        };

        rec.onend = () => {
          setStatus(prev => prev === 'listening' ? 'idle' : prev);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const togglePublish = async (portfolio: Portfolio) => {
    const { error } = await supabase.from('portfolios').update({ published: !portfolio.published }).eq('id', portfolio.id);
    if (!error) {
      const updated = portfolios.map(p => p.id === portfolio.id ? { ...p, published: !p.published } : p);
      setPortfolios(updated);
      if (activePortfolio?.id === portfolio.id) {
        setActivePortfolio({ ...activePortfolio, published: !activePortfolio.published });
      }
      toast.success(portfolio.published ? 'Unpublished' : '🚀 Portfolio is now live!');
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (status === 'listening') {
      recognitionRef.current.stop();
      setStatus('idle');
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // Prefer standard English voice
      const targetVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
      if (targetVoice) utterance.voice = targetVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNewQuestion = async (question: string) => {
    if (!question.trim()) return;
    
    // Add user question
    const updatedMessages = [...messages, { role: 'user', content: question } as Message];
    setMessages(updatedMessages);
    setStatus('responding');

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          portfolioData: activePortfolio?.data || { name: user?.name || 'Alex' },
          history: updatedMessages.slice(-4) // Send last 4 exchanges for context
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const reply = data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speakText(reply);
    } catch (err: any) {
      console.error(err);
      const fallbackReply = "I'm sorry, I'm having trouble connecting to my portfolio data right now. Let me know if I can answer anything else!";
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackReply }]);
      speakText(fallbackReply);
    } finally {
      setStatus('idle');
    }
  };

  const sidebarSections = [
    {
      title: 'PORTFOLIO',
      items: [
        { label: 'Dashboard', icon: Layout, href: '/dashboard' },
        { 
          label: 'Editor', 
          icon: Edit3, 
          href: activePortfolio ? `/editor/${activePortfolio.id}` : '/upload' 
        },
        { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' }
      ]
    },
    {
      title: 'AI TOOLS',
      items: [
        { label: 'Recruiter AI', icon: Users, href: '/dashboard/recruiter' },
        { label: 'Voice Mode', icon: Mic, href: '/dashboard/voice', active: true },
        { label: 'AI Timeline', icon: Clock, href: '/dashboard/ats' }
      ]
    },
    {
      title: 'PUBLISH',
      items: [
        { 
          label: 'Publish', 
          icon: Globe, 
          onClick: () => {
            if (activePortfolio) {
              togglePublish(activePortfolio);
            } else {
              toast.error('No active portfolio');
            }
          } 
        },
        { 
          label: 'QR Card', 
          icon: QrCode, 
          onClick: () => {
            if (activePortfolio && activePortfolio.published) {
              setQrUrl(window.location.origin + `/portfolio/${activePortfolio.slug}`);
            } else {
              toast.error(activePortfolio ? 'Publish your portfolio to view QR Code' : 'No active portfolio');
            }
          }
        },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' }
      ]
    }
  ];

  const predefinedQuestions = [
    "What's your strongest engineering area?",
    "Is he open to remote roles?",
    "What technologies do you use?",
    "Tell me about your latest project."
  ];

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-60 glass-strong border-r border-white/5 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center group-hover:glow-xs transition-all">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[0.95rem]">
              <span className="gradient-text">Folio</span><span className="text-white">AI</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Navigation Sections */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {sidebarSections.map(section => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">{section.title}</div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const content = (
                    <>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                    </>
                  );
                  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    item.active
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`;

                  if (item.onClick) {
                    return (
                      <button key={item.label} onClick={item.onClick} className={className}>
                        {content}
                      </button>
                    );
                  }
                  return (
                    <Link key={item.label} href={item.href || '#'} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-600 hover:text-rose-400 transition-colors shrink-0" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass-strong border-b border-white/5 h-14 flex items-center px-8">
          <h1 className="text-[0.95rem] font-semibold text-white">Voice Mode</h1>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Mic and Transcript Layout */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Voice Pulse interface card */}
              <div className="bento-card p-6 flex flex-col items-center">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-black text-white">Portfolio Voice Mode</h2>
                  <p className="text-xs text-slate-400 mt-1">Visitors can talk to your portfolio and ask anything about your experience</p>
                </div>

                {/* Microphone Ring animation */}
                <div className="relative flex items-center justify-center my-6">
                  <AnimatePresence>
                    {status === 'listening' && (
                      <motion.div
                        initial={{ opacity: 0.5, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 1.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute w-24 h-24 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                      />
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={toggleVoiceRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center glow-md transition-all duration-300 relative z-10 ${
                      status === 'listening'
                        ? 'bg-rose-600 hover:bg-rose-500 scale-105'
                        : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
                    }`}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </button>
                </div>

                {/* Waves Animation */}
                <div className="flex items-center gap-1.5 h-6 mb-4">
                  {status === 'responding' ? (
                    [1, 2, 3, 4, 5, 6, 7].map(bar => (
                      <motion.div
                        key={bar}
                        animate={{ height: [4, 20, 4] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: bar * 0.08 }}
                        className="w-1 bg-indigo-400 rounded-full"
                      />
                    ))
                  ) : status === 'listening' ? (
                    <span className="text-xs text-rose-400 font-semibold animate-pulse">Listening...</span>
                  ) : (
                    <span className="text-xs text-slate-500">Click microphone to speak</span>
                  )}
                </div>

                <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mb-4">
                  {status === 'responding' ? 'AI is responding...' : status === 'listening' ? 'Speak now' : 'Ready'}
                </div>

                {/* Predefined Questions */}
                <div className="w-full border-t border-white/5 pt-6">
                  <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Predefined Questions</h4>
                  <div className="flex flex-wrap gap-2">
                    {predefinedQuestions.map(q => (
                      <button
                        key={q}
                        onClick={() => handleNewQuestion(q)}
                        disabled={status !== 'idle'}
                        className="px-3.5 py-2 glass hover:border-indigo-500/30 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs text-slate-200 transition-all font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Dialogue Transcript Card */}
              <div className="bento-card p-6 flex flex-col h-96">
                <h3 className="font-bold text-white text-sm mb-4">Conversation Transcript</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
                        {m.role === 'user' ? 'Visitor' : 'Portfolio AI'}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'glass border border-white/5 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {status === 'responding' && (
                    <div className="flex flex-col items-start mr-auto max-w-[85%]">
                      <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Portfolio AI</div>
                      <div className="p-3.5 glass border border-white/5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

            </div>

            {/* Right Column: AI Recruiter Score & Matches */}
            <div className="space-y-6">
              
              {/* AI Recruiter Score Card */}
              <div className="bento-card p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">AI Recruiter Score</h3>
                  <div className="inline-block relative">
                    {/* Ring background */}
                    <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-black text-emerald-400">84</span>
                        <span className="text-[10px] block text-slate-500">out of 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white mt-4">Top 12% of profiles</div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-300">
                  {[
                    { text: 'Strong project portfolio with measurable impact', active: true },
                    { text: 'Clear career progression and seniority signals', active: true },
                    { text: 'Good tech stack breadth across frontend/backend', active: true },
                    { text: 'Add open source contributions to boost score', active: false }
                  ].map((bullet, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        bullet.active ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      <span>{bullet.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Match Recommendations */}
              <div className="bento-card p-6">
                <h3 className="font-bold text-white text-sm mb-4">Job Match Recommendations</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Staff Engineer', dept: 'Platform / Infrastructure', match: 94 },
                    { title: 'Principal Backend Engineer', dept: 'Distributed Systems', match: 91 }
                  ].map(match => (
                    <div key={match.title} className="p-3.5 glass rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{match.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-400">{match.match}% match</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{match.dept}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* QR Code Share Modal */}
      <AnimatePresence>
        {qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl text-center relative"
            >
              <button
                onClick={() => setQrUrl(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-2">Share Portfolio QR</h3>
              <p className="text-xs text-slate-400 mb-6">Scan this QR code with a mobile camera to view the live portfolio.</p>
              
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner border border-white/5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}`}
                  alt="Portfolio QR Code"
                  className="w-40 h-40"
                />
              </div>

              <div className="flex gap-2 bg-slate-950 border border-white/5 p-2 rounded-xl text-xs text-slate-300 font-mono break-all justify-between items-center mb-4">
                <span className="truncate max-w-[200px]">{qrUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrUrl);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 shrink-0 font-sans font-semibold text-[10px] uppercase bg-indigo-500/10 px-2 py-1.5 rounded"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
