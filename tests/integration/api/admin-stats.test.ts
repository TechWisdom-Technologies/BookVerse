import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/app/api/admin/stats/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

describe('Admin Stats API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 if user is not an ADMIN', async () => {
    (verifyToken as any).mockResolvedValue({ dbUser: { role: 'USER' } });
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('returns aggregated admin statistics if user is ADMIN', async () => {
    (verifyToken as any).mockResolvedValue({ dbUser: { role: 'ADMIN' } });
    
    // Mock standard counts
    (prisma.user.count as any).mockImplementation((args: any) => {
      if (args?.where) {
        return Promise.resolve(5); // New users this week
      }
      return Promise.resolve(100); // Total users
    });
    
    (prisma.book.count as any).mockResolvedValue(20);
    (prisma.story.count as any).mockResolvedValue(30);
    (prisma.comment.count as any).mockResolvedValue(40);
    
    // Mock downloaded books
    (prisma.book.findMany as any).mockResolvedValue([
      { downloadCount: 5 },
      { downloadCount: 15 }
    ]);

    const res = await GET();
    
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.totalUsers).toBe(100);
    expect(data.totalBooks).toBe(20);
    expect(data.totalStories).toBe(30);
    expect(data.totalComments).toBe(40);
    expect(data.newUsersThisWeek).toBe(5);
    expect(data.downloadsToday).toBe(20); // 5 + 15
    
    expect(prisma.user.count).toHaveBeenCalledTimes(2);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });
});
