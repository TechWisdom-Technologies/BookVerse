import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/author/newsletter/[authorId]/unsubscribe
 * Unsubscribe from an author's newsletter
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  try {
    const { authorId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.newsletterSubscriber.findUnique({
      where: {
        authorId_subscriberId: {
          authorId,
          subscriberId: user.id,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Not subscribed to this newsletter' },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.delete({
      where: {
        authorId_subscriberId: {
          authorId,
          subscriberId: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
