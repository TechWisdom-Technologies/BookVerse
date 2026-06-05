import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/uddoktapay";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payment/uddokta/verify?invoice_id=XXX
 *
 * Called by UddoktaPay's redirect after a successful payment.
 * Verifies the payment, stores the transaction in the DB,
 * and redirects to a client-side success/failure page.
 */
export async function GET(req: NextRequest) {
  const invoiceId = req.nextUrl.searchParams.get("invoice_id");

  if (!invoiceId) {
    // Redirect to cancel page if no invoice
    return NextResponse.redirect(new URL("/payment/cancel", req.url));
  }

  try {
    const result = await verifyPayment(invoiceId);

    if (result.status !== "COMPLETED") {
      console.warn("[UddoktaPay Verify] Payment not completed:", result.status);
      return NextResponse.redirect(
        new URL(`/payment/cancel?reason=incomplete`, req.url)
      );
    }

    // Extract metadata and additional payment tracking info
    const meta = result.metadata || {};
    const userId = meta.userId;
    const paymentType = meta.paymentType; // "PREMIUM" | "PROMOTION" | "TIP"
    const amount = parseFloat(result.amount.replace(/,/g, ''));
    const senderNumber = result.sender_number || "UddoktaPay Gateway";
    const transactionId = result.transaction_id || invoiceId;
    const paymentMethod = result.payment_method || "UddoktaPay";

    // New fields
    const gatewayFee = parseFloat((result.fee || "0").replace(/,/g, ''));
    const chargedAmount = parseFloat((result.charged_amount || result.amount || "0").replace(/,/g, ''));
    const ipAddress = meta.ipAddress || null;
    const country = meta.country || null;
    const email = meta.email || null;
    const metadata = result.metadata || null;

    if (!userId || !paymentType) {
      console.error("[UddoktaPay Verify] Missing metadata:", meta);
      return NextResponse.redirect(
        new URL(`/payment/cancel?reason=invalid_metadata`, req.url)
      );
    }

    // Check for duplicate invoice processing
    const existingTxn = await prisma.subscriptionTransaction.findFirst({
      where: { transactionId },
    });

    if (existingTxn) {
      // Already processed — redirect to success
      return NextResponse.redirect(
        new URL(`/payment/success?type=${paymentType}`, req.url)
      );
    }

    // ─── Process based on payment type ──────────────────────────

    if (paymentType === "PREMIUM") {
      const plan = meta.plan?.toUpperCase() || "PRO";
      const duration = parseInt(meta.duration || "1", 10);

      // Fraud Prevention: Ensure they paid the correct amount for the plan
      let expectedPremiumAmount = 0;
      if (plan === "CREATOR") expectedPremiumAmount = 799 * duration;
      else if (plan === "PRO") expectedPremiumAmount = 299 * duration;
      else expectedPremiumAmount = 99 * duration;

      if (isNaN(expectedPremiumAmount) || amount < expectedPremiumAmount) {
        console.warn(`[UddoktaPay Verify] Fraud detected for PREMIUM. Paid ${amount}, Expected ${expectedPremiumAmount}`);
        return NextResponse.redirect(
          new URL(`/payment/cancel?reason=invalid_amount`, req.url)
        );
      }

      // Logic Override: Since UddoktaPay has verified the payment cryptographically, 
      // requiring manual admin approval is a bad user experience. We will auto-grant.
      await prisma.$transaction(async (tx) => {
        const dbUser = await tx.user.findUnique({ where: { id: userId } });
        let membershipEndDate = new Date();

        if (
          dbUser &&
          dbUser.membershipTier === plan &&
          dbUser.membershipExpiry &&
          dbUser.membershipExpiry > new Date()
        ) {
          // Add to existing expiry
          membershipEndDate = new Date(
            dbUser.membershipExpiry.getTime() + duration * 30 * 24 * 60 * 60 * 1000
          );
        } else {
          // Start from today
          membershipEndDate = new Date(
            Date.now() + duration * 30 * 24 * 60 * 60 * 1000
          );
        }

        const newRole = plan === "CREATOR" || plan === "AUTHOR" ? "AUTHOR" : "MEMBER";

        await tx.subscriptionTransaction.create({
          data: {
            userId,
            plan,
            duration,
            amount,
            senderNumber: `${paymentMethod} — ${senderNumber}`,
            transactionId,
            status: "APPROVED", // Auto-approved via digital gateway
            gatewayFee,
            chargedAmount,
            paymentMethod,
            invoiceId,
            ipAddress,
            country,
            email,
            metadata: metadata ? (metadata as any) : undefined,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: {
            membershipTier: plan,
            membershipExpiry: membershipEndDate,
            role: newRole,
          },
        });
      });
    } else if (paymentType === "PROMOTION") {
      const storyId = meta.storyId;
      const tier = meta.tier || "FEATURED";
      const duration = parseInt(meta.duration || "7", 10);

      if (!storyId) {
        console.error("[UddoktaPay Verify] Missing storyId for PROMOTION");
        return NextResponse.redirect(
          new URL(`/payment/cancel?reason=missing_story`, req.url)
        );
      }

      // Fraud Prevention: Ensure they paid the correct amount for the tier
      let expectedPromoAmount = 0;
      if (tier === "FEATURED") expectedPromoAmount = duration * 50;
      else if (tier === "TRENDING") expectedPromoAmount = duration * 30;
      else if (tier === "PROMOTED") {
        const customBudget = parseInt(meta.customBudget || "10", 10);
        expectedPromoAmount = duration * (isNaN(customBudget) ? 10 : Math.max(10, customBudget));
      }

      if (isNaN(expectedPromoAmount) || amount < expectedPromoAmount) {
        console.warn(`[UddoktaPay Verify] Fraud detected for PROMOTION. Paid ${amount}, Expected ${expectedPromoAmount}`);
        return NextResponse.redirect(
          new URL(`/payment/cancel?reason=invalid_amount`, req.url)
        );
      }

      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + duration * 24 * 60 * 60 * 1000
      );

      await prisma.$transaction([
        prisma.storyPromotion.create({
          data: {
            storyId,
            tier,
            startDate,
            endDate,
            cost: amount,
            senderNumber: `${paymentMethod} — ${senderNumber}`,
            transactionId,
            status: "ACTIVE", // Auto-activated via gateway
            gatewayFee,
            chargedAmount,
            paymentMethod,
            invoiceId,
            ipAddress,
            country,
            email,
            metadata: metadata ? (metadata as any) : undefined,
          },
        }),
        prisma.subscriptionTransaction.create({
          data: {
            userId,
            plan: `PROMOTION_${tier}`,
            duration,
            amount,
            senderNumber: `${paymentMethod} — ${senderNumber}`,
            transactionId,
            status: "APPROVED",
            gatewayFee,
            chargedAmount,
            paymentMethod,
            invoiceId,
            ipAddress,
            country,
            email,
            metadata: metadata ? (metadata as any) : undefined,
          },
        }),
        // Bump the promotion score on the story
        prisma.story.update({
          where: { id: storyId },
          data: {
            promotionScore: { increment: Math.round(amount) },
          },
        }),
      ]);
    } else if (paymentType === "TIP") {
      const receiverId = meta.receiverId;
      const storyId = meta.storyId || null;
      const message = meta.message || null;

      if (!receiverId) {
        console.error("[UddoktaPay Verify] Missing receiverId for TIP");
        return NextResponse.redirect(
          new URL(`/payment/cancel?reason=missing_receiver`, req.url)
        );
      }

      await prisma.$transaction([
        prisma.tip.create({
          data: {
            amount,
            currency: "bdt",
            senderId: userId,
            receiverId,
            storyId,
            message,
            status: "COMPLETED", // Auto-completed via gateway
            senderNumber: `${paymentMethod} — ${senderNumber}`,
            transactionId,
            gatewayFee,
            chargedAmount,
            paymentMethod,
            invoiceId,
            ipAddress,
            country,
            email,
            metadata: metadata ? (metadata as any) : undefined,
          },
        }),
        prisma.subscriptionTransaction.create({
          data: {
            userId,
            plan: "TIP",
            duration: 1,
            amount,
            senderNumber: `${paymentMethod} — ${senderNumber}`,
            transactionId,
            status: "APPROVED",
            gatewayFee,
            chargedAmount,
            paymentMethod,
            invoiceId,
            ipAddress,
            country,
            email,
            metadata: metadata ? (metadata as any) : undefined,
          },
        }),
        prisma.user.update({
          where: { id: receiverId },
          data: { walletBalance: { increment: amount } }
        })
      ]);

      // Notify the author
      try {
        const author = await prisma.user.findUnique({ where: { id: receiverId }, select: { bkashNumber: true, nagadNumber: true, membershipTier: true } });
        const bkash = author?.bkashNumber || "N/A";
        const nagad = author?.nagadNumber || "N/A";
        const tier = author?.membershipTier;

        let customMessage = `A reader sent you a tip of ৳${amount} Taka. You will get your tips amount at the month end at your bKash: ${bkash} / Nagad: ${nagad}.`;

        if (!tier || tier === "AUTHOR" || tier === "MEMBER") {
          customMessage = `A reader sent you a tip of ৳${amount} Taka! Upgrade to Pro to see your balance, or Creator to see who sent it and the transaction history. Payouts of your all tips will be sent at the month end to your bKash: ${bkash} / Nagad: ${nagad}.`;
        } else if (tier === "PRO") {
          customMessage = `A reader sent you a tip of ৳${amount} Taka. Want to see who sent it and the transaction history? Upgrade to Creator! Payouts of your all tips will be sent at the month end to your bKash: ${bkash} / Nagad: ${nagad}.`;
        } else {
          customMessage = `A reader sent you a tip of ৳${amount} Taka. Check your wallet ledger to see who sent it! Payouts of your all tips will be sent at the month end to your bKash: ${bkash} / Nagad: ${nagad}.`;
        }

        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          userId: receiverId,
          type: "TIP",
          title: "🎉 You received a Tip!",
          message: customMessage,
          link: `/wallet`,
        });
      } catch (err) {
        console.error("Failed to send tip notification:", err);
      }
    }

    // Redirect to the client-side success page
    return NextResponse.redirect(
      new URL(`/payment/success?type=${paymentType}`, req.url)
    );
  } catch (error: any) {
    console.error("[UddoktaPay Verify] Error:", error);
    return NextResponse.redirect(
      new URL(`/payment/cancel?reason=verify_error`, req.url)
    );
  }
}
