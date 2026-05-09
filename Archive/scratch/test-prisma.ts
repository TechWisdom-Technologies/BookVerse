import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const brokenUrl = "https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/sample-book.pdf";
    const workingUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    
    const result = await prisma.book.updateMany({
      where: { fileUrl: brokenUrl },
      data: { fileUrl: workingUrl }
    });
    
    console.log(`Updated ${result.count} broken links.`);
    const books = await prisma.book.findMany({ select: { id: true, title: true, fileUrl: true } });
    console.log("Current Books:", JSON.stringify(books, null, 2));
  } catch (e) {
    console.error("FULL ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
