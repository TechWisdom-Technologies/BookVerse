import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    const body = await req.json();
    const { recipientEmail, tier, duration, senderNumber, transactionId } = body;

    if (!recipientEmail || !tier || !duration) {
      return NextResponse.json(
        { error: 'Recipient email, tier, and duration required' },
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
    const [existingTxn, existingGift] = await Promise.all([
      prisma.subscriptionTransaction.findUnique({
        where: { transactionId: cleanTxnId },
      }),
      prisma.giftMembership.findUnique({
        where: { transactionId: cleanTxnId },
      }),
    ]);

    if (existingTxn || existingGift) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been submitted.' },
        { status: 400 }
      );
    }

    const validTiers = ['PRO', 'CREATOR'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Generate unique gift code
    const giftCode = `GIFT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const tierPricing: Record<string, number> = {
      PRO: 499,
      CREATOR: 999,
    };

    const value = (tierPricing[tier] || 0) * duration;

    // Create both records inside a Prisma transaction
    const [gift] = await prisma.$transaction([
      prisma.giftMembership.create({
        data: {
          code: giftCode,
          tier,
          duration,
          sentBy: user.id,
          recipientEmail,
          value,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          status: 'PENDING_PAYMENT',
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
        },
      }),
      prisma.subscriptionTransaction.create({
        data: {
          userId: user.id,
          plan: `GIFT_${tier}`,
          duration,
          amount: value,
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
          status: 'PENDING',
        },
      }),
    ]);

    return NextResponse.json(gift, { status: 201 });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gifts = await prisma.giftMembership.findMany({
      where: {
        OR: [
          { sentBy: user.id },
          { redeemById: user.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
