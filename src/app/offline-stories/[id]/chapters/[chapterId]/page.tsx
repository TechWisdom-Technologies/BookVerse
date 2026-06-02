"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  WifiOff,
  Loader2,
} from "lucide-react";
import {
  getOfflineStory,
  type OfflineChapter,
} from "@/lib/offline-storage";

interface OfflineChapterPageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export default function OfflineChapterPage({ params }: OfflineChapterPageProps) {
  const { id: storyId, chapterId } = use(params);
  const [chapter, setChapter] = useState<OfflineChapter | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [allChapters, setAllChapters] = useState<OfflineChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storyData = await getOfflineStory(storyId);
        if (!storyData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const chapterData = storyData.chapters.find((ch) => ch.id === chapterId);
        if (!chapterData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setChapter(chapterData);
        setStoryTitle(storyData.title);
        setAllChapters(storyData.chapters.sort((a, b) => a.chapterOrder - b.chapterOrder));
      } catch (err) {
        console.error("Failed to load offline chapter:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [storyId, chapterId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Loading chapter…
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !chapter) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto">
            <WifiOff className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Chapter Not Found</h1>
          <p className="text-sm text-zinc-500 font-medium max-w-sm mx-auto">
            This chapter may have expired or been removed from offline storage.
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

  const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  // Render content from stored HTML
  const htmlContent = chapter.htmlContent;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-40">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href={`/offline-stories`}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Offline Library
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-full">
            <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Offline Reading
            </span>
          </div>
        </div>

        {/* Chapter Header */}
        <header className="mb-16 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <BookOpen className="w-3.5 h-3.5" />
              Chapter {chapter.chapterOrder.toString().padStart(2, "0")}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                {chapter.title}
              </h1>
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-mono">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500">
                  {Math.max(1, Math.ceil((chapter.htmlContent?.length || 0) / 1000))} min read
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Chapter Content */}
        <article className="prose prose-zinc max-w-none font-serif leading-relaxed dark:prose-invert text-zinc-700 dark:text-zinc-300">
          {htmlContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="text-lg"
            />
          ) : (
            <p className="text-xs font-medium text-zinc-400 italic">
              No content available for this chapter.
            </p>
          )}
        </article>

        {/* Chapter Navigation */}
        <nav className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevChapter ? (
            <Link
              href={`/offline-stories/${storyId}/chapters/${prevChapter.id}`}
              className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all group"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {prevChapter.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextChapter ? (
            <Link
              href={`/offline-stories/${storyId}/chapters/${nextChapter.id}`}
              className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {nextChapter.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/offline-stories`}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
            >
              Back to Offline Library
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
