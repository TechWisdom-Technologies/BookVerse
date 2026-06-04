import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { displayName: true, username: true, avatarUrl: true } },
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Get chapter count
    const chapterCount = await prisma.storyChapter.count({
      where: { storyId: id },
    });

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    // Generate sharing card with metrics
    const shareCard = {
      title: story.title,
      description: story.summary || 'Check out this story on BookVerse!',
      author: story.author.displayName,
      authorHandle: story.author.username,
      image: story.coverUrl || '/default-story.png',
      url: `${baseUrl}/stories/${story.id}`,
      metrics: {
        views: story.viewCount || 0,
        reactions: story.reactionCount || 0,
        chapters: chapterCount,
      },
      shareText: `Reading "${story.title}" by @${story.author.username} on BookVerse. Join the community!`,
    };

    return NextResponse.json(shareCard);
  } catch (error) {
    console.error('Error generating share card:', error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}

import { getAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

const VALID_PLATFORMS = ['twitter', 'facebook', 'whatsapp', 'telegram', 'copy', 'email', 'reddit', 'linkedin', 'pinterest'];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit: 10 share logs per minute per IP
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { id } = await params;
    
    // Require authentication
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { platform } = body;

    if (!platform || typeof platform !== 'string') {
      return NextResponse.json({ error: 'Platform required' }, { status: 400 });
    }

    const normalizedPlatform = platform.toLowerCase().trim();
    if (!VALID_PLATFORMS.includes(normalizedPlatform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Log share activity for analytics
    await prisma.shareActivity.create({
      data: {
        storyId: id,
        platform: normalizedPlatform,
        sharedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Share logged' });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error logging share:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
