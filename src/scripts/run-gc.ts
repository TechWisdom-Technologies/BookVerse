import { listAllR2Objects, deleteMultipleFromR2 } from "../lib/r2";
import { prisma } from "../lib/prisma";

async function runGarbageCollector() {
  console.log("🚀 Starting Cloudflare R2 Garbage Collection...");

  try {
    const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, "") || "";

    console.log("1️⃣  Fetching all objects from R2...");
    const allR2Keys = await listAllR2Objects();
    console.log(`Found ${allR2Keys.length} total objects in R2 bucket.`);

    console.log("2️⃣  Fetching active URLs from PostgreSQL...");
    const [
      users,
      books,
      stories,
      chapters,
      clubs,
      universes,
      series
    ] = await Promise.all([
      prisma.user.findMany({ select: { avatarUrl: true }, where: { avatarUrl: { not: null } } }),
      prisma.book.findMany({ select: { coverUrl: true, fileUrl: true } }),
      prisma.story.findMany({ select: { coverUrl: true }, where: { coverUrl: { not: null } } }),
      prisma.storyChapter.findMany({ select: { illustrationUrl: true }, where: { illustrationUrl: { not: null } } }),
      prisma.club.findMany({ select: { coverUrl: true }, where: { coverUrl: { not: null } } }),
      prisma.universe.findMany({ select: { coverUrl: true }, where: { coverUrl: { not: null } } }),
      prisma.series.findMany({ select: { coverUrl: true }, where: { coverUrl: { not: null } } }),
    ]);

    const activeKeys = new Set<string>();

    const extractKey = (url: string | null) => {
      if (!url) return;
      if (!url.includes(publicUrlBase.replace("https://", "")) && !url.includes("r2.dev")) return;
      
      try {
        const urlObj = new URL(url);
        const key = urlObj.pathname.replace(/^\/+/, "");
        activeKeys.add(key);
      } catch (e) {
        // Ignore invalid URLs
      }
    };

    users.forEach(u => extractKey(u.avatarUrl));
    books.forEach(b => { extractKey(b.coverUrl); extractKey(b.fileUrl); });
    stories.forEach(s => extractKey(s.coverUrl));
    chapters.forEach(c => extractKey(c.illustrationUrl));
    clubs.forEach(c => extractKey(c.coverUrl));
    universes.forEach(u => extractKey(u.coverUrl));
    series.forEach(s => extractKey(s.coverUrl));

    console.log(`Found ${activeKeys.size} valid file references in the database.`);

    console.log("3️⃣  Identifying orphaned files...");
    const targetPrefixes = ["covers/", "illustrations/", "avatars/", "books/", "universes/", "series/", "clubs/", "profiles/"];
    const orphans: string[] = [];
    
    for (const key of allR2Keys) {
      const isTargetedPrefix = targetPrefixes.some(prefix => key.startsWith(prefix));
      if (!isTargetedPrefix) continue;

      if (!activeKeys.has(key)) {
        orphans.push(key);
      }
    }

    console.log(`Identified ${orphans.length} orphaned files.`);

    if (orphans.length > 0) {
      console.log("4️⃣  Deleting orphaned files from R2...");
      await deleteMultipleFromR2(orphans);
      console.log("✅ Successfully deleted orphans:");
      orphans.forEach(o => console.log(`   - ${o}`));
    } else {
      console.log("✅ Your storage is perfectly clean! No orphans found.");
    }

  } catch (error) {
    console.error("❌ Garbage Collection Error:", error);
  } finally {
    process.exit(0);
  }
}

runGarbageCollector();
