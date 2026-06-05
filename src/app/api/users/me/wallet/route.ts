import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    if (!(await hasFeatureAccess(dbUser, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const USD_TO_BDT = 120; // Stable exchange rate conversion for tips

    // 1. Fetch Tips Received
    const tipsReceived = await prisma.tip.findMany({
      where: { receiverId: dbUser.id },
      include: {
        sender: {
          select: { username: true, displayName: true }
        },
        story: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // 2. Fetch Tips Sent
    const tipsSent = await prisma.tip.findMany({
      where: { senderId: dbUser.id },
      include: {
        receiver: {
          select: { username: true, displayName: true }
        },
        story: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // 3. Fetch Subscription Transactions
    const subscriptions = await prisma.subscriptionTransaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" }
    });

    // 4. Calculate aggregates in BDT with currency awareness
    const calculateBDT = (amount: number, currency: string) => {
      if (currency?.toLowerCase() === 'bdt') return amount;
      // Legacy USD cents fallback
      return (amount / 100) * USD_TO_BDT;
    };

    const successfulTipsReceived = tipsReceived.filter(t => t.status === "COMPLETED");
    const totalEarnedTips = successfulTipsReceived.reduce((acc, t) => acc + calculateBDT(t.amount, t.currency || 'USD'), 0); 
    
    const approvedSubs = subscriptions.filter(s => s.status === "APPROVED");
    const totalSpentSubs = approvedSubs.reduce((acc, s) => acc + s.amount, 0); 

    const successfulTipsSent = tipsSent.filter(t => t.status === "COMPLETED");
    const totalSpentTips = successfulTipsSent.reduce((acc, t) => acc + calculateBDT(t.amount, t.currency || 'USD'), 0);

    // 5. Compile a unified transaction history in BDT
    interface UnifiedTransaction {
      id: string;
      type: "TIP_RECEIVED" | "TIP_SENT" | "SUBSCRIPTION";
      amount: number;
      currency: string;
      status: string;
      createdAt: Date;
      description: string;
      method: string;
    }

    const history: UnifiedTransaction[] = [];

    const isCreator = await hasFeatureAccess(dbUser, 'CREATOR');
    if (isCreator) {
      tipsReceived.forEach(t => {
        history.push({
          id: t.id,
          type: "TIP_RECEIVED",
          amount: calculateBDT(t.amount, t.currency || 'USD'),
          currency: "BDT",
          status: t.status,
          createdAt: t.createdAt,
          description: `Received tip from @${t.sender?.username || 'anonymous'}${t.story ? ` on "${t.story.title}"` : ''}`,
          method: t.currency?.toLowerCase() === 'bdt' ? (t.transactionId ? "Mobile Wallet" : "UddoktaPay") : "Stripe (Card)",
        });
      });

      tipsSent.forEach(t => {
        history.push({
          id: t.id,
          type: "TIP_SENT",
          amount: calculateBDT(t.amount, t.currency || 'USD'),
          currency: "BDT",
          status: t.status,
          createdAt: t.createdAt,
          description: `Sent support tip to @${t.receiver?.username || 'author'}${t.story ? ` on "${t.story.title}"` : ''}`,
          method: t.currency?.toLowerCase() === 'bdt' ? (t.transactionId ? "Mobile Wallet" : "UddoktaPay") : "Stripe (Card)",
        });
      });

      subscriptions.forEach(s => {
        history.push({
          id: s.id,
          type: "SUBSCRIPTION",
          amount: s.amount,
          currency: "BDT",
          status: s.status,
          createdAt: s.createdAt,
          description: `Premium Upgrade: ${s.plan} (${s.duration} Month${s.duration > 1 ? 's' : ''})`,
          method: s.senderNumber ? `bKash/Nagad (${s.senderNumber})` : "Mobile Pay",
        });
      });

      // Sort history by date descending
      history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({
      totalEarnedTips,
      totalSpentTips,
      totalSpentSubs,
      history,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me/wallet error:", error);
    return NextResponse.json({ error: "Failed to fetch wallet info" }, { status: 500 });
  }
}
