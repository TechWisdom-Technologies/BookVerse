import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = Prisma.sql`
    SELECT id, title
    FROM stories s
    WHERE (
      setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(array_to_string(s.tags, ' '), '')), 'A') ||
      setweight(to_tsvector('english', coalesce(s.summary, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(s.search_index, '')), 'C')
    ) @@ to_tsquery('english', 'amar:*')
  `;
  const res = await prisma.$queryRaw(query);
  console.log(res);
}

main().finally(() => prisma.$disconnect());
