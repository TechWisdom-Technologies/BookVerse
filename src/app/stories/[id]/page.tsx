import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactionType } from "@prisma/client";
import { BookOpen, ChevronRight, Eye, FilePenLine, MessageSquare, ArrowLeft, Clock } from "lucide-react";
import { CommentSection } from "@/components/comments/CommentSection";
import { ReactionBar } from "@/components/stories/ReactionBar";
import { StoryViewTracker } from "@/components/stories/StoryViewTracker";
import { TipAuthorDialog } from "@/components/stories/TipAuthorDialog";
import { StoryFeatureActions } from "@/components/stories/StoryFeatureActions";
import { PromotionBadge } from "@/components/promotions/PromotionBadge";
import { StoryRecommendations } from "@/components/stories/StoryRecommendations";
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
  if (!story || !story.published) return { title: "Story not found" };
  return {
    title: story.title,
    description: story.summary || "Read this story on BookVerse",
  };
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

function estimateReadingTime(content: any): number {
  if (!content) return 1;
  
  function countWords(node: any): number {
    if (!node) return 0;
    let count = 0;
    if (node.type === "text" && typeof node.text === "string") {
      count += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        count += countWords(child);
      }
    }
    return count;
  }

  const words = countWords(content);
  return Math.max(1, Math.ceil(words / 200));
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { id } = await params;
  const currentUserId = await getCurrentUserId();

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true, _count: { select: { followers: true, following: true } } } },
      chapters: { orderBy: { chapterOrder: "asc" }, select: { id: true, title: true, chapterOrder: true, createdAt: true, content: true } },
      promotions: {
        where: { status: "ACTIVE", endDate: { gt: new Date() } },
        orderBy: { endDate: "asc" },
        select: { id: true, tier: true, endDate: true },
      },
      _count: { select: { reactions: true, comments: true } },
    },
  });

  if (!story || !story.published) notFound();

  const readingProgress = currentUserId
    ? await prisma.readingProgress.findUnique({
        where: {
          userId_storyId: {
            userId: currentUserId,
            storyId: id,
          },
        },
      })
    : null;

  const resumeChapter = readingProgress
    ? story.chapters.find((c) => c.id === readingProgress.chapterId)
    : null;

  const reactionCounts = await prisma.storyReaction.groupBy({ by: ["reactionType"], where: { storyId: id }, _count: true });
  const reactions: Record<ReactionType, number> = { LIKE: 0, LOVE: 0, FIRE: 0, CRY: 0, WOW: 0 };
  for (const reaction of reactionCounts) { reactions[reaction.reactionType] = reaction._count; }
  const userReaction = currentUserId ? await prisma.storyReaction.findUnique({ where: { storyId_userId: { storyId: id, userId: currentUserId } }, select: { reactionType: true } }) : null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <StoryViewTracker storyId={story.id} />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Minimal Navigation */}
        <div className="mb-12">
          <Link href="/stories" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Story Archives
          </Link>
        </div>

        {/* Story Header Dossier */}
        <div className="flex flex-col md:flex-row gap-12 mb-16 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          <div className="shrink-0">
            <div className="relative aspect-[2/3] w-48 rounded-md overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              {story.coverUrl ? (
                <Image src={story.coverUrl} alt={story.title} fill className="object-cover" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-10">
                  <FilePenLine className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">{story.title}</h1>
              {story.promotions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.promotions.map((promotion) => (
                    <PromotionBadge key={promotion.id} tier={promotion.tier} endDate={promotion.endDate.toISOString()} />
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <Link href={`/profile/${story.author.username}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    {story.author.avatarUrl ? (
                      <Image src={story.author.avatarUrl} alt="" width={32} height={32} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px] uppercase">{story.author.username[0]}</div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    {story.author.displayName || story.author.username}
                  </span>
                </Link>
                {currentUserId !== story.author.id && (
                  <TipAuthorDialog authorId={story.author.id} authorName={story.author.displayName || story.author.username} storyId={story.id} />
                )}
              </div>
            </div>

            {story.summary && (
              <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl font-medium">
                {story.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {story.viewCount}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {story.chapters.length} Chapters</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {story._count.comments}</span>
              <span className="text-[9px] font-mono">{formatDate(story.createdAt)}</span>
            </div>

            <div className="pt-2">
              <ReactionBar storyId={story.id} initialReactions={reactions} initialUserReaction={userReaction?.reactionType ?? null} />
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Narrative Chapters
            </h2>
            {story.chapters.length > 0 && (
              <div className="flex gap-3">
                {resumeChapter ? (
                  <Link href={`/stories/${story.id}/chapters/${resumeChapter.id}`} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all shadow hover:shadow-md">
                    Resume ({Math.round(readingProgress!.percentage)}%)
                  </Link>
                ) : null}
                <Link href={`/stories/${story.id}/chapters/${story.chapters[0].id}`} className="px-5 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                  Start From Beginning
                </Link>
              </div>
            )}
          </div>

          {story.chapters.length === 0 ? (
            <p className="text-xs font-medium text-zinc-400 italic">No historical records in the chapter registry.</p>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              {story.chapters.map((chapter) => {
                const readTime = estimateReadingTime(chapter.content);
                return (
                  <Link key={chapter.id} href={`/stories/${story.id}/chapters/${chapter.id}`} className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold font-mono text-zinc-300">
                        {chapter.chapterOrder.toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {chapter.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-300" />
                        {readTime} min read
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Interaction Section */}
        <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Interaction Feed</h2>
          </div>
          <CommentSection storyId={story.id} currentUserId={currentUserId ?? undefined} />
        </section>

        {/* Dynamic Recommendations Engine */}
        <div className="mt-20">
          <StoryRecommendations />
        </div>

        <StoryFeatureActions storyId={story.id} authorId={story.author.id} currentUserId={currentUserId} />
      </div>
    </main>
  );
}
