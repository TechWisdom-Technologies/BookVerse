import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        stories: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            viewCount: true,
            genre: true,
            summary: true,
            author: {
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
            avatarUrl: true,
          },
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series details:', error);
    return NextResponse.json({ error: 'Failed to fetch series details' }, { status: 500 });
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

    if (series.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, coverUrl, genre } = body;

    // Delete old cover from Cloudinary if it's being replaced or removed
    if (coverUrl !== undefined && coverUrl !== series.coverUrl && series.coverUrl) {
      if (series.coverUrl.includes("res.cloudinary.com")) {
        const publicIdMatch = series.coverUrl.match(/\/v\d+\/(.+?)\.[a-zA-Z]+$/);
        if (publicIdMatch && publicIdMatch[1]) {
          void deleteFromCloudinary(publicIdMatch[1]);
        }
      }
    }

    const updated = await prisma.series.update({
      where: { id: seriesId },
      data: {
        name: name?.trim() || series.name,
        description: description !== undefined ? (description?.trim() || null) : series.description,
        coverUrl: coverUrl !== undefined ? (coverUrl?.trim() || null) : series.coverUrl,
        genre: genre !== undefined ? genre : series.genre,
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

    if (series.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Decouple linked stories from the deleted series
    await prisma.story.updateMany({
      where: { seriesId },
      data: { seriesId: null },
    });

    if (series.coverUrl && series.coverUrl.includes("res.cloudinary.com")) {
      const publicIdMatch = series.coverUrl.match(/\/v\d+\/(.+?)\.[a-zA-Z]+$/);
      if (publicIdMatch && publicIdMatch[1]) {
        void deleteFromCloudinary(publicIdMatch[1]);
      }
    }

    await prisma.series.delete({
      where: { id: seriesId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 });
  }
}
