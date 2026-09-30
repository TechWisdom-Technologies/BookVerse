import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/app/api/stats/route';
import { prisma } from '@/lib/prisma';

describe('Stats API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns aggregated platform statistics', async () => {
    (prisma.book.count as any).mockResolvedValue(100);
    
    // We need to implement a mock for user.count that returns different values based on arguments.
    // The first call (or the one with { where: { role: 'AUTHOR' } }) should return 10
    // The second call (or the one without args) should return 500
    (prisma.user.count as any).mockImplementation((args: any) => {
      if (args?.where?.role === 'AUTHOR') {
        return Promise.resolve(10);
      }
      return Promise.resolve(500);
    });

    const res = await GET();
    
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.totalBooks).toBe(100);
    expect(data.totalAuthors).toBe(10);
    expect(data.totalUsers).toBe(500);
    
    expect(prisma.book.count).toHaveBeenCalledTimes(1);
    expect(prisma.user.count).toHaveBeenCalledTimes(2);
  });
});
