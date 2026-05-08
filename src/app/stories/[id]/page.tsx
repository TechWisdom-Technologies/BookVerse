import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactionType } from "@prisma/client";
import { BookOpen, ChevronRight, Eye, FilePenLine, MessageSquare } from "lucide-react";
import { CommentSection } from "@/components/comments/CommentSection";
import { ReactionBar } from "@/components/stories/ReactionBar";
import { StoryViewTracker } from "@/components/stories/StoryViewTracker";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await prisma.story.findUnique({
    where: { id },
    select: { title: true, summary: true, coverUrl: true, published: true },
  });

  if (!story || !story.published) {
    return { title: "Story not found" };
  }

  return {
    title: story.title,
    description: story.summary || "Read this story on BookVerse",
    openGraph: {
      title: story.title,
      description: story.summary || "Read this story on BookVerse",
      images: story.coverUrl ? [{ url: story.coverUrl }] : [],
    },
  };
}

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return null;

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { id } = await params;
  const currentUserId = await getCurrentUserId();

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          _count: { select: { followers: true, following: true } },
        },
      },
      chapters: {
        orderBy: { chapterOrder: "asc" },
        select: {
          id: true,
          title: true,
          chapterOrder: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          reactions: true,
          comments: true,
        },
      },
    },
  });

  if (!story || !story.published) {
    notFound();
  }

  const reactionCounts = await prisma.storyReaction.groupBy({
    by: ["reactionType"],
    where: { storyId: id },
    _count: true,
  });

  const reactions: Record<ReactionType, number> = {
    LIKE: 0,
    LOVE: 0,
    FIRE: 0,
    CRY: 0,
    WOW: 0,
  };

  for (const reaction of reactionCounts) {
    reactions[reaction.reactionType] = reaction._count;
  }

  const userReaction = currentUserId
    ? await prisma.storyReaction.findUnique({
        where: { storyId_userId: { storyId: id, userId: currentUserId } },
        select: { reactionType: true },
      })
    : null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <StoryViewTracker storyId={story.id} />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-shrink-0">
          <div className="relative aspect-[2/3] w-44 overflow-hidden rounded-lg bg-zinc-200 shadow-lg dark:bg-zinc-800">
            {story.coverUrl ? (
              <Image
                src={story.coverUrl}
                alt={story.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                <FilePenLine className="h-10 w-10 text-white/40" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {story.title}
          </h1>

          <Link
            href={`/profile/${story.author.username}`}
            className="inline-flex items-center gap-3 group"
          >
            {story.author.avatarUrl ? (
              <Image
                src={story.author.avatarUrl}
                alt={story.author.displayName || story.author.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-semibold text-white">
                {(story.author.displayName || story.author.username)[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                {story.author.displayName || story.author.username}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {story.author._count.followers} followers
              </p>
            </div>
          </Link>

          {story.summary && (
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {story.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {story.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {story.chapters.length} chapters
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {story._count.comments} comments
            </span>
            <span className="text-xs">Published {formatDate(story.createdAt)}</span>
          </div>

          <ReactionBar
            storyId={story.id}
            initialReactions={reactions}
            initialUserReaction={userReaction?.reactionType ?? null}
          />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Chapters
        </h2>
        {story.chapters.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No chapters published yet.
          </p>
        ) : (
          <div className="space-y-1">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/stories/${story.id}/chapters/${chapter.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {chapter.chapterOrder}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {chapter.title}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </Link>
            ))}
          </div>
        )}

        {story.chapters.length > 0 && (
          <div className="mt-4">
            <Link
              href={`/stories/${story.id}/chapters/${story.chapters[0].id}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <BookOpen className="h-4 w-4" />
              Start Reading
            </Link>
          </div>
        )}
      </section>

      <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <CommentSection storyId={story.id} currentUserId={currentUserId ?? undefined} />
      </section>
    </main>
  );
}
