import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = Prisma.sql`
    SELECT to_tsquery('english', 'amar:*')::text as q1, to_tsquery('english', 'am:*')::text as q2;
  `;
  const res = await prisma.$queryRaw(query);
  console.log(res);
}

main().finally(() => prisma.$disconnect());
