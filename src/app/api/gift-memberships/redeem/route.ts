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

    // Redeem gift safely with an interactive transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      const currentGift = await tx.giftMembership.findUnique({ where: { code } });
      
      if (!currentGift || currentGift.status !== 'PENDING') {
        throw new Error('Gift code already used or expired');
      }

      const dbUser = await tx.user.findUnique({ where: { id: user.id } });
      let membershipEndDate = new Date();

      if (
        dbUser &&
        dbUser.membershipTier === currentGift.tier &&
        dbUser.membershipExpiry &&
        dbUser.membershipExpiry > new Date()
      ) {
        // Add to existing expiry if they are on the exact same tier
        membershipEndDate = new Date(
          dbUser.membershipExpiry.getTime() + currentGift.duration * 30 * 24 * 60 * 60 * 1000
        );
      } else {
        // Start from today or overwrite if they are upgrading/downgrading
        membershipEndDate = new Date(
          Date.now() + currentGift.duration * 30 * 24 * 60 * 60 * 1000
        );
      }

      await tx.giftMembership.update({
        where: { code },
        data: {
          redeemById: user.id,
          status: 'REDEEMED',
          redeemedAt: new Date(),
        },
      });

      // Update user membership
      await tx.user.update({
        where: { id: user.id },
        data: {
          membershipTier: currentGift.tier,
          membershipExpiry: membershipEndDate,
        },
      });

      return { tier: currentGift.tier, expiresAt: membershipEndDate };
    });

    return NextResponse.json({
      success: true,
      message: 'Gift redeemed successfully',
      membershipTier: result.tier,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error('Error redeeming gift:', error);
    return NextResponse.json({ error: 'Failed to redeem' }, { status: 500 });
  }
}
