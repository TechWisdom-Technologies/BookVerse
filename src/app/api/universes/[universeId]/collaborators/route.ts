import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
    const collaborators = await prisma.universeCollaborator.findMany({
      where: { 
        universeId,
        status: { not: 'REJECTED' }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    const body = await req.json();
    const { username, message } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ error: 'You cannot add yourself as a collaborator' }, { status: 400 });
    }

    // Check if already a collaborator
    const existing = await prisma.universeCollaborator.findUnique({
      where: {
        universeId_userId: {
          universeId,
          userId: targetUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 });
    }

    const collaborator = await prisma.universeCollaborator.create({
      data: {
        universeId,
        userId: targetUser.id,
        message,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    // Send push & in-app notification to the added collaborator
    try {
      await createNotification({
        userId: targetUser.id,
        type: 'COLLABORATOR_INVITE',
        title: 'Collaboration Invite!',
        message: message 
          ? `${user.displayName || user.username} invited you: "${message}"`
          : `${user.displayName || user.username} has invited you to collaborate on their universe "${universe.name}"!`,
        link: '/write/dashboard',
      });
    } catch (notifError) {
      console.error('Failed to send collaborator invite notification:', notifError);
    }

    return NextResponse.json(collaborator, { status: 201 });
  } catch (error: any) {
    console.error('Error adding collaborator:', error);
    return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
  }
}
