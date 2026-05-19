import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await prisma.authorSubscription.findMany({
      where: { subscriberId: user.id },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { subscribedAt: 'desc' },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { authorId, tier } = body;

    if (!authorId || !tier) {
      return NextResponse.json(
        { error: 'Author ID and tier required' },
        { status: 400 }
      );
    }

    const validTiers = ['BASIC', 'PREMIUM', 'VIP'];
    const normalizedTier = String(tier).toUpperCase();
    if (!validTiers.includes(normalizedTier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const tierPricing: Record<string, number> = {
      BASIC: 2.99,
      PREMIUM: 4.99,
      VIP: 9.99,
    };

    // Check if already subscribed
    const existing = await prisma.authorSubscription.findFirst({
      where: { subscriberId: user.id, authorId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already subscribed to this author' },
        { status: 400 }
      );
    }

    const subscription = await prisma.authorSubscription.create({
      data: {
        subscriberId: user.id,
        authorId,
        tier: normalizedTier,
        monthlyPrice: tierPricing[normalizedTier],
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
