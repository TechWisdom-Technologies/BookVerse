import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            sequenceNumber: true,
            genre: true,
            description: true,
            downloadCount: true,
            rating: true,
            uploadedBy: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
          orderBy: { sequenceNumber: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    if (series.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, genre } = body;

    const updated = await prisma.series.update({
      where: { id: seriesId },
      data: {
        name: name?.trim() || series.name,
        description: description?.trim() || series.description,
        genre: genre?.trim() || series.genre,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json({ error: 'Failed to update series' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    if (series.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove from books
    await prisma.book.updateMany({
      where: { seriesId },
      data: { seriesId: null, sequenceNumber: null },
    });

    await prisma.series.delete({
      where: { id: seriesId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 });
  }
}
