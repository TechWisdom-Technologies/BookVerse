import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 17: Cron Job Authentication ───

vi.mock('@/lib/prisma', () => ({
  prisma: {
    storyPromotion: { findMany: vi.fn().mockResolvedValue([]), updateMany: vi.fn() },
    user: { findMany: vi.fn().mockResolvedValue([]), updateMany: vi.fn() },
    deviceSession: { findMany: vi.fn().mockResolvedValue([]), deleteMany: vi.fn() },
    loginHistory: { findMany: vi.fn().mockResolvedValue([]), deleteMany: vi.fn() },
    giftMembership: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
    notification: { findMany: vi.fn().mockResolvedValue([]), deleteMany: vi.fn() },
    cronJobLog: { create: vi.fn().mockResolvedValue({}) },
  },
}));

vi.mock('@/lib/publish-chapters', () => ({
  publishScheduledChapters: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/resend', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

import { GET } from '@/app/api/cron/daily-maintenance/route';

describe('Phase 17: Cron Job Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'production');
    process.env.CRON_SECRET = 'my-super-secret-cron-key';
  });

  it('rejects cron requests without authorization header in production', async () => {
    const req = new Request('http://localhost/api/cron/daily-maintenance', {
      method: 'GET',
    }) as any;

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('rejects cron requests with wrong Bearer token', async () => {
    const req = new Request('http://localhost/api/cron/daily-maintenance', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer WRONG-TOKEN',
      },
    }) as any;

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('allows cron requests with correct Bearer token', async () => {
    const req = new Request('http://localhost/api/cron/daily-maintenance', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer my-super-secret-cron-key',
      },
    }) as any;

    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it('rejects when CRON_SECRET env is not set (production)', async () => {
    delete process.env.CRON_SECRET;

    const req = new Request('http://localhost/api/cron/daily-maintenance', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer anything',
      },
    }) as any;

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
