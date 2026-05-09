'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Award, Heart, Loader2, ArrowLeft, Clock, ShieldCheck, Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  id: string;
  type: 'story_published' | 'achievement_earned' | 'tip_received';
  timestamp: string;
  actor: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  content: any;
  description: string;
}

export default function ActivityFeedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activity-feed');
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        }
      } finally { setLoading(false); }
    };
    fetchFeed();
  }, [user, authLoading, router]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'story_published': return <BookOpen className="w-3 h-3 text-zinc-300" />;
      case 'achievement_earned': return <Award className="w-3 h-3 text-zinc-300" />;
      case 'tip_received': return <Heart className="w-3 h-3 text-zinc-300" />;
      default: return <BookOpen className="w-3 h-3 text-zinc-300" />;
    }
  };

  const getActivityLink = (activity: Activity) => {
    return activity.type === 'story_published' ? `/stories/${activity.content.id}` : `/profile/${activity.actor.username}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Recent Activity.</h1>
              <p className="text-xs text-zinc-500 font-medium">See what the readers and writers you follow are doing.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            Live Updates
          </div>
        </header>

        {/* Activity Logs */}
        {activities.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-8">No activity found yet.</p>
            <Link href="/universes" className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
              Find People to Follow
            </Link>
          </div>
        ) : (
          <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {activities.map(activity => (
                <Link
                  key={activity.id}
                  href={getActivityLink(activity)}
                  className="flex gap-4 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group"
                >
                  {/* Compact Avatar */}
                  <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 overflow-hidden border border-zinc-100 dark:border-zinc-800 shrink-0">
                    {activity.actor.avatarUrl ? (
                      <img src={activity.actor.avatarUrl} alt="" className="w-full h-full object-cover transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-zinc-300">
                        {activity.actor.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] text-zinc-900 dark:text-zinc-100">
                          <span className="font-bold uppercase">{activity.actor.displayName || activity.actor.username}</span>
                          <span className="text-zinc-500 ml-2 italic lowercase">{activity.description}</span>
                        </p>

                        {activity.type === 'story_published' && (
                          <div className="flex items-center gap-2 mt-2">
                            <BookOpen className="w-3 h-3 text-zinc-300" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                              {activity.content.title}
                            </p>
                          </div>
                        )}

                        {activity.type === 'achievement_earned' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-3 h-3 text-zinc-300" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                              {activity.content.achievementName}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 transition-opacity">{getIcon(activity.type)}</div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-50 dark:divide-zinc-900">
                      <Clock className="w-2.5 h-2.5 text-zinc-200" />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-mono">
                        {new Date(activity.timestamp).toLocaleDateString()} • {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Simple Footer */}
        <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3 text-zinc-300 opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Read, Write, Connect — V4.1.0</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}M`;
  if (hours < 24) return `${hours}H`;
  if (days < 7) return `${days}D`;
  return date.toLocaleDateString();
}
