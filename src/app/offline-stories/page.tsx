"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  Trash2,
  Clock,
  BookOpen,
  ArrowLeft,
  HardDrive,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllOfflineStories,
  getOfflineStory,
  deleteOfflineStory,
  clearAllOfflineStories,
  purgeExpiredStories,
  getOfflineStorageSize,
  formatStorageSize,
  getExpirationLabel,
  type OfflineStory,
} from "@/lib/offline-storage";
import { TTSPlayer } from "@/components/stories/TTSPlayer";

// --- Inline Reader Component ---
function OfflineStoryReader({ id, onBack }: { id: string; onBack: () => void }) {
  const [story, setStory] = useState<OfflineStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    async function loadStory() {
      try {
        const offlineStory = await getOfflineStory(id);
        setStory(offlineStory);
      } catch (error) {
        console.error("Failed to load offline story:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-32" />
        <div className="h-8 bg-zinc-100 dark:bg-zinc-900 rounded w-64" />
        <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <WifiOff className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
        <p className="text-sm font-bold text-zinc-400">গল্পটি পাওয়া যায়নি</p>
        <p className="text-xs text-zinc-400">
          গল্পটি মেয়াদোত্তীর্ণ হয়ে যেতে পারে অথবা মুছে ফেলা হয়েছে।
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded"
        >
          Back to Offline Library
        </button>
      </div>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];
  const prevChapter = currentChapterIndex > 0 ? story.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < story.chapters.length - 1 ? story.chapters[currentChapterIndex + 1] : null;

  return (
    <div className="pb-20">
      {/* Navigation */}
      <div className="mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Offline Library
        </button>
      </div>

      {/* Offline Badge */}
      <div className="mb-6 flex items-center gap-3 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
        <WifiOff className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Offline Mode</span>
        <span className="text-zinc-200 dark:text-zinc-700">•</span>
        <span className="text-[9px] font-bold font-mono text-amber-500 uppercase tracking-widest">
          <Clock className="w-3 h-3 inline mr-1" />
          {getExpirationLabel(story.expiresAt)}
        </span>
      </div>

      {/* Chapter Selector */}
      {story.chapters.length > 1 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <BookOpen className="w-3.5 h-3.5" />
            Chapters
          </div>
          <div className="flex flex-wrap gap-2">
            {story.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setCurrentChapterIndex(idx)}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded border transition-all ${
                  idx === currentChapterIndex
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                {ch.chapterOrder.toString().padStart(2, "0")}. {ch.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Header */}
      {currentChapter && (
        <>
          <header className="mb-16 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <BookOpen className="w-3.5 h-3.5" />
                {story.title}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{currentChapter.title}</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                by {story.author}
              </p>
            </div>
            <TTSPlayer htmlContent={currentChapter.htmlContent} />
          </header>

          <article className="prose prose-zinc max-w-none font-serif leading-relaxed dark:prose-invert text-zinc-700 dark:text-zinc-300">
            <div dangerouslySetInnerHTML={{ __html: currentChapter.htmlContent }} className="text-lg" />
          </article>

          {/* Chapter Navigation */}
          <nav className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevChapter ? (
              <button
                onClick={() => setCurrentChapterIndex(currentChapterIndex - 1)}
                className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{prevChapter.title}</span>
              </button>
            ) : <div className="hidden sm:block" />}
            
            {nextChapter ? (
              <button
                onClick={() => setCurrentChapterIndex(currentChapterIndex + 1)}
                className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{nextChapter.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
              >
                Back to Library
              </button>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
// ------------------------------

export default function OfflineStoriesPage() {
  const [stories, setStories] = useState<OfflineStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageSize, setStorageSize] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"savedAt" | "expiresAt">("savedAt");
  const [readingStoryId, setReadingStoryId] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    async function loadStories() {
      try {
        // Auto-purge expired stories first
        const purged = await purgeExpiredStories();
        if (purged > 0) {
          toast.success(`${purged}টি মেয়াদোত্তীর্ণ গল্প মুছে ফেলা হয়েছে`);
        }

        const allStories = await getAllOfflineStories();
        setStories(allStories);

        const size = await getOfflineStorageSize();
        setStorageSize(size);
      } catch (error) {
        console.error("Failed to load offline stories:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOfflineStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      const size = await getOfflineStorageSize();
      setStorageSize(size);
      toast.success("অফলাইন থেকে মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("আপনি কি সব অফলাইন গল্প মুছে ফেলতে চান?")) return;
    try {
      await clearAllOfflineStories();
      setStories([]);
      setStorageSize(0);
      toast.success("সব অফলাইন গল্প মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  const filteredStories = stories
    .filter((s) =>
      searchQuery
        ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.author.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "expiresAt") return a.expiresAt - b.expiresAt;
      return b.savedAt - a.savedAt;
    });

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-32" />
            <div className="h-8 bg-zinc-100 dark:bg-zinc-900 rounded w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (readingStoryId) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <OfflineStoryReader id={readingStoryId} onBack={() => setReadingStoryId(null)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/stories"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Story Archives
          </Link>
        </div>

        {/* Offline Status Banner */}
        {!isOnline && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
              আপনি বর্তমানে অফলাইনে আছেন। শুধুমাত্র সেভ করা গল্পগুলো পড়তে পারবেন।
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <WifiOff className="w-3.5 h-3.5" />
              Offline Library
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              অফলাইন গল্পসমূহ
            </h1>
            <p className="text-xs text-zinc-500 font-medium max-w-md">
              ইন্টারনেট ছাড়াই পড়ুন। গল্পগুলো সেভ করার ৭ দিন পর স্বয়ংক্রিয়ভাবে মুছে যাবে।
            </p>
          </div>

          {/* Storage Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
              <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-zinc-500">
                {formatStorageSize(storageSize)} used
              </span>
            </div>

            {stories.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded transition-all"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search & Sort */}
        {stories.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="গল্প বা লেখক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("savedAt")}
                className={`px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded border transition-all ${
                  sortBy === "savedAt"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy("expiresAt")}
                className={`px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded border transition-all ${
                  sortBy === "expiresAt"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                Expiring Soon
              </button>
            </div>
          </div>
        )}

        {/* Story Cards */}
        {filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <WifiOff className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
            <p className="text-sm font-bold text-zinc-400">
              {searchQuery ? "কোনো গল্প পাওয়া যায়নি" : "কোনো অফলাইন গল্প নেই"}
            </p>
            <p className="text-xs text-zinc-400 max-w-sm text-center">
              {searchQuery
                ? "অন্য কিছু দিয়ে খুঁজুন।"
                : "গল্পের পৃষ্ঠায় গিয়ে \"Save Offline\" বাটনে ক্লিক করে গল্প ডাউনলোড করুন।"}
            </p>
            {!searchQuery && (
              <Link
                href="/stories"
                className="mt-4 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90"
              >
                Browse Stories
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="group relative border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex gap-4 p-4">
                  {/* Cover Image */}
                  <div className="shrink-0 w-20 h-28 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {story.coverImage ? (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="text-sm font-bold tracking-tight truncate">
                      {story.title}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {story.author}
                    </p>
                    {story.description && (
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1 text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-widest">
                        <BookOpen className="w-3 h-3" />
                        {story.chapters.length} Ch
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold font-mono text-amber-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {getExpirationLabel(story.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center border-t border-zinc-50 dark:border-zinc-900">
                  <button
                    onClick={() => setReadingStoryId(story.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                  >
                    <BookOpen className="w-3 h-3" />
                    Read Offline
                  </button>
                  <div className="w-px h-6 bg-zinc-50 dark:bg-zinc-900" />
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
