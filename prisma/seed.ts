import { PrismaClient, FileType, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.bookReview.deleteMany();
  await prisma.bookSave.deleteMany();
  await prisma.comment.deleteMany({ where: { bookId: { not: null } } });
  await prisma.book.deleteMany();

  // 1. Create a system admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@bookverse.com" },
    update: {},
    create: {
      firebaseUid: "system-admin-seed-id",
      email: "admin@bookverse.com",
      username: "bookverse_admin",
      displayName: "BookVerse Librarian",
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.username}`);

  // 2. Sample Book Data with Fixed IDs
  const booksData = [
    {
      id: "seed-book-1",
      title: "The Silent Echoes",
      authorName: "Eleanor Vance",
      genre: "Mystery",
      description: "A gripping tale of secrets buried in a small coastal town, where every whisper carries a price.",
      coverUrl: "https://images.unsplash.com/photo-1543004457-450c09b26c6d?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-2",
      title: "Stellar Horizon",
      authorName: "Marcus Thorne",
      genre: "Sci-Fi",
      description: "In the year 3042, humanity faces its ultimate challenge as a new galaxy beckons with both hope and terror.",
      coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-3",
      title: "The Alchemist's Shadow",
      authorName: "Sofia Rossi",
      genre: "Fantasy",
      description: "An apprentice alchemist discovers a forbidden formula that can bend time, but at a terrible cost to the soul.",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-4",
      title: "Love in Paris",
      authorName: "Julianne Moore",
      genre: "Romance",
      description: "Two strangers find connection in the heart of the City of Light, navigating the complexities of fate and passion.",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-5",
      title: "The Iron Throne",
      authorName: "George S. Martin",
      genre: "Epic Fantasy",
      description: "Kingdoms clash and dragons rise in this epic saga of power, betrayal, and the quest for the ultimate crown.",
      coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-6",
      title: "Mind Palace",
      authorName: "Dr. Arthur Conan",
      genre: "Psychology",
      description: "Unlock the secrets of human memory and cognition with this groundbreaking guide to mental architecture.",
      coverUrl: "https://images.unsplash.com/photo-1532012197367-63097117a75d?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-7",
      title: "Winds of Change",
      authorName: "Sarah Jenkins",
      genre: "Historical Fiction",
      description: "A family's journey through the industrial revolution, witnessing the transformation of a nation and themselves.",
      coverUrl: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-8",
      title: "Cyber Nexus",
      authorName: "Kenji Sato",
      genre: "Cyberpunk",
      description: "In a neon-drenched future, a rogue hacker uncovers a corporate conspiracy that threatens to rewrite reality itself.",
      coverUrl: "https://images.unsplash.com/photo-1604076913837-52ca5629fba9?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-9",
      title: "The Midnight Watch",
      authorName: "Robert Frost",
      genre: "Thriller",
      description: "When a security guard witnesses a crime he wasn't supposed to see, his life becomes a race against time.",
      coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
      fileType: FileType.PDF,
    },
    {
      id: "seed-book-10",
      title: "Beyond the Veil",
      authorName: "Lydia Thorne",
      genre: "Horror",
      description: "An abandoned asylum holds more than just dust and memories; it holds something that hasn't eaten in decades.",
      coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400",
      fileUrl: "https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/sample-book.pdf",
      fileType: FileType.PDF,
    },
  ];

  console.log("Creating books...");
  for (const book of booksData) {
    await prisma.book.create({
      data: {
        ...book,
        uploadedById: admin.id,
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
