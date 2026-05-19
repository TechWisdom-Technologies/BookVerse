import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

type ChallengeParticipantDelegate = {
  findFirst(args: unknown): Promise<{ id: string } | null>;
  create(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
};

type ReadingChallengeDelegate = {
  findUnique(args: unknown): Promise<unknown | null>;
};

type ChallengePrisma = {
  readingChallenge: ReadingChallengeDelegate;
  challengeParticipant: ChallengeParticipantDelegate;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { challengeId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const anyPrisma = prisma as unknown as ChallengePrisma;
    const challenge = await anyPrisma.readingChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Check if already participating
    const existing = await anyPrisma.challengeParticipant.findFirst({
      where: {
        userId: user.id,
        challengeId: challengeId,
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already participating' }, { status: 400 });
    }

    const participant = await anyPrisma.challengeParticipant.create({
      data: {
        userId: user.id,
        challengeId: challengeId,
        progress: 0,
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error joining challenge:', error);
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { challengeId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const anyPrisma = prisma as unknown as ChallengePrisma;
    const participant = await anyPrisma.challengeParticipant.findFirst({
      where: {
        userId: user.id,
        challengeId: challengeId,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not participating' }, { status: 404 });
    }

    await anyPrisma.challengeParticipant.delete({
      where: { id: participant.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    return NextResponse.json({ error: 'Failed to leave challenge' }, { status: 500 });
  }
}
