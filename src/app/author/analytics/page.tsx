'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Eye, Heart, MessageSquare, BookOpen, Users, TrendingUp, BarChart3, ArrowLeft, Loader2, Globe, GlobeLock } from 'lucide-react';

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
}

export default function AuthorAnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

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

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (!analytics) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
      <div className="text-center space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">
          {upgradeUrl ? 'Creator plan required for analytics.' : 'Analytics Offline'}
        </p>
        {upgradeUrl && (
          <Link href={upgradeUrl} className="inline-flex px-8 py-3 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest">
            Upgrade to Creator
          </Link>
        )}
      </div>
    </div>
  );

  const { stats, topStories, stories } = analytics;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Studio
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Performance Registry.</h1>
              <p className="text-xs text-zinc-500 font-medium">Author intelligence and manuscript trajectory analytics.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <BarChart3 className="w-3.5 h-3.5" />
            Intelligence Protocol
          </div>
        </header>

        {/* Global Stats Registry */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-12">
          {[
            { icon: BookOpen, label: "Manuscripts", value: stats.totalStories },
            { icon: Eye, label: "Transmissions", value: stats.totalViews },
            { icon: Heart, label: "Reactions", value: stats.totalReactions },
            { icon: MessageSquare, label: "Engagement", value: stats.totalComments },
          ].map((s, i) => (
            <div key={i} className="p-8 bg-white dark:bg-zinc-950">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                <s.icon className="w-3.5 h-3.5 text-zinc-200" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{s.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Subscriber & Fiscal Registry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Subscribers", val: stats.subscribers, icon: Users },
            { label: "Followers", val: stats.followers, icon: Users },
            { label: "Fiscal Yield", val: `$${stats.totalTipsAmount}`, icon: TrendingUp, sub: `${stats.totalTips} transactions` },
          ].map((s, i) => (
            <div key={i} className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/20 dark:bg-zinc-900/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                <s.icon className="w-3 h-3 text-zinc-300" />
              </div>
              <div className="text-xl font-bold tracking-tight">{s.val}</div>
              {s.sub && <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 mt-1 font-mono">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Top Performers List */}
        {topStories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">High-Velocity Manuscripts</h2>
            </div>
            <div className="space-y-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              {topStories.map((story, idx) => (
                <div key={story.id} className="p-6 bg-white dark:bg-zinc-950 flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-zinc-300">{(idx + 1).toString().padStart(2, '0')}</span>
                    <Link href={`/stories/${story.id}`} className="text-sm font-bold text-zinc-900 dark:text-white hover:underline">
                      {story.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-8">
                    {[
                      { val: story.views, label: "Transmissions" },
                      { val: story.reactions, label: "Reactions" },
                      { val: story.comments, label: "Engagement" }
                    ].map((stat, j) => (
                      <div key={j} className="text-right">
                        <div className="text-sm font-bold">{stat.val.toLocaleString()}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full Archival Log */}
        <section>
          <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-50 dark:border-zinc-900">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Manuscript Registry</h2>
          </div>
          {stories.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No records found in registry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Manuscript</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Views</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Reactions</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Engagement</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Yield</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {stories.map(story => (
                    <tr key={story.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-2">
                        <Link href={`/stories/${story.id}`} className="text-xs font-bold text-zinc-900 dark:text-white hover:underline truncate block max-w-xs">
                          {story.title}
                        </Link>
                      </td>
                      <td className="py-4 px-2 text-right text-[10px] font-mono font-bold text-zinc-400">{story.views}</td>
                      <td className="py-4 px-2 text-right text-[10px] font-mono font-bold text-rose-500">{story.reactions}</td>
                      <td className="py-4 px-2 text-right text-[10px] font-mono font-bold text-blue-500">{story.comments}</td>
                      <td className="py-4 px-2 text-right text-[10px] font-mono font-bold text-emerald-500">{story.tips > 0 ? `$${story.tips}` : '—'}</td>
                      <td className="py-4 px-2 text-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center justify-center gap-1.5 mx-auto w-fit ${
                          story.published ? "text-emerald-500 bg-emerald-50/5 border border-emerald-500/10" : "text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                        }`}>
                          {story.published ? <Globe className="w-2.5 h-2.5" /> : <GlobeLock className="w-2.5 h-2.5" />}
                          {story.published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
