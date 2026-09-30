import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/app/api/activity-feed/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

describe('Activity Feed API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (getAuth as any).mockResolvedValue(null);
    const req = new Request('http://localhost/api/activity-feed');
    const res = await GET(req as any);
    expect(res.status).toBe(401);
  });

  it('returns combined and sorted activity feed for authenticated user', async () => {
    (getAuth as any).mockResolvedValue({ id: 'user1' });
    
    (prisma.follow.findMany as any).mockResolvedValue([
      { followingId: 'f1' }, { followingId: 'f2' }
    ]);
    
    // Mock recent stories
    (prisma.story.findMany as any).mockResolvedValue([
      {
        id: 's1',
        title: 'Story 1',
        createdAt: new Date('2023-10-01T10:00:00Z').toISOString(),
        author: { username: 'author1' }
      }
    ]);
    
    // Mock recent achievements
    (prisma.userAchievement.findMany as any).mockResolvedValue([
      {
        id: 'a1',
        earnedAt: new Date('2023-10-01T12:00:00Z').toISOString(),
        user: { username: 'author2' },
        achievement: { name: 'First Publish' }
      }
    ]);
    
    // Mock recent tips
    (prisma.tip.findMany as any).mockResolvedValue([
      {
        id: 't1',
        amount: 5,
        createdAt: new Date('2023-10-01T11:00:00Z').toISOString(),
        receiver: { username: 'author1' },
        story: { id: 's1', title: 'Story 1' }
      }
    ]);

    const req = new Request('http://localhost/api/activity-feed');
    const res = await GET(req as any);
    
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.count).toBe(3);
    expect(data.activities).toHaveLength(3);
    
    // The feed should be sorted descending by timestamp
    // 1st: Achievement (12:00:00Z)
    // 2nd: Tip (11:00:00Z)
    // 3rd: Story (10:00:00Z)
    expect(data.activities[0].type).toBe('achievement_earned');
    expect(data.activities[1].type).toBe('tip_received');
    expect(data.activities[2].type).toBe('story_published');
    
    expect(prisma.follow.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { followerId: 'user1' } })
    );
  });
});
