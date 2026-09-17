import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledChapters } from '@/lib/publish-chapters';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await publishScheduledChapters();
    const durationMs = Date.now() - startTime;
    
    await prisma.cronJobLog.create({
      data: { jobName: 'publish-chapters', status: 'SUCCESS', durationMs }
    }).catch(e => console.error("Failed to log cron:", e));

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    const durationMs = Date.now() - startTime;
    await prisma.cronJobLog.create({
      data: { jobName: 'publish-chapters', status: 'FAILED', durationMs, errorMessage: error?.message?.substring(0, 500) }
    }).catch(e => console.error("Failed to log cron:", e));

    return NextResponse.json({ error: 'Failed to process scheduled chapters' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
