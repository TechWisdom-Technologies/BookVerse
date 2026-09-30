import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/series/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';
import { checkRateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Series API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/series', () => {
    it('returns series for a specific userId', async () => {
      (prisma.series.findMany as any).mockResolvedValue([
        { id: 's1', name: 'My Series', userId: 'user1' }
      ]);
      
      const req = new Request('http://localhost/api/series?userId=user1');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('My Series');
      
      expect(prisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user1' }
        })
      );
    });

    it('returns onlyMine series if user is authenticated', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user2' });
      (prisma.series.findMany as any).mockResolvedValue([
        { id: 's2', name: 'User 2 Series', userId: 'user2' }
      ]);
      
      const req = new Request('http://localhost/api/series?onlyMine=true');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      
      expect(prisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user2' }
        })
      );
    });

    it('returns 401 if onlyMine is true but user is unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/series?onlyMine=true');
      const res = await GET(req as any);
      
      expect(res.status).toBe(401);
    });

    it('filters by search term', async () => {
      (prisma.series.findMany as any).mockResolvedValue([]);
      
      const req = new Request('http://localhost/api/series?search=epic');
      await GET(req as any);
      
      expect(prisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: { contains: 'epic', mode: 'insensitive' }
          }
        })
      );
    });
  });

  describe('POST /api/series', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/series', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Series' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 402 if user lacks AUTHOR feature access', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(false);
      
      const req = new Request('http://localhost/api/series', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Series' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(402);
    });

    it('returns 400 if name is missing', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      
      const req = new Request('http://localhost/api/series', {
        method: 'POST',
        body: JSON.stringify({ name: '   ' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(400);
    });

    it('creates a new series successfully', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.series.create as any).mockResolvedValue({
        id: 's_new',
        name: 'New Series',
        genre: 'Fantasy'
      });
      
      const req = new Request('http://localhost/api/series', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Series',
          description: 'A great saga',
          genre: 'Fantasy'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(201);
      
      const data = await res.json();
      expect(data.id).toBe('s_new');
      
      expect(prisma.series.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'New Series',
            description: 'A great saga',
            genre: 'Fantasy',
            coverUrl: null,
            userId: 'u1'
          }
        })
      );
    });
  });
});
