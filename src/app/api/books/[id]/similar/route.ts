import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/books/[id]/similar
 * Get books similar to the given book
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const limit = 6;

    // Get the book
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = book.reviews.length > 0
      ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
      : 0;

    // Get similar books by genre
    const similarBooks = await prisma.book.findMany({
      where: {
        AND: [
          { genre: book.genre },
          { id: { not: id } },
        ],
      },
      include: {
        uploadedBy: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        reviews: {
          select: { rating: true },
        },
        saves: {
          select: { id: true },
        },
      },
      take: limit,
    });

    // If not enough similar books by genre, get books with similar keywords
    if (similarBooks.length < limit) {
      const keywords = book.genre.split(' ');
      const additionalBooks = await prisma.book.findMany({
        where: {
          AND: [
            { id: { not: id } },
            { id: { notIn: similarBooks.map(b => b.id) } },
            {
              OR: keywords.map(keyword => ({
                genre: { contains: keyword, mode: 'insensitive' as const },
              })),
            },
          ],
        },
        include: {
          uploadedBy: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
          reviews: {
            select: { rating: true },
          },
          saves: {
            select: { id: true },
          },
        },
        take: limit - similarBooks.length,
      });

      similarBooks.push(...additionalBooks);
    }

    // Format response
    const formattedBooks = similarBooks.map(b => ({
      id: b.id,
      title: b.title,
      genre: b.genre,
      coverUrl: b.coverUrl,
      author: {
        id: b.uploadedBy.id,
        username: b.uploadedBy.username,
        displayName: b.uploadedBy.displayName,
        avatarUrl: b.uploadedBy.avatarUrl,
      },
      rating: b.reviews.length > 0
        ? (b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length).toFixed(1)
        : 0,
      reviewCount: b.reviews.length,
      saveCount: b.saves.length,
      downloadCount: b.downloadCount,
    }));

    return NextResponse.json({
      sourceBook: {
        id: book.id,
        title: book.title,
        genre: book.genre,
        rating: avgRating.toFixed(1),
        reviewCount: book.reviews.length,
      },
      similar: formattedBooks,
    });
  } catch (error) {
    console.error('Error fetching similar books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar books' },
      { status: 500 }
    );
  }
}
