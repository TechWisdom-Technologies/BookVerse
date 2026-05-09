import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/tips/[userId]
 * Fetch tips received by a user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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
 * Create a tip (mock implementation - replace with real Stripe flow)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await getAuth();

    const { amount, message, storyId } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Tip amount must be at least $1' },
        { status: 400 }
      );
    }

    if (userId === user?.id) {
      return NextResponse.json(
        { error: 'Cannot tip yourself' },
        { status: 400 }
      );
    }

    // Create tip record (in production, this would integrate with Stripe)
    const tip = await prisma.tip.create({
      data: {
        amount,
        currency: 'usd',
        senderId: user?.id || null,
        receiverId: userId,
        storyId: storyId || null,
        message: message || null,
        status: 'COMPLETED', // In production, this would be PENDING until Stripe confirms
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        story: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(tip, { status: 201 });
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { error: 'Failed to create tip' },
      { status: 500 }
    );
  }
}
