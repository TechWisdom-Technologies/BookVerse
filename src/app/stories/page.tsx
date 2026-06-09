import Link from "next/link";
import { PenLine, Feather, ArrowLeft, Loader2, Sparkles, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { StoryFilters } from "@/components/stories/StoryFilters";
import { Pagination } from "@/components/shared/Pagination";
import type { Prisma } from "@prisma/client";
import { StoryRecommendations } from "@/components/stories/StoryRecommendations";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { ContinueReadingDashboard } from "@/components/home/ContinueReadingDashboard";
import { getSortedStoryIds } from "@/lib/story-ranking";

export const dynamic = "force-dynamic";

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

const storyGenres = [
  "Adventure", "Fantasy", "Fiction", "Horror", "Mystery", "Romance", "Science Fiction", "Thriller",
];

interface StoriesPageProps {
  searchParams: Promise<{
    genre?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10));
  const sort = params.sort || "popular";
  const genre = params.genre || "";
  const limit = 12;
  const skip = (page - 1) * limit;

  const { ids: rankedStoryIds, total } = await getSortedStoryIds(genre, sort);
  const paginatedIds = rankedStoryIds.slice(skip, skip + limit);

  const currentUserId = await getCurrentUserId();

  const [storiesUnsorted, recentProgress, recentBookBookmarks, activePromotions] = await Promise.all([
    prisma.story.findMany({
      where: { id: { in: paginatedIds } },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        series: { select: { name: true } },
        universe: { select: { name: true } },
        _count: { select: { chapters: true, reactions: true, comments: true } },
      },
    }),
    currentUserId
      ? prisma.readingProgress.findMany({
          where: { userId: currentUserId },
          orderBy: { updatedAt: "desc" },
          take: 10,
        })
      : Promise.resolve([]),
    currentUserId
      ? prisma.bookAnnotation.findMany({
          where: { userId: currentUserId, type: "BOOKMARK" },
          orderBy: { updatedAt: "desc" },
          take: 10,
          include: {
            book: true,
          },
        })
      : Promise.resolve([]),
    prisma.storyPromotion.findMany({
      where: {
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      select: {
        storyId: true,
        tier: true,
      },
    }),
  ]);

  // Fetch stories for recent progress manually to avoid relation dynamic compilation issues
  const progressStoryIds = recentProgress.map((p) => p.storyId);
  const storiesForProgress = progressStoryIds.length > 0
    ? await prisma.story.findMany({
        where: { id: { in: progressStoryIds } },
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          chapters: {
            orderBy: { chapterOrder: "asc" },
            select: { id: true, title: true, chapterOrder: true },
          },
          _count: { select: { chapters: true, reactions: true, comments: true } },
        },
      })
    : [];

  const recentProgressWithStories = recentProgress.map((prog) => {
    const story = storiesForProgress.find((s) => s.id === prog.storyId);
    if (!story) return null;

    const currentChapterIndex = story.chapters.findIndex((c) => c.id === prog.chapterId);
    const isLastChapter = currentChapterIndex === story.chapters.length - 1;
    const nextChapter = currentChapterIndex < story.chapters.length - 1 ? story.chapters[currentChapterIndex + 1] : null;
    
    const isCompleted = prog.percentage >= 98 && isLastChapter;

    return {
      ...prog,
      story,
      nextChapter,
      isCompleted,
    };
  })
  .filter((item): item is NonNullable<typeof item> => !!item && !item.isCompleted)
  .slice(0, 4); // Show only the last 4 incomplete read stories!

  const uniqueBookBookmarksMap = new Map();
  recentBookBookmarks.forEach((bookmark) => {
    if (!uniqueBookBookmarksMap.has(bookmark.bookId)) {
      uniqueBookBookmarksMap.set(bookmark.bookId, bookmark);
    }
  });
  const uniqueBookBookmarks = Array.from(uniqueBookBookmarksMap.values()).slice(0, 4); // Show only the last 4 bookmarked books!

  const stories = paginatedIds
    .map(id => storiesUnsorted.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const totalPages = Math.ceil(total / limit);

  const serializedStories = stories.map(story => {
    const storyPromos = activePromotions.filter((ap) => ap.storyId === story.id);
    const hasTrending = storyPromos.some(p => p.tier === 'TRENDING');
    const hasPromoted = storyPromos.some(p => p.tier === 'PROMOTED');
    const hasFeatured = storyPromos.some(p => p.tier === 'FEATURED');

    return {
      ...story,
      createdAt: story.createdAt.toISOString(),
      isTrendingPromo: hasTrending,
      isPromotedPromo: !hasTrending && hasPromoted,
      isFeaturedPromo: !hasTrending && !hasPromoted && hasFeatured
    };
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Community Stories.</h1>
              <p className="text-xs text-zinc-500 font-medium">Read original stories shared by independent authors across the BookVerse.</p>
            </div>
          </div>
          <Link href="/write/new" className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
            <PenLine className="w-3.5 h-3.5" />
            Start a Story
          </Link>
        </header>

        {/* Dynamic Curation Engine */}
        <div className="mb-16">
          <StoryRecommendations />
        </div>

        {/* Continue Reading Section */}
        <ContinueReadingDashboard
          initialStories={recentProgressWithStories}
          initialBooks={uniqueBookBookmarks}
        />

        {/* Simple Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <StoryFilters genres={storyGenres} />
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
            <Activity className="w-3 h-3 text-zinc-300" />
            {total} Stories Found
          </div>
        </div>

        {/* Story Grid */}
        <div className="min-h-[400px]">
          <StoryGrid stories={serializedStories} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-24 pt-12 border-t border-zinc-50 dark:border-zinc-900 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} basePath="/stories" />
          </div>
        )}
      </div>
    </main>
  );
}
