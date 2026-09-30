import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/clubs/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';
import { checkRateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
  paidFeatureError: vi.fn((feature) => ({ error: `Paid feature ${feature} required` })),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Clubs API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/clubs', () => {
    it('returns clubs matching genre and search', async () => {
      (prisma.club.findMany as any).mockResolvedValue([
        { id: 'c1', name: 'Fantasy Fans', genre: 'Fantasy' }
      ]);

      const req = new Request('http://localhost/api/clubs?genre=Fantasy&search=Fans');
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);

      expect(prisma.club.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            genre: 'Fantasy',
            OR: [
              { name: { contains: 'Fans', mode: 'insensitive' } },
              { description: { contains: 'Fans', mode: 'insensitive' } }
            ]
          }
        })
      );
    });
  });

  describe('POST /api/clubs', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/clubs', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Club' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 402 if user lacks AUTHOR feature access', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(false);

      const req = new Request('http://localhost/api/clubs', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Club' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(402);
    });

    it('returns 400 if name is missing', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);

      const req = new Request('http://localhost/api/clubs', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(400);
    });

    it('returns 409 if club name already exists', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.club.findUnique as any).mockResolvedValue({ id: 'c2', name: 'Taken Name' });

      const req = new Request('http://localhost/api/clubs', {
        method: 'POST',
        body: JSON.stringify({ name: 'Taken Name' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(409);
    });

    it('creates a new club successfully', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.club.findUnique as any).mockResolvedValue(null);

      (prisma.club.create as any).mockResolvedValue({
        id: 'c3',
        name: 'Epic Club',
        ownerId: 'u1'
      });

      const req = new Request('http://localhost/api/clubs', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Epic Club',
          description: 'A great club',
          genre: 'Sci-Fi'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(201);

      expect(prisma.club.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Epic Club',
            description: 'A great club',
            genre: 'Sci-Fi',
            ownerId: 'u1'
          })
        })
      );
    });
  });
});
