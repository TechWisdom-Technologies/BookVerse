import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/universes/route';
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

describe('Universes API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/universes', () => {
    it('returns universes for a specific userId', async () => {
      (prisma.universe.findMany as any).mockResolvedValue([
        { id: 'u1', name: 'My Universe', userId: 'user1' }
      ]);
      
      const req = new Request('http://localhost/api/universes?userId=user1');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('My Universe');
      
      // Verify prisma was called with OR clause for userId and collaborators
      expect(prisma.universe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: 'user1' },
              { collaborators: { some: { userId: 'user1', status: 'ACCEPTED' } } }
            ]
          }
        })
      );
    });

    it('returns onlyMine universes if user is authenticated', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user2' });
      (prisma.universe.findMany as any).mockResolvedValue([
        { id: 'u2', name: 'User 2 Universe', userId: 'user2' }
      ]);
      
      const req = new Request('http://localhost/api/universes?onlyMine=true');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      
      expect(prisma.universe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: 'user2' },
              { collaborators: { some: { userId: 'user2', status: 'ACCEPTED' } } }
            ]
          }
        })
      );
    });

    it('returns 401 if onlyMine is true but user is unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/universes?onlyMine=true');
      const res = await GET(req as any);
      
      expect(res.status).toBe(401);
    });

    it('filters by search term', async () => {
      (prisma.universe.findMany as any).mockResolvedValue([]);
      
      const req = new Request('http://localhost/api/universes?search=galaxy');
      await GET(req as any);
      
      expect(prisma.universe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: { contains: 'galaxy', mode: 'insensitive' }
          }
        })
      );
    });
  });

  describe('POST /api/universes', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/universes', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Universe' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 402 if user lacks AUTHOR feature access', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(false); // No author plan
      
      const req = new Request('http://localhost/api/universes', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Universe' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(402);
      const data = await res.json();
      expect(data.error).toMatch(/Author plan required/i);
    });

    it('returns 400 if name is missing', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      
      const req = new Request('http://localhost/api/universes', {
        method: 'POST',
        body: JSON.stringify({ name: '   ' })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(400);
    });

    it('creates a new universe successfully', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.universe.create as any).mockResolvedValue({
        id: 'u_new',
        name: 'New Universe',
        genre: 'Sci-Fi'
      });
      
      const req = new Request('http://localhost/api/universes', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Universe',
          description: 'A grand tale',
          genre: 'Sci-Fi'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(201);
      
      const data = await res.json();
      expect(data.id).toBe('u_new');
      expect(data.name).toBe('New Universe');
      
      expect(prisma.universe.create).toHaveBeenCalledWith({
        data: {
          name: 'New Universe',
          description: 'A grand tale',
          genre: 'Sci-Fi',
          coverUrl: null,
          userId: 'u1'
        },
        include: { stories: true }
      });
    });
  });
});
