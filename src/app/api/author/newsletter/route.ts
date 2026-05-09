import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/author/newsletter
 * Get newsletter subscribers for the current author
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { authorId: user.id },
      include: {
        subscriber: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/author/newsletter/subscribe
 * Subscribe to an author's newsletter
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { authorId } = await req.json();

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    if (authorId === user.id) {
      return NextResponse.json(
        { error: 'Cannot subscribe to your own newsletter' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: {
        authorId_subscriberId: {
          authorId,
          subscriberId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Already subscribed to this newsletter' },
        { status: 409 }
      );
    }

    const subscription = await prisma.newsletterSubscriber.create({
      data: {
        authorId,
        subscriberId: user.id,
      },
      include: {
        subscriber: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
