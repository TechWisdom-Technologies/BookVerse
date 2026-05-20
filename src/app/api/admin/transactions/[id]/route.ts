import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    if (action !== "APPROVE" && action !== "DECLINE") {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or DECLINE." },
        { status: 400 }
      );
    }

    const txn = await prisma.subscriptionTransaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!txn) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 }
      );
    }

    if (txn.status !== "PENDING") {
      return NextResponse.json(
        { error: `This transaction has already been ${txn.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      // Calculate membership expiry: if they already have the same tier and it is active, extend it.
      const now = new Date();
      let baseDate = now;
      if (
        txn.user.membershipTier === txn.plan &&
        txn.user.membershipExpiry &&
        txn.user.membershipExpiry > now
      ) {
        baseDate = new Date(txn.user.membershipExpiry);
      }
      const membershipEndDate = new Date(
        baseDate.getTime() + txn.duration * 30 * 24 * 60 * 60 * 1000
      );

      // Perform updates inside a transaction
      await prisma.$transaction([
        prisma.subscriptionTransaction.update({
          where: { id },
          data: { status: "APPROVED" },
        }),
        prisma.user.update({
          where: { id: txn.userId },
          data: {
            membershipTier: txn.plan,
            membershipExpiry: membershipEndDate,
          },
        }),
      ]);

      // Create notification for user
      await createNotification({
        userId: txn.userId,
        type: "MEMBERSHIP_UPGRADE",
        title: "✨ Premium Membership Approved!",
        message: `Your payment verification was successful. You are now a BookVerse ${txn.plan} member until ${membershipEndDate.toLocaleDateString()}. Thank you for your support!`,
        link: "/premium",
      });

      return NextResponse.json({
        success: true,
        message: "Transaction approved and membership activated successfully.",
      });
    } else {
      // DECLINE Action
      await prisma.subscriptionTransaction.update({
        where: { id },
        data: { status: "DECLINED" },
      });

      // Create notification for user
      await createNotification({
        userId: txn.userId,
        type: "MEMBERSHIP_DECLINED",
        title: "❌ Payment Verification Failed",
        message: `Your submitted subscription payment (TxnID: ${txn.transactionId}) could not be verified by our administrative team. Please review your payment details and try again.`,
        link: "/premium/checkout?plan=" + txn.plan.toLowerCase(),
      });

      return NextResponse.json({
        success: true,
        message: "Transaction declined.",
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "USER_NOT_FOUND")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/admin/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to process transaction action" },
      { status: 500 }
    );
  }
}
