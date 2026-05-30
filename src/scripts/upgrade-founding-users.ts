import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching first 100 users by creation date...');
  
  const foundingUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    take: 100,
    select: { id: true, username: true, role: true, membershipTier: true },
  });

  console.log(`Found ${foundingUsers.length} users. Upgrading to AUTHOR role and CREATOR tier...`);

  let upgradedCount = 0;

  for (const user of foundingUsers) {
    if (user.role === Role.ADMIN) {
      console.log(`Skipping admin user: ${user.username}`);
      continue;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: Role.AUTHOR,
        membershipTier: 'CREATOR',
      },
    });

    upgradedCount++;
    console.log(`Upgraded ${user.username} to AUTHOR / CREATOR`);
  }

  console.log(`\nSuccess! Upgraded ${upgradedCount} founding users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
