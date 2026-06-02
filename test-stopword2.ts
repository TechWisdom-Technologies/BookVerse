import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = Prisma.sql`
    SELECT (to_tsquery('english', 'amar:*') || to_tsquery('english', 'am:*'))::text as q;
  `;
  const res = await prisma.$queryRaw(query);
  console.log(res);
}

main().finally(() => prisma.$disconnect());
