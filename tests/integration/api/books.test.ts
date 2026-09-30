import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/books/route';
import { getAuth, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';
import { FileType } from '@prisma/client';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
  paidFeatureError: vi.fn((feature) => ({ error: `Paid feature ${feature} required` })),
}));

describe('Books API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('returns a list of books with average ratings', async () => {
      (prisma.book.findMany as any).mockResolvedValue([
        { id: 'b1', title: 'Book One' }
      ]);
      (prisma.book.count as any).mockResolvedValue(1);
      (prisma.bookReview.findMany as any).mockResolvedValue([
        { rating: 4 }, { rating: 5 }
      ]); // average 4.5

      const req = new Request('http://localhost/api/books?q=Book');
      const res = await GET(req as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      
      expect(data.books).toHaveLength(1);
      expect(data.books[0].averageRating).toBe(4.5);
      expect(data.total).toBe(1);
    });
  });

  describe('POST /api/books', () => {
    it('returns 401 if unauthenticated', async () => {
      (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 403 if user cannot upload books', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'USER' } });
      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(403);
    });

    it('returns 402 if user lacks CREATOR access', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'AUTHOR' } });
      (hasFeatureAccess as any).mockResolvedValue(false);
      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(402);
    });

    it('returns 400 for invalid data', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'AUTHOR' } });
      (hasFeatureAccess as any).mockResolvedValue(true);
      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(400); // Zod validation fails
    });

    it('returns 409 if book already exists', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'AUTHOR' } });
      (hasFeatureAccess as any).mockResolvedValue(true);
      
      (prisma.book.findFirst as any).mockResolvedValue({ id: 'b1' });

      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({
          title: 'My Book',
          authorName: 'Me',
          fileUrl: 'http://test',
          fileType: FileType.PDF,
          genre: 'Sci-Fi',
          language: 'EN'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(409);
    });

    it('creates book successfully', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'AUTHOR' } });
      (hasFeatureAccess as any).mockResolvedValue(true);
      
      (prisma.book.findFirst as any).mockResolvedValue(null);
      (prisma.book.create as any).mockResolvedValue({ id: 'b2', title: 'My Book' });

      const req = new Request('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify({
          title: 'My Book',
          authorName: 'Me',
          fileUrl: 'http://test.pdf',
          fileType: FileType.PDF,
          genre: 'Sci-Fi',
          language: 'EN'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(201);
      
      const data = await res.json();
      expect(data.book.title).toBe('My Book');
    });
  });
});
