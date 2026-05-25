import { NextResponse } from "next/server";
import { search } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = (searchParams.get("type") as "all" | "books" | "stories" | "universes" | "authors") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    if (!q.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const searchQuery = q.trim();
    const results = [];
    let total = 0;
    let usingMeilisearch = false;

    // 1. Try Meilisearch for books & stories if applicable
    if (type === "all" || type === "books" || type === "stories") {
      const meiliType = type === "all" ? "all" : type;
      const meiliResult = await search(searchQuery, { type: meiliType, page, limit });

      if (meiliResult.meilisearchAvailable && meiliResult.results.length > 0) {
        results.push(...meiliResult.results);
        total = meiliResult.total;
        usingMeilisearch = true;
      }
    }

    // 2. If using Meilisearch and type is 'all', append universes and authors from Prisma
    if (usingMeilisearch && type === "all") {
      const [prismaUniverses, prismaAuthors] = await Promise.all([
        prisma.universe.findMany({
          where: {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
              { genre: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            description: true,
            genre: true,
            coverUrl: true,
            createdAt: true,
            user: {
              select: { displayName: true, username: true },
            },
            _count: {
              select: { stories: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: Math.ceil(limit / 4),
        }),
        prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: searchQuery, mode: "insensitive" } },
              { displayName: { contains: searchQuery, mode: "insensitive" } },
              { bio: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: Math.ceil(limit / 4),
        })
      ]);

      results.push(...prismaUniverses.map(uni => ({
        ...uni,
        _type: "universe" as const,
        creatorName: uni.user.displayName || uni.user.username,
        storyCount: uni._count.stories,
        createdAt: uni.createdAt.toISOString(),
      })));

      results.push(...prismaAuthors.map(author => ({
        ...author,
        _type: "author" as const,
        createdAt: author.createdAt.toISOString(),
      })));

      total = results.length;
    }

    // 3. Fallback to Prisma completely if Meilisearch not used or for universes/authors specific types
    if (!usingMeilisearch) {
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
            take: type === "all" ? Math.ceil(limit / 4) : limit,
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
            take: type === "all" ? Math.ceil(limit / 4) : limit,
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

      if (type === "all" || type === "universes") {
        const [universes, universeCount] = await Promise.all([
          prisma.universe.findMany({
            where: {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
                { genre: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
            select: {
              id: true,
              name: true,
              description: true,
              genre: true,
              coverUrl: true,
              createdAt: true,
              user: {
                select: { displayName: true, username: true },
              },
              _count: {
                select: { stories: true }
              }
            },
            orderBy: { createdAt: "desc" },
            take: type === "all" ? Math.ceil(limit / 4) : limit,
            skip: type === "all" ? 0 : (page - 1) * limit,
          }),
          type === "universes" ? prisma.universe.count({
            where: {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
                { genre: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
          }) : Promise.resolve(0),
        ]);

        results.push(...universes.map(uni => ({
          ...uni,
          _type: "universe" as const,
          creatorName: uni.user.displayName || uni.user.username,
          storyCount: uni._count.stories,
          createdAt: uni.createdAt.toISOString(),
        })));

        if (type === "universes") total = universeCount;
      }

      if (type === "all" || type === "authors") {
        const [authors, authorCount] = await Promise.all([
          prisma.user.findMany({
            where: {
              OR: [
                { username: { contains: searchQuery, mode: "insensitive" } },
                { displayName: { contains: searchQuery, mode: "insensitive" } },
                { bio: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
              role: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: type === "all" ? Math.ceil(limit / 4) : limit,
            skip: type === "all" ? 0 : (page - 1) * limit,
          }),
          type === "authors" ? prisma.user.count({
            where: {
              OR: [
                { username: { contains: searchQuery, mode: "insensitive" } },
                { displayName: { contains: searchQuery, mode: "insensitive" } },
                { bio: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
          }) : Promise.resolve(0),
        ]);

        results.push(...authors.map(author => ({
          ...author,
          _type: "author" as const,
          createdAt: author.createdAt.toISOString(),
        })));

        if (type === "authors") total = authorCount;
      }

      if (type === "all") {
        total = results.length;
      }
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      results,
      total,
      page,
      totalPages,
      source: usingMeilisearch ? "mixed" : "prisma",
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
