"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  User, 
  Palette, 
  Shield, 
  Bell, 
  ArrowLeft, 
  Check, 
  Type, 
  Moon, 
  Sun, 
  Monitor,
  Loader2,
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const { dbUser, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Settings.</h1>
              <p className="text-sm text-zinc-500 font-medium">Manage your profile, look and feel, and account security.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            Active
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-20">
          
          {/* Sidebar Navigation */}
          <aside>
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded transition-all group ${
                    activeTab === tab.id 
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' 
                      : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-inherit' : 'text-zinc-200 group-hover:text-inherit'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <section className="max-w-3xl">
            {activeTab === 'profile' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Profile Settings</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Update your name, bio, and public information.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded p-10 shadow-sm">
                  <EditProfileForm user={dbUser as any} />
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Appearance</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Toggle between light and dark themes.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean White' },
                    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Deep Night' },
                    { id: 'system', label: 'Automatic', icon: Monitor, desc: 'Device Sync' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-8 p-10 border rounded transition-all group ${
                        theme === t.id 
                          ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 shadow-sm' 
                          : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className={`p-5 rounded transition-all ${theme === t.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                        <t.icon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{t.label}</p>
                        <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">{t.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${theme === t.id ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white' : 'border-zinc-100 dark:border-zinc-900'}`}>
                        {theme === t.id && <Check className="w-3 h-3 text-white dark:text-zinc-900" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Security</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Manage your password and protection.</p>
                </div>
                <div className="py-40 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10 flex flex-col items-center justify-center text-center gap-4">
                  <ShieldCheck className="w-10 h-10 text-zinc-100 dark:text-zinc-800" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic font-mono">Coming Soon</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest max-w-xs leading-relaxed">Security tools are being updated for a safer experience.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
