import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const { optionId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const option = await prisma.pollOption.findUnique({
      where: { id: optionId },
      include: { poll: true },
    });

    if (!option) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    if (option.poll.expiresAt && new Date() > option.poll.expiresAt) {
      return NextResponse.json({ error: 'Poll has expired' }, { status: 400 });
    }

    // Check if user already voted on this poll
    const existingVote = await prisma.pollVote.findFirst({
      where: {
        userId: user.uid,
        option: {
          pollId: option.pollId,
        },
      },
    });

    if (existingVote) {
      // Remove existing vote and add new one
      await prisma.pollVote.delete({ where: { id: existingVote.id } });
    }

    const vote = await prisma.pollVote.create({
      data: {
        userId: user.uid,
        optionId: optionId,
      },
    });

    const updatedOption = await prisma.pollOption.findUnique({
      where: { id: optionId },
      include: {
        votes: { select: { userId: true } },
      },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
