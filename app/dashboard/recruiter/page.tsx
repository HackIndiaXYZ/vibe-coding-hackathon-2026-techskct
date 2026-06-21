'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, LogOut, Loader2, Sparkles, FileText, Settings,
  Layout, Search, MapPin, Briefcase, ExternalLink, Filter, Check,
  BarChart3, Edit3, Mic, Clock, Globe, QrCode, ChevronRight, X, Users
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const FILTER_SKILLS = ['React', 'Node.js', 'TypeScript', 'Python', 'Figma', 'AWS', 'PostgreSQL'];

export default function RecruiterDashboardPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);

    // Fetch user's own portfolios
    const { data: myPortfolios } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', u.id)
      .order('updated_at', { ascending: false });

    const list = myPortfolios || [];
    setPortfolios(list);
    if (list.length > 0) {
      setActivePortfolio(list[0]);
    }

    // Fetch published candidate profiles
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Failed to load published profiles');
    } else {
      setCandidates(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = candidates;

    // Apply search filter (Name or Title)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.data?.name?.toLowerCase().includes(q) || 
        c.data?.title?.toLowerCase().includes(q) || 
        c.title?.toLowerCase().includes(q)
      );
    }

    // Apply skills filter
    if (selectedSkills.length > 0) {
      result = result.filter(c => {
        const cSkills = Array.isArray(c.data?.skills) 
          ? c.data.skills.map((s: string) => s.toLowerCase()) 
          : [];
        return selectedSkills.every(s => cSkills.includes(s.toLowerCase()));
      });
    }

    setFiltered(result);
  }, [search, selectedSkills, candidates]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleViewPortfolio = async (id: string, slug: string) => {
    // Fire-and-forget logging click event
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: id,
          eventType: 'recruiter_click',
          metadata: { timestamp: Date.now(), referrer: 'Recruiter Hub' }
        })
      });
    } catch (e) {
      console.error('Failed to log recruiter click:', e);
    }
    
    // Open in a new tab
    window.open(`/portfolio/${slug}`, '_blank');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const togglePublish = async (portfolio: any) => {
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

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/5 flex flex-col justify-between p-0 glass-strong shrink-0 z-40 h-screen sticky top-0">
        <div className="flex flex-col h-full">
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

          {/* Navigation Sections */}
          <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
            {[
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
                  { label: 'Recruiter AI', icon: Users, href: '/dashboard/recruiter', active: true },
                  { label: 'Voice Mode', icon: Mic, href: '/dashboard/voice' },
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
            ].map(section => (
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
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-600 hover:text-rose-400 transition-colors shrink-0" title="Sign out">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Recruiter Workspace</h1>
            <p className="text-sm text-slate-500">Search and discover talent, screen matching skills, and analyze profiles.</p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bento-card p-6 mb-8 space-y-4">
          <div className="flex items-center gap-3 bg-slate-950 border border-white/5 px-4 py-2.5 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none text-white placeholder-slate-500"
              placeholder="Search by name, role title, or location..."
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold"><Filter className="w-3.5 h-3.5" /> Filter Skills:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_SKILLS.map(skill => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      active
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/35'
                        : 'bg-white/3 text-slate-400 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-indigo-400" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {filtered.length === 0 ? (
          <div className="bento-card p-12 text-center text-slate-500">
            No published candidates match the current search filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
            {filtered.map(c => {
              const d = c.data || {};
              const skills = d.skills || [];
              const displaySkills = skills.slice(0, 5);
              const hasMoreSkills = skills.length > 5;
              
              return (
                <div key={c.id} className="bento-card p-6 flex flex-col justify-between hover:border-indigo-500/20 transition-all hover-lift">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg shrink-0">
                          {d.name ? d.name.split(' ').map((n: string) => n[0]).join('') : 'C'}
                        </div>
                        <div>
                          <h3 className="font-bold text-white leading-tight">{d.name || 'Candidate'}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{d.title || 'Professional Title'}</p>
                        </div>
                      </div>
                      {d.availability && (
                        <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 text-[10px] font-bold border border-emerald-400/20">
                          {d.availability}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {d.summary || 'No professional bio description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {displaySkills.map((sk: string) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-white/3 text-slate-300 text-[10px] border border-white/5">
                          {sk}
                        </span>
                      ))}
                      {hasMoreSkills && (
                        <span className="text-[10px] text-slate-500 font-semibold px-1 py-0.5">
                          +{skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/5 mt-5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {d.location || 'Remote'}
                    </div>

                    <button
                      onClick={() => handleViewPortfolio(c.id, c.slug)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all"
                    >
                      View Portfolio <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                  className="text-indigo-400 hover:text-indigo-300 shrink-0 font-sans font-semibold text-[10px] uppercase bg-indigo-500/10 px-2 py-1.5 -mx-1 rounded"
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
