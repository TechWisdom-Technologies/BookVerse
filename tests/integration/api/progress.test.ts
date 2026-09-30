import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../../../src/app/api/stories/[id]/progress/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

describe('Reading Progress API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stories/[id]/progress', () => {
    it('returns 401 if unauthorized', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/stories/s1/progress');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(401);
    });

    it('returns progress if exists', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.readingProgress.findUnique as any).mockResolvedValue({ chapterId: 'c1', percentage: 50 });
      
      const req = new Request('http://localhost/api/stories/s1/progress');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ chapterId: 'c1', percentage: 50 });
    });

    it('returns null if no progress exists', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.readingProgress.findUnique as any).mockResolvedValue(null);
      
      const req = new Request('http://localhost/api/stories/s1/progress');
      const res = await GET(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeNull();
    });
  });

  describe('POST /api/stories/[id]/progress', () => {
    it('returns 400 for invalid payload', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      const req = new Request('http://localhost/api/stories/s1/progress', {
        method: 'POST',
        body: JSON.stringify({ chapterId: 'c1' }) // Missing percentage
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(400);
    });

    it('upserts progress on valid payload', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.readingProgress.upsert as any).mockResolvedValue({ chapterId: 'c1', percentage: 75 });
      
      const req = new Request('http://localhost/api/stories/s1/progress', {
        method: 'POST',
        body: JSON.stringify({ chapterId: 'c1', percentage: 75 })
      });
      const res = await POST(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      
      expect(prisma.readingProgress.upsert).toHaveBeenCalledWith({
        where: { userId_storyId: { userId: 'u1', storyId: 's1' } },
        update: { chapterId: 'c1', percentage: 75 },
        create: { userId: 'u1', storyId: 's1', chapterId: 'c1', percentage: 75 }
      });
    });
  });

  describe('DELETE /api/stories/[id]/progress', () => {
    it('deletes progress for the user', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.readingProgress.delete as any).mockResolvedValue({});
      
      const req = new Request('http://localhost/api/stories/s1/progress', { method: 'DELETE' });
      const res = await DELETE(req as any, { params: Promise.resolve({ id: 's1' }) });
      expect(res.status).toBe(200);
      
      expect(prisma.readingProgress.delete).toHaveBeenCalledWith({
        where: { userId_storyId: { userId: 'u1', storyId: 's1' } }
      });
    });
  });
});
