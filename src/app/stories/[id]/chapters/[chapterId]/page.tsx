import Link from "next/link";
import { notFound } from "next/navigation";
import { generateHTML, type JSONContent } from "@tiptap/core";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

interface ChapterReaderPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

function renderChapterContent(content: unknown) {
  if (!content || typeof content !== "object") return null;

  try {
    return generateHTML(content as JSONContent, [
      StarterKit,
      ImageExtension,
      Underline,
    ]);
  } catch (error) {
    console.error("Failed to render TipTap content:", error);
    return null;
  }
}

export default async function ChapterReaderPage({ params }: ChapterReaderPageProps) {
  const { id: storyId, chapterId } = await params;

  const chapter = await prisma.storyChapter.findUnique({
    where: { id: chapterId },
    include: {
      story: {
        select: {
          id: true,
          title: true,
          published: true,
          authorId: true,
        },
      },
    },
  });

  if (!chapter || chapter.storyId !== storyId || !chapter.story.published) {
    notFound();
  }

  const siblings = await prisma.storyChapter.findMany({
    where: { storyId },
    orderBy: { chapterOrder: "asc" },
    select: { id: true, title: true, chapterOrder: true },
  });

  const currentIndex = siblings.findIndex((item) => item.id === chapterId);
  const prevChapter = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;
  const html = renderChapterContent(chapter.content);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <Link
        href={`/stories/${storyId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {chapter.story.title}
      </Link>

      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Chapter {chapter.chapterOrder}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {chapter.title}
        </h1>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Updated {formatDate(chapter.updatedAt)}
        </p>
      </header>

      <article className="prose prose-zinc max-w-none font-serif leading-relaxed dark:prose-invert">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="italic text-zinc-500 dark:text-zinc-400">
            This chapter has no content yet.
          </p>
        )}
      </article>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {prevChapter ? (
          <Link
            href={`/stories/${storyId}/chapters/${prevChapter.id}`}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{prevChapter.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/stories/${storyId}/chapters/${nextChapter.id}`}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span className="line-clamp-1">{nextChapter.title}</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/stories/${storyId}`}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Back to Story
          </Link>
        )}
      </nav>
    </main>
  );
}
