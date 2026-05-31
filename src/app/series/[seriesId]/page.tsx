"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Layers, BookOpen, User, Flame, ArrowLeft, Share2, Compass, LayoutGrid, Loader2, Check, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Story {
  id: string;
  title: string;
  coverUrl?: string;
  viewCount: number;
  genre: string;
  summary?: string;
  sequenceNumber?: number;
  author: { id: string; username: string; displayName: string; };
}

interface Series {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  stories: Story[];
  user: { id: string; username: string; displayName: string; avatarUrl?: string };
}

const getSeriesGraphic = (name: string) => {
  const colors = [
    "from-cyan-500 via-teal-600 to-emerald-700",
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-rose-500 via-pink-600 to-purple-700",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-violet-600 via-fuchsia-600 to-pink-700",
    "from-cyan-500 via-blue-600 to-indigo-700"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function SeriesShowcasePage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = use(params);
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequestMoreBooks = async () => {
    setRequesting(true);
    try {
      const res = await fetch('/api/book-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriesId }),
      });
      if (res.ok) {
        toast.success("Thanks! Your request for more books in this series has been sent to the author.");
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

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch(`/api/series/${seriesId}`);
        if (res.ok) {
          const data = await res.json();
          setSeries(data);
        }
      } finally { setLoading(false); }
    };
    fetchSeries();
  }, [seriesId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (!series) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Record Not Found</p>
      <Link href="/series" className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:underline transition-all">Return to Index</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Banner Graphic Showcase */}
        <div className="relative h-64 w-full rounded-lg mb-12 overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-900 flex flex-col justify-end p-8">
          {series.coverUrl ? (
            <img 
              src={series.coverUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getSeriesGraphic(series.name)}`} />
          )}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/30 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-white/90 animate-pulse" /> Serial Saga
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">{series.name}</h1>
          </div>
        </div>

        {/* Minimal Header Dossier */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-20 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex-1 space-y-6">
            <Link href="/series" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Sagas Archives
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-4 uppercase">{series.name}</h1>
              {series.description && (
                <p className="text-sm text-zinc-500 leading-relaxed font-medium max-w-2xl italic">
                  &quot;{series.description}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-6 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-800 rounded-md">
              <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                {series.user.avatarUrl ? (
                  <img src={series.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-[8px] text-zinc-400">{series.user.username[0].toUpperCase()}</div>
                )}
              </div>
              <div>
                <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest">Saga Author</p>
                <p className="text-[10px] font-bold uppercase">{series.user.displayName || series.user.username}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleRequestMoreBooks}
                disabled={requesting}
                className="flex items-center gap-2 text-[9px] font-bold text-zinc-300 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest transition-colors disabled:opacity-50"
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
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Series link copied to clipboard!');
                }}
                className="flex items-center gap-2 text-[9px] font-bold text-zinc-300 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest transition-colors"
              >
                <Share2 className="w-3 h-3" /> Broadcast Series
              </button>
            </div>
          </div>
        </header>

        {/* Narrative Sagas Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 pb-2 border-b border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Books Sequence</h2>
            </div>
            <span className="text-[9px] font-bold text-zinc-300 font-mono tracking-widest uppercase">Volume Count: {series.stories.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
            {series.stories.map((story, idx) => (
              <Link 
                key={story.id} 
                href={`/stories/${story.id}`}
                className="group flex gap-8 p-10 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden"
              >
                <div className="relative w-28 h-40 rounded border border-zinc-100 dark:border-zinc-900 shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                  {story.coverUrl ? (
                    <img src={story.coverUrl} className="w-full h-full object-cover transition-all duration-700" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                  {/* Sequence Badge Overlay */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur text-white text-[8px] font-bold uppercase tracking-widest font-mono">
                    Vol. {story.sequenceNumber || (idx + 1)}
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">
                      {story.genre || "Fiction"}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Flame className="w-3 h-3" /> {story.viewCount} reads
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
            
            {series.stories.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white dark:bg-zinc-950 border border-dashed border-zinc-100 dark:border-zinc-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No volumes registered in this series saga yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Saga System Footer */}
        <footer className="mt-40 pt-12 border-t border-zinc-50 dark:border-zinc-900 text-center opacity-40">
          <Layers className="w-6 h-6 mx-auto text-zinc-200 mb-6" />
          <p className="text-[8px] font-bold uppercase tracking-[0.6em] text-zinc-400">BookVerse Sagas Protocol — Archival Record V1.0</p>
        </footer>
      </div>
    </main>
  );
}
