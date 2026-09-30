import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/app/api/cron/publish-chapters/route';
import { publishScheduledChapters } from '@/lib/publish-chapters';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/publish-chapters', () => ({
  publishScheduledChapters: vi.fn(),
}));

describe('Cron Publish Chapters API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('CRON_SECRET', 'super-secret');
  });

  it('returns 401 if CRON_SECRET is missing or mismatch', async () => {
    const req = new Request('http://localhost/api/cron/publish-chapters', {
      headers: {
        'authorization': 'Bearer wrong-secret'
      }
    });
    
    const response = await GET(req as any);
    expect(response.status).toBe(401);
  });

  it('returns 200 and processes chapters successfully', async () => {
    (publishScheduledChapters as any).mockResolvedValue([
      { storyId: 's1', chapterNumber: 1, published: true }
    ]);
    (prisma.cronJobLog.create as any).mockResolvedValue({});
    
    const req = new Request('http://localhost/api/cron/publish-chapters', {
      headers: {
        'authorization': 'Bearer super-secret'
      }
    });
    
    const response = await GET(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.processed).toBe(1);
    
    expect(publishScheduledChapters).toHaveBeenCalled();
    expect(prisma.cronJobLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        jobName: 'publish-chapters',
        status: 'SUCCESS'
      })
    });
  });

  it('handles errors gracefully and logs failure', async () => {
    (publishScheduledChapters as any).mockRejectedValue(new Error('Publishing failed'));
    (prisma.cronJobLog.create as any).mockResolvedValue({});
    
    const req = new Request('http://localhost/api/cron/publish-chapters', {
      headers: {
        'authorization': 'Bearer super-secret'
      }
    });
    
    const response = await GET(req as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to process scheduled chapters');
    
    expect(prisma.cronJobLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        jobName: 'publish-chapters',
        status: 'FAILED',
        errorMessage: 'Publishing failed'
      })
    });
  });
});
