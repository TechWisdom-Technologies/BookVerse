import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/tips/[userId]
 * Fetch tips received by a user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { userId } = await params;

    const user = await getAuth();
    if (!user || (user.id !== userId && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tips = await prisma.tip.findMany({
      where: {
        receiverId: userId,
        status: 'COMPLETED',
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        story: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Calculate total tips
    const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);

    return NextResponse.json({
      tips,
      totalAmount,
      count: tips.length,
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tips' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tips/[userId]
 * Create a pending tip via manual mobile payment for admin review
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { userId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, message, storyId, senderNumber, transactionId } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Tip amount must be at least ৳1 Taka' },
        { status: 400 }
      );
    }

    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot tip yourself' },
        { status: 400 }
      );
    }

    if (!senderNumber || typeof senderNumber !== 'string' || !senderNumber.trim()) {
      return NextResponse.json(
        { error: 'Sender Mobile Number is required.' },
        { status: 400 }
      );
    }

    if (!transactionId || typeof transactionId !== 'string' || !transactionId.trim()) {
      return NextResponse.json(
        { error: 'Transaction ID is required.' },
        { status: 400 }
      );
    }

    const cleanTxnId = transactionId.trim();

    // Verify duplicate transaction submissions
    const [existingTxn, existingTip] = await Promise.all([
      prisma.subscriptionTransaction.findFirst({
        where: { transactionId: cleanTxnId },
      }),
      prisma.tip.findFirst({
        where: { transactionId: cleanTxnId },
      }),
    ]);

    if (existingTxn || existingTip) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been submitted.' },
        { status: 400 }
      );
    }

    // Create both records inside a Prisma transaction
    const [tip] = await prisma.$transaction([
      prisma.tip.create({
        data: {
          amount,
          currency: 'bdt',
          senderId: user.id,
          receiverId: userId,
          storyId: storyId || null,
          message: message || null,
          status: 'PENDING',
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
        },
        include: {
          sender: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
          story: {
            select: { id: true, title: true },
          },
        },
      }),
      prisma.subscriptionTransaction.create({
        data: {
          userId: user.id,
          plan: 'TIP',
          duration: 1,
          amount: amount,
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
          status: 'PENDING',
        },
      }),
    ]);

    return NextResponse.json(tip, { status: 201 });
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { error: 'Failed to create tip' },
      { status: 500 }
    );
  }
}
