import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledChapters } from '@/lib/publish-chapters';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = req.headers.get('x-vercel-cron') === 'true';
    const hasValidToken = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && !isVercelCron && !hasValidToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await publishScheduledChapters();
    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed to process scheduled chapters' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
