"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  UserPlus, 
  Loader2, 
  Link2, 
  Crown, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Club {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  joinCode?: string;
  maxMembers: number;
  owner: {
    id: string;
    username: string;
    displayName?: string;
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

export default function ClubDetailPage() {
  const { clubId } = useParams() as { clubId: string };
  const { dbUser } = useAuth();
  const router = useRouter();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showJoinCodeInput, setShowJoinCodeInput] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const [clubRes, discussionsRes] = await Promise.all([
          fetch(`/api/clubs/${clubId}`),
          fetch(`/api/clubs/${clubId}/discussions`),
        ]);
        if (clubRes.ok) {
          const clubData = await clubRes.json();
          const discussionsData = discussionsRes.ok ? await discussionsRes.json() : [];
          setClub({ ...clubData, discussions: discussionsData });
          if (dbUser) {
            const isMemberCheck = clubData.members.some((m: any) => m.userId === dbUser.id);
            setIsMember(isMemberCheck);
          }
        }
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchClub();
  }, [clubId, dbUser]);

  const handleJoinClub = async () => {
    if (!dbUser) return toast.error('Login required');
    if (club?.isPrivate && !showJoinCodeInput) return setShowJoinCodeInput(true);

    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode: joinCodeInput }),
      });

      if (res.ok) {
        setIsMember(true);
        setShowJoinCodeInput(false);
        toast.success('Welcome to the club!');
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Join failed');
      }
    } catch (error) {
      toast.error('Connection error');
    }
  };

  const handleLeaveClub = async () => {
    if (!confirm('Leave this club?')) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, { method: 'DELETE' });
      if (res.ok) {
        setIsMember(false);
        toast.success('Left club');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to leave');
    }
  };

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) return;
    try {
      setIsPosting(true);
      const res = await fetch(`/api/clubs/${clubId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newDiscussionTitle, 
          content: newDiscussionContent, 
          parentId: replyingTo 
        }),
      });
      if (res.ok) {
        toast.success('Message posted!');
        setNewDiscussionTitle('');
        setNewDiscussionContent('');
        setShowNewDiscussion(false);
        setReplyingTo(null);
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to post message');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (!club) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-500">Club not found</p>
    </div>
  );

  const isOwner = dbUser?.id === club.owner.id;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="space-y-4">
            <Link href="/clubs" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              All Clubs
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold tracking-tight uppercase">{club.name}</h1>
                {club.isPrivate && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">{club.description || 'A group for book lovers.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwner ? (
              <Link href={`/clubs/${clubId}/settings`} className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                Club Settings
              </Link>
            ) : dbUser && (
              isMember ? (
                <button onClick={handleLeaveClub} className="px-5 py-2 border border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded hover:text-rose-500 transition-all">
                  Leave Club
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {showJoinCodeInput && (
                    <input 
                      type="text" 
                      placeholder="CODE" 
                      value={joinCodeInput}
                      onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                      className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold text-center outline-none w-24 font-mono"
                    />
                  )}
                  <button onClick={handleJoinClub} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded">
                    {club.isPrivate ? (showJoinCodeInput ? 'Join Now' : 'Enter Private Code') : 'Join This Club'}
                  </button>
                </div>
              )
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
          {/* Discussions Feed */}
          <section className="space-y-12">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-50 dark:border-zinc-900">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Discussion ({club.discussions?.length || 0})</h2>
              {isMember && !showNewDiscussion && (
                <button onClick={() => { setShowNewDiscussion(true); setNewDiscussionTitle(''); setNewDiscussionContent(''); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                  <Plus className="w-3.5 h-3.5" /> New Message
                </button>
              )}
            </div>

            {/* New Discussion Form */}
            {isMember && showNewDiscussion && (
              <form id="discussion-form" onSubmit={handlePostDiscussion} className="p-8 border border-zinc-100 dark:border-zinc-800 rounded space-y-6 bg-zinc-50/10">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Subject</label>
                  <input
                    type="text"
                    value={newDiscussionTitle}
                    onChange={e => setNewDiscussionTitle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold outline-none rounded focus:border-zinc-900 dark:focus:border-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Message</label>
                  <textarea
                    value={newDiscussionContent}
                    onChange={e => setNewDiscussionContent(e.target.value)}
                    rows={6}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 px-4 py-2.5 text-xs outline-none resize-none rounded focus:border-zinc-900 dark:focus:border-white leading-relaxed"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={isPosting} className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                    {isPosting ? 'Posting...' : 'Post Message'}
                  </button>
                  <button type="button" onClick={() => { setShowNewDiscussion(false); }} className="px-6 py-2.5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Messages List */}
            <div className="space-y-6">
              {club.discussions?.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No messages yet. Be the first to post!</p>
                </div>
              ) : (
                club.discussions?.slice(0, visibleCount).map(discussion => {
                  const isExpanded = expandedMessages.has(discussion.id);
                  const isLong = discussion.content.length > 300;

                  return (
                    <article key={discussion.id} className="p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                          {discussion.author.avatarUrl ? (
                            <img src={discussion.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            discussion.author.username[0].toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-[11px] font-bold text-zinc-900 dark:text-white block mb-0.5 uppercase">
                            {discussion.author.displayName || discussion.author.username}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                            {new Date(discussion.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            {' · '}
                            {new Date(discussion.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold mb-4 uppercase tracking-tight">
                        {discussion.title}
                      </h3>

                      {/* Full Message Content */}
                      <div className="mb-6">
                        <p className={`text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLong ? 'line-clamp-6' : ''}`}>
                          {discussion.content}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => toggleExpand(discussion.id)}
                            className="flex items-center gap-1.5 mt-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {isExpanded ? 'Show Less' : 'Read Full Message'}
                          </button>
                        )}
                      </div>

                    </article>
                  );
                })
              )}

              {club.discussions && club.discussions.length > visibleCount && (
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="px-8 py-3.5 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all duration-300 flex items-center gap-2 shadow-sm font-mono"
                  >
                    + Load More Messages ({club.discussions.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Members Sidebar */}
          <aside className="space-y-12">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-900">Members ({club.members.length})</h2>
              <div className="space-y-6">
                {club.members.map(member => (
                  <div key={member.userId} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center font-bold text-[10px] border border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-300 transition-colors overflow-hidden">
                        {member.user.avatarUrl ? (
                          <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          member.user.username[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block mb-0.5">{member.user.displayName || member.user.username}</span>
                        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                          {member.userId === club.owner.id ? 'Club Owner' : 'Member'}
                        </span>
                      </div>
                    </div>
                    {member.userId === club.owner.id && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                ))}
              </div>
            </div>
            
            {isMember && (
              <div className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Invite Others</p>
                <div className="flex items-center justify-between bg-white dark:bg-zinc-950 p-3 rounded border border-zinc-100 dark:border-zinc-900">
                  <span className="text-xs font-mono font-bold tracking-widest">{club.joinCode || '-------'}</span>
                  <button onClick={() => { navigator.clipboard.writeText(club.joinCode || ''); toast.success('Code Copied!'); }} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded transition-all">
                    <Link2 className="w-3.5 h-3.5 text-zinc-300" />
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
