'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Award, Heart, Loader } from 'lucide-react';

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
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activity-feed');
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        }
      } catch (error) {
        console.error('Error fetching activity feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, router]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'story_published':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'achievement_earned':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'tip_received':
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityLink = (activity: Activity) => {
    switch (activity.type) {
      case 'story_published':
        return `/stories/${activity.content.id}`;
      default:
        return `/profile/${activity.actor.username}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Activity Feed</h1>
          <p className="text-lg text-gray-600">
            Stay updated with your followed readers and authors
          </p>
        </div>

        {/* Activity Feed */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No activity yet. Follow authors and readers to see their updates here.
            </p>
            <Link
              href="/search"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Explore and follow →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <Link
                key={activity.id}
                href={getActivityLink(activity)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  {activity.actor.avatarUrl && (
                    <img
                      src={activity.actor.avatarUrl}
                      alt={activity.actor.username}
                      className="w-12 h-12 rounded-full"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">
                            {activity.actor.displayName || activity.actor.username}
                          </span>{' '}
                          <span className="text-gray-600">{activity.description}</span>
                        </p>

                        {/* Activity-specific content */}
                        {activity.type === 'story_published' && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            {activity.content.title}
                          </p>
                        )}

                        {activity.type === 'achievement_earned' && (
                          <p className="text-sm text-yellow-600 font-medium mt-1">
                            🏆 {activity.content.achievementName}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(activity.timestamp).toLocaleDateString()} •{' '}
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
