import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET() {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    // Fetch requests where the universe or series belongs to the logged-in user
    const requests = await prisma.bookRequest.findMany({
      where: {
        OR: [
          {
            universe: {
              userId: user.id,
            },
          },
          {
            series: {
              userId: user.id,
            },
          },
        ],
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
        universe: {
          select: {
            id: true,
            name: true,
          },
        },
        series: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching book requests:', error);
    return NextResponse.json({ error: 'Failed to fetch book requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { universeId, seriesId } = body;

    if (!universeId && !seriesId) {
      return NextResponse.json({ error: 'Either Universe ID or Series ID is required' }, { status: 400 });
    }

    // Create the book request
    const request = await prisma.bookRequest.create({
      data: {
        userId: user.id,
        universeId: universeId || null,
        seriesId: seriesId || null,
      },
      include: {
        user: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error: any) {
    console.error('Error creating book request:', error);
    return NextResponse.json({ error: 'Failed to submit book request' }, { status: 500 });
  }
}
