import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { parse } from "@subhesadek/avro-phonetic";

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
    const searchTerms = new Set<string>();
    searchTerms.add(searchQuery);

    const avroParsed1 = parse(searchQuery)?.bangla;
    if (avroParsed1 && avroParsed1 !== searchQuery) searchTerms.add(avroParsed1);

    const capitalizedQuery = searchQuery.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const avroParsed2 = parse(capitalizedQuery)?.bangla;
    if (avroParsed2 && avroParsed2 !== capitalizedQuery) searchTerms.add(avroParsed2);

    const allSearchTerms = Array.from(searchTerms);

    const formatTsQuery = (text: string) => {
      const words = text.replace(/[^\w\s\u0980-\u09FF]/g, ' ').trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return '';
      return words.map(w => `${w}:*`).join(' & ');
    };

    const tsQueryString = formatTsQuery(searchQuery);


    const englishSearchExp = tsQueryString 
      ? Prisma.sql`to_tsquery('english', ${tsQueryString})` 
      : Prisma.sql`plainto_tsquery('english', ${searchQuery})`;

    const banglaSqlExtension = Prisma.join(
      allSearchTerms.map(term => Prisma.sql`
          OR s.title ILIKE ${'%' + term + '%'}
          OR si.content ILIKE ${'%' + term + '%'}
          OR s.summary ILIKE ${'%' + term + '%'}
          OR array_to_string(s.tags, ' ') ILIKE ${'%' + term + '%'}
      `),
      ' '
    );

    const banglaRankBoost = Prisma.join(
      allSearchTerms.map(term => Prisma.sql`
          + CASE 
              WHEN s.title ILIKE ${'%' + term + '%'} THEN 2.0
              WHEN si.content ILIKE ${'%' + term + '%'} THEN 1.5
              WHEN s.summary ILIKE ${'%' + term + '%'} THEN 1.0
              WHEN array_to_string(s.tags, ' ') ILIKE ${'%' + term + '%'} THEN 1.0
              ELSE 0.0
            END
      `),
      ' '
    );

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
                OR: allSearchTerms.flatMap(term => [
                  { title: { contains: term, mode: "insensitive" as const } },
                  { authorName: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                ]),
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
                OR: allSearchTerms.flatMap(term => [
                  { title: { contains: term, mode: "insensitive" as const } },
                  { authorName: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                ]),
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
          const storiesQuery = Prisma.sql`
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
              (
                ts_rank_cd(
                  setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                  setweight(to_tsvector('english', coalesce(si.content, '')), 'C'),
                  ${englishSearchExp}
                )
                ${banglaRankBoost}
              ) AS rank
            FROM stories s
            JOIN users u ON u.id = s.author_id
            LEFT JOIN story_search_index si ON si.story_id = s.id
            WHERE s.published = true
              AND (
                ${searchQuery} = '' OR 
                (
                  setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                  setweight(to_tsvector('english', coalesce(si.content, '')), 'C')
                ) @@ (${englishSearchExp})
                ${banglaSqlExtension}
              )
            ORDER BY 
              CASE 
                WHEN s.promotion_score = 200 THEN 1000
                WHEN s.promotion_score = 500 THEN 900
                WHEN s.promotion_score = 100 THEN 800
                ELSE s.promotion_score
              END DESC, 
              rank DESC, 
              s.view_count DESC
            LIMIT ${take} OFFSET ${skip};
          `;
          const storiesRaw = await prisma.$queryRaw(storiesQuery) as any[];

          let storyCount = 0;
          if (type === "stories") {
            const countQuery = Prisma.sql`
              SELECT COUNT(*)
              FROM stories s
              LEFT JOIN story_search_index si ON si.story_id = s.id
              WHERE s.published = true
                AND (
                  ${searchQuery} = '' OR 
                  (
                    setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                    setweight(to_tsvector('english', coalesce(si.content, '')), 'C')
                  ) @@ (${englishSearchExp})
                  ${banglaSqlExtension}
                )
            `;
            const countRaw = await prisma.$queryRaw(countQuery) as any[];
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
                OR: allSearchTerms.flatMap(term => [
                  { name: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                ]),
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
                OR: allSearchTerms.flatMap(term => [
                  { name: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                ]),
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
                OR: allSearchTerms.flatMap(term => [
                  { username: { contains: term, mode: "insensitive" as const } },
                  { displayName: { contains: term, mode: "insensitive" as const } },
                  { bio: { contains: term, mode: "insensitive" as const } },
                ]),
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
                OR: allSearchTerms.flatMap(term => [
                  { username: { contains: term, mode: "insensitive" as const } },
                  { displayName: { contains: term, mode: "insensitive" as const } },
                  { bio: { contains: term, mode: "insensitive" as const } },
                ]),
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
      // Re-sort results for 'all' to prioritize promoted stories, then order by type, then by creation date
      const typeWeight: Record<string, number> = {
        story: 4,
        book: 3,
        universe: 2,
        author: 1
      };

      results.sort((a, b) => {
        const getRankScore = (score: number) => {
          if (score === 200) return 1000;
          if (score === 500) return 900;
          if (score === 100) return 800;
          return score;
        };
        
        const scoreA = getRankScore(a.promotionScore || 0);
        const scoreB = getRankScore(b.promotionScore || 0);
        
        // 1. Promoted/Featured/Trending first
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // 2. Stories -> Books -> Universes -> Authors
        const weightA = typeWeight[a._type] || 0;
        const weightB = typeWeight[b._type] || 0;
        if (weightA !== weightB) return weightB - weightA;
        
        // 3. Finally, sort by recency
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
