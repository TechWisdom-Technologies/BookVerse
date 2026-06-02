import { PrismaClient } from './src/generated/client';

const prisma = new PrismaClient();

async function checkQueries() {
  const storyId = 'clx123456789'; // Fake ID
  const timeWindow = { gte: new Date(), lte: new Date() };
  
  try {
    console.log("Checking StoryReaction...");
    await prisma.storyReaction.count({ where: { storyId, createdAt: timeWindow } });
    await prisma.storyReaction.groupBy({
      by: ['reactionType'],
      where: { storyId, createdAt: timeWindow },
      _count: true
    });
    
    console.log("Checking Comment...");
    await prisma.comment.count({ where: { storyId, createdAt: timeWindow } });
    
    console.log("Checking Follow...");
    await prisma.follow.count({ where: { followingId: storyId, createdAt: timeWindow } });
    
    console.log("Checking Tip...");
    await prisma.tip.findMany({ where: { storyId, status: 'COMPLETED', createdAt: timeWindow }, select: { amount: true } });
    
    console.log("Checking ShareActivity...");
    await prisma.shareActivity.count({ where: { storyId, createdAt: timeWindow } });
    
    console.log("Checking BookSave...");
    await prisma.bookSave.count({ where: { bookId: storyId, createdAt: timeWindow } });
    
    console.log("Checking ReadingLog...");
    await prisma.readingLog.findMany({ where: { storyId, createdAt: timeWindow }, select: { minutes: true } });
    
    console.log("Checking InlineComment...");
    await prisma.inlineComment.count({ where: { storyId, createdAt: timeWindow } });
    
    console.log("ALL QUERIES VALID!");
  } catch (err) {
    console.error("ERROR IN QUERIES:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkQueries();
