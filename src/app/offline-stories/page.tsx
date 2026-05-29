"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  Trash2,
  BookOpen,
  Clock,
  ArrowLeft,
  Download,
  AlertTriangle,
  Feather,
  Loader2,
  Timer,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getOfflineStories,
  removeOfflineStory,
  getTimeRemaining,
  type OfflineStory,
} from "@/lib/offlineStoryDb";

export default function OfflineStoriesPage() {
  const [stories, setStories] = useState<OfflineStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [, setTick] = useState(0); // Force re-render for countdown updates

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // Tick every minute to update time remaining
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const result = await getOfflineStories();
      setStories(result);
    } catch (err) {
      console.error("Failed to load offline stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (storyId: string) => {
    setRemovingId(storyId);
    try {
      await removeOfflineStory(storyId);
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      toast.success("Story removed from offline storage");
    } catch (err) {
      console.error("Failed to remove:", err);
      toast.error("Failed to remove story");
    } finally {
      setRemovingId(null);
    }
  };

  const getExpirationColor = (expiresAt: number) => {
    const diff = expiresAt - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 24) return "text-rose-500";
    if (hours < 72) return "text-amber-500";
    return "text-emerald-500";
  };

  const getExpirationBarWidth = (savedAt: number, expiresAt: number) => {
    const total = expiresAt - savedAt;
    const remaining = expiresAt - Date.now();
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>

        {/* Offline Status Banner */}
        {isOffline && (
          <div className="mb-8 flex items-center gap-3 px-5 py-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                You&apos;re offline
              </p>
              <p className="text-[10px] font-medium text-amber-600/70 dark:text-amber-500/60 mt-0.5">
                Reading from your saved offline library. Stories below are available to read.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <Download className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Offline Stories</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                {stories.length} {stories.length === 1 ? "story" : "stories"} saved
                <span className="mx-2 text-zinc-300">·</span>
                7-day auto-expiry
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 font-medium max-w-2xl">
            Stories you save for offline reading are stored on this device for 7 days. 
            After that, they will automatically vanish. Save a story again to reset the timer.
          </p>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Loading saved stories…
            </p>
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <Feather className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight mb-2">No offline stories yet</h2>
              <p className="text-sm text-zinc-500 font-medium max-w-md">
                Save stories for offline reading by clicking the &quot;Save Offline&quot; button on any story page.
              </p>
            </div>
            {!isOffline && (
              <Link
                href="/stories"
                className="mt-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90"
              >
                Browse Stories
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-lg overflow-hidden">
            {stories.map((story) => {
              const timeRemaining = getTimeRemaining(story.expiresAt);
              const barWidth = getExpirationBarWidth(story.savedAt, story.expiresAt);
              const colorClass = getExpirationColor(story.expiresAt);

              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-zinc-950 p-0 transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                >
                  <div className="flex items-start gap-5 p-5">
                    {/* Cover */}
                    <Link
                      href={`/offline-stories/${story.id}`}
                      className="shrink-0"
                    >
                      <div className="relative w-16 h-24 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm group">
                        {story.coverBase64 ? (
                          <img
                            src={story.coverBase64}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : story.coverUrl ? (
                          <img
                            src={story.coverUrl}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                          </div>
                        )}
                        {/* Offline badge */}
                        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm px-1.5 py-0.5 text-center">
                          <span className="text-[7px] font-bold uppercase tracking-widest text-white">
                            Offline
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Story Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/offline-stories/${story.id}`}
                        className="block group"
                      >
                        <h3 className="text-sm font-bold tracking-tight truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        by {story.authorName}
                      </p>
                      {story.summary && (
                        <p className="text-xs text-zinc-500 font-medium mt-2 line-clamp-2">
                          {story.summary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                          <BookOpen className="w-3 h-3" />
                          {story.chapterCount} {story.chapterCount === 1 ? "chapter" : "chapters"}
                        </span>
                        <span className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${colorClass}`}>
                          <Timer className="w-3 h-3" />
                          {timeRemaining}
                        </span>
                      </div>

                      {/* Expiration progress bar */}
                      <div className="mt-3 h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            barWidth > 60
                              ? "bg-emerald-500"
                              : barWidth > 30
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        href={`/offline-stories/${story.id}`}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90"
                      >
                        Read
                      </Link>
                      <button
                        onClick={() => handleRemove(story.id)}
                        disabled={removingId === story.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 text-[9px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-40"
                      >
                        {removingId === story.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Footer */}
        {stories.length > 0 && (
          <div className="mt-8 flex items-start gap-3 px-5 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                Storage Notice
              </p>
              <p className="text-xs text-zinc-400 font-medium">
                Saved stories expire after 7 days and are stored only on this device.
                Clearing your browser data will also remove saved stories.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
