import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ universeId: string; storyId: string }> }
) {
  try {
    const { universeId, storyId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const universe = await prisma.universe.findUnique({
      where: { id: universeId },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    if (universe.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. Only the universe owner can remove stories.' }, { status: 403 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (story.universeId !== universeId) {
      return NextResponse.json({ error: 'Story is not in this universe' }, { status: 400 });
    }

    const body = await req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'A reason must be provided to remove a story.' }, { status: 400 });
    }

    // Unlink the story from the universe
    await prisma.story.update({
      where: { id: storyId },
      data: {
        universeId: null,
      },
    });

    // Notify the story author
    if (story.authorId !== user.id) {
      try {
        await createNotification({
          userId: story.authorId,
          type: 'STORY_REMOVED',
          title: `Story Removed from Universe`,
          message: `${user.displayName || user.username} has removed your story "${story.title}" from the universe "${universe.name}". Reason: "${reason}"`,
          link: `/write/dashboard`,
        });
      } catch (notifError) {
        console.error('Failed to send story removal notification:', notifError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error removing story from universe:', error);
    return NextResponse.json({ error: 'Failed to remove story from universe' }, { status: 500 });
  }
}
