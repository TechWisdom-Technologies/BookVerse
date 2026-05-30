'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  Loader2,
  Globe,
  GlobeLock,
  Search,
  ArrowUpDown,
  Coins,
  Sparkles,
  Award,
  BookOpenCheck,
  Smile,
  Share2,
  Clock,
  Palette,
  Layers
} from 'lucide-react';

interface StoryAnalytics {
  id: string;
  title: string;
  published: boolean;
  views: number;
  reactions: number;
  comments: number;
  chapters: number;
  tips: number;
}

interface SentimentGroup {
  reactionType: 'LIKE' | 'LOVE' | 'FIRE' | 'CRY' | 'WOW';
  _count: { id: number };
}

interface Analytics {
  stats: {
    totalViews: number;
    totalStories: number;
    totalChapters: number;
    totalReactions: number;
    totalComments: number;
    totalTipsAmount: number;
    totalTips: number;
    subscribers: number;
    followers: number;
  };
  topStories: Array<{
    id: string;
    title: string;
    views: number;
    reactions: number;
    comments: number;
    tips: number;
  }>;
  stories: StoryAnalytics[];
  sentimentDistribution: SentimentGroup[];
  readingCompletion: {
    averageProgress: number;
    trackedReaders: number;
  };
  // 5 New Analytical Telemetries
  viralAmplification: {
    shares: Record<string, number>;
    totalShares: number;
    amplificationScore: number;
  };
  focusIndex: {
    avgPagesPerSession: number;
    avgMinutesPerSession: number;
    focusScore: number;
  };
  annotationsHeatmap: {
    bookmarks: number;
    highlights: number;
    notes: number;
    totalAnnotations: number;
    colors: Record<string, number>;
  };
  cohortRetention: Array<{
    chapter: string;
    rate: number;
  }>;
  creatorInsights?: {
    followers: Array<{ id: string; username: string; displayName: string | null; avatarUrl: string | null }>;
    subscribers: Array<{ id?: string; email?: string; username?: string; displayName?: string | null; avatarUrl?: string | null }>;
    tippers: Array<{ amount: number; createdAt: string; sender: { id?: string; username: string; displayName?: string | null; avatarUrl?: string | null } }>;
  };
}

type SortKey = 'title' | 'views' | 'reactions' | 'comments' | 'tips' | 'chapters' | 'engagementRate';
type SortDirection = 'asc' | 'desc';

