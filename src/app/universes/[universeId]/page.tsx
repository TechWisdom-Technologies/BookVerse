"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Globe, BookOpen, User, Flame, ArrowLeft, Share2, Sparkles, LayoutGrid, Loader2, Compass, Check, Users, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface Story {
  id: string;
  title: string;
  coverUrl?: string;
  viewCount: number;
  genre: string;
  summary?: string;
  author: { id: string; username: string; displayName: string; };
}

interface Universe {
  id: string;
  name: string;
  description?: string;
  genre: string;
  coverUrl?: string;
  viewCount: number;
  stories: Story[];
  user: { id: string; username: string; displayName: string; avatarUrl?: string };
  collaborators?: { 
    userId: string; 
    status: string; 
    type: string;
    user?: {
      id: string;
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    }
  }[];
}

const getUniverseGraphic = (name: string) => {
  const colors = [
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-rose-500 via-pink-600 to-purple-700",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-violet-600 via-fuchsia-600 to-pink-700"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function UniverseShowcasePage({ params }: { params: Promise<{ universeId: string }> }) {
  const { universeId } = use(params);
  const { dbUser } = useAuth();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  // Co-Author Request State
  const [showCoAuthorModal, setShowCoAuthorModal] = useState(false);
  const [coAuthorMessage, setCoAuthorMessage] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const handleRequestMoreBooks = async () => {
    setRequesting(true);
    try {
      const res = await fetch('/api/book-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universeId }),
      });
      if (res.ok) {
        toast.success("Thanks! Your request for more books in this universe has been sent to the author.");
        setRequested(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request.");
      }
    } catch (err) {
      toast.error("Failed to submit request.");
    } finally {
      setRequesting(false);
    }
  };

  const handleRequestCoAuthor = async () => {
    setSubmittingRequest(true);
    try {
      const res = await fetch(`/api/universes/${universeId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: coAuthorMessage }),
      });
      if (res.ok) {
        toast.success("Co-author request sent successfully!");
        setShowCoAuthorModal(false);
        setCoAuthorMessage("");
        // Optimistically update
        setUniverse(prev => prev ? {
          ...prev,
          collaborators: [
            ...(prev.collaborators || []),
            { userId: dbUser?.id || '', status: 'PENDING', type: 'REQUEST' }
          ]
        } : prev);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  useEffect(() => {
    const fetchUniverse = async () => {
      try {
        const res = await fetch(`/api/universes/${universeId}`);
        if (res.ok) {
          const data = await res.json();
          setUniverse(data);
        }
      } finally { setLoading(false); }
    };
    fetchUniverse();
  }, [universeId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (!universe) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Record Not Found</p>
      <Link href="/universes" className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:underline transition-all">Return to Index</Link>
    </div>
  );

  const isOwner = dbUser?.id === universe.user.id;
  const myCollab = universe.collaborators?.find(c => c.userId === dbUser?.id);
  const canRequestCoAuthor = dbUser && !isOwner && !myCollab && (dbUser.membershipTier === 'CREATOR' || dbUser.role === 'ADMIN');
  const acceptedCollabs = universe.collaborators?.filter(c => c.status === 'ACCEPTED') || [];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Banner Graphic Showcase */}
        <div className="relative h-64 w-full rounded-lg mb-12 overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-900 flex flex-col justify-end p-8">
          {universe.coverUrl ? (
            <img 
              src={universe.coverUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getUniverseGraphic(universe.name)}`} />
          )}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/30 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-white/25 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                {universe.genre}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-white/90 animate-pulse" /> Cosmic Hub
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">{universe.name}</h1>
          </div>
        </div>

        {/* Minimal Header Dossier */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-20 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex-1 space-y-6">
            <Link href="/universes" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Archives
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                  {universe.genre}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 font-mono flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-zinc-300" /> {universe.viewCount} Transmissions
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-4 uppercase">{universe.name}</h1>
              {universe.description && (
                <p className="text-sm text-zinc-500 leading-relaxed font-medium max-w-2xl italic">
                  &quot;{universe.description}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-6 shrink-0">
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-800 rounded-md">
                <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  {universe.user.avatarUrl ? (
                    <img src={universe.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[8px] text-zinc-400">{universe.user.username[0].toUpperCase()}</div>
                  )}
                </div>
                <div>
                  <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest">Architect</p>
                  <p className="text-[10px] font-bold uppercase">{universe.user.displayName || universe.user.username}</p>
                </div>
              </div>
              
              {acceptedCollabs.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-800 rounded-md max-w-sm">
                  <div className="flex -space-x-2">
                    {acceptedCollabs.map(c => (
                      <div key={c.userId} className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700 relative z-10 hover:z-20">
                        {c.user?.avatarUrl ? (
                          <img src={c.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-[8px] text-zinc-400 bg-white dark:bg-zinc-900">{c.user?.username?.[0]?.toUpperCase() || <User className="w-3 h-3 text-zinc-400" />}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest">
                      {acceptedCollabs.length === 1 ? 'Co-Author' : 'Co-Authors'}
                    </p>
                    <p className="text-[10px] font-bold uppercase">
                      {acceptedCollabs.map(c => c.user?.displayName || c.user?.username).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {canRequestCoAuthor && (
                <button
                  onClick={() => setShowCoAuthorModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" /> Request Co-Author
                </button>
              )}
              {myCollab && myCollab.status === 'PENDING' && (
                <span className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending Request
                </span>
              )}
              {myCollab && myCollab.status === 'ACCEPTED' && (
                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-900/50">
                  <Check className="w-3.5 h-3.5" /> Co-Author
                </span>
              )}
              
              <button
                onClick={handleRequestMoreBooks}
                disabled={requesting}
                className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {requesting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : requested ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {requested ? "Requested!" : "Request More Books"}
              </button>
              <button className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest transition-colors">
                <Share2 className="w-3 h-3" /> Broadcast Dossier
              </button>
            </div>
          </div>
        </header>

        {/* Narrative Dimensions Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 pb-2 border-b border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Linked Dimensions</h2>
            </div>
            <span className="text-[9px] font-bold text-zinc-300 font-mono tracking-widest uppercase">Count: {universe.stories.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
            {universe.stories.map((story) => (
              <Link 
                key={story.id} 
                href={`/stories/${story.id}`}
                className="group flex gap-8 p-10 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden"
              >
                <div className="relative w-28 h-40 rounded border border-zinc-100 dark:border-zinc-900 shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                  {story.coverUrl ? (
                    <img src={story.coverUrl} className="w-full h-full object-cover transition-all duration-700" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">
                      {story.genre}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Flame className="w-3 h-3" /> {story.viewCount}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors mb-2 tracking-tight uppercase">
                      {story.title}
                    </h3>
                    {story.summary && (
                      <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {universe.stories.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white dark:bg-zinc-950 border border-dashed border-zinc-100 dark:border-zinc-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No archival dimensions registered to this universe.</p>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-40 pt-12 border-t border-zinc-50 dark:border-zinc-900 text-center opacity-40">
          <Globe className="w-6 h-6 mx-auto text-zinc-200 mb-6" />
          <p className="text-[8px] font-bold uppercase tracking-[0.6em] text-zinc-400">BookVerse Cosmic Protocol — Archival Record V2.0</p>
        </footer>
      </div>

      {/* Co-Author Request Modal */}
      {showCoAuthorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">
                Request Co-Authorship
              </h3>
              <button
                onClick={() => {
                  setShowCoAuthorModal(false);
                  setCoAuthorMessage("");
                }}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-zinc-500 font-medium">
                Send a request to <span className="font-bold text-zinc-900 dark:text-white">{universe.user.displayName || universe.user.username}</span> to collaborate on this universe.
              </p>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Message (Optional)
                </label>
                <textarea
                  value={coAuthorMessage}
                  onChange={(e) => setCoAuthorMessage(e.target.value)}
                  className="w-full h-24 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs resize-none outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Introduce yourself and explain what you'd like to contribute..."
                />
              </div>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCoAuthorModal(false);
                  setCoAuthorMessage("");
                }}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCoAuthor}
                disabled={submittingRequest}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingRequest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
