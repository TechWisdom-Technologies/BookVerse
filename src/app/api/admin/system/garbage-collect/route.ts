import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { listAllR2Objects, deleteMultipleFromR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export const maxDuration = 300; // 5 minutes max duration

export async function POST(_request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, "") || "";

    // 1. Fetch all objects from R2
    const allR2Keys = await listAllR2Objects();
    const r2KeysSet = new Set(allR2Keys);

    // 2. Fetch all valid URLs from the database
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

    // 3. Find Orphans
    // Only target dynamic folders, ignore root or static assets
    const targetPrefixes = ["covers/", "illustrations/", "avatars/", "books/", "universes/", "series/", "clubs/", "profiles/"];
    
    const orphans: string[] = [];
    
    for (const key of allR2Keys) {
      const isTargetedPrefix = targetPrefixes.some(prefix => key.startsWith(prefix));
      if (!isTargetedPrefix) continue;

      if (!activeKeys.has(key)) {
        orphans.push(key);
      }
    }

    // 4. Delete Orphans
    if (orphans.length > 0) {
      await deleteMultipleFromR2(orphans);
    }

    return NextResponse.json({
      success: true,
      report: {
        totalFilesScanned: allR2Keys.length,
        totalActiveDatabaseKeys: activeKeys.size,
        orphansFoundAndDeleted: orphans.length,
        deletedKeys: orphans
      }
    });

  } catch (error) {
    console.error("Garbage Collection Error:", error);
    return NextResponse.json({ error: "Failed to run garbage collection." }, { status: 500 });
  }
}
