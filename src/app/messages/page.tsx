'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Conversation {
  partnerId: string;
  partner: { id: string; username: string; displayName: string; avatar?: string };
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const filtered = conversations.filter((conv) =>
    conv.partner.displayName.toLowerCase().includes(search.toLowerCase()) ||
    conv.partner.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white m-4 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              {conversations.length === 0
                ? 'No conversations yet. Start messaging other readers!'
                : 'No conversations match your search'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map((conv) => (
              <Link
                key={conv.partnerId}
                href={`/messages/${conv.partnerId}`}
                className={`block p-4 hover:bg-gray-50 transition ${
                  conv.unread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-${conv.unread ? 'bold' : 'semibold'} text-gray-900`}>
                        {conv.partner.displayName}
                      </h3>
                      {conv.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {new Date(conv.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
