import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Rate limit: Max 10 reports per 15 minutes per IP
  const limitRes = await checkRateLimit(10, 15 * 60 * 1000);
  if (limitRes.limited) return limitRes.response;

  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const body = await req.json();
    const { storyId, reason, description } = body;

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
        description: description || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to report' }, { status: 500 });
  }
}
