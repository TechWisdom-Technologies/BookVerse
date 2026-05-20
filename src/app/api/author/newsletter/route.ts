import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';
import { createNotification } from '@/lib/notifications';

/**
 * GET /api/author/newsletter
 * Get newsletter subscribers for the current author
 */
export async function GET() {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAuthorOrAdmin = user.role === 'AUTHOR' || user.role === 'ADMIN';
    const hasAccess = isAuthorOrAdmin || (await hasFeatureAccess(user, 'CREATOR'));
    if (!hasAccess) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
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
export async function POST(req: Request) {
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

    // Notify the author that someone has subscribed to their newsletter
    try {
      await createNotification({
        userId: authorId,
        type: 'NEWSLETTER_SUBSCRIBE',
        title: 'New Newsletter Subscriber! 📧',
        message: `${user.displayName || user.username} (@${user.username}) has subscribed to your newsletter.`,
        link: '/author/newsletter',
      });
    } catch (notifErr) {
      console.error('Failed to trigger newsletter subscription notification:', notifErr);
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
