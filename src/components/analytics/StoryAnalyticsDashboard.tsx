'use client';

import { useState, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';

interface ChapterDropoff {
  chapterNumber: number;
  estimatedReads: number;
}

interface StoryAnalytics {
  totalReaders: number;
  avgReadTime: number;
  completionRate: number;
  chapterDropoff: ChapterDropoff[];
  totalChapters: number;
}

export function StoryAnalyticsDashboard({ storyId }: { storyId: string }) {
  const [analytics, setAnalytics] = useState<StoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}/analytics-detailed`);
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [storyId]);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Readers</p>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.totalReaders}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Avg Read Time</p>
          <p className="text-2xl font-bold text-green-600">
            {analytics.avgReadTime}s
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.completionRate.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border">
        <h3 className="font-bold mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
          Chapter Drop-off Analysis
        </h3>
        <div className="space-y-2">
          {analytics.chapterDropoff.map((item) => (
            <div key={item.chapterNumber} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Chapter {item.chapterNumber}</span>
                <span className="font-medium">{item.estimatedReads} reads</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(item.estimatedReads / analytics.totalReaders) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
