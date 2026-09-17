'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { checkTierAccess } from"@/lib/tier-check";
import { AccessDeniedModal } from"@/components/auth/AccessDeniedModal";
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
 avgChaptersRead: number;
 avgMinutesPerSession: number;
 focusScore: number;
 totalLogsCount: number;
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
 retentionByStory: Record<string, Array<{ chapter: string; rate: number }>>;
 collections: {
 totalUniverseViews: number;
 totalSeriesViews: number;
 universes: Array<{ id: string; name: string; views: number; reactions: number; comments: number }>;
 series: Array<{ id: string; name: string; views: number; reactions: number; comments: number }>;
 };
 creatorInsights?: {
 followers: Array<{ id: string; username: string; displayName: string | null; avatarUrl: string | null }>;
 subscribers: Array<{ id?: string; email?: string; username?: string; displayName?: string | null; avatarUrl?: string | null }>;
 tippers: Array<{ amount: number; createdAt: string; sender: { id?: string; username: string; displayName?: string | null; avatarUrl?: string | null } }>;
 };
 promotionAnalytics?: Array<{
 id: string;
 storyTitle: string;
 tier: string;
 cost: number;
 status: string;
 startDate: string;
 endDate: string;
 campaignDays: number;
 promotionViews: number;
 reactionsGenerated: number;
 commentsGenerated: number;
 totalEngagements: number;
 costPerEngagement: string;
 costPerView: string;
 roiRating: string;
 dailyEngagementVelocity: number;
 followersGained: number;
 tipsEarned: number;
 tipCount: number;
 promoShares: number;
 interactionRate: number;
 sentimentScore: number;
 positiveReactions: number;
 negativeReactions: number;
 librarySaves: number;
 totalReadingMinutes: number;
 costPerMinute: number;
 inlineCommentsCount: number;
 }>;
}

type SortKey = 'title' | 'views' | 'reactions' | 'comments' | 'tips' | 'chapters' | 'engagementRate';
type SortDirection = 'asc' | 'desc';

