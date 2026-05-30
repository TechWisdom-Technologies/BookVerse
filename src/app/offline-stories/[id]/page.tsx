"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clock, WifiOff } from "lucide-react";
import { getOfflineStory, getExpirationLabel, type OfflineStory } from "@/lib/offline-storage";
import { TTSPlayer } from "@/components/stories/TTSPlayer";

interface OfflineStoryReaderProps {
  params: Promise<{ id: string }>;
}

export default function OfflineStoryReader({ params }: OfflineStoryReaderProps) {
  const { id } = use(params);
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
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-32" />
            <div className="h-8 bg-zinc-100 dark:bg-zinc-900 rounded w-64" />
            <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link
              href="/offline-stories"
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Offline Library
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <WifiOff className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
            <p className="text-sm font-bold text-zinc-400">গল্পটি পাওয়া যায়নি</p>
            <p className="text-xs text-zinc-400">
              গল্পটি মেয়াদোত্তীর্ণ হয়ে যেতে পারে অথবা মুছে ফেলা হয়েছে।
            </p>
            <Link
              href="/offline-stories"
              className="mt-4 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded"
            >
              Back to Offline Library
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];
  const prevChapter = currentChapterIndex > 0 ? story.chapters[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex < story.chapters.length - 1
      ? story.chapters[currentChapterIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-40">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/offline-stories"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Offline Library
          </Link>
        </div>

        {/* Offline Badge */}
        <div className="mb-6 flex items-center gap-3 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
          <WifiOff className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            Offline Mode
          </span>
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
                <h1 className="text-2xl font-bold tracking-tight">
                  {currentChapter.title}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  by {story.author}
                </p>
              </div>
              <TTSPlayer htmlContent={currentChapter.htmlContent} />
            </header>

            {/* Chapter Content */}
            <article className="prose prose-zinc max-w-none font-serif leading-relaxed dark:prose-invert text-zinc-700 dark:text-zinc-300">
              <div
                dangerouslySetInnerHTML={{ __html: currentChapter.htmlContent }}
                className="text-lg"
              />
            </article>

            {/* Chapter Navigation */}
            <nav className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevChapter ? (
                <button
                  onClick={() => setCurrentChapterIndex(currentChapterIndex - 1)}
                  className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {prevChapter.title}
                  </span>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextChapter ? (
                <button
                  onClick={() => setCurrentChapterIndex(currentChapterIndex + 1)}
                  className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {nextChapter.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href="/offline-stories"
                  className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
                >
                  Back to Library
                </Link>
              )}
            </nav>
          </>
        )}
      </div>
    </main>
  );
}
