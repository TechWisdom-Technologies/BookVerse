"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  ArrowLeft, 
  Smartphone,
  Loader2,
  Sparkles,
  Info,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';
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

export default function WalletPage() {
  const { dbUser, loading: authLoading, refreshUser } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [savingBilling, setSavingBilling] = useState(false);

  // Ledger lists
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletEarnedTips, setWalletEarnedTips] = useState(0);
  const [walletSpentTips, setWalletSpentTips] = useState(0);
  const [walletSpentSubs, setWalletSpentSubs] = useState(0);
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>([]);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Sync DB user data to component state once loaded
  useEffect(() => {
    if (dbUser) {
      setBkashNumber(dbUser.bkashNumber || '');
      setNagadNumber(dbUser.nagadNumber || '');
    }
  }, [dbUser]);

  // Load wallet transaction history
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
    if (mounted && dbUser) {
      fetchWalletDetails();
    }
  }, [mounted, dbUser]);

  if (!mounted) return null;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-6">
          <Wallet className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-xs text-zinc-500 max-w-xs mb-6 uppercase">Please sign in to your BookVerse account to view your dynamic wallet ledger.</p>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded"
        >
          Sign In
        </Link>
      </div>
    );
  }

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

  const renderMethodIcon = (method: string, type: string) => {
    const isBkash = method.toLowerCase().includes('bkash');
    const isNagad = method.toLowerCase().includes('nagad');
    
    if (isBkash) {
      return (
        <div className="w-10 h-10 rounded bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm shrink-0">
          <img src="https://yt3.googleusercontent.com/ytc/AIdro_kfgKlp22w3_zZbhHhYhc279q-rVbYRMy1xZ8gJMZRcsQ=s900-c-k-c0x00ffffff-no-rj" alt="bKash" className="w-6 h-6 rounded shrink-0 select-none object-contain" />
        </div>
      );
    }
    
    if (isNagad) {
      return (
        <div className="w-10 h-10 rounded bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm shrink-0">
          <img src="https://play-lh.googleusercontent.com/9ps_d6nGKQzfbsJfMaFR0RkdwzEdbZV53ReYCS09Eo5MV-GtVylFD-7IHcVktlnz9Mo" alt="Nagad" className="w-6 h-6 rounded shrink-0 select-none object-contain" />
        </div>
      );
    }

    const isReceived = type === 'TIP_RECEIVED';
    const isSub = type === 'SUBSCRIPTION';

    return (
      <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
        isReceived 
          ? 'bg-emerald-500/10 text-emerald-500' 
          : isSub 
          ? 'bg-blue-500/10 text-blue-500' 
          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
      }`}>
        {isReceived ? (
          <ArrowDownLeft className="w-5 h-5" />
        ) : isSub ? (
          <TrendingUp className="w-5 h-5" />
        ) : (
          <ArrowUpRight className="w-5 h-5" />
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Navigation & Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase flex items-center gap-3">
                <Wallet className="w-6 h-6 text-zinc-900 dark:text-white" />
                My Wallet Ledger.
              </h1>
              <p className="text-sm text-zinc-500 font-medium">Manage mobile payout configurations and analyze BDT transactions ledger sheet.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
          </div>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Earnings Card */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Earnings (Tips)</span>
                <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                ৳{walletEarnedTips.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-6">Tips received (Converted to BDT)</span>
          </div>

          {/* Tips Sent Card */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Tipped to Authors</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                ৳{walletSpentTips.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-6">Support given (Converted to BDT)</span>
          </div>

          {/* Subscriptions Card */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-3 text-zinc-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Subscription Cost</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-2xl font-mono font-black text-zinc-900 dark:text-white leading-none">
                ৳{walletSpentSubs.toLocaleString()}
              </h3>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-6">Verified Premium cycles</span>
          </div>
        </div>

        {/* Grid: Wallets Setup & Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
          
          {/* Left panel: mobile wallet links and membership */}
          <div className="space-y-8">
            
            {/* bKash & Nagad Setup */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm space-y-6">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Mobile Payouts</h3>
                <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Define numbers below. Auto-tipping payouts will settle to these wallets.</p>
              </div>

              <form onSubmit={handleSaveBilling} className="space-y-6">
                
                {/* bKash */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img src="https://yt3.googleusercontent.com/ytc/AIdro_kfgKlp22w3_zZbhHhYhc279q-rVbYRMy1xZ8gJMZRcsQ=s900-c-k-c0x00ffffff-no-rj" alt="bKash" className="w-6 h-6 rounded shrink-0 select-none object-contain" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">bKash Personal</span>
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

                {/* Nagad */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img src="https://play-lh.googleusercontent.com/9ps_d6nGKQzfbsJfMaFR0RkdwzEdbZV53ReYCS09Eo5MV-GtVylFD-7IHcVktlnz9Mo" alt="Nagad" className="w-6 h-6 rounded shrink-0 select-none object-contain" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Nagad Personal</span>
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

                <button
                  type="submit"
                  disabled={savingBilling}
                  className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow"
                >
                  {savingBilling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Save Wallet Setup'
                  )}
                </button>
              </form>
            </div>

            {/* Membership Details */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm space-y-4">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Premium Identity Tier</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                  {dbUser?.membershipTier || 'FREE ACCOUNT'}
                  {dbUser?.membershipTier && <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />}
                </h3>
                <p className="text-[10px] font-medium text-zinc-450 uppercase tracking-widest leading-relaxed mt-2">
                  {dbUser?.membershipTier ? 'Unlocked complete publishing controls' : 'Upgrade to premium tier to monetize your novels.'}
                </p>
              </div>
              <Link
                href="/premium"
                className="w-full inline-flex justify-center items-center py-3 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all font-mono shadow-sm"
              >
                {dbUser?.membershipTier ? 'Modify Tier' : 'Upgrade Account'}
              </Link>
            </div>

          </div>

          {/* Right panel: Ledger transactions list */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-zinc-150 dark:border-zinc-900">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Unified Ledger History</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">A transparent tracking sheet detailing support tips and subscriptions in BDT.</p>
            </div>

            {walletLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-300 dark:text-zinc-700" />
              </div>
            ) : walletHistory.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/[0.01] flex flex-col items-center justify-center gap-3">
                <Wallet className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">No balance entries found in your dynamic wallet.</p>
              </div>
            ) : (
              <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-900 shadow-sm">
                {walletHistory.map((item) => {
                  const isReceived = item.type === 'TIP_RECEIVED';
                  
                  return (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-all">
                      <div className="flex items-start gap-4">
                        {renderMethodIcon(item.method, item.type)}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white block leading-tight">{item.description}</span>
                          <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                            <span>Settled: {item.method}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
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

            {/* Portal details */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Merchant Credit Clearance</h3>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium uppercase">
                Direct credit card gateways and international tips require card verification checks. Launch the secure Stripe customer portal to manage details.
              </p>
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded text-zinc-400 dark:text-zinc-650 cursor-not-allowed font-mono shadow-sm"
              >
                Portal (Coming Soon)
              </button>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
