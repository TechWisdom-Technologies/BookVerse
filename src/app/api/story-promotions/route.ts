import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET(req: Request) {
  try {
    const promotions = await prisma.storyPromotion.findMany({
      where: { status: 'ACTIVE' },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            viewCount: true,
          },
        },
      },
      orderBy: { endDate: 'asc' },
      take: 20,
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has pro plan access (first 100 users get free)
    const hasAccess = await hasFeatureAccess(dbUser, 'PRO');
    if (!hasAccess) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 403 });
    }

    const body = await req.json();
    const { storyId, duration, tier, customBudget, senderNumber, transactionId } = body;

    if (!storyId || !duration || !tier) {
      return NextResponse.json(
        { error: 'Story ID, duration, and tier required' },
        { status: 400 }
      );
    }

    if (tier === 'PROMOTED' && (!customBudget || isNaN(Number(customBudget)) || Number(customBudget) <= 0)) {
      return NextResponse.json(
        { error: 'Custom budget is required for PROMOTED tier' },
        { status: 400 }
      );
    }

    // Validate payment credentials
    if (!senderNumber || typeof senderNumber !== 'string' || !senderNumber.trim()) {
      return NextResponse.json(
        { error: 'Sender Mobile Number (bkash/Nagad) is required for payment verification.' },
        { status: 400 }
      );
    }

    if (!transactionId || typeof transactionId !== 'string' || !transactionId.trim()) {
      return NextResponse.json(
        { error: 'Payment Transaction ID is required for payment verification.' },
        { status: 400 }
      );
    }

    const cleanTxnId = transactionId.trim();

    // Prevent duplicate Transaction ID submissions
    const existingTxn = await prisma.storyPromotion.findUnique({
      where: { transactionId: cleanTxnId },
    });

    if (existingTxn) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been submitted for a promotion.' },
        { status: 400 }
      );
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story || story.authorId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Per-day pricing: Featured = 50/day, Trending = 30/day, Promoted = custom budget/day
    let finalCost = 0;
    if (tier === 'FEATURED') {
      finalCost = 50 * duration;
    } else if (tier === 'TRENDING') {
      finalCost = 30 * duration;
    } else if (tier === 'PROMOTED') {
      finalCost = Number(customBudget) * duration;
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    // Create both promotion and transaction records inside a database transaction to keep them synchronized
    const [promotion] = await prisma.$transaction([
      prisma.storyPromotion.create({
        data: {
          storyId,
          tier,
          startDate,
          endDate,
          cost: finalCost,
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
          status: 'PENDING',
        },
      }),
      prisma.subscriptionTransaction.create({
        data: {
          userId: dbUser.id,
          plan: `PROMOTION_${tier}`, // e.g. PROMOTION_FEATURED, PROMOTION_TRENDING, PROMOTION_PROMOTED
          duration: duration, // duration in days for promotions
          amount: finalCost,
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
          status: 'PENDING',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Promotion payment receipt submitted for admin verification.',
      promotionId: promotion.id,
      transactionId: promotion.transactionId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
