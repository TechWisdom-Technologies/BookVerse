import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { storyId, reason } = body;

    if (!storyId || !reason) {
      return NextResponse.json(
        { error: 'Story ID and reason required' },
        { status: 400 }
      );
    }

    const validReasons = ['COPYRIGHTED', 'EXPLICIT', 'HATE_SPEECH', 'HARASSMENT', 'OTHER'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason' }, { status: 400 });
    }

    const report = await prisma.contentReport.create({
      data: {
        reportedBy: user.id,
        storyId,
        reason,
        status: 'PENDING',
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to report' }, { status: 500 });
  }
}
