import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

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

    if (!(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    const universe = await prisma.universe.findUnique({
      where: { id: universeId },
      include: { user: true },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    if (universe.userId === user.id) {
      return NextResponse.json({ error: 'You are the owner of this universe' }, { status: 400 });
    }

    const body = await req.json();
    const { message } = body;

    // Check if already a collaborator or already requested
    const existing = await prisma.universeCollaborator.findUnique({
      where: {
        universeId_userId: {
          universeId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json({ error: 'Request or invite is already pending' }, { status: 400 });
      }
      return NextResponse.json({ error: 'You are already a collaborator' }, { status: 400 });
    }

    const request = await prisma.universeCollaborator.create({
      data: {
        universeId,
        userId: user.id,
        message,
        type: 'REQUEST',
        status: 'PENDING',
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

    // Send push & in-app notification to the universe owner
    try {
      await createNotification({
        userId: universe.userId,
        type: 'COLLABORATOR_REQUEST',
        title: 'New Co-Author Request!',
        message: message 
          ? `${user.displayName || user.username} wants to co-author "${universe.name}": "${message}"`
          : `${user.displayName || user.username} has requested to co-author your universe "${universe.name}".`,
        link: '/write/dashboard',
      });
    } catch (notifError) {
      console.error('Failed to send collaborator request notification:', notifError);
    }

    return NextResponse.json(request, { status: 201 });
  } catch (error: any) {
    console.error('Error creating collaborator request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
