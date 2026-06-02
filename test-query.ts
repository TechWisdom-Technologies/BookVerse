import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tsQueryString = "amar:*";
  const tsBanglaQueryString = "আমার:*";
  const englishSearchExp = Prisma.sql`to_tsquery('english', ${tsQueryString})`;
  const banglaSqlExtension = Prisma.sql`|| to_tsquery('english', ${tsBanglaQueryString})`;
  const searchQuery = "amar";

  const query = Prisma.sql`
    SELECT id, title
    FROM stories s
    WHERE (
      setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
      setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(s.search_index, '')), 'C')
    ) @@ (${englishSearchExp} ${banglaSqlExtension})
  `;
  
  console.log(query.sql);
  const res = await prisma.$queryRaw(query);
  console.log("Found:", res);
}

main().finally(() => prisma.$disconnect());
