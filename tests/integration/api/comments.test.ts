import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/stories/[id]/comments/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendCommentNotification } from '@/lib/resend';
import { createNotification } from '@/lib/notifications';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/resend', () => ({
  sendCommentNotification: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Comments API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stories/[id]/comments', () => {
    it('returns paginated comments', async () => {
      (prisma.comment.findMany as any).mockResolvedValue([
        { id: 'c1', content: 'Great story!', authorId: 'u1' }
      ]);
      (prisma.comment.count as any).mockResolvedValue(1);

      const req = new Request('http://localhost/api/stories/s1/comments?page=1&limit=20');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data.comments).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.totalPages).toBe(1);
    });
  });

  describe('POST /api/stories/[id]/comments', () => {
    it('returns 401 if unauthorized', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const req = new Request('http://localhost/api/stories/s1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Nice!' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(401);
    });

    it('returns 404 if story does not exist', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
      (prisma.story.findUnique as any).mockResolvedValue(null);
      
      const req = new Request('http://localhost/api/stories/s1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Nice!' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(404);
    });

    it('creates a new comment and sends notifications', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', username: 'john' } });
      
      (prisma.story.findUnique as any).mockResolvedValue({
        id: 's1',
        title: 'Epic Tale',
        authorId: 'author1',
        author: { email: 'author@example.com', emailNotifications: true }
      });
      
      (prisma.user.findUnique as any).mockResolvedValue({
        email: 'author@example.com',
        displayName: 'Author One'
      });
      
      (prisma.comment.create as any).mockResolvedValue({
        id: 'newComment',
        content: 'Nice!',
        authorId: 'u1',
        author: { username: 'john', avatarUrl: null }
      });

      const req = new Request('http://localhost/api/stories/s1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Nice!' })
      });
      
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(201);
      
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          storyId: 's1',
          content: 'Nice!',
          authorId: 'u1'
        }),
        include: expect.any(Object)
      });
      
      await vi.waitFor(() => {
        expect(createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'author1',
            type: 'COMMENT',
            title: 'New Comment on Your Story',
          })
        );
        
        expect(sendCommentNotification).toHaveBeenCalledWith(
          'author@example.com',
          {
            authorName: 'Author One',
            commenterName: 'john',
            storyTitle: 'Epic Tale',
            commentPreview: 'Nice!',
            storyId: 's1'
          }
        );
      });
    });
  });
});
