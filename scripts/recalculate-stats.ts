import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Recalculating stats for all stories and books...\n");

  // --- Stories ---
  const stories = await prisma.story.findMany({
    select: { id: true, title: true },
  });

  console.log(`Found ${stories.length} stories.`);
  let storyCount = 0;

  for (const story of stories) {
    const [reactionCount, commentCount] = await Promise.all([
      prisma.storyReaction.count({ where: { storyId: story.id } }),
      prisma.comment.count({ where: { storyId: story.id } }),
    ]);

    await prisma.story.update({
      where: { id: story.id },
      data: { reactionCount },
    });

    storyCount++;
    if (storyCount % 10 === 0) {
      console.log(`  Stories: ${storyCount}/${stories.length}`);
    }
  }
  console.log(`  ✅ Recalculated reaction counts for ${storyCount} stories.\n`);

  // --- Books ---
  const books = await prisma.book.findMany({
    select: { id: true, title: true },
  });

  console.log(`Found ${books.length} books.`);
  let bookCount = 0;

  for (const book of books) {
    const [reviewCount, commentCount, saveCount] = await Promise.all([
      prisma.bookReview.count({ where: { bookId: book.id } }),
      prisma.comment.count({ where: { bookId: book.id } }),
      prisma.bookSave.count({ where: { bookId: book.id } }),
    ]);

    // Log stats since Book model doesn't cache them
    console.log(`  📖 "${book.title}" — ${reviewCount} reviews, ${commentCount} comments, ${saveCount} saves`);
    bookCount++;
  }
  console.log(`  ✅ Audited ${bookCount} books.\n`);

  console.log("Stats recalculation complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
