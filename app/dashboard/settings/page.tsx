'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, User, Bell, Shield, Palette, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) toast.error(error.message);
    else toast.success('Profile updated!');
    setSaving(false);
  };

  const TABS = [
    { id: 'profile',        label: 'Profile',        icon: User },
    { id: 'notifications',  label: 'Notifications',  icon: Bell },
    { id: 'appearance',     label: 'Appearance',     icon: Palette },
    { id: 'security',       label: 'Security',       icon: Shield },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-white">Settings</span>
        </div>
      </div>

      <div className="container-page py-10 max-w-4xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48 shrink-0">
            <nav className="space-y-0.5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {activeTab === 'profile' && (
              <div className="bento-card p-7">
                <h2 className="text-lg font-bold text-white mb-6">Profile Settings</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 tracking-wide">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 tracking-wide">Email Address</label>
                    <input value={email} disabled className="input-field opacity-50 cursor-not-allowed" />
                    <p className="text-xs text-slate-600 mt-1">Email cannot be changed here.</p>
                  </div>
                  <div className="pt-2">
                    <button onClick={handleSave} disabled={saving} className="btn-primary">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bento-card p-7">
                <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Portfolio view milestones', desc: 'Get notified at 10, 100, 1000 views', checked: true },
                    { label: 'Weekly analytics digest', desc: 'Summary of your portfolio performance', checked: true },
                    { label: 'Product updates', desc: 'New features and improvements', checked: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 glass rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-white">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.checked ? 'left-5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="bento-card p-7">
                <h2 className="text-lg font-bold text-white mb-6">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-3 tracking-wide">Color Scheme</label>
                    <div className="flex gap-3">
                      {['Dark', 'System'].map(mode => (
                        <button key={mode} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          mode === 'Dark' ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-white/20'
                        }`}>
                          {mode === 'Dark' && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 text-indigo-400" />}
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bento-card p-7">
                <h2 className="text-lg font-bold text-white mb-6">Security</h2>
                <div className="space-y-4">
                  <div className="p-4 glass rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Change Password</div>
                      <div className="text-xs text-slate-500 mt-0.5">Update your account password</div>
                    </div>
                    <button className="btn-secondary text-xs py-2">Update</button>
                  </div>
                  <div className="p-4 glass rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Two-Factor Authentication</div>
                      <div className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</div>
                    </div>
                    <button className="btn-secondary text-xs py-2">Enable</button>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <button className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
