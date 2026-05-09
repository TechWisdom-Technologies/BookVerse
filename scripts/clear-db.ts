
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database cleanup...");
  
  await prisma.review.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.readingProgress.deleteMany();
  await prisma.story.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  
  console.log("Database cleanup finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

