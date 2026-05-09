import Link from "next/link";
import { PenLine, Feather } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { StoryFilters } from "@/components/stories/StoryFilters";
import { Pagination } from "@/components/shared/Pagination";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const storyGenres = [
  "Adventure",
  "Fantasy",
  "Fiction",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
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
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            reactions: true,
            comments: true,
          },
        },
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
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        
        {/* Huge Clean Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
                Voices.
              </h1>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Discover brilliant original stories, crafted by our community of independent writers and creators.
              </p>
            </div>
            <Link
              href="/write/new"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-brand text-white rounded-full font-bold text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 transition-all duration-300 shrink-0"
            >
              <PenLine className="w-5 h-5" />
              Start Writing
            </Link>
          </div>
        </header>

        {/* Minimal Divider */}
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />

        {/* Filters and Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <StoryFilters genres={storyGenres} />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {total} Active Stories
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          <StoryGrid stories={serializedStories} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} basePath="/stories" />
          </div>
        )}
      </div>
    </main>
  );
}
