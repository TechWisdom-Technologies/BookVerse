import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { storyId } = body;

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID required' }, { status: 400 });
    }

    const universe = await prisma.storyUniverse.findUnique({
      where: { id: universeId },
      select: { creatorId: true, stories: true },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    if (universe.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Add story to universe (scalar array update)
    if (!universe.stories.includes(storyId)) {
      await prisma.storyUniverse.update({
        where: { id: universeId },
        data: {
          stories: {
            set: [...universe.stories, storyId],
          },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Story added to universe' });
  } catch (error) {
    console.error('Error adding story to universe:', error);
    return NextResponse.json({ error: 'Failed to add' }, { status: 500 });
  }
}
