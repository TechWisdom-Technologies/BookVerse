import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/stories/[id]/reactions/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

describe('Reactions API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stories/[id]/reactions', () => {
    it('returns aggregated reaction counts', async () => {
      (prisma.storyReaction.groupBy as any).mockResolvedValue([
        { reactionType: 'LIKE', _count: 10 },
        { reactionType: 'FIRE', _count: 5 },
      ]);
      (verifyToken as any).mockRejectedValue(new Error('Unauthenticated')); // User not logged in
      
      const req = new Request('http://localhost/api/stories/s1/reactions');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data.reactions.LIKE).toBe(10);
      expect(data.reactions.FIRE).toBe(5);
      expect(data.reactions.LOVE).toBe(0);
      expect(data.userReaction).toBeNull();
    });

    it('returns userReaction if user is logged in', async () => {
      (prisma.storyReaction.groupBy as any).mockResolvedValue([]);
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
      (prisma.storyReaction.findUnique as any).mockResolvedValue({ reactionType: 'WOW' });
      
      const req = new Request('http://localhost/api/stories/s1/reactions');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      
      const data = await res.json();
      expect(data.userReaction).toBe('WOW');
    });
  });

  describe('POST /api/stories/[id]/reactions', () => {
    it('returns 400 for invalid reaction type', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
      const req = new Request('http://localhost/api/stories/s1/reactions', {
        method: 'POST',
        body: JSON.stringify({ reactionType: 'INVALID' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(400);
    });

    it('toggles reaction off if same reaction is sent', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
      (prisma.storyReaction.findUnique as any).mockResolvedValue({ id: 'r1', reactionType: 'LIKE' });
      
      const req = new Request('http://localhost/api/stories/s1/reactions', {
        method: 'POST',
        body: JSON.stringify({ reactionType: 'LIKE' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(204);
      
      expect(prisma.storyReaction.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 's1' },
        data: { reactionCount: { decrement: 1 } }
      });
    });

    it('creates a new reaction if none exists and triggers notification', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', username: 'john' } });
      (prisma.storyReaction.findUnique as any).mockResolvedValue(null);
      (prisma.storyReaction.create as any).mockResolvedValue({ id: 'r2' });
      
      // Need to mock findUnique for story to get authorId for notification
      (prisma.story.findUnique as any).mockResolvedValue({ id: 's1', authorId: 'a1' });
      
      const req = new Request('http://localhost/api/stories/s1/reactions', {
        method: 'POST',
        body: JSON.stringify({ reactionType: 'LOVE' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(201);
      
      expect(prisma.storyReaction.create).toHaveBeenCalledWith({
        data: { storyId: 's1', userId: 'u1', reactionType: 'LOVE' }
      });
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 's1' },
        data: { reactionCount: { increment: 1 } }
      });
      
      // Since notification is fire and forget, wait for it
      await vi.waitFor(() => {
        expect(createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'a1',
            type: 'REACT',
          })
        );
      });
    });
  });
});
