import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, duration, senderNumber, transactionId } = await req.json();

    const upperPlan = plan?.toUpperCase();
    if (upperPlan !== 'PRO' && upperPlan !== 'CREATOR' && upperPlan !== 'AUTHOR') {
      return NextResponse.json({ error: 'Invalid subscription plan selected.' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { membershipTier: true, membershipExpiry: true },
    });

    if (dbUser?.membershipTier) {
      const isActive = !dbUser.membershipExpiry || new Date(dbUser.membershipExpiry).getTime() > Date.now();
      if (isActive) {
        const tierRank = (t: string) => t === 'CREATOR' ? 3 : t === 'PRO' ? 2 : t === 'AUTHOR' ? 1 : 0;
        if (tierRank(dbUser.membershipTier) >= tierRank(upperPlan)) {
          return NextResponse.json({ 
            error: `You already have an active ${dbUser.membershipTier} plan or higher. You cannot purchase a lower tier.` 
          }, { status: 400 });
        }
      }
    }

    const months = duration ? Number(duration) : 1;
    if (![1, 3, 6, 12].includes(months)) {
      return NextResponse.json({ error: 'Invalid subscription duration selected.' }, { status: 400 });
    }

    if (!senderNumber || typeof senderNumber !== 'string' || !senderNumber.trim()) {
      return NextResponse.json({ error: 'Sender Mobile Number is required.' }, { status: 400 });
    }

    if (!transactionId || typeof transactionId !== 'string' || !transactionId.trim()) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    const cleanTxnId = transactionId.trim();

    // Prevent duplicate Transaction ID submissions
    const existingTxn = await prisma.subscriptionTransaction.findUnique({
      where: { transactionId: cleanTxnId },
    });

    if (existingTxn) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been submitted for verification.' },
        { status: 400 }
      );
    }

    // Calculate billing amount based on plan prices (AUTHOR = 99 BDT, PRO = 299 BDT, CREATOR = 799 BDT per month)
    const pricePerMonth = upperPlan === 'CREATOR' ? 799 : upperPlan === 'PRO' ? 299 : 99;
    const amount = pricePerMonth * months;

    // Log the pending manual payment transaction
    const transaction = await prisma.subscriptionTransaction.create({
      data: {
        userId: user.id,
        plan: upperPlan,
        duration: months,
        amount,
        senderNumber: senderNumber.trim(),
        transactionId: cleanTxnId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction submitted successfully for administrative review.',
      transactionId: transaction.transactionId,
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription upgrade' }, { status: 500 });
  }
}
