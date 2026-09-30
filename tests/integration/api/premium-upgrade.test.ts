import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/app/api/premium/upgrade/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

describe('Premium Upgrade API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (getAuth as any).mockResolvedValue(null);
    const req = new Request('http://localhost/api/premium/upgrade', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it('returns 400 if plan is invalid', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    const req = new Request('http://localhost/api/premium/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan: 'INVALID' })
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Invalid subscription plan/i);
  });

  it('returns 400 if user already has a higher tier active', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    
    // User already has CREATOR plan, trying to buy PRO
    (prisma.user.findUnique as any).mockResolvedValue({
      membershipTier: 'CREATOR',
      membershipExpiry: new Date(Date.now() + 100000).toISOString()
    });

    const req = new Request('http://localhost/api/premium/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan: 'PRO' })
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/already have an active CREATOR plan or higher/i);
  });

  it('returns 400 if duplicate transaction ID is submitted', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (prisma.user.findUnique as any).mockResolvedValue({ membershipTier: 'NONE' });
    
    (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue({
      id: 'txn1'
    });

    const req = new Request('http://localhost/api/premium/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan: 'AUTHOR', duration: 1, senderNumber: '123', transactionId: 'txn1' })
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/already been submitted/i);
  });

  it('creates transaction successfully', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1', email: 'u1@test.com' });
    (prisma.user.findUnique as any).mockResolvedValue({ membershipTier: 'NONE', email: 'u1@test.com' });
    (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue(null);
    
    (prisma.subscriptionTransaction.create as any).mockResolvedValue({
      transactionId: 'txn2'
    });

    const req = new Request('http://localhost/api/premium/upgrade', {
      method: 'POST',
      headers: new Headers({ 'x-forwarded-for': '127.0.0.1' }),
      body: JSON.stringify({ plan: 'PRO', duration: 3, senderNumber: '01700000000', transactionId: 'txn2' })
    });
    
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.transactionId).toBe('txn2');
    
    expect(prisma.subscriptionTransaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          plan: 'PRO',
          duration: 3,
          amount: 199 * 3, // PRO plan is 199/mo
          transactionId: 'txn2',
          senderNumber: '01700000000'
        })
      })
    );
  });
});
