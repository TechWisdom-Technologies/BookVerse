import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Gift code required' }, { status: 400 });
    }

    const gift = await prisma.giftMembership.findUnique({
      where: { code },
    });

    if (!gift) {
      return NextResponse.json({ error: 'Invalid gift code' }, { status: 404 });
    }

    if (gift.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Gift code already used or expired' },
        { status: 400 }
      );
    }

    // Validate that the redeemer is the intended recipient
    if (gift.recipientEmail && user.email !== gift.recipientEmail) {
      return NextResponse.json(
        { error: 'This gift code was sent to a different email address.' },
        { status: 403 }
      );
    }

    if (gift.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Gift code expired' }, { status: 400 });
    }

    // Redeem gift
    const membershipEndDate = new Date(Date.now() + gift.duration * 30 * 24 * 60 * 60 * 1000);

    await prisma.giftMembership.update({
      where: { code },
      data: {
        redeemById: user.id,
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
    });

    // Update user membership
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipTier: gift.tier,
        membershipExpiry: membershipEndDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Gift redeemed successfully',
      membershipTier: gift.tier,
      expiresAt: membershipEndDate,
    });
  } catch (error) {
    console.error('Error redeeming gift:', error);
    return NextResponse.json({ error: 'Failed to redeem' }, { status: 500 });
  }
}
