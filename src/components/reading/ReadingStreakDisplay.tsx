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
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reading Streak</h3>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-orange-600">{stats.currentStreak}</span>
          <span className="text-sm text-gray-600">day{stats.currentStreak !== 1 ? 's' : ''}</span>
        </div>
        {stats.maxStreak > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Your personal best: {stats.maxStreak} days
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Days Read</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.daysRead}</p>
          <p className="text-xs text-gray-500 mt-1">Last 90 days</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Pages</span>
            <BookOpen className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.totalPages}</p>
          <p className="text-xs text-gray-500 mt-1">Average: {stats.avgPagesPerSession}/session</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reading Time</span>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{Math.round(stats.totalMinutes / 60)}h</p>
          <p className="text-xs text-gray-500 mt-1">{stats.totalMinutes} minutes total</p>
        </div>
      </div>
    </div>
  );
}
