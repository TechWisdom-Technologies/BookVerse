import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all users who have a wallet balance > 0
    const authors = await prisma.user.findMany({
      where: {
        walletBalance: {
          gt: 0,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        walletBalance: true,
        bkashNumber: true,
        nagadNumber: true,
      },
      orderBy: {
        walletBalance: "desc",
      },
    });

    return NextResponse.json(authors);
  } catch (error) {
    console.error("GET /api/admin/payouts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { authorId, transactionId, sentToNumber } = body;

    if (!authorId || !transactionId || !sentToNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author || author.walletBalance <= 0) {
      return NextResponse.json(
        { error: "Author not found or has zero balance" },
        { status: 400 }
      );
    }

    const finalPayoutAmount = await prisma.$transaction(async (tx) => {
      const currentAuthor = await tx.user.findUnique({
        where: { id: authorId },
        select: { walletBalance: true },
      });

      if (!currentAuthor || currentAuthor.walletBalance <= 0) {
        throw new Error("Insufficient balance or concurrent payout detected.");
      }

      const payoutAmount = currentAuthor.walletBalance;

      await tx.authorPayout.create({
        data: {
          authorId,
          amount: payoutAmount,
          transactionId,
          sentToNumber,
        },
      });

      const updatedUser = await tx.user.updateMany({
        where: { 
          id: authorId,
          walletBalance: { gte: payoutAmount }
        },
        data: { walletBalance: { decrement: payoutAmount } },
      });

      if (updatedUser.count === 0) {
        throw new Error("Concurrent transaction detected. Payout aborted.");
      }

      return payoutAmount;
    });

    await createNotification({
      userId: authorId,
      type: "PAYOUT",
      title: "💸 Month-End Tips Transferred!",
      message: `Your accumulated tips of ৳${finalPayoutAmount} Taka have been transferred to you! Transaction Code: ${transactionId}. Sent to: ${sentToNumber}.`,
      link: `/profile`,
    });

    return NextResponse.json({
      success: true,
      message: "Payout recorded and notification sent.",
    });
  } catch (error) {
    console.error("POST /api/admin/payouts error:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}
