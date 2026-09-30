import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, DELETE } from '@/app/api/follow/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendFollowNotification } from '@/lib/resend';
import { createNotification } from '@/lib/notifications';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

vi.mock('@/lib/resend', () => ({
  sendFollowNotification: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

describe('Follow API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('returns 401 if unauthorized', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const request = new Request('http://localhost/api/follow', {
        method: 'POST',
        body: JSON.stringify({ followingId: 'target123' })
      });

      const response = await POST(request);
      expect(response!.status).toBe(401);
    });

    it('returns 400 if following self', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      
      const request = new Request('http://localhost/api/follow', {
        method: 'POST',
        body: JSON.stringify({ followingId: 'user1' })
      });

      const response = await POST(request);
      expect(response!.status).toBe(400);
      const data = await response!.json();
      expect(data.error).toBe('Cannot follow yourself');
    });

    it('returns 404 if target user not found', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      (prisma.user.findUnique as any).mockResolvedValue(null);
      
      const request = new Request('http://localhost/api/follow', {
        method: 'POST',
        body: JSON.stringify({ followingId: 'target123' })
      });

      const response = await POST(request);
      expect(response!.status).toBe(404);
    });

    it('creates follow relationship and sends notifications', async () => {
      (verifyToken as any).mockResolvedValue({ 
        dbUser: { id: 'user1', username: 'follower' } 
      });
      (prisma.user.findUnique as any).mockResolvedValue({ 
        id: 'target123', email: 'target@test.com', username: 'target' 
      });
      (prisma.follow.create as any).mockResolvedValue({ id: 'follow123' });
      
      const request = new Request('http://localhost/api/follow', {
        method: 'POST',
        body: JSON.stringify({ followingId: 'target123' })
      });

      const response = await POST(request);
      expect(response!.status).toBe(201);
      
      expect(prisma.follow.create).toHaveBeenCalledWith({
        data: { followerId: 'user1', followingId: 'target123' }
      });
      expect(sendFollowNotification).toHaveBeenCalledWith('target@test.com', expect.any(Object));
      expect(createNotification).toHaveBeenCalled();
    });

    it('returns 409 if already following', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'target123' });
      (prisma.follow.create as any).mockRejectedValue({ code: 'P2002' });
      
      const request = new Request('http://localhost/api/follow', {
        method: 'POST',
        body: JSON.stringify({ followingId: 'target123' })
      });

      const response = await POST(request);
      expect(response!.status).toBe(409);
    });
  });

  describe('DELETE', () => {
    it('returns 401 if unauthorized', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      
      const request = new Request('http://localhost/api/follow?followingId=target123', {
        method: 'DELETE'
      });

      const response = await DELETE(request);
      expect(response.status).toBe(401);
    });

    it('returns 400 if followingId is missing', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      
      const request = new Request('http://localhost/api/follow', {
        method: 'DELETE'
      });

      const response = await DELETE(request);
      expect(response.status).toBe(400);
    });

    it('deletes follow relationship', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'user1' } });
      (prisma.follow.deleteMany as any).mockResolvedValue({ count: 1 });
      
      const request = new Request('http://localhost/api/follow?followingId=target123', {
        method: 'DELETE'
      });

      const response = await DELETE(request);
      expect(response.status).toBe(204);
      
      expect(prisma.follow.deleteMany).toHaveBeenCalledWith({
        where: { followerId: 'user1', followingId: 'target123' }
      });
    });
  });
});
