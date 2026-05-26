"use client";

import { useEffect, useState, use } from "react";
import {
  Loader2,
  ArrowLeft,
  User,
  Sparkles,
  Shield,
  Mail,
  Compass,
  BookOpen,
  Heart,
  Award,
  Ban,
  AlertTriangle,
  DownloadCloud,
  Smile,
  Layers,
  GitBranch,
  CreditCard,
  Gift,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  Check,
  X,
  ShieldAlert,
  Activity,
  BookMarked,
  MessageSquare,
  Clipboard,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type TabType = "profile" | "creations" | "financials" | "activity";

export default function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [instructionText, setInstructionText] = useState('');
  const [sendingInstruction, setSendingInstruction] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="p-12 text-center bg-white dark:bg-zinc-950 min-h-screen text-zinc-500">
        User not found.
      </div>
    );
  }

  const { user, analytics } = data;

  const handleBan = async () => {
    if (!confirm('Ban this user? This will revoke access.')) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban' }),
      });
      if (res.ok) {
        toast.success('User banned');
        fetchData();
      } else {
        toast.error('Failed to ban user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspend = async () => {
    const until = prompt('Suspend until (YYYY-MM-DD), leave blank for indefinite');
    if (until === null) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suspend', until: until || null }),
      });
      if (res.ok) {
        toast.success('User suspended');
        fetchData();
      } else {
        toast.error('Failed to suspend user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export' }),
      });
      if (!res.ok) {
        toast.error('Failed to export user data');
        return;
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-export-${user.username}-${id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Error exporting data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImpersonate = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'impersonate' }),
      });
      if (!res.ok) {
        toast.error('Failed to impersonate');
        return;
      }
      const { token } = await res.json();
      if (!token) {
        toast.error('No token returned');
        return;
      }
      await signInWithCustomToken(auth, token);
      toast.success('Signed in as user');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      toast.error('Error impersonating');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRemainingDays = (expiryDateStr: string | null) => {
    if (!expiryDateStr) return null;
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} day(s) left` : "Expired";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("User ID copied to clipboard!");
  };

  const handleSendInstruction = async () => {
    if (!instructionText.trim()) {
      toast.error('Please write an instruction message');
      return;
    }
    setSendingInstruction(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/instruction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: instructionText.trim() }),
      });
      if (res.ok) {
        toast.success('Instruction sent! User will see it on next visit.');
        setInstructionText('');
        fetchData();
      } else {
        toast.error('Failed to send instruction');
      }
    } catch {
      toast.error('Error sending instruction');
    } finally {
      setSendingInstruction(false);
    }
  };

  const handleClearInstruction = async () => {
    if (!confirm('Clear the active instruction for this user?')) return;
    setSendingInstruction(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/instruction`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Instruction cleared');
        fetchData();
      } else {
        toast.error('Failed to clear instruction');
      }
    } catch {
      toast.error('Error clearing instruction');
    } finally {
      setSendingInstruction(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Registry
          </Link>
        </div>

        {/* User Profile Header Card */}
        <section className="mb-10 bg-white dark:bg-zinc-900/60 rounded-3xl p-8 border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Avatar & Details */}
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-2xl uppercase">
                    {user.username?.[0] || "@"}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight">{user.displayName || user.username}</h1>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    user.role === "ADMIN" 
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
                      : user.role === "AUTHOR" 
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350"
                  }`}>
                    {user.role}
                  </span>
                  {user.membershipTier && (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {user.membershipTier}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-semibold tracking-wider">
                  @{user.username} • {user.email}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">
                    ID: {user.id}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(user.id)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    title="Copy User ID"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/40">
              <button
                onClick={handleImpersonate}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-indigo-500/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Impersonate
              </button>
              <button
                onClick={handleSuspend}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-amber-500/10"
              >
                <Clock className="w-3.5 h-3.5" />
                Suspend
              </button>
              <button
                onClick={handleBan}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-555 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-rose-500/10"
              >
                <Ban className="w-3.5 h-3.5" />
                Ban User
              </button>
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Quick Counter Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800/40">
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 text-center">
              <div className="font-black text-xl text-zinc-900 dark:text-white">{user._count?.stories || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Stories</div>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 text-center">
              <div className="font-black text-xl text-zinc-900 dark:text-white">{user._count?.books || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Books</div>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 text-center">
              <div className="font-black text-xl text-zinc-900 dark:text-white">{user._count?.followers || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Followers</div>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 text-center">
              <div className="font-black text-xl text-zinc-900 dark:text-white">{user.reactionCount || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Reactions</div>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 text-center col-span-2 md:col-span-1">
              <div className="font-black text-xl text-zinc-900 dark:text-white">{analytics?.recentReads || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Reads (30d)</div>
            </div>
          </div>
        </section>

        {/* Admin Instruction Panel */}
        <section className="mb-10 bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-500" /> Send Instruction to User
          </h2>
          
          {/* Show active instruction status */}
          {user.adminInstruction && (
            <div className={`mb-4 p-4 rounded-2xl border text-xs space-y-2 ${
              user.instructionSeen
                ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-800/30'
                : 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-800/30 animate-pulse'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  user.instructionSeen ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {user.instructionSeen ? '✓ Instruction Seen by User' : '⏳ Instruction Pending — Not Yet Seen'}
                </span>
                <button
                  onClick={handleClearInstruction}
                  disabled={sendingInstruction}
                  className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-rose-200 dark:hover:bg-rose-900/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <p className="text-zinc-600 dark:text-zinc-350 font-medium italic border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
                &quot;{user.adminInstruction}&quot;
              </p>
            </div>
          )}

          <div className="space-y-3">
            <textarea
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Write an instruction for this user... e.g. 'Please add a profile picture and complete your bio to enhance your author profile.'"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 px-4 py-3 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            />
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-400 font-medium">{instructionText.length}/500 characters</span>
              <button
                onClick={handleSendInstruction}
                disabled={sendingInstruction || !instructionText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-indigo-500/10"
              >
                {sendingInstruction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Instruction
              </button>
            </div>
          </div>
        </section>

        {/* Tab Buttons */}
        <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 flex overflow-x-auto no-scrollbar">
          {[
            { id: "profile", label: "Profile & Metadata", icon: User },
            { id: "creations", label: "Creations & Works", icon: BookOpen },
            { id: "financials", label: "Billing & Gifts", icon: CreditCard },
            { id: "activity", label: "Activity & Timeline", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-650 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {/* TAB 1: Profile & Metadata */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Data Details */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" /> Account Registry
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Internal User ID</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Joined Date</span>
                    <span>{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Account Role</span>
                    <span className="font-bold">{user.role}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Date of Birth</span>
                    <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Current Mood Status</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Smile className="w-3.5 h-3.5 text-amber-500" />
                      {user.mood || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-450 font-medium">Global Age Rating Constraint</span>
                    <span>{user.ageRating}+ years old</span>
                  </div>
                </div>
              </div>

              {/* Preferences & Bio */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 space-y-6">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" /> Bio & Narrative Description
                  </h2>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                    <p className="text-sm font-semibold text-zinc-500 uppercase text-[9px] tracking-widest mb-1">Short Bio</p>
                    <p className="text-xs text-zinc-650 dark:text-zinc-350 italic">
                      &quot;{user.bio || "No bio registered yet."}&quot;
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 mt-3">
                    <p className="text-sm font-semibold text-zinc-500 uppercase text-[9px] tracking-widest mb-1">Extended Description</p>
                    <p className="text-xs text-zinc-650 dark:text-zinc-350">
                      {user.description || "No extended narrative description."}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">
                    Subgenres & User Tags
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-zinc-400 mb-1">Favorite Genres</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.subGenres && user.subGenres.length > 0 ? (
                          user.subGenres.map((g: string) => (
                            <span key={g} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-bold">
                              {g}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 italic">No genres selected</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase text-zinc-400 mb-1">Account Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.tags && user.tags.length > 0 ? (
                          user.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-350 rounded-md text-[10px] font-bold">
                              #{t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 italic">No tags associated</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding Quiz Stats */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40 md:col-span-2 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-500" /> Onboarding Quiz Telemetry
                </h2>
                {user.onboardingQuiz ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-1">
                      <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Reading Level Preference</span>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-250 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        {user.onboardingQuiz.readingLevel}
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-1">
                      <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Favorite Genres</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.onboardingQuiz.genrePreferences?.map((genre: string) => (
                          <span key={genre} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded text-[9px] font-bold uppercase">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-1">
                      <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Favorite Authors</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.onboardingQuiz.favoriteAuthors?.map((author: string) => (
                          <span key={author} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 rounded text-[9px] font-bold">
                            {author}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">User has not completed the onboarding quiz.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Creations & Works */}
          {activeTab === "creations" && (
            <div className="space-y-8">
              {/* Stories & Manuscript Submissions */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> Story Submissions ({user.stories?.length || 0})
                </h2>
                {user.stories && user.stories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.stories.map((story: any) => (
                      <div key={story.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 flex justify-between items-center gap-4">
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{story.title}</p>
                          <p className="text-[9px] text-zinc-400 mt-1 font-mono uppercase">ID: {story.id} • Created {new Date(story.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          story.published 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-800"
                        }`}>
                          {story.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No stories created by this user.</p>
                )}
              </div>

              {/* PDF/EPUB Uploads */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Book Library Uploads ({user.books?.length || 0})
                </h2>
                {user.books && user.books.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.books.map((book: any) => (
                      <div key={book.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 flex justify-between items-center gap-4">
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{book.title}</p>
                          <p className="text-[9px] text-zinc-400 mt-1 font-semibold uppercase">Genre: {book.genre || "N/A"}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 rounded text-[9px] font-bold uppercase tracking-wider">
                          Uploaded {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No books uploaded to the library by this user.</p>
                )}
              </div>

              {/* Universes & Series frameworks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Universes */}
                <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" /> Literary Universes ({user.universes?.length || 0})
                  </h2>
                  {user.universes && user.universes.length > 0 ? (
                    <div className="space-y-3">
                      {user.universes.map((uni: any) => (
                        <div key={uni.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold">{uni.name}</p>
                            <p className="text-[9px] text-zinc-400">Genre: {uni.genre}</p>
                          </div>
                          <span className="text-[9px] font-semibold text-zinc-450">{new Date(uni.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No universes created.</p>
                  )}
                </div>

                {/* Series */}
                <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" /> Series Bookchains ({user.series?.length || 0})
                  </h2>
                  {user.series && user.series.length > 0 ? (
                    <div className="space-y-3">
                      {user.series.map((ser: any) => (
                        <div key={ser.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                          <p className="text-xs font-bold">{ser.name}</p>
                          <span className="text-[9px] font-semibold text-zinc-450">{new Date(ser.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No series constructed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Billing, Transactions & Gifts */}
          {activeTab === "financials" && (
            <div className="space-y-8">
              {/* Premium Status */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Active Plan Telemetry
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Membership Tier</span>
                    <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 mt-1 block uppercase">
                      {user.membershipTier || "Free Visitor"}
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Expiration Date</span>
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-1 block">
                      {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest">Time Remaining</span>
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-1 block uppercase">
                      {getRemainingDays(user.membershipExpiry) || "Permanent Account / None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions list */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" /> Subscription Transactions Audit ({user.subscriptionTransactions?.length || 0})
                </h2>
                {user.subscriptionTransactions && user.subscriptionTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800/60 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          <th className="pb-3">Plan</th>
                          <th className="pb-3">Duration</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Mobile No</th>
                          <th className="pb-3">Transaction ID</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/20">
                        {user.subscriptionTransactions.map((tx: any) => (
                          <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                            <td className="py-3">
                              <div className="space-y-0.5">
                                {tx.plan === "TIP" ? (
                                  <span className="font-bold text-amber-600 dark:text-amber-400 block uppercase">
                                    Author Tip
                                  </span>
                                ) : tx.plan.startsWith("GIFT_") ? (
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block uppercase">
                                    Gift {tx.plan.replace("GIFT_", "")}
                                  </span>
                                ) : tx.plan.startsWith("PROMOTION_") ? (
                                  <span className="font-bold text-rose-600 dark:text-rose-400 block uppercase">
                                    Promo {tx.plan.replace("PROMOTION_", "")}
                                  </span>
                                ) : (
                                  <span className="font-bold uppercase block">{tx.plan}</span>
                                )}

                                {tx.details?.type === "TIP" && (
                                  <span className="block text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                                    To: <span className="font-bold text-amber-600 dark:text-amber-500 uppercase">@{tx.details.receiverUsername}</span>
                                  </span>
                                )}

                                {tx.details?.type === "GIFT" && (
                                  <span className="block text-[10px] text-zinc-450 dark:text-zinc-500 font-medium select-all">
                                    To: {tx.details.recipientEmail}
                                  </span>
                                )}

                                {tx.details?.type === "PROMOTION" && (
                                  <span className="block text-[10px] text-zinc-450 dark:text-zinc-500 font-medium italic max-w-[150px] truncate">
                                    "{tx.details.storyTitle}"
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              {tx.plan === "TIP" || tx.plan.startsWith("PROMOTION_") ? "-" : `${tx.duration} month(s)`}
                            </td>
                            <td className="py-3 font-mono font-bold">৳{tx.amount}</td>
                            <td className="py-3 font-mono">{tx.senderNumber}</td>
                            <td className="py-3 font-mono text-zinc-500">{tx.transactionId}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                tx.status === "APPROVED" 
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                  : tx.status === "DECLINED"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse"
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3 text-right text-zinc-450">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No subscription transactions found for this user.</p>
                )}
              </div>

              {/* Gift memberships sent / received */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gifts Sent */}
                <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-indigo-500" /> Gifts Sent to Others ({user.giftsSent?.length || 0})
                  </h2>
                  {user.giftsSent && user.giftsSent.length > 0 ? (
                    <div className="space-y-3">
                      {user.giftsSent.map((gift: any) => (
                        <div key={gift.id} className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-1 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-zinc-650 dark:text-zinc-300 font-mono">Code: {gift.code}</span>
                            <span className="uppercase text-[9px] bg-indigo-50 dark:bg-indigo-950/25 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                              {gift.tier} ({gift.duration}m)
                            </span>
                          </div>
                          <p className="text-zinc-450 text-[10px]">Recipient: {gift.recipientEmail}</p>
                          <div className="flex justify-between items-center pt-1 text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                            <span>Status: {gift.status}</span>
                            <span>{new Date(gift.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No gifts sent.</p>
                  )}
                </div>

                {/* Gifts Received */}
                <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-indigo-500" /> Gifts Received & Redeemed ({user.giftsReceived?.length || 0})
                  </h2>
                  {user.giftsReceived && user.giftsReceived.length > 0 ? (
                    <div className="space-y-3">
                      {user.giftsReceived.map((gift: any) => (
                        <div key={gift.id} className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-1 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-zinc-650 dark:text-zinc-300 font-mono">Code: {gift.code}</span>
                            <span className="uppercase text-[9px] bg-indigo-50 dark:bg-indigo-950/25 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                              {gift.tier}
                            </span>
                          </div>
                          <p className="text-zinc-450 text-[10px]">Sponsor: @{gift.sentByUser.username}</p>
                          <div className="flex justify-between items-center pt-1 text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                            <span>Status: {gift.status}</span>
                            {gift.redeemedAt && <span>Redeemed {new Date(gift.redeemedAt).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No gifts received.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Activity & Timeline */}
          {activeTab === "activity" && (
            <div className="space-y-8">
              {/* Reading Progress */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" /> Reading Progression Logs ({user.readingProgress?.length || 0})
                </h2>
                {user.readingProgress && user.readingProgress.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.readingProgress.map((prog: any) => (
                      <div key={prog.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-zinc-400 uppercase text-[9px]">Story ID: {prog.storyId}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{prog.percentage}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-650 h-full rounded-full transition-all" style={{ width: `${prog.percentage}%` }} />
                        </div>
                        <p className="text-[9px] text-zinc-400 text-right font-medium">Updated: {new Date(prog.updatedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No reading progress tracks registered.</p>
                )}
              </div>

              {/* Achievements earned */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" /> Earned Badges & Achievements ({user.achievements?.length || 0})
                </h2>
                {user.achievements && user.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.achievements.map((ach: any) => (
                      <div key={ach.achievement.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{ach.achievement.name}</p>
                          <p className="text-[9px] text-indigo-500 font-bold uppercase">{ach.achievement.points} Points</p>
                          <p className="text-[8px] text-zinc-400">Earned: {new Date(ach.earnedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No achievements unlocked yet.</p>
                )}
              </div>

              {/* Newsletter Subscriptions */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" /> Newsletter Subscriptions ({user.newsletterSubs?.length || 0})
                </h2>
                {user.newsletterSubs && user.newsletterSubs.length > 0 ? (
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/20 text-xs">
                    {user.newsletterSubs.map((n: any) => (
                      <li key={n.author.id} className="py-2.5 flex justify-between items-center">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Subscribed to @{n.author.username}</span>
                        <span className="text-[10px] text-zinc-400">Subscribed {new Date(n.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-400 italic">Not subscribed to any newsletter mailing lists.</p>
                )}
              </div>

              {/* DMCA Notices */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/40">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-500" /> DMCA Copyright Submission Notices ({user.dmcaNotices?.length || 0})
                </h2>
                {user.dmcaNotices && user.dmcaNotices.length > 0 ? (
                  <div className="space-y-3">
                    {user.dmcaNotices.map((d: any) => (
                      <div key={d.id} className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200">Notice Ref: {d.id}</p>
                          <p className="text-[9px] text-zinc-450 font-semibold uppercase">Target Story ID: {d.storyId}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            d.status === "SUBMITTED" 
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                              : d.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-650 dark:bg-zinc-900"
                          }`}>
                            {d.status}
                          </span>
                          <p className="text-[9px] text-zinc-400">{new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No copyright compliance filings found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
