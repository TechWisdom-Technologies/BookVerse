import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DELETE } from '../../../src/app/api/polls/[optionId]/route';
import { POST } from '../../../src/app/api/polls/[optionId]/vote/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Polls API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DELETE /api/polls/[optionId]', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/polls/p1');
      const res = await DELETE(req as any, { params: Promise.resolve({ optionId: 'p1' }) });
      expect(res.status).toBe(401);
    });

    it('returns 403 if user is not author of the story', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user2' });
      
      (prisma.poll.findUnique as any).mockResolvedValue({
        id: 'p1',
        chapter: { story: { authorId: 'user1' } } // different author
      });

      const req = new Request('http://localhost/api/polls/p1');
      const res = await DELETE(req as any, { params: Promise.resolve({ optionId: 'p1' }) });
      expect(res.status).toBe(403);
    });

    it('deletes the poll successfully if user is the author', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user1' });
      
      (prisma.poll.findUnique as any).mockResolvedValue({
        id: 'p1',
        chapter: { story: { authorId: 'user1' } }
      });

      const req = new Request('http://localhost/api/polls/p1');
      const res = await DELETE(req as any, { params: Promise.resolve({ optionId: 'p1' }) });
      expect(res.status).toBe(200);
      
      expect(prisma.poll.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
    });
  });

  describe('POST /api/polls/[optionId]/vote', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/polls/o1/vote', { method: 'POST' });
      const res = await POST(req as any, { params: Promise.resolve({ optionId: 'o1' }) });
      expect(res.status).toBe(401);
    });

    it('returns 400 if poll is expired', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user1' });
      
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1); // 1 year ago
      
      (prisma.pollOption.findUnique as any).mockResolvedValue({
        id: 'o1',
        poll: { expiresAt: pastDate }
      });

      const req = new Request('http://localhost/api/polls/o1/vote', { method: 'POST' });
      const res = await POST(req as any, { params: Promise.resolve({ optionId: 'o1' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Poll has expired');
    });

    it('votes successfully for an option', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user1' });
      
      (prisma.pollOption.findUnique as any).mockImplementation((args: any) => {
        return Promise.resolve({
          id: 'o1',
          pollId: 'p1',
          poll: { expiresAt: null },
          votes: [{ userId: 'user1' }]
        });
      });
      
      // Assume no existing vote
      (prisma.pollVote.findFirst as any).mockResolvedValue(null);

      const req = new Request('http://localhost/api/polls/o1/vote', { method: 'POST' });
      const res = await POST(req as any, { params: Promise.resolve({ optionId: 'o1' }) });
      expect(res.status).toBe(200);
      
      expect(prisma.pollVote.create).toHaveBeenCalledWith({
        data: { userId: 'user1', optionId: 'o1' }
      });
    });

    it('removes existing vote and casts new vote', async () => {
      (getAuth as any).mockResolvedValue({ id: 'user1' });
      
      (prisma.pollOption.findUnique as any).mockResolvedValue({
        id: 'o1',
        pollId: 'p1',
        poll: { expiresAt: null }
      });
      
      // Assume existing vote found
      (prisma.pollVote.findFirst as any).mockResolvedValue({ id: 'v1' });

      const req = new Request('http://localhost/api/polls/o1/vote', { method: 'POST' });
      const res = await POST(req as any, { params: Promise.resolve({ optionId: 'o1' }) });
      expect(res.status).toBe(200);
      
      expect(prisma.pollVote.delete).toHaveBeenCalledWith({ where: { id: 'v1' } });
      expect(prisma.pollVote.create).toHaveBeenCalledWith({
        data: { userId: 'user1', optionId: 'o1' }
      });
    });
  });
});
