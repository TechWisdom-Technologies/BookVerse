import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { parse } from "@subhesadek/avro-phonetic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = (searchParams.get("type") as "all" | "books" | "stories" | "universes" | "authors" | "series" | "clubs") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    
    const tagsParam = searchParams.get("tags");
    const subGenresParam = searchParams.get("subGenres");
    const moodParam = searchParams.get("mood");
    const ageRatingParam = searchParams.get("ageRating");

    if (!q.trim() && !tagsParam && !subGenresParam && !moodParam && !ageRatingParam) {
      return NextResponse.json(
        { error: "At least one search parameter (q, tags, subGenres, etc.) is required" },
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
    const counts = { books: 0, stories: 0, universes: 0, authors: 0, series: 0, clubs: 0 };

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
              take: type === "all" ? Math.ceil(limit / 6) : limit,
              skip: type === "all" ? 0 : (page - 1) * limit,
            }),
            type === "all" || type === "books" ? prisma.book.count({
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
          counts.books = bookCount;
          if (type === "books") total = bookCount;
        })()
      );
    }

    // --- STORIES (FIVERR STYLE RANKING) ---
    if (type === "all" || type === "stories") {
      promises.push(
        (async () => {
          const take = type === "all" ? Math.ceil(limit / 6) : limit;
          const skip = type === "all" ? 0 : (page - 1) * limit;

          const tagsArray = tagsParam ? tagsParam.split(",").map(t => t.trim()) : [];
          const subGenresArray = subGenresParam ? subGenresParam.split(",").map(sg => sg.trim()) : [];
          
          const tagsFilter = tagsArray.length > 0 
            ? Prisma.sql`AND s.tags @> ARRAY[${Prisma.join(tagsArray)}]::text[]` 
            : Prisma.empty;
            
          const subGenresFilter = subGenresArray.length > 0 
            ? Prisma.sql`AND s."subGenres" @> ARRAY[${Prisma.join(subGenresArray)}]::text[]` 
            : Prisma.empty;
            
          const moodFilter = moodParam ? Prisma.sql`AND s.mood = ${moodParam}` : Prisma.empty;
          const ageRatingFilter = ageRatingParam ? Prisma.sql`AND s."ageRating" = ${parseInt(ageRatingParam, 10)}` : Prisma.empty;

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
              (
                SELECT sp.tier 
                FROM story_promotions sp 
                WHERE sp.story_id = s.id AND sp.status = 'ACTIVE' AND sp.end_date > NOW()
                ORDER BY CASE sp.tier WHEN 'PROMOTED' THEN 2 WHEN 'FEATURED' THEN 1 ELSE 0 END DESC
                LIMIT 1
              ) AS "activeTier",
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
              ${tagsFilter}
              ${subGenresFilter}
              ${moodFilter}
              ${ageRatingFilter}
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
              CASE (
                SELECT sp.tier 
                FROM story_promotions sp 
                WHERE sp.story_id = s.id AND sp.status = 'ACTIVE' AND sp.end_date > NOW()
                ORDER BY CASE sp.tier WHEN 'PROMOTED' THEN 2 WHEN 'FEATURED' THEN 1 ELSE 0 END DESC
                LIMIT 1
              )
                WHEN 'PROMOTED' THEN 2
                WHEN 'FEATURED' THEN 1
                ELSE 0
              END DESC,
              ((
                ts_rank_cd(
                  setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
                  setweight(to_tsvector('english', coalesce(si.content, '')), 'C'),
                  ${englishSearchExp}
                )
                ${banglaRankBoost}
              ) + COALESCE(s.promotion_score, 0)) DESC, 
              s.view_count DESC
            LIMIT ${take} OFFSET ${skip};
          `;
          const storiesRaw = await prisma.$queryRaw(storiesQuery) as any[];

          let storyCount = 0;
          if (type === "all" || type === "stories") {
            const countQuery = Prisma.sql`
              SELECT COUNT(*)
              FROM stories s
              LEFT JOIN story_search_index si ON si.story_id = s.id
              WHERE s.published = true
                ${tagsFilter}
                ${subGenresFilter}
                ${moodFilter}
                ${ageRatingFilter}
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
            activeTier: story.activeTier,
            _type: "story" as const,
            authorName: story.authorDisplayName || story.authorUsername,
            createdAt: new Date(story.createdAt).toISOString(),
          })));

          counts.stories = storyCount;
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
              take: type === "all" ? Math.ceil(limit / 6) : limit,
              skip: type === "all" ? 0 : (page - 1) * limit,
            }),
            type === "all" || type === "universes" ? prisma.universe.count({
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
          counts.universes = universeCount;
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
              take: type === "all" ? Math.ceil(limit / 6) : limit,
              skip: type === "all" ? 0 : (page - 1) * limit,
            }),
            type === "all" || type === "authors" ? prisma.user.count({
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
          counts.authors = authorCount;
          if (type === "authors") total = authorCount;
        })()
      );
    }

    // --- SERIES ---
    if (type === "all" || type === "series") {
      promises.push(
        (async () => {
          const [seriesList, seriesCount] = await Promise.all([
            prisma.series.findMany({
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
                coverUrl: true,
                genre: true,
                sequenceType: true,
                status: true,
                createdAt: true,
                user: {
                  select: { displayName: true, username: true },
                },
                _count: {
                  select: { stories: true }
                }
              },
              orderBy: { createdAt: "desc" },
              take: type === "all" ? Math.ceil(limit / 6) : limit,
              skip: type === "all" ? 0 : (page - 1) * limit,
            }),
            type === "all" || type === "series" ? prisma.series.count({
              where: {
                OR: allSearchTerms.flatMap(term => [
                  { name: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                ]),
              },
            }) : Promise.resolve(0),
          ]);
          results.push(...seriesList.map(series => ({
            ...series,
            _type: "series" as const,
            creatorName: series.user.displayName || series.user.username,
            storyCount: series._count.stories,
            createdAt: series.createdAt.toISOString(),
          })));
          counts.series = seriesCount;
          if (type === "series") total = seriesCount;
        })()
      );
    }

    // --- CLUBS ---
    if (type === "all" || type === "clubs") {
      promises.push(
        (async () => {
          const [clubsList, clubsCount] = await Promise.all([
            prisma.club.findMany({
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
                coverUrl: true,
                genre: true,
                createdAt: true,
                owner: {
                  select: { displayName: true, username: true },
                },
                _count: {
                  select: { members: true, discussions: true }
                }
              },
              orderBy: { createdAt: "desc" },
              take: type === "all" ? Math.ceil(limit / 6) : limit,
              skip: type === "all" ? 0 : (page - 1) * limit,
            }),
            type === "all" || type === "clubs" ? prisma.club.count({
              where: {
                OR: allSearchTerms.flatMap(term => [
                  { name: { contains: term, mode: "insensitive" as const } },
                  { description: { contains: term, mode: "insensitive" as const } },
                  { genre: { contains: term, mode: "insensitive" as const } },
                ]),
              },
            }) : Promise.resolve(0),
          ]);
          results.push(...clubsList.map(club => ({
            ...club,
            _type: "club" as const,
            creatorName: club.owner.displayName || club.owner.username,
            memberCount: club._count.members,
            createdAt: club.createdAt.toISOString(),
          })));
          counts.clubs = clubsCount;
          if (type === "clubs") total = clubsCount;
        })()
      );
    }

    // Wait for all queries to resolve
    await Promise.all(promises);

    if (type === "all") {
      // Re-sort results for 'all' to prioritize promoted stories, then order by type, then by creation date
      const typeWeight: Record<string, number> = {
        story: 6,
        series: 5,
        book: 4,
        universe: 3,
        club: 2,
        author: 1
      };

      results.sort((a, b) => {
        // 1. Promoted/Featured active stories first
        const getTierScore = (tier?: string) => {
          if (tier === 'PROMOTED') return 2;
          if (tier === 'FEATURED') return 1;
          return 0;
        };
        const scoreA = getTierScore(a.activeTier);
        const scoreB = getTierScore(b.activeTier);
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
      counts,
      page,
      totalPages,
      source: "prisma-fts",
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
