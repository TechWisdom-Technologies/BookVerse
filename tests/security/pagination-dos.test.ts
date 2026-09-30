import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { GET } from '@/app/api/clubs/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    club: {
      findMany: vi.fn(),
      count: vi.fn().mockResolvedValue(50),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Phase 15: Unbounded Pagination & DoS Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Clubs API Pagination', () => {
    it('limits club results to prevent massive data retrieval DoS', async () => {
      // Mock returning many items
      (prisma.club.findMany as any).mockResolvedValue(new Array(50).fill({ id: 'club1' }));

      const req = new Request('http://localhost/api/clubs');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      
      // Ensure findMany was called with a "take" or "limit" argument
      expect(prisma.club.findMany).toHaveBeenCalled();
      const callArgs = (prisma.club.findMany as any).mock.calls[0][0];
      
      // Check if pagination boundaries are enforced
      expect(callArgs).toHaveProperty('take');
      expect(callArgs.take).toBeLessThanOrEqual(100);
      expect(callArgs.take).toBeGreaterThan(0);
    });
  });
});
