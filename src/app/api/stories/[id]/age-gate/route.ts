import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();

    const story = await prisma.story.findUnique({
      where: { id },
      select: { ageRating: true, contentWarnings: true, authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Check if user meets age requirement
    if (user) {
      const userAge = await prisma.user.findUnique({
        where: { id: user.id },
        select: { dateOfBirth: true },
      });

      if (userAge?.dateOfBirth) {
        const age = Math.floor((Date.now() - new Date(userAge.dateOfBirth).getTime()) / 31557600000);
        const isAllowed = age >= (story.ageRating || 0);

        return NextResponse.json({
          ageRating: story.ageRating,
          contentWarnings: story.contentWarnings,
          isAllowed,
          userAge: age,
        });
      }
    }

    return NextResponse.json({
      ageRating: story.ageRating,
      contentWarnings: story.contentWarnings,
      isAllowed: false,
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Error checking age gate:', error);
    return NextResponse.json({ error: 'Failed to check' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story || story.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { ageRating, contentWarnings } = body;

    const updated = await prisma.story.update({
      where: { id },
      data: {
        ageRating: ageRating || 0,
        contentWarnings: contentWarnings || [],
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating age gate:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
