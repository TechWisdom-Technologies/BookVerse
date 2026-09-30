import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/tips/[userId]/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Tips API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tips/[userId]', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/tips/u2');
      const res = await GET(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(401);
    });

    it('returns 401 if user is neither the receiver nor admin', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1', role: 'USER' });
      const req = new Request('http://localhost/api/tips/u2');
      const res = await GET(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(401);
    });

    it('returns tips successfully', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u2', role: 'AUTHOR' }); // User is the receiver
      
      (prisma.tip.findMany as any).mockResolvedValue([
        { id: 't1', amount: 50 },
        { id: 't2', amount: 100 },
      ]);

      const req = new Request('http://localhost/api/tips/u2');
      const res = await GET(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data.tips).toHaveLength(2);
      expect(data.totalAmount).toBe(150);
      expect(data.count).toBe(2);
    });
  });

  describe('POST /api/tips/[userId]', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/tips/u2', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(401);
    });

    it('returns 400 if user tries to tip themselves', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      const req = new Request('http://localhost/api/tips/u1', {
        method: 'POST',
        body: JSON.stringify({ amount: 10, senderNumber: '123', transactionId: 'txn1' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ userId: 'u1' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/Cannot tip yourself/i);
    });

    it('returns 400 for duplicate transaction ID', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue({ id: 'txn1' });
      
      const req = new Request('http://localhost/api/tips/u2', {
        method: 'POST',
        body: JSON.stringify({ amount: 10, senderNumber: '123', transactionId: 'txn1' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(400);
    });

    it('creates a new pending tip successfully', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      
      (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue(null);
      (prisma.tip.findFirst as any).mockResolvedValue(null);
      
      (prisma.tip.create as any).mockResolvedValue({
        id: 't3',
        amount: 20
      });

      const req = new Request('http://localhost/api/tips/u2', {
        method: 'POST',
        body: JSON.stringify({ amount: 20, senderNumber: '01700000000', transactionId: 'txn2' })
      });
      const res = await POST(req as any, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(201);
      
      const data = await res.json();
      expect(data.id).toBe('t3');
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
