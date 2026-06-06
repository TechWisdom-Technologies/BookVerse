import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        membershipTier: true,
        membershipExpiry: true,
        reactionCount: true,
        tags: true,
        subGenres: true,
        socialLinks: true,
        bio: true,
        description: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
        nationality: true,
        mood: true,
        contentWarnings: true,
        ageRating: true,
        adminInstruction: true,
        instructionSeen: true,
        onboardingQuiz: {
          select: {
            genrePreferences: true,
            readingLevel: true,
            favoriteAuthors: true,
            completed: true,
          }
        },
        books: { select: { id: true, title: true, genre: true, createdAt: true } },
        stories: { select: { id: true, title: true, published: true, createdAt: true } },
        universes: { select: { id: true, name: true, genre: true, createdAt: true } },
        series: { select: { id: true, name: true, createdAt: true } },
        subscriptionTransactions: { select: { id: true, plan: true, duration: true, amount: true, senderNumber: true, transactionId: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' } },
        giftsSent: { select: { id: true, code: true, tier: true, duration: true, recipientEmail: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' } },
        giftsReceived: { select: { id: true, code: true, tier: true, duration: true, sentByUser: { select: { username: true } }, status: true, redeemedAt: true }, orderBy: { redeemedAt: 'desc' } },
        readingProgress: { select: { id: true, storyId: true, percentage: true, updatedAt: true }, orderBy: { updatedAt: 'desc' } },
        achievements: { select: { achievement: { select: { id: true, name: true, points: true } }, earnedAt: true } },
        newsletterSubs: { select: { author: { select: { id: true, username: true } }, createdAt: true } },
        dmcaNotices: { select: { id: true, storyId: true, status: true, createdAt: true } },
        _count: {
          select: { books: true, stories: true, followers: true, readingLogs: true, comments: true },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Batch fetch related lookup details to enrich user transactions
    const txnIds = user.subscriptionTransactions.map(t => t.transactionId).filter(Boolean);

    const [tips, gifts, promotions] = await Promise.all([
      prisma.tip.findMany({
        where: { transactionId: { in: txnIds } },
        include: {
          receiver: {
            select: { username: true, displayName: true }
          },
          story: {
            select: { title: true }
          }
        }
      }),
      prisma.giftMembership.findMany({
        where: { transactionId: { in: txnIds } },
      }),
      prisma.storyPromotion.findMany({
        where: { transactionId: { in: txnIds } },
        include: {
          story: {
            select: { title: true }
          }
        }
      })
    ]);

    const tipMap = new Map(tips.map(t => [t.transactionId, t]));
    const giftMap = new Map(gifts.map(g => [g.transactionId, g]));
    const promoMap = new Map(promotions.map(p => [p.transactionId, p]));

    const enrichedTransactions = user.subscriptionTransactions.map(txn => {
      let details: any = null;
      
      if (txn.plan === "TIP") {
        const tip = tipMap.get(txn.transactionId);
        if (tip) {
          details = {
            type: "TIP",
            receiverName: tip.receiver.displayName || tip.receiver.username,
            receiverUsername: tip.receiver.username,
            storyTitle: tip.story?.title || null,
          };
        }
      } else if (txn.plan.startsWith("GIFT_")) {
        const gift = giftMap.get(txn.transactionId);
        if (gift) {
          details = {
            type: "GIFT",
            recipientEmail: gift.recipientEmail,
            tier: gift.tier,
          };
        }
      } else if (txn.plan.startsWith("PROMOTION_")) {
        const promo = promoMap.get(txn.transactionId);
        if (promo) {
          details = {
            type: "PROMOTION",
            storyTitle: promo.story.title,
            tier: promo.tier,
          };
        }
      }

      return {
        ...txn,
        details,
      };
    });

    const enrichedUser = {
      ...user,
      subscriptionTransactions: enrichedTransactions
    };

    // compute simple analytics: recent reading logs count, etc.
    const recentReads = await prisma.readingLog.count({ where: { userId: id, createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } });

    return NextResponse.json({ user: enrichedUser, analytics: { recentReads } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
