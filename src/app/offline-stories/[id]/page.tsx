"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  WifiOff,
  Timer,
  Trash2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getOfflineStory,
  removeOfflineStory,
  getTimeRemaining,
  type OfflineStory,
  type OfflineChapter,
} from "@/lib/offlineStoryDb";

interface OfflineStoryPageProps {
  params: Promise<{ id: string }>;
}

export default function OfflineStoryPage({ params }: OfflineStoryPageProps) {
  const { id } = use(params);
  const [story, setStory] = useState<OfflineStory | null>(null);
  const [chapters, setChapters] = useState<OfflineChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getOfflineStory(id);
        if (!result) {
          setNotFound(true);
        } else {
          setStory(result.story);
          setChapters(result.chapters);
        }
      } catch (err) {
        console.error("Failed to load offline story:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      await removeOfflineStory(id);
      toast.success("Story removed from offline storage");
      window.location.href = "/offline-stories";
    } catch {
      toast.error("Failed to remove story");
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Loading offline story…
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !story) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto">
            <WifiOff className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Story Not Found</h1>
          <p className="text-sm text-zinc-500 font-medium max-w-sm mx-auto">
            This story may have expired or been removed from offline storage.
          </p>
          <Link
            href="/offline-stories"
            className="inline-block mt-4 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90"
          >
            Back to Offline Stories
          </Link>
        </div>
      </main>
    );
  }

  const timeRemaining = getTimeRemaining(story.expiresAt);
  const diff = story.expiresAt - Date.now();
  const hours = diff / (1000 * 60 * 60);
  const colorClass = hours < 24 ? "text-rose-500" : hours < 72 ? "text-amber-500" : "text-emerald-500";

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/offline-stories"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Offline Stories
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full">
            <WifiOff className="w-3 h-3 text-zinc-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Offline Mode
            </span>
          </div>
        </div>

        {/* Story Header */}
        <div className="flex flex-col md:flex-row gap-12 mb-16 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          <div className="shrink-0">
            <div className="relative aspect-[2/3] w-48 rounded-md overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              {story.coverBase64 ? (
                <img
                  src={story.coverBase64}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : story.coverUrl ? (
                <img
                  src={story.coverUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-10">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">{story.title}</h1>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <span className="font-bold text-[10px] uppercase text-zinc-400">
                    {story.authorUsername[0]}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-500">
                  {story.authorName}
                </span>
              </div>
            </div>

            {story.summary && (
              <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl font-medium">
                {story.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {story.chapterCount} Chapters
              </span>
              <span className={`flex items-center gap-1.5 ${colorClass}`}>
                <Timer className="h-3.5 w-3.5" />
                {timeRemaining}
              </span>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-40"
            >
              {removing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Remove from Offline
            </button>
          </div>
        </div>

        {/* Chapters Section */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Saved Chapters
            </h2>
            {chapters.length > 0 && (
              <Link
                href={`/offline-stories/${story.id}/chapters/${chapters[0].chapterId}`}
                className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90"
              >
                Start Reading
              </Link>
            )}
          </div>

          {chapters.length === 0 ? (
            <p className="text-xs font-medium text-zinc-400 italic">
              No chapters saved for this story.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.chapterId}
                  href={`/offline-stories/${story.id}/chapters/${chapter.chapterId}`}
                  className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold font-mono text-zinc-300">
                      {chapter.chapterOrder.toString().padStart(2, "0")}
                    </span>
                    <span className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-300" />
                      {chapter.readingTimeMin} min read
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