export default function AuthorAnalyticsPage() {
 const router = useRouter();
 const { user, dbUser, loading: authLoading } = useAuth();
 const access = checkTierAccess(dbUser,"CREATOR","/author/analytics");
 const [analytics, setAnalytics] = useState<Analytics | null>(null);
 const [loading, setLoading] = useState(true);
 const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

 // Advanced Options States
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
 const [sortKey, setSortKey] = useState<SortKey>('views');
 const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
 const [selectedRetentionStory, setSelectedRetentionStory] = useState<string>('all');
 const [selectedPromotion, setSelectedPromotion] = useState<string>('');

 useEffect(() => {
 if (authLoading || !access.allowed) return;
 
 const fetchAnalytics = async () => {
 try {
 setLoading(true);
 const res = await fetch('/api/author/analytics');
 if (res.ok) {
 const data = await res.json();
 setAnalytics(data);
 if (data.promotionAnalytics && data.promotionAnalytics.length > 0) {
 setSelectedPromotion(data.promotionAnalytics[0].id);
 }
 } else if (res.status === 402) {
 const data = await res.json();
 setUpgradeUrl(data.upgradeUrl || '/premium/checkout?plan=creator');
 }
 } finally { setLoading(false); }
 };
 fetchAnalytics();
 }, [user, dbUser, authLoading, router, access.allowed]);

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

 if (authLoading || (loading && access.allowed)) return (
 <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
 <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
 </div>
 );

 if (!access.allowed) {
 return <AccessDeniedModal requiredTier={access.requiredTier} redirectTo={access.redirectTo} />;
 }

 if (!analytics) return (
 <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-center p-6">
 <div className="space-y-4">
 <GlobeLock className="w-10 h-10 text-zinc-400 mx-auto" />
 <p className="text-xs font-bold text-zinc-400">Analytics Offline</p>
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
 cohortRetention,
 collections,
 promotionAnalytics
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
 <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
 Performance Registry <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
 </h1>
 <p className="text-xs text-zinc-500 font-bold">Advanced manuscript metrics, computed engagement indexes, and yield data.</p>
 </div>
 </div>
 <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-xl">
 <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
 Intelligence Protocol Active
 </div>
 </header>

 {/* Global Stats Registry */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden mb-12 shadow">
 {[
 { icon: BookOpen, label:"Manuscripts established", value: stats.totalStories },
 { icon: Eye, label:"Total views logged", value: stats.totalViews },
 { icon: Heart, label:"Reader reactions", value: stats.totalReactions },
 { icon: MessageSquare, label:"Comments index", value: stats.totalComments },
 ].map((s, i) => (
 <div key={i} className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between min-h-[140px]">
 <div className="flex items-center justify-between mb-4">
 <span className="text-sm font-bold text-zinc-400">{s.label}</span>
 <s.icon className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
 </div>
 <div className="text-2xl font-bold tracking-tight">{s.value.toLocaleString()}</div>
 </div>
 ))}
 </div>

 
 <div className="my-16 border-b border-zinc-200 dark:border-zinc-800" />

 {/* Collections (Universes & Series) Stats */}
 <section className="mb-12 animate-fade-in">
 <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
 <Layers className="w-4 h-4 text-zinc-400" />
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold text-zinc-400">Collections Intelligence</h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Universes */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Globe className="w-4 h-4 text-indigo-500" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold">Universes Performance</h3>
 </div>
 <div className="text-right">
 <span className="text-xs font-bold text-zinc-400 block">Total Views</span>
 <span className="text-sm font-bold">{collections.totalUniverseViews.toLocaleString()}</span>
 </div>
 </div>
 
 {collections.universes.length === 0 ? (
 <p className="text-xs text-zinc-400 font-bold text-center py-6">No universes found</p>
 ) : (
 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
 {collections.universes.map(u => (
 <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="text-sm font-bold truncate max-w-[200px]" title={u.name}>{u.name}</span>
 <div className="flex items-center gap-4 text-xs font-bold">
 <span className="text-zinc-500" title="Views"><Eye className="w-3 h-3 inline mr-1 mb-0.5"/>{u.views}</span>
 <span className="text-emerald-500" title="Reactions"><Heart className="w-3 h-3 inline mr-1 mb-0.5"/>{u.reactions}</span>
 <span className="text-indigo-500" title="Comments"><MessageSquare className="w-3 h-3 inline mr-1 mb-0.5"/>{u.comments}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Series */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-indigo-500" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold">Series Performance</h3>
 </div>
 <div className="text-right">
 <span className="text-xs font-bold text-zinc-400 block">Total Views</span>
 <span className="text-sm font-bold">{collections.totalSeriesViews.toLocaleString()}</span>
 </div>
 </div>
 
 {collections.series.length === 0 ? (
 <p className="text-xs text-zinc-400 font-bold text-center py-6">No series found</p>
 ) : (
 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
 {collections.series.map(s => (
 <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="text-sm font-bold truncate max-w-[200px]" title={s.name}>{s.name}</span>
 <div className="flex items-center gap-4 text-xs font-bold">
 <span className="text-zinc-500" title="Views"><Eye className="w-3 h-3 inline mr-1 mb-0.5"/>{s.views}</span>
 <span className="text-emerald-500" title="Reactions"><Heart className="w-3 h-3 inline mr-1 mb-0.5"/>{s.reactions}</span>
 <span className="text-indigo-500" title="Comments"><MessageSquare className="w-3 h-3 inline mr-1 mb-0.5"/>{s.comments}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </section>

 
 <div className="my-16 border-b border-zinc-200 dark:border-zinc-800" />

 {/* NEW FEATURE 4 & 5: Sentiment Metrics & Reader Progress Section */}
 <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
 
 {/* Sentiment distribution bar chart card */}
 <div className="lg:col-span-2 p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow flex flex-col justify-between space-y-6">
 <div>
 <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
 <Smile className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Audience Sentiment Distribution</h3>
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
 <div className="flex justify-between text-xs font-bold">
 <span className="text-zinc-500 flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${s.color}`} /> {s.label}</span>
 <span className="text-zinc-900 dark:text-white">{s.pct}% ({s.val})</span>
 </div>
 <div className="w-full h-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden shadow-inner">
 <div className={`h-full ${s.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${s.pct}%` }} />
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Reader completion progress card */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow flex flex-col justify-between space-y-6">
 <div>
 <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
 <BookOpenCheck className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Reader Completion Telemetry</h3>
 </div>
 <div className="space-y-6">
 <div>
 <div className="text-sm font-bold text-zinc-400 mb-2">Average Completion progress</div>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-bold text-indigo-500">{readingCompletion.averageProgress.toFixed(1)}%</span>
 <span className="text-xs font-bold text-zinc-400">Average page rate</span>
 </div>
 <div className="w-full h-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden mt-3 shadow-inner">
 <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${readingCompletion.averageProgress}%` }}><div className="absolute inset-0 bg-white/20 w-full animate-pulse" /></div>
 </div>
 </div>

 <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
 <div className="text-sm font-bold text-zinc-400">Tracked Reader Sessions</div>
 <div className="text-xl font-bold mt-1">{(readingCompletion.trackedReaders).toLocaleString()}</div>
 <p className="text-xs text-zinc-400 mt-1">Unique page reader completion logs</p>
 </div>
 </div>
 </div>
 </div>
 </section>

 
 <div className="my-16 border-b border-zinc-200 dark:border-zinc-800" />

 {/* Subscriber & Fiscal Registry List */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
 {[
 { label:"Community Newsletter", val: `${stats.subscribers.toLocaleString()} subscribers`, icon: Users },
 { label:"Followers Count", val: `${stats.followers.toLocaleString()} readers`, icon: Users },
 { label:"Fiscal Yield Snapshot", val: `৳${stats.totalTipsAmount.toLocaleString()}`, icon: Coins, sub: `${stats.totalTips} total sponsorships` },
 ].map((s, i) => (
 <div key={i} className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-sm shadow flex flex-col justify-between min-h-[130px]">
 <div className="flex items-center justify-between">
 <span className="text-sm font-bold text-zinc-400">{s.label}</span>
 <s.icon className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
 </div>
 <div>
 <div className="text-lg font-bold tracking-tight mt-4">{s.val}</div>
 {s.sub && <div className="text-xs font-bold text-zinc-400 mt-1">{s.sub}</div>}
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
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold">Creator Demographics (Identities)</h2>
 <p className="text-sm text-zinc-400 font-bold mt-0.5">Exclusive itemized identity lists of your audience base.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Followers Identity List */}
 <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow max-h-[400px] flex flex-col">
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Followers</h3>
 <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
 {analytics.creatorInsights.followers.length === 0 ? (
 <div className="text-xs text-zinc-500 py-10 text-center">No followers yet.</div>
 ) : (
 analytics.creatorInsights.followers.map((f, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
 {f.avatarUrl ? <img src={f.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-bold">{f.username.charAt(0)}</div>}
 </div>
 <div className="overflow-hidden">
 <p className="text-sm font-bold truncate">{f.displayName || f.username}</p>
 <p className="text-xs text-zinc-400 truncate">@{f.username}</p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Subscribers Identity List */}
 <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow max-h-[400px] flex flex-col">
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Subscribers</h3>
 <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
 {analytics.creatorInsights.subscribers.length === 0 ? (
 <div className="text-xs text-zinc-500 py-10 text-center">No subscribers yet.</div>
 ) : (
 analytics.creatorInsights.subscribers.map((s, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
 {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-bold">{(s.username || s.email || '?').charAt(0)}</div>}
 </div>
 <div className="overflow-hidden">
 <p className="text-sm font-bold truncate">{s.displayName || s.username || 'Anonymous'}</p>
 <p className="text-xs text-zinc-400 truncate">{s.username ? `@${s.username}` : s.email}</p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Tippers Identity List */}
 <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow max-h-[400px] flex flex-col">
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">Recent Tippers</h3>
 <div className="overflow-y-auto space-y-4 pr-2 flex-1 scrollbar-thin">
 {analytics.creatorInsights.tippers.length === 0 ? (
 <div className="text-xs text-zinc-500 py-10 text-center">No tips yet.</div>
 ) : (
 analytics.creatorInsights.tippers.map((t, i) => (
 <div key={i} className="flex items-center justify-between gap-3">
 <div className="flex items-center gap-3 overflow-hidden">
 <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
 {t.sender?.avatarUrl ? <img src={t.sender.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-bold">{(t.sender?.username || '?').charAt(0)}</div>}
 </div>
 <div className="overflow-hidden">
 <p className="text-sm font-bold truncate">{t.sender?.displayName || t.sender?.username}</p>
 <p className="text-xs text-zinc-400 truncate">{t.sender?.username ? `@${t.sender.username}` : 'Anonymous'}</p>
 </div>
 </div>
 <div className="text-right shrink-0">
 <p className="text-xs font-bold text-emerald-500">৳{(t.amount / 100).toFixed(2)}</p>
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
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold">Creator Intelligence Telemetry</h2>
 <p className="text-sm text-zinc-400 font-bold mt-0.5">Advanced platform amplification, engagement focal indexing, and tipping projection simulation tools.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* 1. Platform Amplification Grid */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow flex flex-col justify-between min-h-[300px]">
 <div>
 <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Share2 className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Viral Platform Amplification</h3>
 </div>
 <span className="text-xs font-bold text-indigo-500">{viralAmplification.amplificationScore.toFixed(1)}% Amp</span>
 </div>

 {viralAmplification.totalShares === 0 ? (
 <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
 <Share2 className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
 <p className="text-sm text-zinc-400 font-bold">No shares recorded yet</p>
 <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">Share your stories with fans to start capturing viral reach and platform spread statistics here.</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-4 mt-6">
 {Object.entries(viralAmplification.shares).map(([platform, count]) => (
 <div key={platform} className="p-4 bg-zinc-50/20 dark:bg-zinc-900/5 border border-zinc-100 dark:border-zinc-900 rounded-xl">
 <span className="text-xs font-bold text-zinc-400 block">{platform}</span>
 <span className="text-lg font-bold block mt-2">{count}</span>
 <span className="text-xs text-indigo-500 font-bold block mt-1 font-sans">shares logged</span>
 </div>
 ))}
 </div>
 )}
 </div>

 {viralAmplification.totalShares > 0 && (
 <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between mt-6">
 <span className="text-xs font-bold text-zinc-400">Cumulative shares</span>
 <span className="text-xs font-bold text-indigo-500">{viralAmplification.totalShares} total</span>
 </div>
 )}
 </div>

 {/* 2. Reading Session Focus Index */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow flex flex-col justify-between min-h-[300px]">
 <div>
 <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Clock className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Reading Focus Index</h3>
 </div>
 <span className="text-xs font-bold text-emerald-500">Active</span>
 </div>

 {focusIndex.totalLogsCount === 0 ? (
 <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
 <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
 <p className="text-sm text-zinc-400 font-bold">No session logs detected</p>
 <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed font-sans">Community reading duration and session focus stats will calculate and render here.</p>
 </div>
 ) : (
 <div className="space-y-6 mt-6">
 <div className="flex justify-between items-center">
 <div>
 <span className="text-xs font-bold text-zinc-400 font-sans">Session Intensity</span>
 <div className="text-3xl font-bold tracking-tight text-emerald-500 mt-1">{focusIndex.focusScore.toFixed(0)}%</div>
 </div>
 <div className="text-right">
 <span className="text-xs font-bold text-zinc-400 block font-sans">Focus Metric</span>
 <span className="text-xs text-zinc-500 font-medium block mt-1 font-sans">Chapters vs Minutes</span>
 </div>
 </div>

 <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 text-sm font-bold">
 <div className="flex justify-between">
 <span className="text-zinc-400 font-sans">Avg Chapters read</span>
 <span className="">{focusIndex.avgChaptersRead.toFixed(1)} chapters</span>
 </div>
 <div className="flex justify-between">
 <span className="text-zinc-400 font-sans">Avg Session Duration</span>
 <span className="">{focusIndex.avgMinutesPerSession.toFixed(1)} mins</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* 3. Reader Annotation Heatmap */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow flex flex-col justify-between min-h-[300px]">
 <div>
 <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Palette className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Reader Annotations Heatmap</h3>
 </div>
 <span className="text-xs font-bold text-indigo-500">{annotationsHeatmap.totalAnnotations} Total</span>
 </div>

 {annotationsHeatmap.totalAnnotations === 0 ? (
 <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
 <Palette className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
 <p className="text-sm text-zinc-400 font-bold">No annotations tracked</p>
 <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed font-sans">When readers highlight, bookmark or leave notes on your books, a custom palette breakdown will appear here.</p>
 </div>
 ) : (
 <div className="space-y-6 mt-6">
 <div className="flex gap-2 justify-between">
 {[
 { label:"Bookmarks", count: annotationsHeatmap.bookmarks, bg:"bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500" },
 { label:"Highlights", count: annotationsHeatmap.highlights, bg:"bg-amber-50 dark:bg-amber-950/20 text-amber-500" },
 { label:"Notes", count: annotationsHeatmap.notes, bg:"bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500" }
 ].map((item, idx) => (
 <div key={idx} className={`flex-1 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 text-center ${item.bg}`}>
 <span className="text-xs font-bold block font-sans">{item.label}</span>
 <span className="text-sm font-bold block mt-2">{item.count}</span>
 </div>
 ))}
 </div>

 <div className="space-y-3 pt-2">
 <div className="text-xs font-bold text-zinc-400 font-sans">Highlight Palette preferences:</div>
 <div className="flex items-center gap-4">
 {[
 { color:"bg-yellow-400", name:"Yellow", count: annotationsHeatmap.colors.yellow },
 { color:"bg-emerald-400", name:"Green", count: annotationsHeatmap.colors.green },
 { color:"bg-blue-400", name:"Blue", count: annotationsHeatmap.colors.blue },
 { color:"bg-pink-400", name:"Pink", count: annotationsHeatmap.colors.pink },
 ].map((c, i) => (
 <div key={i} className="flex items-center gap-1.5 text-xs font-bold">
 <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
 <span className="text-zinc-500">{c.count}</span>
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
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow space-y-6">
 <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Chapter Retention Cohort Drop-Off</h3>
 </div>
 <div className="flex items-center gap-4">
 <select
 value={selectedRetentionStory}
 onChange={(e) => setSelectedRetentionStory(e.target.value)}
 className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[200px]"
 >
 <option value="all">All Stories</option>
 {analytics.stories.map((s) => (
 <option key={s.id} value={s.id}>{s.title}</option>
 ))}
 </select>
 <span className="text-xs font-bold text-rose-500">Attrition Matrix</span>
 </div>
 </div>

 {(selectedRetentionStory === 'all' ? cohortRetention : analytics.retentionByStory[selectedRetentionStory] || []).length === 0 ? (
 <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
 <Layers className="w-8 h-8 text-zinc-300 dark:text-zinc-800" />
 <p className="text-sm text-zinc-400 font-bold">No chapter progression data loaded</p>
 <p className="text-xs text-zinc-400 max-w-md leading-relaxed font-sans">Cohort drop-off matrices measure readers' transition rate from Chapter 1 through subsequent chapters. Add multiple chapters to your stories and build reader traction to see progression cohort rates here.</p>
 </div>
 ) : (
 <div className="space-y-3">
 {(selectedRetentionStory === 'all' ? cohortRetention : analytics.retentionByStory[selectedRetentionStory] || []).map((ch, idx) => (
 <div key={idx} className="flex items-center gap-4">
 <span className="text-xs font-bold text-zinc-400 w-28 truncate shrink-0 font-sans">{ch.chapter}</span>
 <div className="flex-1 h-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden relative shadow-inner">
 <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${ch.rate}%` }}><div className="absolute inset-0 bg-white/10 w-full" /></div>
 </div>
 <span className="text-xs font-bold w-10 text-right text-zinc-900 dark:text-white shrink-0">{ch.rate}%</span>
 </div>
 ))}
 </div>
 )}
 </div>

 </div>

 </section>

 {/* ========================================== */}
 {/* Promotion Campaign Analytics */}
 {/* ========================================== */}
 {promotionAnalytics && promotionAnalytics.length > 0 && (
 <section className="mb-16 animate-fade-in">
 <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-900">
 <TrendingUp className="w-4 h-4 text-zinc-400" />
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold text-zinc-400">Promotion Campaign Analytics</h2>
 </div>

 {/* Summary Stats Grid — matches Global Stats pattern */}
 {(() => {
 const totalSpent = promotionAnalytics.reduce((s, p) => s + p.cost, 0);
 const totalPromoViews = promotionAnalytics.reduce((s, p) => s + p.promotionViews, 0);
 const totalPromoEngagements = promotionAnalytics.reduce((s, p) => s + p.totalEngagements, 0);
 const totalFollowersGained = promotionAnalytics.reduce((s, p) => s + p.followersGained, 0);
 const totalTipsEarned = promotionAnalytics.reduce((s, p) => s + p.tipsEarned, 0);
 const totalReadMin = promotionAnalytics.reduce((s, p) => s + p.totalReadingMinutes, 0);
 const avgCpv = totalPromoViews > 0 ? (totalSpent / totalPromoViews).toFixed(2) : '0.00';
 return (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden mb-8 shadow">
 {[
 { label: 'Total Ad Spend', value: `৳${totalSpent.toLocaleString()}` },
 { label: 'Promotion Views', value: totalPromoViews.toLocaleString() },
 { label: 'Total Engagements', value: totalPromoEngagements.toLocaleString() },
 { label: 'Avg Cost Per View', value: `৳${avgCpv}` },
 ].map((s, i) => (
 <div key={i} className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between min-h-[140px]">
 <span className="text-sm font-bold text-zinc-400">{s.label}</span>
 <div className="text-2xl font-bold tracking-tight">{s.value}</div>
 </div>
 ))}
 </div>
 );
 })()}

 {/* Individual Campaign Deep-Dive — matches Cohort Retention pattern */}
 <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl shadow space-y-6">
 <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-zinc-400" />
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 font-bold text-zinc-400">Campaign Deep-Dive</h3>
 </div>
 <div className="flex items-center gap-4">
 <select
 value={selectedPromotion}
 onChange={(e) => setSelectedPromotion(e.target.value)}
 className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[250px]"
 >
 {promotionAnalytics.map((promo) => (
 <option key={promo.id} value={promo.id}>
 {promo.storyTitle} ({new Date(promo.startDate).toLocaleDateString()})
 </option>
 ))}
 </select>
 <span className="text-xs font-bold text-indigo-500">{promotionAnalytics.length} Campaign{promotionAnalytics.length > 1 ? 's' : ''}</span>
 </div>
 </div>

 {promotionAnalytics.filter(p => p.id === selectedPromotion).map((promo) => {
 const isEnded = new Date(promo.endDate) < new Date() || promo.status === 'ENDED';
 const isActive = promo.status === 'ACTIVE' && !isEnded;
 const isPending = promo.status === 'PENDING';
 const displayStatus = isEnded ? 'ENDED' : promo.status;
 const totalReactionCount = promo.positiveReactions + promo.negativeReactions;
 const negativePercent = totalReactionCount > 0 ? parseFloat((100 - promo.sentimentScore).toFixed(1)) : 0;

 return (
 <div key={promo.id} className="space-y-6">

 {/* Campaign Identity Bar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
 promo.tier === 'FEATURED' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
 promo.tier === 'TRENDING' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500'
 }`}>{promo.tier}</span>
 <h4 className="text-sm font-bold truncate text-zinc-900 dark:text-white max-w-xs" title={promo.storyTitle}>{promo.storyTitle}</h4>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold text-zinc-400">
 {new Date(promo.startDate).toLocaleDateString()} — {new Date(promo.endDate).toLocaleDateString()} ({promo.campaignDays}d)
 </span>
 <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
 isActive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
 isPending ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
 isEnded ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' :
 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
 }`}>{displayStatus}</span>
 <span className={`text-xs font-bold ${
 promo.roiRating === 'Excellent' ? 'text-emerald-500' :
 promo.roiRating === 'Good' ? 'text-indigo-500' :
 promo.roiRating === 'Average' ? 'text-amber-500' : 'text-rose-500'
 }`}>ROI: {promo.roiRating}</span>
 </div>
 </div>

 {/* Primary Metrics — 4-column grid matching cost cards pattern */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="block text-xs font-bold text-zinc-400 mb-1">Campaign Cost</span>
 <span className="text-xl font-bold">৳{promo.cost.toLocaleString()}</span>
 </div>
 <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="block text-xs font-bold text-zinc-400 mb-1">Views Generated</span>
 <span className="text-xl font-bold">{promo.promotionViews.toLocaleString()}</span>
 </div>
 <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="block text-xs font-bold text-zinc-400 mb-1">Cost Per View</span>
 <span className={`text-xl font-bold ${parseFloat(promo.costPerView) === 0 ? 'text-zinc-400' : parseFloat(promo.costPerView) <= 5 ? 'text-emerald-500' : parseFloat(promo.costPerView) <= 15 ? 'text-amber-500' : 'text-rose-500'}`}>
 ৳{promo.costPerView}
 </span>
 </div>
 <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
 <span className="block text-xs font-bold text-zinc-400 mb-1">Cost Per Engagement</span>
 <span className={`text-xl font-bold ${parseFloat(promo.costPerEngagement) === 0 ? 'text-zinc-400' : parseFloat(promo.costPerEngagement) <= 20 ? 'text-emerald-500' : parseFloat(promo.costPerEngagement) <= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
 ৳{promo.costPerEngagement}
 </span>
 </div>
 </div>

 {/* Engagement & Conversion Metrics — 2-column card layout */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

 {/* Left: Engagement Breakdown */}
 <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl space-y-4">
 <span className="text-xs font-bold text-zinc-400 block">Engagement Breakdown</span>
 <div className="space-y-3">
 {[
 { label: 'Daily Velocity', value: `${promo.dailyEngagementVelocity}`, unit: 'engagements/day', color: promo.dailyEngagementVelocity > 5 ? 'text-emerald-500' : promo.dailyEngagementVelocity > 0 ? 'text-amber-500' : 'text-zinc-400' },
 { label: 'Interaction Rate', value: `${promo.interactionRate}%`, unit: 'of viewers engaged', color: promo.interactionRate > 5 ? 'text-emerald-500' : promo.interactionRate > 0 ? 'text-indigo-500' : 'text-zinc-400' },
 { label: 'Reactions', value: `${promo.reactionsGenerated}`, unit: 'during campaign', color: promo.reactionsGenerated > 0 ? 'text-indigo-500' : 'text-zinc-400' },
 { label: 'Comments', value: `${promo.commentsGenerated}`, unit: 'during campaign', color: promo.commentsGenerated > 0 ? 'text-indigo-500' : 'text-zinc-400' },
 { label: 'Inline Comments', value: `${promo.inlineCommentsCount}`, unit: 'deep engagement', color: promo.inlineCommentsCount > 0 ? 'text-emerald-500' : 'text-zinc-400' },
 ].map((item, idx) => (
 <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900/10 last:border-0">
 <div>
 <span className="text-xs font-bold text-zinc-500 block">{item.label}</span>
 <span className="text-[7px] text-zinc-400 font-medium">{item.unit}</span>
 </div>
 <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Right: Growth & Retention */}
 <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl space-y-4">
 <span className="text-xs font-bold text-zinc-400 block">Growth & Retention</span>
 <div className="space-y-3">
 {[
 { label: 'Followers Gained', value: `+${promo.followersGained}`, unit: 'during campaign period', color: promo.followersGained > 0 ? 'text-emerald-500' : 'text-zinc-400' },
 { label: 'Tips Earned', value: `৳${promo.tipsEarned}`, unit: `${promo.tipCount} tip${promo.tipCount !== 1 ? 's' : ''}`, color: promo.tipsEarned > 0 ? 'text-amber-500' : 'text-zinc-400' },
 { label: 'Library Saves', value: `${promo.librarySaves}`, unit: 'readers saved to shelf', color: promo.librarySaves > 0 ? 'text-indigo-500' : 'text-zinc-400' },
 { label: 'Reach Expansion', value: `${promo.promoShares}`, unit: 'shares logged', color: promo.promoShares > 0 ? 'text-indigo-500' : 'text-zinc-400' },
 { label: 'Reading Time', value: `${promo.totalReadingMinutes} min`, unit: `৳${promo.costPerMinute}/min attention cost`, color: promo.totalReadingMinutes > 0 ? 'text-emerald-500' : 'text-zinc-400' },
 ].map((item, idx) => (
 <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900/10 last:border-0">
 <div>
 <span className="text-xs font-bold text-zinc-500 block">{item.label}</span>
 <span className="text-[7px] text-zinc-400 font-medium">{item.unit}</span>
 </div>
 <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* Sentiment Conversion Bar */}
 <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-xl space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-zinc-400">Campaign Sentiment</span>
 {totalReactionCount > 0 ? (
 <span className="text-xs font-bold">
 <span className="text-emerald-500">{promo.sentimentScore}% Positive</span>
 <span className="text-zinc-300 dark:text-zinc-700 mx-1.5">·</span>
 <span className="text-rose-400">{negativePercent}% Negative</span>
 </span>
 ) : (
 <span className="text-xs font-bold text-zinc-400 italic">No reactions recorded during campaign</span>
 )}
 </div>
 {totalReactionCount > 0 && (
 <>
 <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden flex shadow-inner">
 <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-1000 ease-out" style={{ width: `${promo.sentimentScore}%` }} />
 <div className="h-full bg-rose-400 rounded-r-full transition-all duration-1000 ease-out" style={{ width: `${negativePercent}%` }} />
 </div>
 <div className="flex justify-between text-[7px] font-bold text-zinc-400">
 <span>👍 {promo.positiveReactions} positive</span>
 <span>😢 {promo.negativeReactions} negative</span>
 </div>
 </>
 )}
 </div>

 </div>
 );
 })}
 </div>
 </section>
 )}

 
 <div className="my-16 border-b border-zinc-200 dark:border-zinc-800" />

 {/* Top Performers List */}
 {topStories.length > 0 && (
 <section className="mb-16">
 <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-900">
 <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold text-zinc-400">High-Velocity Manuscripts</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
 {topStories.map((story, idx) => {
 const totalEngagement = story.reactions + story.comments;
 const er = story.views > 0 ? ((totalEngagement / story.views) * 100).toFixed(1) : '0.0';
 
 return (
 <div key={story.id} className="p-6 bg-zinc-50/20 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow hover:border-indigo-500/20 transition-all flex flex-col justify-between gap-4">
 <div>
 <span className="text-xs text-zinc-300 dark:text-zinc-700">PERFORMER {(idx + 1).toString().padStart(2, '0')}</span>
 <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1 line-clamp-1 truncate" title={story.title}>
 {story.title}
 </h3>
 </div>
 <div>
 <div className="text-xl font-bold">{story.views.toLocaleString()}</div>
 <div className="text-xs font-bold text-zinc-400">Views logged</div>
 </div>
 <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-xs font-bold">
 <span className="text-zinc-400">Engagement</span>
 <span className="text-indigo-500">{er}% ER</span>
 </div>
 </div>
 );
 })}
 </div>
 </section>
 )}

 
 <div className="my-16 border-b border-zinc-200 dark:border-zinc-800" />

 {/* 3. Fully Advanced Sortable Manuscripts Logs Section */}
 <section className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 shadow">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
 <div className="flex items-center gap-2">
 <BookOpen className="w-4 h-4 text-zinc-400" />
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-bold text-zinc-400">Manuscripts Registry logs</h2>
 </div>
 
 {/* Real-time Query Options */}
 <div className="flex flex-wrap items-center gap-3">
 {/* Status Segment controls */}
 <div className="flex bg-zinc-50 dark:bg-zinc-900 p-1 border border-zinc-100 dark:border-zinc-800 rounded-xl">
 {(['all', 'published', 'draft'] as const).map(option => (
 <button
 key={option}
 onClick={() => setStatusFilter(option)}
 className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
 statusFilter === option
 ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow'
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
 className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-indigo-500 transition-all w-48 sm:w-64 shadow"
 />
 </div>
 </div>
 </div>

 {processedStories.length === 0 ? (
 <div className="text-center py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/5">
 <p className="text-sm font-bold text-zinc-300">No matching manuscripts located in registry.</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-zinc-100 dark:border-zinc-900 select-none">
 {/* Header Columns */}
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('title')}>
 <div className="flex items-center gap-1">
 Manuscript
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('views')}>
 <div className="flex items-center justify-end gap-1">
 Views
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('reactions')}>
 <div className="flex items-center justify-end gap-1">
 Reactions
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('comments')}>
 <div className="flex items-center justify-end gap-1">
 Comments
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('engagementRate')}>
 <div className="flex items-center justify-end gap-1">
 Eng. Rate
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-right cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('tips')}>
 <div className="flex items-center justify-end gap-1">
 Sponsorship Yield
 <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40" />
 </div>
 </th>
 <th className="py-4 px-3 text-sm font-bold text-zinc-400 text-center">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/60 text-sm font-bold">
 {processedStories.map(story => {
 const er = story.views > 0 ? (((story.reactions + story.comments) / story.views) * 100).toFixed(1) : '0.0';
 
 return (
 <tr key={story.id} className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-all">
 <td className="py-4 px-3 font-sans text-xs">
 <Link href={`/write/story/${story.id}/edit`} className="text-zinc-900 dark:text-white hover:underline truncate block max-w-[200px] sm:max-w-xs font-bold tracking-wide">
 {story.title}
 </Link>
 </td>
 <td className="py-4 px-3 text-right text-zinc-500">{story.views.toLocaleString()}</td>
 <td className="py-4 px-3 text-right text-rose-500">{story.reactions.toLocaleString()}</td>
 <td className="py-4 px-3 text-right text-blue-500">{story.comments.toLocaleString()}</td>
 <td className="py-4 px-3 text-right text-indigo-500">{er}%</td>
 <td className="py-4 px-3 text-right text-emerald-500">{story.tips > 0 ? `৳${story.tips.toLocaleString()}` : '—'}</td>
 <td className="py-4 px-3 text-center">
 <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center justify-center gap-1.5 mx-auto w-fit ${
 story.published ?"text-emerald-500 bg-emerald-500/5 border border-emerald-500/10" :"text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
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
