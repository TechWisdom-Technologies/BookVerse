import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/uddoktapay";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("rt-uddoktapay-api-key");
    const configuredKey = process.env.UDDOKTAPAY_API_KEY;

    // Optional but recommended: Check webhook authorization header
    if (apiKey && configuredKey && apiKey !== configuredKey) {
      console.warn("[UddoktaPay Webhook] Invalid API Key provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const invoiceId = body.invoice_id;

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoice_id" }, { status: 400 });
    }

    // Call the server-to-server verification which acts as ultimate source of truth
    const result = await verifyPayment(invoiceId);

    if (result.status !== "COMPLETED") {
      console.warn("[UddoktaPay Webhook] Payment not completed:", result.status);
      return NextResponse.json({ success: true, message: "Ignored, not completed" });
    }

    const meta = result.metadata || {};
    const userId = meta.userId;
    const paymentType = meta.paymentType;
    const amount = parseFloat(result.amount.replace(/,/g, ''));
    const senderNumber = result.sender_number || "UddoktaPay Gateway";
    const transactionId = result.transaction_id || invoiceId;
    const paymentMethod = result.payment_method || "UddoktaPay";

    const gatewayFee = parseFloat((result.fee || "0").replace(/,/g, ''));
    const chargedAmount = parseFloat((result.charged_amount || result.amount || "0").replace(/,/g, ''));
    const ipAddress = meta.ipAddress || null;
    const country = meta.country || null;
    const email = meta.email || null;
    const metadata = result.metadata || null;

    if (!userId || !paymentType) {
      console.error("[UddoktaPay Webhook] Missing metadata:", meta);
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    // Check for duplicate invoice processing (Idempotency)
    const existingTxn = await prisma.subscriptionTransaction.findFirst({
      where: { transactionId },
    });

    if (existingTxn) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // ─── Process based on payment type ──────────────────────────

    if (paymentType === "PREMIUM") {
      const plan = meta.plan?.toUpperCase() || "PRO";
      const duration = parseInt(meta.duration || "1", 10);

      let expectedPremiumAmount = 0;
      if (plan === "CREATOR") expectedPremiumAmount = 599 * duration;
      else if (plan === "PRO") expectedPremiumAmount = 299 * duration;
      else expectedPremiumAmount = 99 * duration;

      if (isNaN(expectedPremiumAmount) || amount < expectedPremiumAmount) {
        console.warn(`[UddoktaPay Webhook] Fraud detected for PREMIUM. Paid ${amount}, Expected ${expectedPremiumAmount}`);
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        const dbUser = await tx.user.findUnique({ where: { id: userId } });
        let membershipEndDate = new Date();

        if (
          dbUser &&
          dbUser.membershipTier === plan &&
          dbUser.membershipExpiry &&
          dbUser.membershipExpiry > new Date()
        ) {
          membershipEndDate = new Date(dbUser.membershipExpiry.getTime() + duration * 30 * 24 * 60 * 60 * 1000);
        } else {
          membershipEndDate = new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000);
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

      if (!storyId) return NextResponse.json({ error: "Missing storyId" }, { status: 400 });

      let expectedPromoAmount = 0;
      if (tier === "FEATURED") expectedPromoAmount = duration * 50;
      else if (tier === "TRENDING") expectedPromoAmount = duration * 30;
      else if (tier === "PROMOTED") {
        const customBudget = parseInt(meta.customBudget || "10", 10);
        expectedPromoAmount = duration * (isNaN(customBudget) ? 10 : Math.max(10, customBudget));
      }

      if (isNaN(expectedPromoAmount) || amount < expectedPromoAmount) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

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
            status: "ACTIVE",
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
        prisma.story.update({
          where: { id: storyId },
          data: { promotionScore: { increment: Math.round(amount) } },
        }),
      ]);
    } else if (paymentType === "TIP") {
      const receiverId = meta.receiverId;
      const storyId = meta.storyId || null;
      const message = meta.message || null;

      if (!receiverId) return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });

      await prisma.$transaction([
        prisma.tip.create({
          data: {
            amount,
            currency: "bdt",
            senderId: userId,
            receiverId,
            storyId,
            message,
            status: "COMPLETED",
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[UddoktaPay Webhook] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
