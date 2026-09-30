import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/stories/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';
import { getSortedStoryIds } from '@/lib/story-ranking';
import { publishScheduledChapters } from '@/lib/publish-chapters';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
}));

vi.mock('@/lib/story-ranking', () => ({
  getSortedStoryIds: vi.fn(),
}));

vi.mock('@/lib/publish-chapters', () => ({
  publishScheduledChapters: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Stories API Route Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stories', () => {
    it('returns a paginated list of stories ranked by popular', async () => {
      // Mock the ranking module to return sorted IDs
      (getSortedStoryIds as any).mockResolvedValue({
        ids: ['story2', 'story1'],
        total: 2
      });

      // Mock Prisma to return full story objects based on IDs
      (prisma.story.findMany as any).mockResolvedValue([
        { id: 'story1', title: 'First Story' },
        { id: 'story2', title: 'Second Story' }
      ]);

      const req = new Request('http://localhost:3000/api/stories?page=1&limit=10&sort=popular');
      const response = await GET(req as any);
      
      expect(response!.status).toBe(200);
      const data = await response!.json();
      
      // Asserts that it fetches IDs from ranker
      expect(getSortedStoryIds).toHaveBeenCalledWith('', 'popular');
      
      // Asserts that it returns total pages
      expect(data.totalPages).toBe(1);
      expect(data.total).toBe(2);
      
      // Asserts that it re-orders based on ranking (story2 should be first)
      expect(data.stories).toHaveLength(2);
      expect(data.stories[0].id).toBe('story2');
      expect(data.stories[1].id).toBe('story1');
      
      // Asserts it triggers scheduled chapters publishing
      expect(publishScheduledChapters).toHaveBeenCalled();
    });

    it('handles database errors gracefully', async () => {
      (getSortedStoryIds as any).mockRejectedValue(new Error('DB Failed'));
      const req = new Request('http://localhost:3000/api/stories');
      const response = await GET(req as any);
      
      expect(response!.status).toBe(500);
      const data = await response!.json();
      expect(data.error).toBe('Failed to fetch stories');
    });
  });

  describe('POST /api/stories', () => {
    it('returns 401 if unauthorized', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const req = new Request('http://localhost:3000/api/stories', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Story' })
      });

      const response = await POST(req as any);
      expect(response!.status).toBe(401);
    });

    it('returns 403 if user lacks AUTHOR feature access', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      (hasFeatureAccess as any).mockResolvedValue(false); // Not an author
      
      const req = new Request('http://localhost:3000/api/stories', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Story' })
      });

      const response = await POST(req as any);
      expect(response!.status).toBe(403);
      const data = await response!.json();
      expect(data.error).toBe('Author plan required to create stories.');
    });

    it('creates a new story and an initial chapter when valid', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'author1' } });
      (hasFeatureAccess as any).mockResolvedValue(true); // Is an author
      
      (prisma.story.create as any).mockResolvedValue({ id: 'new-story', title: 'Epic Tale' });
      (prisma.storyChapter.create as any).mockResolvedValue({ id: 'chap1' });
      
      const payload = {
        title: 'Epic Tale',
        summary: 'A long time ago...',
        genre: 'FANTASY',
        contentWarnings: ['VIOLENCE']
      };
      
      const req = new Request('http://localhost:3000/api/stories', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const response = await POST(req as any);
      expect(response!.status).toBe(201);
      
      // Asserts that story was created with authorId
      expect(prisma.story.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Epic Tale',
          summary: 'A long time ago...',
          genre: 'FANTASY',
          authorId: 'author1',
          contentWarnings: ['VIOLENCE'],
          published: false
        })
      });
      
      // Asserts that a default chapter 1 was also created
      expect(prisma.storyChapter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          storyId: 'new-story',
          title: 'Chapter 1',
          chapterNumber: 1
        })
      });
    });
  });
});
