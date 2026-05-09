import Link from "next/link";
import { PenLine, Feather, ArrowLeft, Loader2, Sparkles, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { StoryFilters } from "@/components/stories/StoryFilters";
import { Pagination } from "@/components/shared/Pagination";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

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
  const sort = params.sort || "recent";
  const genre = params.genre || "";
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Prisma.StoryWhereInput = { published: true };
  if (genre) {
    where.OR = [
      { title: { contains: genre, mode: "insensitive" } },
      { summary: { contains: genre, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.StoryOrderByWithRelationInput =
    sort === "popular"
      ? { viewCount: "desc" }
      : sort === "reactions"
        ? { reactions: { _count: "desc" } }
        : { createdAt: "desc" };

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { chapters: true, reactions: true, comments: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.story.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const serializedStories = stories.map((story) => ({
    ...story,
    createdAt: story.createdAt.toISOString(),
  }));

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
