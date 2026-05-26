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

    const promo = await prisma.storyPromotion.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!promo) {
      return NextResponse.json(
        { error: "Promotion not found." },
        { status: 404 }
      );
    }

    if (promo.status !== "PENDING") {
      return NextResponse.json(
        { error: `This promotion has already been ${promo.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      // Activate the promotion with fresh dates from now
      const now = new Date();
      const durationMs = promo.endDate.getTime() - promo.startDate.getTime();
      const newEndDate = new Date(now.getTime() + durationMs);

      // Perform updates inside a transaction to keep them synchronized
      await prisma.$transaction([
        prisma.storyPromotion.update({
          where: { id },
          data: {
            status: "ACTIVE",
            startDate: now,
            endDate: newEndDate,
          },
        }),
        ...(promo.transactionId
          ? [
              prisma.subscriptionTransaction.updateMany({
                where: { transactionId: promo.transactionId },
                data: { status: "APPROVED" },
              }),
            ]
          : []),
      ]);

      // Notify the story author
      await createNotification({
        userId: promo.story.authorId,
        type: "PROMOTION_APPROVED",
        title: "🎉 Story Promotion Approved!",
        message: `Your ${promo.tier} promotion for "${promo.story.title}" has been activated! It will run until ${newEndDate.toLocaleDateString()}.`,
        link: `/stories/${promo.storyId}`,
      });

      return NextResponse.json({
        success: true,
        message: "Promotion approved and activated successfully.",
      });
    } else {
      // DECLINE Action
      await prisma.$transaction([
        prisma.storyPromotion.update({
          where: { id },
          data: { status: "DECLINED" },
        }),
        ...(promo.transactionId
          ? [
              prisma.subscriptionTransaction.updateMany({
                where: { transactionId: promo.transactionId },
                data: { status: "DECLINED" },
              }),
            ]
          : []),
      ]);

      // Notify the story author
      await createNotification({
        userId: promo.story.authorId,
        type: "PROMOTION_DECLINED",
        title: "❌ Promotion Payment Verification Failed",
        message: `Your ${promo.tier} promotion payment for "${promo.story.title}" (TxnID: ${promo.transactionId || 'N/A'}) could not be verified. Please review your payment details and try again.`,
        link: `/stories/${promo.storyId}`,
      });

      return NextResponse.json({
        success: true,
        message: "Promotion declined.",
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "USER_NOT_FOUND")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/admin/promotions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to process promotion action" },
      { status: 500 }
    );
  }
}
