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
    const { recipientEmail, tier, duration } = body;

    if (!recipientEmail || !tier || !duration) {
      return NextResponse.json(
        { error: 'Recipient email, tier, and duration required' },
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
      PRO: 9.99,
      CREATOR: 19.99,
    };

    const gift = await prisma.giftMembership.create({
      data: {
        code: giftCode,
        tier,
        duration,
        sentBy: user.uid,
        recipientEmail,
        value: (tierPricing[tier] || 0) * duration,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        status: 'PENDING',
      },
    });

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
