'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Users, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Subscriber {
  id: string;
  subscriber: {
    id: string;
    username: string;
    displayName?: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export default function NewsletterManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/author/newsletter');
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers);
          setFilteredSubscribers(data.subscribers);
        } else {
          toast.error('Failed to load subscribers');
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [user, router]);

  useEffect(() => {
    const filtered = subscribers.filter(
      sub =>
        sub.subscriber.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subscriber.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
          <p className="text-lg text-gray-600">
            Connect with your readers and build your community
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Your Subscribers
          </h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subscribers Table */}
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {subscribers.length === 0
                  ? 'No subscribers yet. Share your newsletter with readers!'
                  : 'No results found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Subscriber</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Username</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(subscriber => (
                    <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {subscriber.subscriber.avatarUrl && (
                            <img
                              src={subscriber.subscriber.avatarUrl}
                              alt={subscriber.subscriber.username}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {subscriber.subscriber.displayName || subscriber.subscriber.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{subscriber.subscriber.email}</td>
                      <td className="py-4 px-4 text-gray-600">@{subscriber.subscriber.username}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Newsletter Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Tips for Growing Your Newsletter</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-3">✨</span>
              <span>Add a "Subscribe to my newsletter" button on your profile</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">📬</span>
              <span>Announce new chapters or stories to your subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🎁</span>
              <span>Offer exclusive content for newsletter subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">💬</span>
              <span>Engage with subscribers and ask for feedback</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">📊</span>
              <span>Share your writing journey and milestones</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
