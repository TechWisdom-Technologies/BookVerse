import Link from "next/link";
import { PenLine } from "lucide-react";
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
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Community Stories
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Discover original stories written by the community.
          </p>
        </div>
        <Link
          href="/write/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <PenLine className="h-4 w-4" />
          Start Writing
        </Link>
      </div>

      <div className="mt-6">
        <StoryFilters genres={storyGenres} />
      </div>

      <div className="mt-8">
        <StoryGrid stories={serializedStories} />
      </div>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} basePath="/stories" />
        </div>
      )}
    </main>
  );
}
