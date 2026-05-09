import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/books/[id]/purchase-status
 * Check if current user has purchased or has access to a book
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();

    const book = await prisma.book.findUnique({
      where: { id },
      select: { uploadedById: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Free access if user is the author or if it's free
    const hasAccess = user?.id === book.uploadedById;

    return NextResponse.json({
      hasAccess,
      isPurchased: hasAccess,
      canRead: hasAccess,
    });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return NextResponse.json(
      { error: 'Failed to check purchase status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books/[id]/purchase
 * Purchase a book (mock implementation)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { price } = await req.json();

    const book = await prisma.book.findUnique({
      where: { id },
      select: { id: true, title: true, uploadedById: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.uploadedById === user.id) {
      return NextResponse.json(
        { error: 'Cannot purchase your own book' },
        { status: 400 }
      );
    }

    // In production, integrate with Stripe to create a payment session
    // For now, this is a mock implementation
    const purchaseRecord = {
      id: `purchase-${Date.now()}`,
      bookId: id,
      userId: user.id,
      authorId: book.uploadedById,
      price: price || 0,
      status: 'pending',
      createdAt: new Date(),
      stripeSessionId: null,
    };

    // TODO: Create actual purchase record in database
    // This would require adding a Purchase model to Prisma schema

    return NextResponse.json(purchaseRecord, { status: 201 });
  } catch (error) {
    console.error('Error purchasing book:', error);
    return NextResponse.json(
      { error: 'Failed to purchase book' },
      { status: 500 }
    );
  }
}
