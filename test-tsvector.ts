import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = Prisma.sql`
    SELECT to_tsvector('english', 'আমার সোনার বাংলা')::text as vec, to_tsquery('english', 'আমার:*')::text as q;
  `;
  const res = await prisma.$queryRaw(query);
  console.log(res);
}

main().finally(() => prisma.$disconnect());
