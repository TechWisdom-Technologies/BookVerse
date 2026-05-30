import { NextResponse } from "next/server";
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
    const results: any[] = [];
    let total = 0;
    
    // We will do parallel fetches depending on type.
    const promises = [];

    // --- BOOKS ---
    if (type === "all" || type === "books") {
      promises.push(
        (async () => {
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
              orderBy: { downloadCount: "desc" },
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
        })()
      );
    }

    // --- STORIES (FIVERR STYLE RANKING) ---
    if (type === "all" || type === "stories") {
      promises.push(
        (async () => {
          const take = type === "all" ? Math.ceil(limit / 4) : limit;
          const skip = type === "all" ? 0 : (page - 1) * limit;

          // PostgreSQL Raw Query for Full Text Search with Weights and Promotion Score
          const storiesRaw = await prisma.$queryRaw`
            SELECT 
              s.id, 
              s.title, 
              s.summary, 
              s.cover_url AS "coverUrl",
              s.published,
              s.created_at AS "createdAt",
              s.view_count AS "viewCount",
              s.promotion_score AS "promotionScore",
              u.display_name AS "authorDisplayName",
              u.username AS "authorUsername",
              ts_rank_cd(
                setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                setweight(to_tsvector('english', coalesce(s.search_index, '')), 'C'),
                plainto_tsquery('english', ${searchQuery})
              ) AS rank
            FROM stories s
            JOIN users u ON u.id = s.author_id
            WHERE s.published = true
              AND (
                ${searchQuery} = '' OR 
                (
                  setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                  setweight(to_tsvector('english', coalesce(s.search_index, '')), 'C')
                ) @@ plainto_tsquery('english', ${searchQuery})
              )
            ORDER BY 
              s.promotion_score DESC, 
              rank DESC, 
              s.view_count DESC
            LIMIT ${take} OFFSET ${skip};
          ` as any[];

          let storyCount = 0;
          if (type === "stories") {
            const countRaw = await prisma.$queryRaw`
              SELECT COUNT(*)
              FROM stories s
              WHERE s.published = true
                AND (
                  ${searchQuery} = '' OR 
                  (
                    setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                    setweight(to_tsvector('english', coalesce(s.search_index, '')), 'C')
                  ) @@ plainto_tsquery('english', ${searchQuery})
                )
            ` as any[];
            storyCount = Number(countRaw[0]?.count || 0);
          }

          results.push(...storiesRaw.map(story => ({
            id: story.id,
            title: story.title,
            summary: story.summary,
            coverUrl: story.coverUrl,
            published: story.published,
            viewCount: story.viewCount,
            promotionScore: story.promotionScore,
            _type: "story" as const,
            authorName: story.authorDisplayName || story.authorUsername,
            createdAt: new Date(story.createdAt).toISOString(),
          })));

          if (type === "stories") total = storyCount;
        })()
      );
    }

    // --- UNIVERSES ---
    if (type === "all" || type === "universes") {
      promises.push(
        (async () => {
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
        })()
      );
    }

    // --- AUTHORS ---
    if (type === "all" || type === "authors") {
      promises.push(
        (async () => {
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
        })()
      );
    }

    // Wait for all queries to resolve
    await Promise.all(promises);

    if (type === "all") {
      // Re-sort results for 'all' to mix them reasonably, prioritizing promoted stories if any exist
      results.sort((a, b) => {
        const scoreA = a.promotionScore || 0;
        const scoreB = b.promotionScore || 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      total = results.length;
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      results,
      total,
      page,
      totalPages,
      source: "prisma-fts",
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
