import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ clubId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await context.params;

    await prisma.clubMember.updateMany({
      where: {
        clubId,
        userId: user.id
      },
      data: {
        lastReadAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating last read:', error);
    return NextResponse.json({ error: 'Failed to update last read' }, { status: 500 });
  }
}
