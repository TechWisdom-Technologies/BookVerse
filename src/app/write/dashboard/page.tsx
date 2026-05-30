"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  Users,
  Compass,
  Layers,
  GitBranch,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Calendar,
  Radio,
  Vote,
  Bookmark,
  Gift,
  Copy,
  CheckCircle2,
  Target,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Collaborator {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

interface ContributedStory {
  id: string;
  title: string;
  coverUrl: string | null;
  authorId: string;
  genre?: string | null;
  author: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

interface UniverseItem {
  id: string;
  name: string;
  description: string | null;
  collaborators: Collaborator[];
  stories: ContributedStory[];
}

interface BookRequestItem {
  id: string;
  createdAt: string;
  user: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  universe?: { id: string; name: string } | null;
  series?: { id: string; name: string } | null;
}

interface InviteItem {
  id: string;
  universeId: string;
  universe: {
    id: string;
    name: string;
    user: {
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    };
  };
}

// 3 New Telemetry Dash Interfaces
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollItem {
  id: string;
  question: string;
  storyTitle: string;
  chapterTitle: string;
  totalVotes: number;
  options: PollOption[];
}

interface BetaReaderItem {
  id: string;
  story: { title: string };
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

interface ScheduledItem {
  id: string;
  chapterNumber: number;
  releaseDateTime: string;
  notifyFollowers: boolean;
  storyTitle: string;
}

interface DashboardData {
  pendingInvites: InviteItem[];
  myUniverses: UniverseItem[];
  bookRequests: BookRequestItem[];
  stats: {
    totalStories: number;
    totalViews: number;
    totalReactions: number;
    totalComments: number;
    totalSubscribers: number;
    totalFollowers: number;
  };
  // Advanced feeds
  activePolls: PollItem[];
  betaReaders: BetaReaderItem[];
  scheduledTimeline: ScheduledItem[];
  // 5 New Dashboard Telemetries
  warningsAudit: {
    warningsSummary: Record<string, number>;
    avgAgeRating: number;
  };
  giftMemberships: Array<{
    id: string;
    code: string;
    tier: string;
    duration: number;
    recipientEmail: string;
    value: number;
    status: string;
    expiresAt: string;
    redeemedAt: string | null;
  }>;
  safetyReports: Array<{
    id: string;
    type: string;
    storyTitle: string;
    reason: string;
    status: string;
    createdAt: string;
    reporter: string;
  }>;
  genreMatchmaker: Array<{
    genre: string;
    readersInterested: number;
    servedByAuthor: boolean;
    marketNicheScore: number;
  }>;
}

export default function AuthorDashboardPage() {
  const router = useRouter();
  const { user, dbUser, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/author/dashboard');
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      } else if (res.status === 402) {
        const errPayload = await res.json();
        setUpgradeUrl(errPayload.upgradeUrl || '/premium/checkout?plan=creator');
      }
    } catch (err) {
      console.error('Error fetching author dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/write/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, authLoading, router]);

  const handleRespondInvite = async (universeId: string, accept: boolean) => {
    if (!dbUser) return;
    try {
      setActionLoading(universeId);
      const method = accept ? 'PATCH' : 'DELETE';
      const endpoint = `/api/universes/${universeId}/collaborators/${dbUser.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: accept ? JSON.stringify({ status: 'ACCEPTED' }) : undefined,
      });

      if (response.ok) {
        // Refresh dashboard statistics and invitations
        await fetchDashboardData();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update invite response.');
      }
    } catch (err) {
      console.error('Failed to respond to collaboration invite:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300 dark:text-zinc-700" />
      </div>
    );
  }

  // Upgrade Gate View
  if (upgradeUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <div className="max-w-md w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

          <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-wider">Creator Plan Required</h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Unlock the advanced Performance Registry, Fan Book Requests Stream, and robust Universe Co-Authorship control decks.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              href={upgradeUrl}
              className="w-full py-3 inline-flex items-center justify-center rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow"
            >
              Upgrade to Creator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-center p-6">
        <div className="space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Registry offline or inaccessible.</p>
        </div>
      </div>
    );
  }

  const {
    pendingInvites,
    myUniverses,
    bookRequests,
    stats,
    activePolls,
    betaReaders,
    scheduledTimeline,
    warningsAudit,
    giftMemberships,
    safetyReports,
    genreMatchmaker
  } = data;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Dashboard Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Studio
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight mb-2 uppercase flex items-center gap-2">
                Author Dashboard <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              </h1>
              <p className="text-sm text-zinc-500 font-medium">Sleek analytical telemetry, fan book requests, and collaborative universe frameworks.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2 border border-indigo-500/10 rounded-xl animate-fade-in shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
            Creator Protocol Enabled
          </div>
        </header>

        {/* 1. Pending Collaboration Invitations Section */}
        {pendingInvites.length > 0 && (
          <section className="mb-12 bg-indigo-50/10 dark:bg-indigo-950/5 border border-indigo-500/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm animate-fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Pending Collaboration Invitations ({pendingInvites.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 flex items-center justify-between gap-6 shadow-sm hover:border-indigo-500/20 transition-all animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                      {invite.universe.user.avatarUrl ? (
                        <img src={invite.universe.user.avatarUrl} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {invite.universe.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        Invited by @{invite.universe.user.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      disabled={actionLoading === invite.universeId}
                      onClick={() => handleRespondInvite(invite.universeId, true)}
                      className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-500 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white border border-emerald-500/10 shadow-sm transition-all flex items-center justify-center"
                      title="Accept Invite"
                    >
                      {actionLoading === invite.universeId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      disabled={actionLoading === invite.universeId}
                      onClick={() => handleRespondInvite(invite.universeId, false)}
                      className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white border border-rose-500/10 shadow-sm transition-all flex items-center justify-center"
                      title="Decline Invite"
                    >
                      {actionLoading === invite.universeId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Analytical Telemetry Snapshot */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Performance Telemetry</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden">
            {[
              { icon: BookOpen, label: 'Manuscripts', val: stats.totalStories, color: 'text-zinc-500' },
              { icon: Eye, label: 'Views', val: stats.totalViews, color: 'text-blue-500' },
              { icon: Heart, label: 'Reactions', val: stats.totalReactions, color: 'text-rose-500' },
              { icon: MessageSquare, label: 'Comments', val: stats.totalComments, color: 'text-indigo-500' },
              { icon: Users, label: 'Newsletter', val: stats.totalSubscribers, color: 'text-emerald-500' },
              { icon: Users, label: 'Followers', val: stats.totalFollowers, color: 'text-purple-500' },
            ].map((s, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                </div>
                <div className="text-xl font-black tracking-tight">{s.val.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* NEW FEATURE 1 & 2: Trajectory Timeline & Chapter Polls Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Calendar Release Timeline */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Scheduled Release Trajectory</h3>
              </div>
              {scheduledTimeline.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 italic">No manuscript releases scheduled. Set scheduling options in edit chapter menus.</div>
              ) : (
                <div className="space-y-4">
                  {scheduledTimeline.map((sc) => (
                    <div key={sc.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{sc.storyTitle}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Chapter {sc.chapterNumber} release</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider block font-mono text-indigo-500">{new Date(sc.releaseDateTime).toLocaleDateString()}</span>
                        <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block font-mono mt-1">{sc.notifyFollowers ? "ALERT ACTIVE" : "SILENT RELEASE"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/write" className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-1 w-fit">
              Manage manuscripts <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Active Polls telemetry */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <Vote className="w-4 h-4 text-zinc-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Audience Polls & Votes Telemetry</h3>
              </div>
              {activePolls.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 italic">No active story polls. Engage fans by adding interactive questions in chapter setups.</div>
              ) : (
                <div className="space-y-4">
                  {activePolls.slice(0, 2).map((poll) => (
                    <div key={poll.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider line-clamp-1">{poll.question}</h4>
                          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-1 block">
                            {poll.storyTitle} • {poll.chapterTitle}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 text-[8px] font-bold uppercase tracking-wider shrink-0 border border-indigo-500/10">
                          {poll.totalVotes} Votes
                        </span>
                      </div>

                      {/* Poll option percentages */}
                      <div className="space-y-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                        {poll.options.map(opt => {
                          const pct = poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(0) : '0';
                          return (
                            <div key={opt.id} className="space-y-1">
                              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                                <span className="text-zinc-500">{opt.text}</span>
                                <span className="text-zinc-900 dark:text-white font-mono">{pct}% ({opt.votes})</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/write" className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-1 w-fit">
              View all manuscripts <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </section>

        {/* 3. NEW FEATURE 3: Beta Reader Squad */}
        <section className="mb-12 p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
            <Radio className="w-4 h-4 text-zinc-400 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Beta Reader Squad</h3>
          </div>
          {betaReaders.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 italic">No beta readers registered. Connect with the community to recruit beta readers for draft feedback.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {betaReaders.map((br) => (
                <div key={br.id} className="p-4 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    {br.user.avatarUrl ? (
                      <img src={br.user.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[100px]">{br.user.displayName || br.user.username}</h4>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">@{br.user.username}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] font-bold uppercase tracking-wider text-indigo-500 w-full truncate" title={br.story.title}>
                    {br.story.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Two Column Registry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1 & 2: Universe Co-Authors & Works Registry */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <GitBranch className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Universes Collaborators Log</h2>
            </div>

            {myUniverses.length === 0 ? (
              <div className="py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl bg-zinc-50/5 flex flex-col items-center justify-center text-center p-6">
                <GitBranch className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mb-6" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic mb-2">No universes established.</p>
                <Link href="/write/universes" className="px-6 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 shadow">
                  Establish a Universe
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myUniverses.map((uni) => (
                  <div
                    key={uni.id}
                    className="p-6 bg-zinc-50/20 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-3xl space-y-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{uni.name}</h3>
                        {uni.description && <p className="text-xs text-zinc-400 max-w-lg mt-1 font-medium leading-relaxed line-clamp-1">{uni.description}</p>}
                      </div>
                      <Link
                        href={`/write/universes`}
                        className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-zinc-200/40 dark:border-zinc-700/40 shrink-0"
                      >
                        Manage Invites
                      </Link>
                    </div>

                    {/* Collaborator Roster */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40 space-y-4">
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Co-Authors Roster</h4>
                      {uni.collaborators.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No co-authors added yet. Establish collaborator nodes in Universe Studio.</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {uni.collaborators.map((c) => (
                            <div
                              key={c.id}
                              className="px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center gap-2 text-xs"
                            >
                              <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                {c.user.avatarUrl ? (
                                  <img src={c.user.avatarUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-2.5 h-2.5 text-zinc-400" />
                                )}
                              </div>
                              <span className="font-bold">{c.user.displayName || c.user.username}</span>
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.status === 'ACCEPTED'
                                  ? 'bg-emerald-50/5 text-emerald-500'
                                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                                }`}>
                                {c.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collaborator Contributions */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Manuscripts & Contributions</h4>
                        <Link
                          href="/author/analytics"
                          className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          See Full Analytics <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                      {uni.stories.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No collaborative manuscripts compiled in this universe yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {uni.stories.map((story) => (
                            <Link
                              href={`/write/story/${story.id}/edit`}
                              key={story.id}
                              className="p-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all shadow-sm"
                            >
                              {story.coverUrl ? (
                                <img src={story.coverUrl} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                              ) : (
                                <div className="w-10 h-14 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4 text-zinc-300" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold truncate pr-2">{story.title}</h5>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1 truncate">
                                  By {story.author.displayName || story.author.username}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Recent Book Requests Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fan Demands</h2>
              </div>
              <Link href="/write/requests" className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                View All
              </Link>
            </div>

            {bookRequests.length === 0 ? (
              <div className="py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl bg-zinc-50/5 flex flex-col items-center justify-center text-center p-6">
                <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mb-6" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No request feeds logged.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-zinc-50/10 dark:bg-zinc-900/5 border border-zinc-100 dark:border-zinc-900 rounded-2xl space-y-3 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                        {req.user.avatarUrl ? (
                          <img src={req.user.avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate pr-1">{req.user.displayName || req.user.username}</h4>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">{formatDate(req.createdAt)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/40 flex flex-col gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">wants new book in:</span>
                      {req.universe && (
                        <div className="px-2 py-1 rounded bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-500 border border-indigo-500/10 text-[9px] font-bold uppercase tracking-wider w-fit">
                          {req.universe.name}
                        </div>
                      )}
                      {req.series && (
                        <div className="px-2 py-1 rounded bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-500/10 text-[9px] font-bold uppercase tracking-wider w-fit">
                          {req.series.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ========================================== */}
        {/* 5 NEW ADVANCED CREATOR TOOL CARDS SECTION */}
        {/* ========================================== */}
        <section className="mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-900 space-y-12">

          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Creator Intelligence Registry</h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Advanced monetization trackers, content audits, and promotion campaigns.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Card 1: Target Audience & Warnings Audit */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Content Warning & Age Audit</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">YA-13 Avg</span>
                </div>

                <div className="space-y-4 mt-6">
                  {Object.keys(warningsAudit.warningsSummary).length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-400 italic">No content warnings active. Keep scanning draft safety ratings.</div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(warningsAudit.warningsSummary).slice(0, 3).map(([warn, count]) => (
                        <div key={warn} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-zinc-500">{warn}</span>
                            <span className="text-zinc-955 dark:text-white font-mono">{count} stories</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, count * 20)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl space-y-2 mt-4">
                    <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Demographic Reach Scope:</div>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                      Your stories average an age rating of <span className="font-bold text-zinc-900 dark:text-white font-mono">{warningsAudit.avgAgeRating.toFixed(0)}+</span>. Recommended marketing focus: Young Adults and Mature Fantasy circles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Onboarding Niche Preference Matchmaker */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Audience Genre Matchmaker</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">Live Niche Index</span>
                </div>

                <div className="space-y-4 mt-6">
                  {genreMatchmaker.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-400 italic font-medium leading-relaxed">
                      No onboarding preferences logged in database yet. Matched niches compile dynamically as readers join.
                    </div>
                  ) : (
                    genreMatchmaker.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-zinc-50 dark:border-zinc-900/10 last:border-0">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{item.genre}</h4>
                          <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{item.readersInterested} fans searching</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${item.servedByAuthor
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10'
                          }`}>
                          {item.servedByAuthor ? "SERVED" : "POTENTIAL"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Recent Content Integrity & Warnings alerts */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-zinc-400 animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Content Integrity & Flags</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 font-mono">Catalog Safe</span>
                </div>

                <div className="space-y-4 mt-6">
                  {safetyReports.length === 0 ? (
                    <div className="py-12 text-center text-xs text-emerald-500 font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-500/10 rounded-2xl flex items-center justify-center gap-2 animate-fade-in shadow-sm">
                      <Check className="w-4 h-4 text-emerald-500 animate-bounce" /> Catalog is clean and compliant
                    </div>
                  ) : (
                    safetyReports.map((report) => (
                      <div key={report.id} className="p-4 bg-zinc-50/20 dark:bg-zinc-900/5 border border-zinc-100 dark:border-zinc-900 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 font-mono">{report.type}</span>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${report.status === 'RESOLVED' || report.status === 'DISMISSED'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                            }`}>
                            {report.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate" title={report.storyTitle}>{report.storyTitle}</h4>
                        <p className="text-[9px] text-zinc-400 font-medium leading-normal line-clamp-1" title={report.reason}>{report.reason}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-8">

            {/* Card 5: Gift Memberships registry with interactive Copy button */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Gift Memberships Console</h3>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">Gift Registry</span>
              </div>

              <div className="space-y-4">
                {giftMemberships.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-400 italic font-medium leading-relaxed">
                    No active gift memberships sponsored yet. Sponsor gift codes from the Creator Tier control deck to invite premium beta co-authors.
                  </div>
                ) : (
                  giftMemberships.map((g) => (
                    <div key={g.id} className="p-5 bg-zinc-50/20 dark:bg-zinc-900/5 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center justify-between gap-6 hover:border-indigo-500/20 transition-all">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">{g.code}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(g.code);
                              setCopiedCode(g.code);
                              setTimeout(() => setCopiedCode(null), 2000);
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                            title="Copy Promo Code"
                          >
                            {copiedCode === g.code ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in duration-200" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase truncate max-w-[180px]" title={g.recipientEmail}>For: {g.recipientEmail}</p>
                        <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Valued: ${g.value.toFixed(2)} USD</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg block w-fit ml-auto mb-2 ${g.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                            : g.status === 'REDEEMED'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                          }`}>
                          {g.status}
                        </span>
                        <span className="text-[8px] text-zinc-400 font-bold uppercase font-mono block">Expires {new Date(g.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
