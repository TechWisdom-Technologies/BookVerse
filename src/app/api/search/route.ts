import { NextResponse } from "next/server";
import { search } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = (searchParams.get("type") as "all" | "books" | "stories") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    if (!q.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Try Meilisearch first
    const meiliResult = await search(q, { type, page, limit });

    if (meiliResult.meilisearchAvailable && meiliResult.results.length > 0) {
      return NextResponse.json({
        results: meiliResult.results,
        total: meiliResult.total,
        page: meiliResult.page,
        totalPages: meiliResult.totalPages,
        source: "meilisearch",
      });
    }

    // Fallback to Prisma if Meilisearch unavailable or no results
    const searchQuery = q.trim();
    const results = [];
    let total = 0;

    if (type === "all" || type === "books") {
      const [books, bookCount] = await Promise.all([
        prisma.book.findMany({
          where: {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { authorName: { contains: searchQuery, mode: "insensitive" } },
              { genre: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            title: true,
            authorName: true,
            genre: true,
            language: true,
            description: true,
            coverUrl: true,
            fileType: true,
            createdAt: true,
            downloadCount: true,
          },
          orderBy: { createdAt: "desc" },
          take: type === "all" ? Math.ceil(limit / 2) : limit,
          skip: type === "all" ? 0 : (page - 1) * limit,
        }),
        type === "books" ? prisma.book.count({
          where: {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { authorName: { contains: searchQuery, mode: "insensitive" } },
              { genre: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        }) : Promise.resolve(0),
      ]);

      results.push(...books.map(book => ({
        ...book,
        _type: "book" as const,
        createdAt: book.createdAt.toISOString(),
      })));

      if (type === "books") total = bookCount;
    }

    if (type === "all" || type === "stories") {
      const [stories, storyCount] = await Promise.all([
        prisma.story.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { summary: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            title: true,
            summary: true,
            coverUrl: true,
            published: true,
            createdAt: true,
            viewCount: true,
            author: {
              select: { displayName: true, username: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: type === "all" ? Math.ceil(limit / 2) : limit,
          skip: type === "all" ? 0 : (page - 1) * limit,
        }),
        type === "stories" ? prisma.story.count({
          where: {
            published: true,
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { summary: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        }) : Promise.resolve(0),
      ]);

      results.push(...stories.map(story => ({
        ...story,
        _type: "story" as const,
        authorName: story.author.displayName || story.author.username,
        createdAt: story.createdAt.toISOString(),
      })));

      if (type === "stories") total = storyCount;
    }

    if (type === "all") {
      total = results.length;
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      results,
      total,
      page,
      totalPages,
      source: "prisma",
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
