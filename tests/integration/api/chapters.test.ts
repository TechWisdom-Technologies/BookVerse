import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/stories/[id]/chapters/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

describe('Chapters API Route Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stories/[id]/chapters', () => {
    it('returns 404 if story does not exist', async () => {
      (prisma.story.findUnique as any).mockResolvedValue(null);
      
      const req = new Request('http://localhost:3000/api/stories/invalid-id/chapters');
      const response = await GET(req as any, { params: Promise.resolve({ id: 'invalid-id' }) });
      
      expect(response!.status).toBe(404);
      const data = await response!.json();
      expect(data.error).toBe('Story not found');
    });

    it('returns 404 for unpublished story if user is not author or admin', async () => {
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', published: false, authorId: 'author1' });
      // Not logged in
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters');
      const response = await GET(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(404);
    });

    it('returns chapters if story is published', async () => {
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', published: true, authorId: 'author1' });
      (prisma.storyChapter.findMany as any).mockResolvedValue([
        { id: 'chap1', title: 'Chapter 1', chapterOrder: 1 },
        { id: 'chap2', title: 'Chapter 2', chapterOrder: 2 }
      ]);
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters');
      const response = await GET(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(200);
      const data = await response!.json();
      expect(data.chapters).toHaveLength(2);
      expect(prisma.storyChapter.findMany).toHaveBeenCalledWith({
        where: { storyId: 'story123' },
        orderBy: { chapterOrder: 'asc' },
        select: expect.any(Object)
      });
    });

    it('returns chapters for unpublished story if user is the author', async () => {
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', published: false, authorId: 'author1' });
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'author1', role: 'USER' } });
      (prisma.storyChapter.findMany as any).mockResolvedValue([]);
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters');
      const response = await GET(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(200);
    });
  });

  describe('POST /api/stories/[id]/chapters', () => {
    it('returns 401 if unauthorized', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Chapter' })
      });
      const response = await POST(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(401);
    });

    it('returns 404 if story does not exist', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'author1' } });
      (prisma.story.findUnique as any).mockResolvedValue(null);
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const response = await POST(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(404);
    });

    it('returns 403 if user is not the author of the story', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'otherUser' } });
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', authorId: 'author1' });
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const response = await POST(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(403);
    });

    it('creates a new chapter with the next order number', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'author1' } });
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', authorId: 'author1' });
      
      // Mock finding the last chapter to get its order
      (prisma.storyChapter.findFirst as any).mockResolvedValue({ chapterOrder: 2 });
      
      (prisma.storyChapter.create as any).mockResolvedValue({ id: 'newChap', chapterOrder: 3 });
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters', {
        method: 'POST',
        body: JSON.stringify({ title: 'The Awakening' })
      });
      
      const response = await POST(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(201);
      const data = await response!.json();
      expect(data.chapter.id).toBe('newChap');
      
      expect(prisma.storyChapter.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { storyId: 'story123' },
          orderBy: { chapterOrder: 'desc' }
        })
      );
      
      expect(prisma.storyChapter.create).toHaveBeenCalledWith({
        data: {
          storyId: 'story123',
          title: 'The Awakening',
          content: Prisma.JsonNull,
          chapterNumber: 3,
          chapterOrder: 3
        }
      });
    });

    it('uses "Untitled Chapter" if title is missing or empty', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'author1' } });
      (prisma.story.findUnique as any).mockResolvedValue({ id: 'story123', authorId: 'author1' });
      (prisma.storyChapter.findFirst as any).mockResolvedValue(null); // No previous chapters
      
      (prisma.storyChapter.create as any).mockResolvedValue({ id: 'newChap' });
      
      const req = new Request('http://localhost:3000/api/stories/story123/chapters', {
        method: 'POST',
        body: JSON.stringify({ title: '   ' }) // Just spaces
      });
      
      const response = await POST(req as any, { params: Promise.resolve({ id: 'story123' }) });
      
      expect(response!.status).toBe(201);
      expect(prisma.storyChapter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Untitled Chapter',
          chapterNumber: 1,
          chapterOrder: 1
        })
      });
    });
  });
});
