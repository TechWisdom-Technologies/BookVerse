'use client';

import { useEffect, useState } from 'react';
import { Flame, BookOpen, Clock } from 'lucide-react';

interface ReadingStats {
  currentStreak: number;
  maxStreak: number;
  totalPages: number;
  totalMinutes: number;
  avgPagesPerSession: number;
  daysRead: number;
}

interface ReadingStreakDisplayProps {
  userId: string;
}

export function ReadingStreakDisplay({ userId }: ReadingStreakDisplayProps) {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reading-logs/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching reading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading reading stats...</div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-500">No reading data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Reading Streak</h3>
          <Flame className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.currentStreak}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">day{stats.currentStreak !== 1 ? 's' : ''}</span>
        </div>
        {stats.maxStreak > 0 && (
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-4">
            Personal Best: {stats.maxStreak} Days
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Days Read</span>
            <BookOpen className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.daysRead}</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-2">Last 90 Days</p>
        </div>

        <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Total Pages</span>
            <BookOpen className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalPages}</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-2">Avg: {stats.avgPagesPerSession}/session</p>
        </div>

        <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Reading Time</span>
            <Clock className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{Math.round(stats.totalMinutes / 60)}h</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-2">{stats.totalMinutes} minutes total</p>
        </div>
      </div>
    </div>
  );
}
