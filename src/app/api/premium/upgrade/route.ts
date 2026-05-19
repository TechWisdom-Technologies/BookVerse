import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, duration } = await req.json();
    const upperPlan = plan?.toUpperCase();

    if (upperPlan !== 'PRO' && upperPlan !== 'CREATOR') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const months = duration ? Number(duration) : 1;
    const membershipExpiry = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipTier: upperPlan,
        membershipExpiry,
      },
    });

    return NextResponse.json({
      success: true,
      membershipTier: updatedUser.membershipTier,
      membershipExpiry,
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription upgrade' }, { status: 500 });
  }
}
