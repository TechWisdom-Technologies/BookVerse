import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  console.log(`Checking for expired promotions at ${now.toISOString()}...`);

  // Find all ACTIVE promotions whose endDate has passed
  const expiredPromos = await prisma.storyPromotion.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: now },
    },
    select: { id: true, storyId: true, tier: true, endDate: true },
  });

  console.log(`Found ${expiredPromos.length} expired promotion(s).`);

  let processed = 0;
  for (const promo of expiredPromos) {
    const scoreDecrement = promo.tier === "FEATURED" ? 500 : promo.tier === "PROMOTED" ? 200 : 100;

    await prisma.$transaction([
      prisma.storyPromotion.update({
        where: { id: promo.id },
        data: { status: "ENDED" },
      }),
      prisma.story.update({
        where: { id: promo.storyId },
        data: {
          promotionScore: {
            decrement: scoreDecrement,
          },
        },
      }),
    ]);

    processed++;
    console.log(`  ✅ Expired promo ${promo.id} (${promo.tier}) for story ${promo.storyId} — score decremented by ${scoreDecrement}`);
  }

  // Clamp any negative promotionScores back to 0
  const clamped = await prisma.story.updateMany({
    where: { promotionScore: { lt: 0 } },
    data: { promotionScore: 0 },
  });

  if (clamped.count > 0) {
    console.log(`  Clamped ${clamped.count} story score(s) back to 0.`);
  }

  console.log(`\nDone! Expired ${processed} promotion(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
