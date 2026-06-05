"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  User, 
  Palette, 
  Shield, 
  ArrowLeft, 
  Check, 
  Type, 
  Moon, 
  Sun, 
  Monitor,
  Loader2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  KeyRound,
  Trash2,
  Sparkles,
  Info,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Link2,
  Download,
  Laptop,
  LogOut
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface WalletTransaction {
  id: string;
  type: 'TIP_RECEIVED' | 'TIP_SENT' | 'SUBSCRIPTION';
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description: string;
  method: string;
}

export default function SettingsPage() {
  const { dbUser, loading: authLoading, refreshUser, resetPassword } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [mounted, setMounted] = useState(false);

  // Reading preferences states
  const [readingFont, setReadingFont] = useState('sans');
  const [readerTheme, setReaderTheme] = useState('white');
  const [readingProgressSync, setReadingProgressSync] = useState(true);
  const [savingReading, setSavingReading] = useState(false);

  // Billing states
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [savingBilling, setSavingBilling] = useState(false);

  // Wallet states
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletEarnedTips, setWalletEarnedTips] = useState(0);
  const [walletSpentTips, setWalletSpentTips] = useState(0);
  const [walletSpentSubs, setWalletSpentSubs] = useState(0);
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>([]);

  // Security & Deactivation states
  const [deactivatePeriod, setDeactivatePeriod] = useState('login'); // 'login' | '15' | '30' | '45' | '90' | '175' | 'custom'
  const [customDays, setCustomDays] = useState('');
  const [deactivating, setDeactivating] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Block List States
  const [blockedUsers, setBlockedUsers] = useState<{id: string; userId: string; username: string; displayName: string | null; reason: string; createdAt: string}[]>([]);
  const [newBlockedUser, setNewBlockedUser] = useState('');
  const [blockingUser, setBlockingUser] = useState(false);
  const [blocksLoading, setBlocksLoading] = useState(false);

  // Portability & Session States
  const [isExporting, setIsExporting] = useState(false);
  const [revokingSessions, setRevokingSessions] = useState(false);

  // Block List Handlers (Real API)
  const fetchBlockList = async () => {
    setBlocksLoading(true);
    try {
      const res = await fetch('/api/users/me/blocks');
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data.blocks || []);
      }
    } catch (err) {
      console.error('Failed to fetch block list:', err);
    } finally {
      setBlocksLoading(false);
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedUser.trim()) return;
    setBlockingUser(true);
    try {
      const res = await fetch('/api/users/me/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newBlockedUser.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlockedUsers(prev => [data.block, ...prev]);
        toast.success(`User @${newBlockedUser.trim()} successfully added to your Block List.`);
        setNewBlockedUser('');
      } else {
        toast.error(data.error || 'Failed to block user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error blocking user');
    } finally {
      setBlockingUser(false);
    }
  };

  const handleUnblockUser = async (id: string, username: string) => {
    try {
      const res = await fetch(`/api/users/me/blocks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlockedUsers(prev => prev.filter(u => u.id !== id));
        toast.success(`User @${username} has been unblocked.`);
      } else {
        toast.error('Failed to unblock user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error unblocking user');
    }
  };

  // GDPR Data Export Handler (Real API)
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/users/me/export');
      if (!res.ok) throw new Error('Export failed');
      const exportPayload = await res.json();

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookverse_data_export_${dbUser?.username || 'user'}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Your complete profile data archive has been downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export profile data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Real Session Revocation Handler (Firebase Admin)
  const handleRevokeAllSessions = async () => {
    if (!confirm('This will sign you out of ALL devices including this one. You will need to log in again. Continue?')) {
      return;
    }
    setRevokingSessions(true);
    try {
      const res = await fetch('/api/users/me/revoke-sessions', { method: 'POST' });
      if (res.ok) {
        toast.success('All sessions revoked. Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to revoke sessions');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error revoking sessions');
    } finally {
      setRevokingSessions(false);
    }
  };

  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Sync DB user data to component state once loaded
  useEffect(() => {
    if (dbUser) {
      setReadingFont(dbUser.readingFont || 'sans');
      setReaderTheme(dbUser.readerTheme || 'white');
      setReadingProgressSync(dbUser.readingProgressSync ?? true);
      setBkashNumber(dbUser.bkashNumber || '');
      setNagadNumber(dbUser.nagadNumber || '');
    }
  }, [dbUser]);

  // Load wallet transaction history when billing tab is selected
  const fetchWalletDetails = async () => {
    setWalletLoading(true);
    try {
      const res = await fetch('/api/users/me/wallet');
      if (res.ok) {
        const data = await res.json();
        setWalletEarnedTips(data.totalEarnedTips);
        setWalletSpentTips(data.totalSpentTips);
        setWalletSpentSubs(data.totalSpentSubs);
        setWalletHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load wallet details:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'billing') {
      fetchWalletDetails();
    }
    if (activeTab === 'privacy') {
      fetchBlockList();
    }
  }, [activeTab]);

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
    { id: 'reading', label: 'Reading Prefs', icon: Type },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Wallet & Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'connections', label: 'Connections', icon: Link2 },
    { id: 'privacy', label: 'Block List', icon: ShieldCheck },
    { id: 'portability', label: 'GDPR & Sessions', icon: Laptop },
  ];

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingReading(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readingFont,
          readerTheme,
          readingProgressSync,
        }),
      });
      if (res.ok) {
        toast.success('Reading preferences updated successfully!');
        await refreshUser();
      } else {
        toast.error('Failed to update reading preferences');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update reading preferences');
    } finally {
      setSavingReading(false);
    }
  };

  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBilling(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bkashNumber: bkashNumber.trim() || null,
          nagadNumber: nagadNumber.trim() || null,
        }),
      });
      if (res.ok) {
        toast.success('Payout numbers updated successfully!');
        await refreshUser();
      } else {
        toast.error('Failed to update payout numbers');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update payout numbers');
    } finally {
      setSavingBilling(false);
    }
  };

  const handleDeactivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let days: number | null = null;
    if (deactivatePeriod !== 'login') {
      const parsedDays = deactivatePeriod === 'custom' ? Number(customDays) : Number(deactivatePeriod);
      if (isNaN(parsedDays) || parsedDays <= 0) {
        toast.error('Please enter a valid number of days');
        return;
      }
      days = parsedDays;
    }

    if (!confirm(`Are you sure you want to deactivate your account? ${
      days 
        ? `Your profile will be hidden for ${days} days, or until you log in again.` 
        : 'Your profile will be hidden until you log back in.'
    }`)) {
      return;
    }

    setDeactivating(true);
    try {
      const res = await fetch('/api/users/me/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });

      if (res.ok) {
        toast.success('Account successfully deactivated.');
        window.location.href = '/';
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to deactivate account');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network failure during account deactivation');
    } finally {
      setDeactivating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!dbUser?.email) return;
    setSendingReset(true);
    try {
      await resetPassword(dbUser.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err: unknown) {
      const e = err as Record<string, unknown>;
      toast.error((e.message as string) || 'Failed to send password reset email');
    } finally {
      setSendingReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }
    if (!confirm("WARNING: This action is permanent. All your books, chapters, and account data will be permanently deleted from BookVerse. Are you absolutely sure?")) {
      return;
    }
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Your account was successfully deleted.');
        window.location.href = '/';
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network failure during account deletion');
    } finally {
      setDeletingAccount(false);
    }
  };

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
              <p className="text-sm text-zinc-500 font-medium">Manage your profile, reading preferences, mobile wallets, and account deactivation.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            Active Status: Verified
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
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Profile Settings</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Update your name, bio, and public information.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded p-10 shadow-sm">
                  <EditProfileForm user={dbUser as unknown as Parameters<typeof EditProfileForm>[0]["user"]} />
                </div>
              </div>
            )}

            {/* READING PREFERENCES TAB */}
            {activeTab === 'reading' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Reading Preferences</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Customize how you read chapters and stories across BookVerse.</p>
                </div>

                <form onSubmit={handleSaveReading} className="space-y-10">
                  {/* Default Font */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Default Typography</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'sans', label: 'Sans-Serif', desc: 'Modern & Clean', fontClass: 'font-sans' },
                        { id: 'serif', label: 'Serif', desc: 'Classic Novelist', fontClass: 'font-serif' },
                        { id: 'dyslexic', label: 'Dyslexic', desc: 'Specialized Reading', fontClass: 'font-mono' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setReadingFont(f.id)}
                          className={`flex flex-col text-left p-6 border rounded transition-all ${
                            readingFont === f.id
                              ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900'
                              : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <span className={`text-base font-bold mb-1 ${f.fontClass}`}>Aa</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest block">{f.label}</span>
                          <span className="text-[9px] text-zinc-400 font-bold block mt-1 uppercase">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reader Theme */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Reader Interface Theme</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: 'white', label: 'White', bg: 'bg-[#FFFFFF]', text: 'text-[#1E1E1E]', border: 'border-zinc-200' },
                        { id: 'sepia', label: 'Sepia', bg: 'bg-[#F4ECD8]', text: 'text-[#5F4B32]', border: 'border-[#E7DEC7]' },
                        { id: 'cream', label: 'Cream', bg: 'bg-[#FAF6EE]', text: 'text-[#1E1E1E]', border: 'border-[#F0EBE0]' },
                        { id: 'charcoal', label: 'Charcoal', bg: 'bg-[#2D2D2D]', text: 'text-[#E0E0E0]', border: 'border-[#3D3D3D]' },
                        { id: 'black', label: 'Ink Black', bg: 'bg-[#000000]', text: 'text-[#FFFFFF]', border: 'border-[#1E1E1E]' }
                      ].map((themeOpt) => (
                        <button
                          key={themeOpt.id}
                          type="button"
                          onClick={() => setReaderTheme(themeOpt.id)}
                          className={`p-4 border rounded flex flex-col items-center gap-3 transition-all ${themeOpt.bg} ${themeOpt.text} ${themeOpt.border} ${
                            readerTheme === themeOpt.id ? 'ring-2 ring-zinc-900 dark:ring-white scale-105' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-widest leading-none">A</div>
                          <span className="text-[9px] font-bold uppercase tracking-wider">{themeOpt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress Sync */}
                  <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg flex items-center justify-between gap-6 bg-zinc-50/20 dark:bg-zinc-900/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 block">Synchronize Reading Progress</span>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Auto-save pages and scroll milestones across devices.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReadingProgressSync(!readingProgressSync)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        readingProgressSync ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out ${
                          readingProgressSync ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={savingReading}
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {savingReading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Save Preferences'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* APPEARANCE TAB */}
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

            {/* WALLET, BILLING & TIPPING TAB (strictly in BDT) */}
            {activeTab === 'billing' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Wallet Hub & Billings</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Configure mobile cash-out wallets, check your payment balance sheets, and track ledger history in BDT.</p>
                </div>

                {/* Dynamic Wallet Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Earned Card */}
                  <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest">Earnings (Tips)</span>
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                        ৳{walletEarnedTips.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-4">Tips received (Converted to BDT)</span>
                  </div>

                  {/* Total Tipped Card */}
                  <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest">Tipped to Authors</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                        ৳{walletSpentTips.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-4">Support given (Converted to BDT)</span>
                  </div>

                  {/* Total Subscription Spent Card */}
                  <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest">Subscription Cost</span>
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                        ৳{walletSpentSubs.toLocaleString()}
                      </h3>
                    </div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-4">Verified Premium cycles</span>
                  </div>
                </div>

                {/* Membership Status Card */}
                <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Premium Verification Tier</span>
                    <h3 className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                      {dbUser?.membershipTier || 'FREE ACCOUNT'}
                      {dbUser?.membershipTier && <Sparkles className="w-4.5 h-4.5 text-purple-500 animate-pulse" />}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest mt-1">
                      {dbUser?.membershipTier ? `Authorized access to premium resources` : 'Upgrade your account to unlock publishing capabilities.'}
                    </p>
                  </div>
                  <Link
                    href="/premium"
                    className="px-6 py-2.5 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all font-mono shrink-0"
                  >
                    {dbUser?.membershipTier ? 'Modify Tier' : 'Upgrade Account'}
                  </Link>
                </div>

                {/* bKash & Nagad Wallets Forms */}
                <form onSubmit={handleSaveBilling} className="space-y-6">
                  <div className="pb-2 border-b border-zinc-100 dark:border-zinc-900">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mobile Payout Addresses</h3>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Link your mobile cash-out wallets. Author tipping payouts will default to these wallets.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* bKash Personal Card */}
                    <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg space-y-4 bg-white dark:bg-zinc-950">
                      <div className="flex items-center gap-3">
                        <img src="https://yt3.googleusercontent.com/ytc/AIdro_kfgKlp22w3_zZbhHhYhc279q-rVbYRMy1xZ8gJMZRcsQ=s900-c-k-c0x00ffffff-no-rj" alt="bKash" className="w-8 h-8 rounded shrink-0 select-none object-contain" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 block">bKash Personal</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Mobile Wallet</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-350" />
                        <input
                          type="text"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          placeholder="e.g. 017XXXXXXXX"
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Nagad Personal Card */}
                    <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-lg space-y-4 bg-white dark:bg-zinc-950">
                      <div className="flex items-center gap-3">
                        <img src="https://play-lh.googleusercontent.com/9ps_d6nGKQzfbsJfMaFR0RkdwzEdbZV53ReYCS09Eo5MV-GtVylFD-7IHcVktlnz9Mo" alt="Nagad" className="w-8 h-8 rounded shrink-0 select-none object-contain" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 block">Nagad Personal</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Mobile Wallet</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-350" />
                        <input
                          type="text"
                          value={nagadNumber}
                          onChange={(e) => setNagadNumber(e.target.value)}
                          placeholder="e.g. 019XXXXXXXX"
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingBilling}
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {savingBilling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Save Wallet Information'
                    )}
                  </button>
                </form>

                {/* Workable Unified Wallet Ledger History in BDT */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-zinc-100 dark:border-zinc-900">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Wallet Ledger History</h3>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">A complete ledger of tips received, support tips sent, and subscription transactions in BDT.</p>
                  </div>

                  {walletLoading ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                    </div>
                  ) : walletHistory.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/[0.02] flex flex-col items-center justify-center gap-2">
                      <Wallet className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 italic">No payment history linked to this wallet ledger.</p>
                    </div>
                  ) : (
                    <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-900">
                      {walletHistory.map((item) => {
                        const isReceived = item.type === 'TIP_RECEIVED';
                        const isSub = item.type === 'SUBSCRIPTION';
                        
                        return (
                          <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-all">
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded shrink-0 ${
                                isReceived 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : isSub 
                                  ? 'bg-blue-500/10 text-blue-500' 
                                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                              }`}>
                                {isReceived ? (
                                  <ArrowDownLeft className="w-4 h-4" />
                                ) : isSub ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-zinc-900 dark:text-white block">{item.description}</span>
                                <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                                  <span>Via: {item.method}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center sm:justify-end gap-4 shrink-0 justify-between">
                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                                item.status === 'COMPLETED' || item.status === 'APPROVED'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  : item.status === 'DECLINED' || item.status === 'FAILED'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                              }`}>
                                {item.status}
                              </span>
                              
                              {/* Amount in BDT */}
                              <span className={`text-xs font-mono font-black ${
                                isReceived 
                                  ? 'text-emerald-500' 
                                  : 'text-zinc-950 dark:text-zinc-50'
                              }`}>
                                {isReceived ? '+' : '-'}৳{item.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Payment Gateway Info */}
                <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/30 dark:bg-zinc-900/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Gateway</h3>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-6 font-medium uppercase">
                    All gateway payments (bKash, Nagad, Rocket, Cards) are processed securely via UddoktaPay and verified instantly. Manual bKash/Nagad transfers require admin approval.
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded text-emerald-600 dark:text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">UddoktaPay Gateway Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY & DEACTIVATION TAB */}
            {activeTab === 'security' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Security & Account Status</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Manage your password, temporarily deactivate your public profile, or safely delete account datasets.</p>
                </div>

                {/* Trigger password reset */}
                <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                      Reset Account Password
                    </span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block leading-relaxed">
                      Send a secure password-reset link directly to your inbox.
                    </span>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    disabled={sendingReset}
                    className="px-6 py-3 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-white text-[9px] font-bold uppercase tracking-widest rounded hover:border-zinc-900 dark:hover:border-white transition-all flex items-center gap-2"
                  >
                    {sendingReset ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Trigger Reset Email'
                    )}
                  </button>
                </div>

                {/* Account Deactivation Section */}
                <form onSubmit={handleDeactivateAccount} className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Deactivate Account
                    </span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block leading-relaxed max-w-xl">
                      Temporarily hide your profile, stories, and book contributions from public search registries. Logging in again at any time will instantly reactivate your account.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">Deactivation Interval</label>
                      <select
                        value={deactivatePeriod}
                        onChange={(e) => setDeactivatePeriod(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 transition-all uppercase"
                      >
                        <option value="login">Reactivate on next login</option>
                        <option value="15">Deactivate for 15 Days</option>
                        <option value="30">Deactivate for 30 Days</option>
                        <option value="45">Deactivate for 45 Days</option>
                        <option value="90">Deactivate for 90 Days</option>
                        <option value="175">Deactivate for 175 Days</option>
                        <option value="custom">Custom duration (days)</option>
                      </select>
                    </div>

                    {deactivatePeriod === 'custom' && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">Enter Custom Days</label>
                        <input
                          type="number"
                          min="1"
                          value={customDays}
                          onChange={(e) => setCustomDays(e.target.value)}
                          placeholder="e.g. 60"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={deactivating}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
                  >
                    {deactivating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Perform Deactivation'
                    )}
                  </button>
                </form>

                {/* Dangerous section - Delete Account */}
                <div className="p-8 border border-rose-500/20 dark:border-rose-900/30 rounded-lg bg-rose-500/[0.02] space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" />
                      Permanently Delete Account
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider block leading-relaxed max-w-xl">
                      Deletes all databases entries tied to your User ID and deletes your Firebase Authentication profile. This operation is permanent and absolute.
                    </span>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">
                      Type <span className="font-mono text-zinc-900 dark:text-white font-black select-all">DELETE</span> to confirm deactivation
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="Type DELETE"
                        className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono font-bold outline-none text-zinc-900 dark:text-white max-w-xs focus:border-rose-500 transition-all uppercase"
                      />
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount || deleteConfirm !== 'DELETE'}
                        className="px-6 py-2.5 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-rose-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 transition-all flex items-center justify-center gap-2"
                      >
                        {deletingAccount ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Perform Deletion'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONNECTIONS TAB */}
            {activeTab === 'connections' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Auth Connections</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Link and manage third-party credential providers for instant secure sign-in.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'google', name: 'Google Workspace', desc: 'Secure one-click authentication via Google OAuth 2.0' },
                    { id: 'github', name: 'GitHub Developer', desc: 'Link your GitHub profile for contributor badges' },
                    { id: 'discord', name: 'Discord Community', desc: 'Bind your Discord identity for server integrations' }
                  ].map((serv) => (
                    <div key={serv.id} className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm opacity-60">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                          <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                          {serv.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block leading-relaxed">
                          {serv.desc}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/30 dark:bg-zinc-900/20">
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                    OAuth integration with Google, GitHub, and Discord requires setting up dedicated application credentials and callback URLs. This feature is in active development and will be available in a future update.
                  </p>
                </div>
              </div>
            )}

            {/* BLOCK LIST TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Moderation & Block List</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Manage your block list. Blocked users cannot comment on your stories, send messages, or tip your wallet.</p>
                </div>

                {/* Block List */}
                <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 block">Moderation Registry (Block List)</span>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block mt-1">Enter a BookVerse username to add them to your permanent block registry.</span>
                  </div>

                  {/* Add block form */}
                  <form onSubmit={handleBlockUser} className="flex gap-4">
                    <input
                      type="text"
                      value={newBlockedUser}
                      onChange={(e) => setNewBlockedUser(e.target.value)}
                      placeholder="Enter exact username to block..."
                      className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                    />
                    <button
                      type="submit"
                      disabled={blockingUser || !newBlockedUser.trim()}
                      className="px-6 py-2 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {blockingUser ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Block'
                      )}
                    </button>
                  </form>

                  {/* Blocked Accounts List */}
                  {blocksLoading ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-300 dark:text-zinc-700" />
                    </div>
                  ) : blockedUsers.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/[0.01] flex flex-col items-center justify-center gap-1.5">
                      <Shield className="w-6 h-6 text-zinc-200 dark:text-zinc-800" />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 italic">No users are currently on your block list.</p>
                    </div>
                  ) : (
                    <div className="border border-zinc-100 dark:border-zinc-900 rounded divide-y divide-zinc-100 dark:divide-zinc-900 overflow-hidden bg-zinc-50/[0.01]">
                      {blockedUsers.map((userObj) => (
                        <div key={userObj.id} className="p-4 flex items-center justify-between gap-4 group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-black text-zinc-900 dark:text-white block">@{userObj.username}</span>
                            <span className="text-[8px] text-zinc-450 uppercase font-semibold tracking-wider block">Reason: {userObj.reason}</span>
                          </div>
                          <button
                            onClick={() => handleUnblockUser(userObj.id, userObj.username)}
                            className="px-4 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500 text-[8px] font-bold uppercase tracking-widest rounded hover:text-rose-500 hover:bg-rose-500/[0.02] transition-all"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DATA PORTABILITY & SESSION MANAGEMENT TAB */}
            {activeTab === 'portability' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 italic">Data Registry & Compliance</h2>
                  <p className="text-[11px] text-zinc-500 font-medium italic">Download a comprehensive backup of your entire BookVerse data, and manage active sessions.</p>
                </div>

                {/* GDPR Data Export */}
                <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-zinc-400" />
                      Export Profile Data (GDPR Compliant)
                    </span>
                    <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-wider block leading-relaxed max-w-xl">
                      Downloads a comprehensive JSON archive containing your complete profile, stories, books, tips, subscriptions, reading progress, achievements, and block list directly from the database.
                    </span>
                  </div>

                  <button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="px-6 py-3 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching data from server...</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Generate & Download Profile Backup</>
                    )}
                  </button>
                </div>

                {/* Session Revocation */}
                <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                      Sign Out All Devices
                    </span>
                    <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-wider block leading-relaxed max-w-xl">
                      Revokes all Firebase authentication tokens across every device and browser where you are currently signed in. You will be signed out everywhere, including this device, and will need to log in again.
                    </span>
                  </div>

                  <button
                    onClick={handleRevokeAllSessions}
                    disabled={revokingSessions}
                    className="px-6 py-3 border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/[0.02] hover:bg-rose-500/10 text-[9px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {revokingSessions ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Revoking tokens...</>
                    ) : (
                      <><LogOut className="w-3.5 h-3.5" /> Revoke All Sessions</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
