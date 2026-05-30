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

    if (txn.plan.startsWith("PROMOTION_")) {
      const tier = txn.plan.replace("PROMOTION_", "");
      
      if (action === "APPROVE") {
        const now = new Date();
        const promo = await prisma.storyPromotion.findFirst({
          where: { transactionId: txn.transactionId }
        });

        let newEndDate = now;
        if (promo) {
          const durationMs = promo.endDate.getTime() - promo.startDate.getTime();
          newEndDate = new Date(now.getTime() + durationMs);
        }

        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "APPROVED" },
          }),
          prisma.storyPromotion.updateMany({
            where: { transactionId: txn.transactionId },
            data: {
              status: "ACTIVE",
              startDate: now,
              endDate: newEndDate,
            },
          }),
        ]);

        const storyPromotion = await prisma.storyPromotion.findFirst({
          where: { transactionId: txn.transactionId },
          include: { story: true }
        });

        if (storyPromotion) {
          await createNotification({
            userId: txn.userId,
            type: "PROMOTION_APPROVED",
            title: `✨ Promotion Approved for "${storyPromotion.story.title}"!`,
            message: `Your payment verification was successful. Your story is now promoted as ${tier} until ${newEndDate.toLocaleDateString()}.`,
            link: `/stories/${storyPromotion.storyId}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: "Promotion transaction approved and activated successfully.",
        });
      } else {
        // DECLINE Action
        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "DECLINED" },
          }),
          prisma.storyPromotion.updateMany({
            where: { transactionId: txn.transactionId },
            data: { status: "DECLINED" },
          }),
        ]);

        const storyPromotion = await prisma.storyPromotion.findFirst({
          where: { transactionId: txn.transactionId },
          include: { story: true }
        });

        if (storyPromotion) {
          await createNotification({
            userId: txn.userId,
            type: "PROMOTION_DECLINED",
            title: "❌ Promotion Payment Failed",
            message: `Your submitted promotion payment (TxnID: ${txn.transactionId}) for "${storyPromotion.story.title}" could not be verified by our administrative team.`,
            link: `/write/story/${storyPromotion.storyId}/edit`,
          });
        }

        return NextResponse.json({
          success: true,
          message: "Promotion transaction declined.",
        });
      }
    }

    if (txn.plan.startsWith("GIFT_")) {
      const tier = txn.plan.replace("GIFT_", "");
      
      if (action === "APPROVE") {
        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "APPROVED" },
          }),
          prisma.giftMembership.updateMany({
            where: { transactionId: txn.transactionId },
            data: { status: "PENDING" }, // Make redeemable
          }),
        ]);

        await createNotification({
          userId: txn.userId,
          type: "GIFT_APPROVED",
          title: `✨ Gift Membership Approved!`,
          message: `Your payment verification was successful. Your recipient can now redeem the invite code under your registry.`,
          link: `/gifts`,
        });

        return NextResponse.json({
          success: true,
          message: "Gift transaction approved and invitation code activated successfully.",
        });
      } else {
        // DECLINE Action
        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "DECLINED" },
          }),
          prisma.giftMembership.updateMany({
            where: { transactionId: txn.transactionId },
            data: { status: "DECLINED" },
          }),
        ]);

        await createNotification({
          userId: txn.userId,
          type: "GIFT_DECLINED",
          title: "❌ Gift Membership Payment Failed",
          message: `Your submitted gift payment (TxnID: ${txn.transactionId}) could not be verified by our administrative team.`,
          link: `/gifts`,
        });

        return NextResponse.json({
          success: true,
          message: "Gift transaction declined.",
        });
      }
    }

    if (txn.plan === "TIP") {
      if (action === "APPROVE") {
        const completedTip = await prisma.tip.findFirst({
          where: { transactionId: txn.transactionId }
        });

        if (!completedTip) {
          return NextResponse.json({ error: "Tip record not found" }, { status: 404 });
        }

        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "APPROVED" },
          }),
          prisma.tip.updateMany({
            where: { transactionId: txn.transactionId },
            data: { status: "COMPLETED" },
          }),
        ]);

        // Notify author who received the tip
        await createNotification({
          userId: completedTip.receiverId,
          type: "TIP",
          title: "🎉 You received a Tip!",
          message: `A reader sent you a tip of ৳${completedTip.amount} Taka. Your manual payment is approved and cleared!`,
          link: `/profile`,
        });

        // Notify user who sent the tip
        await createNotification({
          userId: txn.userId,
          type: "TIP_APPROVED",
          title: "✨ Tipping Receipt Verified",
          message: `Your manual tip payment of ৳${completedTip.amount} Taka was verified and successfully delivered to the author!`,
          link: `/profile`,
        });

        return NextResponse.json({
          success: true,
          message: "Tipping transaction approved and tip successfully cleared.",
        });
      } else {
        // DECLINE Action
        const completedTip = await prisma.tip.findFirst({
          where: { transactionId: txn.transactionId }
        });

        await prisma.$transaction([
          prisma.subscriptionTransaction.update({
            where: { id },
            data: { status: "DECLINED" },
          }),
          prisma.tip.updateMany({
            where: { transactionId: txn.transactionId },
            data: { status: "FAILED" },
          }),
        ]);

        await createNotification({
          userId: txn.userId,
          type: "TIP_DECLINED",
          title: "❌ Tip Payment Failed",
          message: `Your submitted tip payment (TxnID: ${txn.transactionId}) could not be verified by our team.`,
          link: `/profile`,
        });

        return NextResponse.json({
          success: true,
          message: "Tipping transaction declined.",
        });
      }
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

      // Determine if we need to upgrade their role to AUTHOR
      // We only upgrade if they are currently a VISITOR or MEMBER, so we don't downgrade ADMINs
      let newRole = txn.user.role;
      if ((txn.plan === "AUTHOR" || txn.plan === "PRO" || txn.plan === "CREATOR") && 
          (newRole === "VISITOR" || newRole === "MEMBER")) {
        newRole = "AUTHOR";
      }

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
            role: newRole,
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
