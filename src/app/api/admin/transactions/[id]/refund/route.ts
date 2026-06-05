import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refundPayment } from "@/lib/uddoktapay";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await getAuth();
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const txn = await prisma.subscriptionTransaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!txn) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    if (txn.status !== "APPROVED") {
      return NextResponse.json({ error: "Only approved transactions can be refunded." }, { status: 400 });
    }

    // Attempt refund via Paymently / UddoktaPay ONLY if it's a gateway transaction
    if (txn.invoiceId) {
      try {
        // UddoktaPay requires the invoice_id for refunds
        const refundResult = await refundPayment(txn.invoiceId);
        
        if (!refundResult.status) {
           return NextResponse.json({ error: refundResult.message || "Gateway rejected refund." }, { status: 400 });
        }
      } catch (gatewayError: any) {
        return NextResponse.json({ error: gatewayError.message || "Failed to communicate with payment gateway." }, { status: 500 });
      }
    }

    // Process local database downgrade
    await prisma.$transaction(async (tx) => {
      // 1. Mark transaction as REJECTED (Refunded)
      await tx.subscriptionTransaction.update({
        where: { id },
        data: { status: "REJECTED" },
      });

      // 2. Surgically revoke the specific service that was refunded
      if (txn.plan === "TIP") {
        // Find the Tip record to identify the author and deduct the money
        const tip = await tx.tip.findFirst({
          where: { transactionId: txn.transactionId }
        });
        if (tip) {
          await tx.tip.update({
            where: { id: tip.id },
            data: { status: "FAILED" }
          });
          // Deduct the refunded tip amount from the author's pending wallet balance
          await tx.user.update({
            where: { id: tip.receiverId },
            data: { walletBalance: { decrement: tip.amount } }
          });
        }
      } else if (txn.plan.startsWith("GIFT_")) {
        // Mark the unredeemed or redeemed gift code as REJECTED
        await tx.giftMembership.updateMany({
          where: { transactionId: txn.transactionId },
          data: { status: "DECLINED" }
        });
      } else if (txn.plan.startsWith("PROMOTION_")) {
        // Find the promotion record to identify the story and deduct its promotion score
        const promo = await tx.storyPromotion.findFirst({
           where: { transactionId: txn.transactionId }
        });
        if (promo) {
          await tx.storyPromotion.update({
             where: { id: promo.id },
             data: { status: "DECLINED" }
          });
          // Deduct the artificial promotion points from the story
          await tx.story.update({
            where: { id: promo.storyId },
            data: { promotionScore: { decrement: Math.round(txn.amount) } }
          });
        }
      } else {
        // Standard Premium Subscription (PRO, CREATOR, AUTHOR)
        await tx.user.update({
          where: { id: txn.userId },
          data: {
            membershipTier: null,
            role: txn.user.role === "ADMIN" ? "ADMIN" : "MEMBER",
            membershipExpiry: null,
          },
        });
      }
    });

    // Notify user
    await createNotification({
      userId: txn.userId,
      type: "SYSTEM_ALERT",
      title: "Payment Refunded",
      message: `Your payment (TxnID: ${txn.transactionId}) has been refunded by the administration. Your premium features have been revoked.`,
    });

    return NextResponse.json({ success: true, message: "Payment successfully refunded." });
  } catch (error: any) {
    console.error("POST /api/admin/transactions/[id]/refund error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
