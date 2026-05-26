import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const transactions = await prisma.subscriptionTransaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            membershipTier: true,
            role: true,
          },
        },
      },
    });

    // Batch fetch related lookup details
    const txnIds = transactions.map(t => t.transactionId).filter(Boolean);

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

    const enrichedTransactions = transactions.map(txn => {
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

    return NextResponse.json({ transactions: enrichedTransactions });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "USER_NOT_FOUND")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
