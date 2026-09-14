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
  ChevronUp,
  Trash2,
  Pencil
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import ClubSettingsModal from './ClubSettingsModal';

interface ClubDiscussionReaction {
  id: string;
  discussionId: string;
  userId: string;
  emoji: string;
}

interface ClubDiscussion {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  reactions?: ClubDiscussionReaction[];
  _count?: { replies: number };
}

interface Club {
  id: string;
  name: string;
  description?: string;
  rules?: string;
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
  discussions: ClubDiscussion[];
}

export default function ClubDetailPage() {
  const { clubId } = useParams() as { clubId: string };
  const { dbUser } = useAuth();
  const router = useRouter();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showJoinCodeInput, setShowJoinCodeInput] = useState(false);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editDiscussionContent, setEditDiscussionContent] = useState('');
  const [repliesData, setRepliesData] = useState<Record<string, ClubDiscussion[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());

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
        }
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchClub();
  }, [clubId]);

  useEffect(() => {
    if (club && dbUser) {
      const isMemberCheck = club.members.some((m: any) => m.userId === dbUser.id);
      setIsMember(isMemberCheck);
      if (isMemberCheck) {
        fetch(`/api/clubs/${clubId}/read`, { method: 'POST' }).catch(console.error);
      }
    } else if (!dbUser) {
      setIsMember(false);
    }
  }, [club, dbUser, clubId]);

  const handleJoinClub = async () => {
    if (!dbUser) return toast.error('Login required');
    if (club?.rules && !hasAgreedToRules) {
      return toast.error('You must agree to the club rules to join.');
    }
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
        setHasAgreedToRules(false);
        toast.success('Welcome to the club!');
        setClub(prev => prev ? {
          ...prev,
          members: [...prev.members, {
            userId: dbUser.id,
            role: 'MEMBER',
            user: { 
              id: dbUser.id, 
              username: dbUser.username, 
              displayName: dbUser.displayName ?? undefined, 
              avatarUrl: dbUser.avatarUrl ?? undefined 
            }
          }]
        } : null);
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
        setClub(prev => prev ? {
          ...prev,
          members: prev.members.filter(m => m.userId !== dbUser?.id)
        } : null);
      }
    } catch (error) {
      toast.error('Connection error');
    }
  };

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionContent.trim()) return;
    try {
      setIsPosting(true);
      const res = await fetch(`/api/clubs/${clubId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newDiscussionContent, 
          parentId: replyingTo 
        }),
      });
      if (res.ok) {
        toast.success('Message posted!');
        setNewDiscussionContent('');
        setShowNewDiscussion(false);
        setReplyingTo(null);
        
        // Refetch logic
        const discussionsRes = await fetch(`/api/clubs/${clubId}/discussions`);
        if (discussionsRes.ok) {
          const discussionsData = await discussionsRes.json();
          setClub(prev => prev ? { ...prev, discussions: discussionsData } : null);
        }
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

  const handleEditDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDiscussionContent.trim() || !editingDiscussionId) return;
    try {
      setIsPosting(true);
      const res = await fetch(`/api/clubs/${clubId}/discussions/${editingDiscussionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editDiscussionContent }),
      });
      if (res.ok) {
        toast.success('Message updated!');
        setEditingDiscussionId(null);
        
        const discussionsRes = await fetch(`/api/clubs/${clubId}/discussions`);
        if (discussionsRes.ok) {
          const discussionsData = await discussionsRes.json();
          setClub(prev => prev ? { ...prev, discussions: discussionsData } : null);
        }
      } else {
        toast.error('Failed to update message');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleReplies = async (discussionId: string) => {
    if (showReplies.has(discussionId)) {
      const next = new Set(showReplies);
      next.delete(discussionId);
      setShowReplies(next);
      return;
    }

    const next = new Set(showReplies);
    next.add(discussionId);
    setShowReplies(next);

    if (!repliesData[discussionId]) {
      try {
        setLoadingReplies(prev => new Set(prev).add(discussionId));
        const res = await fetch(`/api/clubs/${clubId}/discussions/${discussionId}/replies`);
        if (res.ok) {
          const data = await res.json();
          setRepliesData(prev => ({ ...prev, [discussionId]: data }));
        }
      } catch (err) {
        toast.error('Failed to load replies');
      } finally {
        setLoadingReplies(prev => {
          const next = new Set(prev);
          next.delete(discussionId);
          return next;
        });
      }
    }
  };

  const handleReact = async (discussionId: string, emoji: string, isReply = false, parentId?: string) => {
    if (!dbUser) return toast.error('Login required');
    try {
      // Optimistic update
      const updateReactions = (discussions: ClubDiscussion[]) => 
        discussions.map(d => {
          if (d.id === discussionId) {
            let updatedReactions = [...(d.reactions || [])];
            const existingIndex = updatedReactions.findIndex(r => r.userId === dbUser.id);
            
            if (existingIndex !== -1) {
              if (updatedReactions[existingIndex].emoji === emoji) {
                // Remove if clicking same emoji
                updatedReactions.splice(existingIndex, 1);
              } else {
                // Replace if clicking different emoji
                updatedReactions[existingIndex].emoji = emoji;
              }
            } else {
              // Add new reaction
              updatedReactions.push({ id: 'temp', discussionId, userId: dbUser.id, emoji });
            }
            return { ...d, reactions: updatedReactions };
          }
          return d;
        });

      if (isReply && parentId) {
        setRepliesData(prev => ({
          ...prev,
          [parentId]: updateReactions(prev[parentId] || [])
        }));
      } else {
        setClub(prev => prev ? { ...prev, discussions: updateReactions(prev.discussions) } : null);
      }

      await fetch(`/api/clubs/${clubId}/discussions/${discussionId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}/discussions/${discussionId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        setClub(prev => prev ? { 
          ...prev, 
          discussions: prev.discussions.filter(d => d.id !== discussionId) 
        } : null);
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      toast.error('Network error');
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
              <button onClick={() => setShowSettingsModal(true)} className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                Club Settings
              </button>
            ) : dbUser && (
              isMember ? (
                <button onClick={handleLeaveClub} className="px-5 py-2 border border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded hover:text-rose-500 transition-all">
                  Leave Club
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {club.rules && (
                    <div className="w-full max-w-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded p-4 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Club Rules & Terms</p>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 max-h-32 overflow-y-auto whitespace-pre-wrap font-medium mb-3">
                        {club.rules}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={hasAgreedToRules} 
                          onChange={e => setHasAgreedToRules(e.target.checked)}
                          className="w-3.5 h-3.5 accent-zinc-900 dark:accent-white" 
                        />
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest">I agree to these terms</span>
                      </label>
                    </div>
                  )}
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
                    <button 
                      onClick={handleJoinClub} 
                      disabled={!!club.rules && !hasAgreedToRules}
                      className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded disabled:opacity-50 transition-all"
                    >
                      {club.isPrivate ? (showJoinCodeInput ? 'Join Now' : 'Enter Private Code') : 'Join This Club'}
                    </button>
                  </div>
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
                <button onClick={() => { setShowNewDiscussion(true); setNewDiscussionContent(''); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                  <Plus className="w-3.5 h-3.5" /> New Message
                </button>
              )}
            </div>

            {/* New Discussion Form */}
            {isMember && showNewDiscussion && (
              <form id="discussion-form" onSubmit={handlePostDiscussion} className="p-8 border border-zinc-100 dark:border-zinc-800 rounded space-y-6 bg-zinc-50/10">

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
                      {editingDiscussionId === discussion.id ? (
                        <form onSubmit={handleEditDiscussion} className="space-y-4">

                          <textarea
                            value={editDiscussionContent}
                            onChange={e => setEditDiscussionContent(e.target.value)}
                            rows={4}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 px-4 py-2.5 text-xs outline-none resize-none rounded focus:border-zinc-900 dark:focus:border-white leading-relaxed"
                            required
                          />
                          <div className="flex gap-2">
                            <button type="submit" disabled={isPosting} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                              {isPosting ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setEditingDiscussionId(null)} className="px-4 py-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          {/* Author Info */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                                {discussion.author.avatarUrl && discussion.author.avatarUrl !== "null" ? (
                                  <img 
                                    src={discussion.author.avatarUrl} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = discussion.author.username[0].toUpperCase(); }}
                                  />
                                ) : (
                                  discussion.author.username[0].toUpperCase()
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="text-[11px] font-bold text-zinc-900 dark:text-white block mb-0.5 uppercase">
                                  {discussion.author.displayName || discussion.author.username}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                  <span>
                                    {new Date(discussion.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    {' · '}
                                    {new Date(discussion.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {discussion.isEdited && <span className="text-zinc-400 italic">(edited)</span>}
                                </span>
                              </div>
                            </div>
                            
                            {(dbUser?.id === discussion.author.id || isOwner) && (
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {dbUser?.id === discussion.author.id && (
                                  <button onClick={() => {
                                    setEditingDiscussionId(discussion.id);
                                    setEditDiscussionContent(discussion.content);
                                  }} className="p-1.5 text-zinc-400 hover:text-indigo-500 rounded transition-colors" title="Edit message">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button onClick={() => handleDeleteDiscussion(discussion.id)} className="p-1.5 text-zinc-400 hover:text-rose-500 rounded transition-colors" title="Delete message">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>



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
                            {/* Actions & Reactions */}
                            <div className="flex items-center gap-6 mt-4">
                              {(() => {
                                const hasReplied = repliesData[discussion.id]?.some(r => r.author.id === dbUser?.id);
                                return (
                                  <button 
                                    onClick={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)} 
                                    disabled={hasReplied}
                                    className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors disabled:opacity-50 disabled:hover:text-zinc-400"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" /> {hasReplied ? 'Replied' : 'Reply'}
                                  </button>
                                );
                              })()}
                              
                              <div className="flex items-center gap-2">
                                {['👍', '❤️', '😂', '🔥', '👀'].map(emoji => {
                                  const count = discussion.reactions?.filter(r => r.emoji === emoji).length || 0;
                                  const hasReacted = discussion.reactions?.some(r => r.userId === dbUser?.id && r.emoji === emoji);
                                  
                                  return (
                                    <button 
                                      key={emoji}
                                      onClick={() => handleReact(discussion.id, emoji)}
                                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors ${hasReacted ? 'bg-indigo-500/10 text-indigo-500' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                                    >
                                      <span>{emoji}</span>
                                      {count > 0 && <span className="font-bold">{count}</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Reply Input Form */}
                            {replyingTo === discussion.id && (
                              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <form onSubmit={handlePostDiscussion} className="flex gap-2">
                                  <textarea
                                    value={newDiscussionContent}
                                    onChange={e => setNewDiscussionContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    rows={2}
                                    className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 px-3 py-2 text-xs outline-none resize-none rounded focus:border-zinc-900 dark:focus:border-white leading-relaxed"
                                    required
                                  />
                                  <button type="submit" disabled={isPosting} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded transition-all whitespace-nowrap self-end h-[36px]">
                                    {isPosting ? '...' : 'Reply'}
                                  </button>
                                </form>
                              </div>
                            )}

                            {/* Replies List */}
                            {discussion._count && discussion._count.replies > 0 && (
                              <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
                                <button 
                                  onClick={() => handleToggleReplies(discussion.id)}
                                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                                >
                                  {showReplies.has(discussion.id) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  {showReplies.has(discussion.id) ? 'Hide Replies' : `See Replies (${discussion._count.replies})`}
                                </button>
                                
                                {showReplies.has(discussion.id) && (
                                  <div className="mt-6 space-y-6 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800/50">
                                    {loadingReplies.has(discussion.id) ? (
                                      <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-zinc-400" /></div>
                                    ) : (
                                      repliesData[discussion.id]?.map(reply => (
                                        <div key={reply.id} className="group flex flex-col gap-3">
                                          <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold border border-zinc-100 dark:border-zinc-800 overflow-hidden shrink-0">
                                              {reply.author.avatarUrl && reply.author.avatarUrl !== "null" ? (
                                                <img 
                                                  src={reply.author.avatarUrl} 
                                                  alt="" 
                                                  className="w-full h-full object-cover" 
                                                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = reply.author.username[0].toUpperCase(); }}
                                                />
                                              ) : (
                                                reply.author.username[0].toUpperCase()
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase">{reply.author.displayName || reply.author.username}</span>
                                                <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                                                  {new Date(reply.createdAt).toLocaleDateString()}
                                                </span>
                                              </div>
                                              <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                            </div>
                                          </div>
                                          
                                          {/* Reply Reactions */}
                                          <div className="flex items-center gap-2 ml-11">
                                            {['👍', '❤️', '😂', '🔥', '👀'].map(emoji => {
                                              const count = reply.reactions?.filter(r => r.emoji === emoji).length || 0;
                                              const hasReacted = reply.reactions?.some(r => r.userId === dbUser?.id && r.emoji === emoji);
                                              if (count === 0 && !hasReacted) return null; // Only show active reactions for replies to save space, unless hover (could add later)
                                              return (
                                                <button 
                                                  key={emoji}
                                                  onClick={() => handleReact(reply.id, emoji, true, discussion.id)}
                                                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors ${hasReacted ? 'bg-indigo-500/10 text-indigo-500' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                                >
                                                  <span>{emoji}</span>
                                                  <span className="font-bold">{count}</span>
                                                </button>
                                              );
                                            })}
                                            {/* Add Reaction Button for Reply */}
                                            <div tabIndex={0} className="relative group/react cursor-pointer flex items-center justify-center w-5 h-5 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-300 focus:outline-none">
                                              <Plus className="w-3 h-3" />
                                              <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover/react:opacity-100 group-hover/react:visible group-focus-within/react:opacity-100 group-focus-within/react:visible transition-all flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-xl z-10 pointer-events-auto">
                                                {['👍', '❤️', '😂', '🔥', '👀'].map(emoji => (
                                                  <button 
                                                    key={emoji} 
                                                    onClick={(e) => { e.currentTarget.blur(); handleReact(reply.id, emoji, true, discussion.id); }} 
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                                                  >
                                                    {emoji}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}

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
                        {member.user.avatarUrl && member.user.avatarUrl !== "null" ? (
                          <img 
                            src={member.user.avatarUrl} 
                            alt="" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = member.user.username[0].toUpperCase(); }}
                          />
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
      
      <ClubSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
        club={club} 
        setClub={setClub} 
      />
    </main>
  );
}
