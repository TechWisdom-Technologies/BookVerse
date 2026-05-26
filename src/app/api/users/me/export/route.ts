import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET /api/users/me/export — Comprehensive GDPR data export
export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    // Fetch the full user profile with relations
    const user = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        dateOfBirth: true,
        membershipTier: true,
        membershipExpiry: true,
        description: true,
        mood: true,
        subGenres: true,
        tags: true,
        readingFont: true,
        readerTheme: true,
        readingProgressSync: true,
        bkashNumber: true,
        nagadNumber: true,
        _count: {
          select: {
            followers: true,
            following: true,
            stories: true,
            books: true,
            bookSaves: true,
            comments: true,
            tipsReceived: true,
            tipsSent: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch stories authored
    const stories = await prisma.story.findMany({
      where: { authorId: dbUser.id },
      select: {
        id: true,
        title: true,
        genre: true,
        published: true,
        viewCount: true,
        reactionCount: true,
        createdAt: true,
        _count: { select: { chapters: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch books uploaded
    const books = await prisma.book.findMany({
      where: { uploadedById: dbUser.id },
      select: {
        id: true,
        title: true,
        genre: true,
        downloadCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch saved books
    const savedBooks = await prisma.bookSave.findMany({
      where: { userId: dbUser.id },
      select: {
        book: { select: { id: true, title: true, authorName: true, genre: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch tip history
    const tipsReceived = await prisma.tip.findMany({
      where: { receiverId: dbUser.id },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        message: true,
        createdAt: true,
        sender: { select: { username: true } },
        story: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const tipsSent = await prisma.tip.findMany({
      where: { senderId: dbUser.id },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        message: true,
        createdAt: true,
        receiver: { select: { username: true } },
        story: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch subscription transactions
    const subscriptions = await prisma.subscriptionTransaction.findMany({
      where: { userId: dbUser.id },
      select: {
        id: true,
        plan: true,
        duration: true,
        amount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch blocked users
    const blockedUsers = await prisma.userBlock.findMany({
      where: { blockerId: dbUser.id },
      select: {
        blocked: { select: { username: true } },
        reason: true,
        createdAt: true,
      },
    });

    // Fetch reading progress
    const readingProgress = await prisma.readingProgress.findMany({
      where: { userId: dbUser.id },
      select: {
        storyId: true,
        chapterId: true,
        percentage: true,
        updatedAt: true,
      },
    });

    // Fetch achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: dbUser.id },
      select: {
        achievement: { select: { name: true, description: true, points: true } },
        earnedAt: true,
      },
    });

    // Fetch reading logs
    const readingLogs = await prisma.readingLog.findMany({
      where: { userId: dbUser.id },
      select: {
        date: true,
        pagesRead: true,
        minutes: true,
      },
      orderBy: { date: "desc" },
      take: 365, // Last year
    });

    // Compile the export
    const exportData = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        platform: "BookVerse",
        version: "1.0",
        dataSubject: user.email,
      },
      profile: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        description: user.description,
        role: user.role,
        mood: user.mood,
        subGenres: user.subGenres,
        tags: user.tags,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        membershipTier: user.membershipTier,
        membershipExpiry: user.membershipExpiry,
        statistics: user._count,
      },
      preferences: {
        readingFont: user.readingFont,
        readerTheme: user.readerTheme,
        readingProgressSync: user.readingProgressSync,
      },
      wallets: {
        bkashNumber: user.bkashNumber,
        nagadNumber: user.nagadNumber,
      },
      content: {
        stories,
        books,
        savedBooks: savedBooks.map((s) => ({
          ...s.book,
          savedAt: s.createdAt,
        })),
      },
      financial: {
        tipsReceived: tipsReceived.map((t) => ({
          ...t,
          senderUsername: t.sender?.username || "anonymous",
          storyTitle: t.story?.title || null,
        })),
        tipsSent: tipsSent.map((t) => ({
          ...t,
          receiverUsername: t.receiver?.username || "unknown",
          storyTitle: t.story?.title || null,
        })),
        subscriptions,
      },
      social: {
        blockedUsers: blockedUsers.map((b) => ({
          username: b.blocked.username,
          reason: b.reason,
          blockedAt: b.createdAt,
        })),
      },
      activity: {
        readingProgress,
        achievements: achievements.map((a) => ({
          name: a.achievement.name,
          description: a.achievement.description,
          points: a.achievement.points,
          earnedAt: a.earnedAt,
        })),
        readingLogs,
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me/export error:", error);
    return NextResponse.json({ error: "Failed to export user data" }, { status: 500 });
  }
}
