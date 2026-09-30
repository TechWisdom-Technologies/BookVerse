import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH, DELETE } from '../../../src/app/api/admin/reports/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

describe('Admin Reports API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/reports', () => {
    it('returns 403 if user is not an ADMIN', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'USER' } });
      const req = new Request('http://localhost/api/admin/reports');
      const res = await GET(req as any);
      expect(res.status).toBe(403);
    });

    it('returns a paginated list of reports if user is ADMIN', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'ADMIN' } });
      (prisma.contentReport.findMany as any).mockResolvedValue([
        { id: 'r1', reason: 'SPAM', story: { title: 'Spammy Story' } }
      ]);
      (prisma.contentReport.count as any).mockResolvedValue(1);

      const req = new Request('http://localhost/api/admin/reports?page=1&limit=10&search=Spam');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.reports).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      
      expect(prisma.contentReport.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { reason: { contains: 'Spam', mode: 'insensitive' } },
              { story: { title: { contains: 'Spam', mode: 'insensitive' } } },
              { reporter: { username: { contains: 'Spam', mode: 'insensitive' } } },
            ]
          })
        })
      );
    });
  });

  describe('PATCH /api/admin/reports', () => {
    it('returns 403 if user is not an ADMIN', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'USER' } });
      const req = new Request('http://localhost/api/admin/reports', {
        method: 'PATCH',
        body: JSON.stringify({ reportId: 'r1', status: 'RESOLVED' })
      });
      const res = await PATCH(req);
      expect(res.status).toBe(403);
    });

    it('updates report status to RESOLVED and triggers automated takedown', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'ADMIN' } });
      
      (prisma.contentReport.update as any).mockResolvedValue({
        id: 'r1',
        status: 'RESOLVED',
        storyId: 's1',
        story: { title: 'Bad Story', authorId: 'a1' }
      });

      const req = new Request('http://localhost/api/admin/reports', {
        method: 'PATCH',
        body: JSON.stringify({ reportId: 'r1', status: 'RESOLVED' })
      });
      const res = await PATCH(req);
      
      expect(res.status).toBe(200);
      
      expect(prisma.contentReport.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'r1' },
          data: { status: 'RESOLVED' }
        })
      );
      
      // Validates that it unpublishes the story
      expect(prisma.story.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 's1' },
          data: { published: false }
        })
      );
      
      // Validates that notification is sent to author
      expect(createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'a1',
          type: 'CONTENT_TAKEDOWN'
        })
      );
    });
  });

  describe('DELETE /api/admin/reports', () => {
    it('returns 403 if user is not an ADMIN', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'USER' } });
      const req = new Request('http://localhost/api/admin/reports', {
        method: 'DELETE',
        body: JSON.stringify({ reportId: 'r1' })
      });
      const res = await DELETE(req as any);
      expect(res.status).toBe(403);
    });

    it('deletes report if user is ADMIN', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { role: 'ADMIN' } });
      
      const req = new Request('http://localhost/api/admin/reports', {
        method: 'DELETE',
        body: JSON.stringify({ reportId: 'r1' })
      });
      const res = await DELETE(req as any);
      
      expect(res.status).toBe(204);
      expect(prisma.contentReport.delete).toHaveBeenCalledWith({
        where: { id: 'r1' }
      });
    });
  });
});