export default function AuthorAnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

  // Advanced Options States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/author/analytics'); return; }
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/author/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        } else if (res.status === 402) {
          const data = await res.json();
          setUpgradeUrl(data.upgradeUrl || '/premium/checkout?plan=creator');
        }
      } finally { setLoading(false); }
    };
    fetchAnalytics();
  }, [user, authLoading, router]);

  // Handle Sort triggers
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Compute stats and process list dynamically
  const processedStories = useMemo(() => {
    if (!analytics?.stories) return [];

    let list = [...analytics.stories];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(s => s.title.toLowerCase().includes(query));
    }

    // 2. Status Segment Filter
    if (statusFilter === 'published') {
      list = list.filter(s => s.published);
    } else if (statusFilter === 'draft') {
      list = list.filter(s => !s.published);
    }

    // Helper to calculate engagement rate
    const getEngagementRate = (story: StoryAnalytics) => {
      if (story.views === 0) return 0;
      return (story.reactions + story.comments) / story.views;
    };

    // 3. Advanced Sorting Protocol
    list.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortKey === 'engagementRate') {
        valA = getEngagementRate(a);
        valB = getEngagementRate(b);
      } else {
        valA = a[sortKey];
        valB = b[sortKey];
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [analytics, searchQuery, statusFilter, sortKey, sortDirection]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (upgradeUrl) return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-md w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl animate-in fade-in duration-300">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow">
          <Award className="w-7 h-7" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-wider">Creator Plan Required</h2>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            Unlock fully sortable manuscript registers, dynamic analytics queries, computed engagement indices, and detailed monetization ledger reviews.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <Link href={upgradeUrl} className="w-full py-3 inline-flex items-center justify-center rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow">
            Upgrade to Creator
          </Link>
        </div>
      </div>
    </main>
  );

  if (!analytics) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-center p-6">
      <div className="space-y-4">
        <GlobeLock className="w-10 h-10 text-zinc-400 mx-auto" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Analytics Offline</p>
      </div>
    </div>
  );

  const {
    stats,
    topStories,
    sentimentDistribution,
    readingCompletion,
    viralAmplification,
    focusIndex,
    annotationsHeatmap,
    cohortRetention
  } = analytics;

  // Compute sentiment breakdown
  const sentimentStats = {
    LIKE: sentimentDistribution?.find(s => s.reactionType === 'LIKE')?._count.id || 0,
    LOVE: sentimentDistribution?.find(s => s.reactionType === 'LOVE')?._count.id || 0,
    FIRE: sentimentDistribution?.find(s => s.reactionType === 'FIRE')?._count.id || 0,
    CRY: sentimentDistribution?.find(s => s.reactionType === 'CRY')?._count.id || 0,
    WOW: sentimentDistribution?.find(s => s.reactionType === 'WOW')?._count.id || 0,
  };
  const totalSentimentVotes = Object.values(sentimentStats).reduce((sum, v) => sum + v, 0);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write/dashboard" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Creator Studio
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight mb-2 uppercase flex items-center gap-2">
                Performance Registry <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              </h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Advanced manuscript metrics, computed engagement indexes, and yield data.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-xl">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
            Intelligence Protocol Active
          </div>
        </header>

        {/* Global Stats Registry */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden mb-12 shadow-sm">
          {[
            { icon: BookOpen, label: "Manuscripts established", value: stats.totalStories },
            { icon: Eye, label: "Total views logged", value: stats.totalViews },
            { icon: Heart, label: "Reader reactions", value: stats.totalReactions },
            { icon: MessageSquare, label: "Comments index", value: stats.totalComments },
          ].map((s, i) => (
            <div key={i} className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                <s.icon className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
              </div>
              <div className="text-2xl font-black tracking-tight">{s.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* NEW FEATURE 4 & 5: Sentiment Metrics & Reader Progress Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Sentiment distribution bar chart card */}
          <div className="lg:col-span-2 p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <Smile className="w-4 h-4 text-zinc-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Audience Sentiment Distribution</h3>
              </div>
              {totalSentimentVotes === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 italic">No reactions logged. Community reactions will compile sentiment details here.</div>
              ) : (
                <div className="space-y-4">
                  {[
                    { type: 'LOVE', label: 'Loves', val: sentimentStats.LOVE, pct: ((sentimentStats.LOVE / totalSentimentVotes) * 100).toFixed(0), color: 'bg-rose-500', barColor: 'bg-rose-500/20' },
                    { type: 'FIRE', label: 'Fires', val: sentimentStats.FIRE, pct: ((sentimentStats.FIRE / totalSentimentVotes) * 100).toFixed(0), color: 'bg-amber-500', barColor: 'bg-amber-500/20' },
                    { type: 'LIKE', label: 'Likes', val: sentimentStats.LIKE, pct: ((sentimentStats.LIKE / totalSentimentVotes) * 100).toFixed(0), color: 'bg-blue-500', barColor: 'bg-blue-500/20' },
                    { type: 'WOW', label: 'Wows', val: sentimentStats.WOW, pct: ((sentimentStats.WOW / totalSentimentVotes) * 100).toFixed(0), color: 'bg-purple-500', barColor: 'bg-purple-500/20' },
                    { type: 'CRY', label: 'Sad/Crys', val: sentimentStats.CRY, pct: ((sentimentStats.CRY / totalSentimentVotes) * 100).toFixed(0), color: 'bg-zinc-400', barColor: 'bg-zinc-450/20' },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-zinc-500 flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${s.color}`} /> {s.label}</span>
                        <span className="text-zinc-900 dark:text-white font-mono">{s.pct}% ({s.val})</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reader completion progress card */}
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <BookOpenCheck className="w-4 h-4 text-zinc-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Reader Completion Telemetry</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Average Completion progress</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-500">{readingCompletion.averageProgress.toFixed(1)}%</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Average page rate</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${readingCompletion.averageProgress}%` }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tracked Reader Sessions</div>
                  <div className="text-xl font-black mt-1">{(readingCompletion.trackedReaders).toLocaleString()}</div>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Unique page reader completion logs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscriber & Fiscal Registry List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Community Newsletter", val: `${stats.subscribers.toLocaleString()} subscribers`, icon: Users },
            { label: "Followers Count", val: `${stats.followers.toLocaleString()} readers`, icon: Users },
            { label: "Fiscal Yield Snapshot", val: `$${stats.totalTipsAmount.toLocaleString()}`, icon: Coins, sub: `${stats.totalTips} total sponsorships` },
          ].map((s, i) => (
            <div key={i} className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-sm shadow-sm flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                <s.icon className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight mt-4">{s.val}</div>
                {s.sub && <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1 font-mono">{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* ========================================== */}
        {/* EXCLUSIVE CREATOR INSIGHTS (WHO IS WHO) */}
        {/* ========================================== */}
        {analytics.creatorInsights && (
          <section className="mb-16 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Creator Demographics (Identities)</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Exclusive itemized identity lists of your audience base.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Followers Identity List */}
              <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm max-h-[400px] flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Followers</h3>
                <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
                  {analytics.creatorInsights.followers.length === 0 ? (
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest py-10 text-center">No followers yet.</div>
                  ) : (
                    analytics.creatorInsights.followers.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                          {f.avatarUrl ? <img src={f.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{f.username.charAt(0)}</div>}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold uppercase truncate">{f.displayName || f.username}</p>
                          <p className="text-[8px] text-zinc-400 uppercase tracking-wider truncate">@{f.username}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Subscribers Identity List */}
              <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm max-h-[400px] flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Subscribers</h3>
                <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
                  {analytics.creatorInsights.subscribers.length === 0 ? (
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest py-10 text-center">No subscribers yet.</div>
                  ) : (
                    analytics.creatorInsights.subscribers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                          {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{(s.username || s.email || '?').charAt(0)}</div>}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold uppercase truncate">{s.displayName || s.username || 'Anonymous'}</p>
                          <p className="text-[8px] text-zinc-400 uppercase tracking-wider truncate">{s.username ? `@${s.username}` : s.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Tippers Identity List */}
              <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm max-h-[400px] flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Tippers</h3>
                <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
                  {analytics.creatorInsights.tippers.length === 0 ? (
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest py-10 text-center">No tips yet.</div>
                  ) : (
                    analytics.creatorInsights.tippers.map((t, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                            {t.sender?.avatarUrl ? <img src={t.sender.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{(t.sender?.username || '?').charAt(0)}</div>}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold uppercase truncate">{t.sender?.displayName || t.sender?.username}</p>
                            <p className="text-[8px] text-zinc-400 uppercase tracking-wider truncate">{t.sender?.username ? `@${t.sender.username}` : 'Anonymous'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-emerald-500 font-mono">${(t.amount / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* 5 NEW ADVANCED PERFORMANCE ANALYTICS CARDS */}
        {/* ========================================== */}
        <section className="mb-16 space-y-12 animate-fade-in">
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Creator Intelligence Telemetry</h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Advanced platform amplification, engagement focal indexing, and tipping projection simulation tools.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. Platform Amplification Grid */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Viral Platform Amplification</h3>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-indigo-500">{viralAmplification.amplificationScore.toFixed(1)}% Amp</span>
                </div>

                {viralAmplification.totalShares === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                    <Share2 className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">No shares recorded yet</p>
                    <p className="text-[9px] text-zinc-400 max-w-[200px] leading-relaxed">Share your stories with fans to start capturing viral reach and platform spread statistics here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {Object.entries(viralAmplification.shares).map(([platform, count]) => (
                      <div key={platform} className="p-4 bg-zinc-50/20 dark:bg-zinc-900/5 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block">{platform}</span>
                        <span className="text-lg font-black block mt-2 font-mono">{count}</span>
                        <span className="text-[8px] text-indigo-500 font-bold block mt-1 uppercase font-sans">shares logged</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {viralAmplification.totalShares > 0 && (
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between mt-6">
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Cumulative shares</span>
                  <span className="text-xs font-black text-indigo-500 font-mono">{viralAmplification.totalShares} total</span>
                </div>
              )}
            </div>

            {/* 2. Reading Session Focus Index */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Reading Focus Index</h3>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-emerald-500">Active</span>
                </div>

                {focusIndex.focusScore === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                    <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">No session logs detected</p>
                    <p className="text-[9px] text-zinc-400 max-w-[200px] leading-relaxed font-sans">Community reading duration and session focus stats will calculate and render here.</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-sans">Session Intensity</span>
                        <div className="text-3xl font-black tracking-tight text-emerald-500 mt-1">{focusIndex.focusScore.toFixed(0)}%</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block font-sans">Focus Metric</span>
                        <span className="text-[9px] text-zinc-500 font-medium block mt-1 font-sans">Pages vs Minutes speed</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 text-[10px] font-bold uppercase">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">Avg Pages read</span>
                        <span className="font-mono">{focusIndex.avgPagesPerSession.toFixed(1)} pages</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">Avg Session Duration</span>
                        <span className="font-mono">{focusIndex.avgMinutesPerSession.toFixed(1)} mins</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Reader Annotation Heatmap */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Reader Annotations Heatmap</h3>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-indigo-500">{annotationsHeatmap.totalAnnotations} Total</span>
                </div>

                {annotationsHeatmap.totalAnnotations === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                    <Palette className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">No annotations tracked</p>
                    <p className="text-[9px] text-zinc-400 max-w-[200px] leading-relaxed font-sans">When readers highlight, bookmark or leave notes on your books, a custom palette breakdown will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    <div className="flex gap-2 justify-between">
                      {[
                        { label: "Bookmarks", count: annotationsHeatmap.bookmarks, bg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500" },
                        { label: "Highlights", count: annotationsHeatmap.highlights, bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-500" },
                        { label: "Notes", count: annotationsHeatmap.notes, bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500" }
                      ].map((item, idx) => (
                        <div key={idx} className={`flex-1 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-900 text-center ${item.bg}`}>
                          <span className="text-[8px] font-black uppercase tracking-wider block font-sans">{item.label}</span>
                          <span className="text-sm font-black block mt-2 font-mono">{item.count}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 font-sans">Highlight Palette preferences:</div>
                      <div className="flex items-center gap-4">
                        {[
                          { color: "bg-yellow-400", name: "Yellow", count: annotationsHeatmap.colors.yellow },
                          { color: "bg-emerald-400", name: "Green", count: annotationsHeatmap.colors.green },
                          { color: "bg-blue-400", name: "Blue", count: annotationsHeatmap.colors.blue },
                          { color: "bg-pink-400", name: "Pink", count: annotationsHeatmap.colors.pink },
                        ].map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold uppercase">
                            <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                            <span className="font-mono text-zinc-500">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-8">
            
            {/* 4. Chapter Drop-Off Cohort Retention */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Chapter Retention Cohort Drop-Off</h3>
                </div>
                <span className="text-[9px] font-black tracking-wider text-rose-500 font-mono">Attrition Matrix</span>
              </div>

              {cohortRetention.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
                  <Layers className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">No chapter progression data loaded</p>
                  <p className="text-[9px] text-zinc-400 max-w-md leading-relaxed font-sans">Cohort drop-off matrices measure readers' transition rate from Chapter 1 through subsequent chapters. Add multiple chapters to your stories and build reader traction to see progression cohort rates here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cohortRetention.map((ch, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider w-28 truncate shrink-0 font-sans">{ch.chapter}</span>
                      <div className="flex-1 h-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-lg overflow-hidden relative">
                        <div className="h-full bg-indigo-500 rounded-lg transition-all duration-500" style={{ width: `${ch.rate}%` }} />
                      </div>
                      <span className="text-[9px] font-black uppercase font-mono tracking-wider w-10 text-right text-zinc-900 dark:text-white shrink-0">{ch.rate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </section>

        {/* Top Performers List */}
        {topStories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">High-Velocity Manuscripts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topStories.map((story, idx) => {
                const totalEngagement = story.reactions + story.comments;
                const er = story.views > 0 ? ((totalEngagement / story.views) * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={story.id} className="p-6 bg-zinc-50/20 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl shadow-sm hover:border-indigo-500/20 transition-all flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-700">PERFORMER {(idx + 1).toString().padStart(2, '0')}</span>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1 line-clamp-1 truncate" title={story.title}>
                        {story.title}
                      </h3>
                    </div>
                    <div>
                      <div className="text-xl font-black">{story.views.toLocaleString()}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Views logged</div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-[9px] font-bold uppercase">
                      <span className="text-zinc-400">Engagement</span>
                      <span className="text-indigo-500">{er}% ER</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Fully Advanced Sortable Manuscripts Logs Section */}
        <section className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Manuscripts Registry logs</h2>
            </div>
            
            {/* Real-time Query Options */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Segment controls */}
              <div className="flex bg-zinc-50 dark:bg-zinc-900 p-1 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                {(['all', 'published', 'draft'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setStatusFilter(option)}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                      statusFilter === option
                        ? 'bg-white dark:bg-zinc-850 text-zinc-950 dark:text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                  >
                    {option === 'all' ? 'All' : option === 'published' ? 'Live' : 'Drafts'}
                  </button>
                ))}
              </div>

              {/* Dynamic live search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
                <input
                  type="text"
                  placeholder="Query by title..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-indigo-500 transition-all w-48 sm:w-64 shadow-sm"
                />
              </div>
            </div>
          </div>

          {processedStories.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No matching manuscripts located in registry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 select-none">
                    {/* Header Columns */}
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        Manuscript
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('views')}>
                      <div className="flex items-center justify-end gap-1">
                        Views
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('reactions')}>
                      <div className="flex items-center justify-end gap-1">
                        Reactions
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('comments')}>
                      <div className="flex items-center justify-end gap-1">
                        Comments
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('engagementRate')}>
                      <div className="flex items-center justify-end gap-1">
                        Eng. Rate
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('tips')}>
                      <div className="flex items-center justify-end gap-1">
                        Sponsorship Yield
                        <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
                      </div>
                    </th>
                    <th className="py-4 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/60 font-mono text-[10px] font-bold">
                  {processedStories.map(story => {
                    const er = story.views > 0 ? (((story.reactions + story.comments) / story.views) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <tr key={story.id} className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-all">
                        <td className="py-4 px-3 font-sans text-xs">
                          <Link href={`/write/story/${story.id}/edit`} className="text-zinc-900 dark:text-white hover:underline truncate block max-w-[200px] sm:max-w-xs font-bold uppercase tracking-wide">
                            {story.title}
                          </Link>
                        </td>
                        <td className="py-4 px-3 text-right text-zinc-500">{story.views.toLocaleString()}</td>
                        <td className="py-4 px-3 text-right text-rose-500">{story.reactions.toLocaleString()}</td>
                        <td className="py-4 px-3 text-right text-blue-500">{story.comments.toLocaleString()}</td>
                        <td className="py-4 px-3 text-right text-indigo-500">{er}%</td>
                        <td className="py-4 px-3 text-right text-emerald-500">{story.tips > 0 ? `$${story.tips.toLocaleString()}` : '—'}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center justify-center gap-1.5 mx-auto w-fit ${
                            story.published ? "text-emerald-500 bg-emerald-500/5 border border-emerald-500/10" : "text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                          }`}>
                            {story.published ? <Globe className="w-2.5 h-2.5" /> : <GlobeLock className="w-2.5 h-2.5" />}
                            {story.published ? 'Live' : 'Draft'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
