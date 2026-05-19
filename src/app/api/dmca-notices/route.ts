import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const body = await req.json();
    const { storyId, originalWorkTitle, originalWorkAuthor, copyrightHolder, description } = body;

    if (!storyId || !originalWorkTitle || !copyrightHolder) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const dmcaNotice = await prisma.dMCANotice.create({
      data: {
        storyId,
        originalWorkTitle,
        originalWorkAuthor: originalWorkAuthor || null,
        copyrightHolder,
        description: description || null,
        submittedBy: user.id,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json(dmcaNotice, { status: 201 });
  } catch (error) {
    console.error('Error submitting DMCA:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
