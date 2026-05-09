'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Users, MessageSquare, Settings, LogOut, UserPlus, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Club {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  owner: {
    id: string;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  };
  members: Array<{
    userId: string;
    role: string;
    user: {
      id: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
    };
  }>;
  discussions: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
    };
  }>;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export default function ClubDetailPage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/clubs/${clubId}`);
        if (res.ok) {
          const data = await res.json();
          setClub(data);
          setDiscussions(data.discussions || []);
          
          // Check if current user is a member
          if (user) {
            const isMemberCheck = data.members.some((m: any) => m.userId === user.id);
            setIsMember(isMemberCheck);
          }
        }
      } catch (error) {
        console.error('Error fetching club:', error);
        toast.error('Failed to load club');
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClub();
    }
  }, [clubId, user]);

  const handleJoinClub = async () => {
    if (!user) {
      toast.error('Please log in to join clubs');
      return;
    }

    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'POST',
      });

      if (res.ok) {
        setIsMember(true);
        toast.success('Joined club successfully! 🎉');
        // Refresh club data
        const clubRes = await fetch(`/api/clubs/${clubId}`);
        if (clubRes.ok) {
          const data = await clubRes.json();
          setClub(data);
        }
      } else {
        toast.error('Failed to join club');
      }
    } catch (error) {
      console.error('Error joining club:', error);
      toast.error('An error occurred');
    }
  };

  const handleLeaveClub = async () => {
    if (!confirm('Are you sure you want to leave this club?')) return;

    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsMember(false);
        toast.success('Left club');
        // Refresh club data
        const clubRes = await fetch(`/api/clubs/${clubId}`);
        if (clubRes.ok) {
          const data = await clubRes.json();
          setClub(data);
        }
      } else {
        toast.error('Failed to leave club');
      }
    } catch (error) {
      console.error('Error leaving club:', error);
      toast.error('An error occurred');
    }
  };

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      setIsPosting(true);
      const res = await fetch(`/api/clubs/${clubId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDiscussionTitle,
          content: newDiscussionContent,
        }),
      });

      if (res.ok) {
        const discussion = await res.json();
        setDiscussions([discussion, ...discussions]);
        setNewDiscussionTitle('');
        setNewDiscussionContent('');
        setShowNewDiscussion(false);
        toast.success('Discussion posted! 🎉');
      } else {
        toast.error('Failed to post discussion');
      }
    } catch (error) {
      console.error('Error posting discussion:', error);
      toast.error('An error occurred');
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Club not found</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === club.owner.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
              {club.genre && (
                <p className="text-blue-100 mb-2">{club.genre}</p>
              )}
              {club.description && (
                <p className="text-blue-100 max-w-2xl">{club.description}</p>
              )}
            </div>

            <div className="flex gap-3">
              {user && !isOwner && (
                <>
                  {isMember ? (
                    <button
                      onClick={handleLeaveClub}
                      className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinClub}
                      className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      Join Club
                    </button>
                  )}
                </>
              )}

              {isOwner && (
                <button className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition">
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members ({club.members.length})
              </h2>

              <div className="space-y-3">
                {club.members.slice(0, 10).map(member => (
                  <div key={member.userId} className="flex items-center gap-2">
                    {member.user.avatarUrl && (
                      <img
                        src={member.user.avatarUrl}
                        alt={member.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.user.displayName || member.user.username}
                      </p>
                      {member.role !== 'MEMBER' && (
                        <p className="text-xs text-blue-600">{member.role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {club.members.length > 10 && (
                <p className="text-xs text-gray-500 mt-4">
                  +{club.members.length - 10} more members
                </p>
              )}
            </div>
          </div>

          {/* Main Content - Discussions */}
          <div className="lg:col-span-3">
            {/* New Discussion Form */}
            {isMember && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {!showNewDiscussion ? (
                  <button
                    onClick={() => setShowNewDiscussion(true)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Start a discussion...
                  </button>
                ) : (
                  <form onSubmit={handlePostDiscussion} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Discussion title"
                      value={newDiscussionTitle}
                      onChange={e => setNewDiscussionTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <textarea
                      placeholder="What would you like to discuss?"
                      value={newDiscussionContent}
                      onChange={e => setNewDiscussionContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isPosting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        {isPosting ? 'Posting...' : 'Post Discussion'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewDiscussion(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
              {discussions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No discussions yet</p>
                  {isMember && (
                    <p className="text-sm text-gray-500 mt-2">Be the first to start one!</p>
                  )}
                </div>
              ) : (
                discussions.map(discussion => (
                  <div key={discussion.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start gap-4 mb-3">
                      {discussion.author.avatarUrl && (
                        <img
                          src={discussion.author.avatarUrl}
                          alt={discussion.author.username}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by{' '}
                          <span className="font-medium">
                            {discussion.author.displayName || discussion.author.username}
                          </span>{' '}
                          • {new Date(discussion.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{discussion.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
