'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Eye, Heart, MessageSquare, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Loader } from 'lucide-react';

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
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/author/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const { stats, topStories, stories } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Author Dashboard</h1>
          <p className="text-lg text-gray-600">Track your stories, views, and earnings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookOpen}
            label="Total Stories"
            value={stats.totalStories}
            color="blue"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={stats.totalViews}
            color="green"
          />
          <StatCard
            icon={Heart}
            label="Total Reactions"
            value={stats.totalReactions}
            color="red"
          />
          <StatCard
            icon={MessageSquare}
            label="Total Comments"
            value={stats.totalComments}
            color="purple"
          />
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Subscribers</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.subscribers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Followers</h3>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.followers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Tips</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${stats.totalTipsAmount}</p>
            <p className="text-xs text-gray-600 mt-1">{stats.totalTips} tips</p>
          </div>
        </div>

        {/* Top Performing Stories */}
        {topStories.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Top Performing Stories</h2>
            <div className="space-y-4">
              {topStories.map((story, idx) => (
                <div key={story.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                      <Link
                        href={`/stories/${story.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {story.title}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{story.views}</p>
                      <p className="text-xs">views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-500">{story.reactions}</p>
                      <p className="text-xs">reactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-500">{story.comments}</p>
                      <p className="text-xs">comments</p>
                    </div>
                    {story.tips > 0 && (
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-500">${story.tips}</p>
                        <p className="text-xs">tips</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Stories Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Stories</h2>
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No stories yet</p>
              <Link
                href="/write/new"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Start writing →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Story</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Views</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Reactions</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Comments</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Chapters</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Tips</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map(story => (
                    <tr key={story.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/stories/${story.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium truncate"
                        >
                          {story.title}
                        </Link>
                      </td>
                      <td className="text-right py-3 px-4">{story.views}</td>
                      <td className="text-right py-3 px-4">{story.reactions}</td>
                      <td className="text-right py-3 px-4">{story.comments}</td>
                      <td className="text-right py-3 px-4">{story.chapters}</td>
                      <td className="text-right py-3 px-4">{story.tips > 0 ? `$${story.tips}` : '—'}</td>
                      <td className="text-center py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            story.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {story.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <div className={`${colorClasses[color].bg} p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${colorClasses[color].text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
