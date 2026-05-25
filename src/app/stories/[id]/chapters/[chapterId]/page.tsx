import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/core";
import { Window } from "happy-dom";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { TTSPlayer } from "@/components/stories/TTSPlayer";
import { ChapterInlineComments } from "@/components/stories/ChapterInlineComments";
import { ReadingProgressTracker } from "@/components/stories/ReadingProgressTracker";
import { ChapterPollManager } from "@/components/stories/ChapterPollManager";
import { adminAuth } from "@/lib/firebase-admin";

interface ChapterReaderPageProps {
  params: Promise<{ id: string; chapterId: string; }>;
}

function renderChapterContent(content: unknown) {
  if (!content || typeof content !== "object") return null;
  try {
    const window = new Window();
    (global as any).window = window;
    (global as any).document = window.document;
    try { (global as any).navigator = window.navigator; } catch (e) {}
    return generateHTML(content as JSONContent, [StarterKit, ImageExtension, Underline]);
  } catch (error) {
    console.error("Failed to render TipTap content:", error);
    return null;
  }
}

function estimateReadingTime(content: any): number {
  if (!content) return 1;
  
  function countWords(node: any): number {
    if (!node) return 0;
    let clientWordCount = 0;
    if (node.type === "text" && typeof node.text === "string") {
      clientWordCount += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        clientWordCount += countWords(child);
      }
    }
    return clientWordCount;
  }

  const words = countWords(content);
  return Math.max(1, Math.ceil(words / 200));
}

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid }, select: { id: true } });
    return user?.id ?? null;
  } catch { return null; }
}

export default async function ChapterReaderPage({ params }: ChapterReaderPageProps) {
  const { id: storyId, chapterId } = await params;
  const currentUserId = await getCurrentUserId();

  const chapter = await prisma.storyChapter.findUnique({
    where: { id: chapterId },
    include: {
      story: { select: { id: true, title: true, published: true, authorId: true } },
    },
  });

  if (!chapter || chapter.storyId !== storyId || !chapter.story.published) notFound();

  const isAuthor = currentUserId === chapter.story.authorId;
  const readTime = estimateReadingTime(chapter.content);

  const siblings = await prisma.storyChapter.findMany({
    where: { storyId },
    orderBy: { chapterOrder: "asc" },
    select: { id: true, title: true, chapterOrder: true },
  });

  const currentIndex = siblings.findIndex((item) => item.id === chapterId);
  const prevChapter = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const html = renderChapterContent(chapter.content);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-40">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Minimal Navigation */}
        <div className="mb-12">
          <Link href={`/stories/${storyId}`} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            {chapter.story.title}
          </Link>
        </div>

        {/* Chapter Header Dossier */}
        <header className="mb-16 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <BookOpen className="w-3.5 h-3.5" />
              Transmission {chapter.chapterOrder.toString().padStart(2, '0')}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">{chapter.title}</h1>
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-mono">
                <Clock className="w-3 h-3 text-zinc-450" />
                Updated {formatDate(chapter.updatedAt)}
                <span className="text-zinc-600 dark:text-zinc-800">•</span>
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500">{readTime} min read</span>
              </div>
            </div>
          </div>
          {html && <TTSPlayer htmlContent={html} />}
        </header>

        {/* Narrative Article */}
        <article className="prose prose-zinc max-w-none font-serif leading-relaxed dark:prose-invert text-zinc-700 dark:text-zinc-300">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} className="text-lg" />
          ) : (
            <p className="text-xs font-medium text-zinc-400 italic">No narrative data transmitted for this record.</p>
          )}
        </article>

        {currentUserId && (
          <ReadingProgressTracker storyId={storyId} chapterId={chapterId} />
        )}

        <ChapterPollManager storyId={storyId} chapterId={chapterId} isAuthor={isAuthor} userId={currentUserId} />

        <ChapterInlineComments storyId={storyId} chapterId={chapterId} />

        {/* Transmission Navigation Registry */}
        <nav className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevChapter ? (
            <Link
              href={`/stories/${storyId}/chapters/${prevChapter.id}`}
              className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all group"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{prevChapter.title}</span>
            </Link>
          ) : <div className="hidden sm:block" />}

          {nextChapter ? (
            <Link
              href={`/stories/${storyId}/chapters/${nextChapter.id}`}
              className="flex items-center gap-3 px-6 py-3 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{nextChapter.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/stories/${storyId}`}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
            >
              Archive Return
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
