import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSortedStoryIds } from '../../src/lib/story-ranking';
import { prisma } from '@/lib/prisma';

describe('Story Ranking Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sorts by "recent" efficiently using DB order', async () => {
    (prisma.story.findMany as any).mockResolvedValue([
      { id: 'story2' },
      { id: 'story1' }
    ]);

    const result = await getSortedStoryIds('Fantasy', 'recent', 'TestAuthor');
    
    expect(result).toEqual({ ids: ['story2', 'story1'], total: 2 });
    
    // Verify where clause was constructed properly
    expect(prisma.story.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        published: true,
        OR: expect.any(Array),
        author: expect.objectContaining({
          isDeactivated: false,
          OR: expect.any(Array)
        })
      }),
      orderBy: { createdAt: 'desc' }
    }));
  });

  it('sorts organically by popularity score', async () => {
    // 1st story: high views, low comments
    // 2nd story: low views, high comments (worth 3 points each)
    (prisma.story.findMany as any).mockResolvedValue([
      {
        id: 's1',
        viewCount: 100,
        reactionCount: 10,
        promotions: [],
        createdAt: new Date('2026-01-01'),
        _count: { comments: 5, inlineComments: 0 }
      },
      {
        id: 's2',
        viewCount: 50,
        reactionCount: 20,
        promotions: [],
        createdAt: new Date('2026-01-02'),
        _count: { comments: 50, inlineComments: 10 }
      }
    ]);

    (prisma.readingLog.groupBy as any).mockResolvedValue([
      { storyId: 's1', _sum: { minutes: 200 } },
      { storyId: 's2', _sum: { minutes: 50 } }
    ]);

    const result = await getSortedStoryIds(undefined, 'popular', undefined);
    
    // s1 score = 100 + (10*2) + (5*3) + 200 = 335
    // s2 score = 50 + (20*2) + (60*3) + 50 = 320
    
    // So s1 should be first.
    expect(result.ids).toEqual(['s1', 's2']);
  });

  it('handles sorting strictly by reactions', async () => {
    (prisma.story.findMany as any).mockResolvedValue([
      {
        id: 's1',
        viewCount: 1000,
        reactionCount: 5,
        promotions: [],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      },
      {
        id: 's2',
        viewCount: 10,
        reactionCount: 50, // More reactions
        promotions: [],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      }
    ]);

    (prisma.readingLog.groupBy as any).mockResolvedValue([]);

    const result = await getSortedStoryIds(undefined, 'reactions');
    expect(result.ids).toEqual(['s2', 's1']);
  });

  it('handles sorting strictly by views', async () => {
    (prisma.story.findMany as any).mockResolvedValue([
      {
        id: 's1',
        viewCount: 1000,
        reactionCount: 0,
        promotions: [],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      },
      {
        id: 's2',
        viewCount: 2000, // More views
        reactionCount: 100,
        promotions: [],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      }
    ]);

    (prisma.readingLog.groupBy as any).mockResolvedValue([]);

    const result = await getSortedStoryIds(undefined, 'views');
    expect(result.ids).toEqual(['s2', 's1']);
  });

  it('prioritizes TRENDING over PROMOTED and ORGANIC regardless of organic score', async () => {
    (prisma.story.findMany as any).mockResolvedValue([
      {
        id: 'organic',
        viewCount: 9999,
        reactionCount: 9999,
        promotions: [],
        createdAt: new Date(),
        _count: { comments: 9999, inlineComments: 0 }
      },
      {
        id: 'promoted',
        viewCount: 10,
        reactionCount: 10,
        promotions: [{ tier: 'PROMOTED', cost: 100, startDate: new Date() }],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      },
      {
        id: 'trending',
        viewCount: 5,
        reactionCount: 5,
        promotions: [{ tier: 'TRENDING', cost: 200, startDate: new Date() }],
        createdAt: new Date(),
        _count: { comments: 0, inlineComments: 0 }
      }
    ]);

    (prisma.readingLog.groupBy as any).mockResolvedValue([]);

    const result = await getSortedStoryIds();
    
    // Expected order: Trending (Tier 3), Promoted (Tier 2), Organic (Tier 1)
    expect(result.ids).toEqual(['trending', 'promoted', 'organic']);
  });

  it('breaks ties between promoted stories by cost, views, quality, and then oldest first', async () => {
    const baseDate = new Date('2026-01-01').getTime();
    
    (prisma.story.findMany as any).mockResolvedValue([
      // Same tier, same cost, same views, same quality -> oldest wins
      {
        id: 'newest_promo',
        viewCount: 100,
        reactionCount: 50,
        promotions: [{ tier: 'PROMOTED', cost: 100, startDate: new Date(baseDate + 1000) }], // newer
        createdAt: new Date(),
        _count: { comments: 50, inlineComments: 0 }
      },
      {
        id: 'oldest_promo',
        viewCount: 100,
        reactionCount: 50,
        promotions: [{ tier: 'PROMOTED', cost: 100, startDate: new Date(baseDate) }], // older
        createdAt: new Date(),
        _count: { comments: 50, inlineComments: 0 }
      },
      // Higher quality wins over lower quality (if views and cost match)
      {
        id: 'high_quality_promo',
        viewCount: 100,
        reactionCount: 60, // higher reaction -> higher quality
        promotions: [{ tier: 'PROMOTED', cost: 100, startDate: new Date(baseDate) }],
        createdAt: new Date(),
        _count: { comments: 50, inlineComments: 0 }
      },
      // Higher views wins over higher quality
      {
        id: 'high_views_promo',
        viewCount: 150,
        reactionCount: 10,
        promotions: [{ tier: 'PROMOTED', cost: 100, startDate: new Date(baseDate) }],
        createdAt: new Date(),
        _count: { comments: 10, inlineComments: 0 }
      },
      // Higher cost wins above all other tie-breakers within the SAME tier
      {
        id: 'high_cost_promo',
        viewCount: 10,
        reactionCount: 10,
        promotions: [{ tier: 'PROMOTED', cost: 500, startDate: new Date(baseDate) }],
        createdAt: new Date(),
        _count: { comments: 10, inlineComments: 0 }
      }
    ]);

    (prisma.readingLog.groupBy as any).mockResolvedValue([]);

    const result = await getSortedStoryIds();
    
    // Order: High Cost -> High Views -> High Quality -> Oldest -> Newest
    expect(result.ids).toEqual([
      'high_cost_promo',
      'high_views_promo',
      'high_quality_promo',
      'oldest_promo',
      'newest_promo'
    ]);
  });
});
