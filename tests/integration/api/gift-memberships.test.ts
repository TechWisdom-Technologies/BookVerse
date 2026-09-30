import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/app/api/gift-memberships/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
  paidFeatureError: vi.fn((feature) => ({ error: `Paid feature ${feature} required` })),
}));

describe('Gift Memberships API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (getAuth as any).mockResolvedValue(null);
    const req = new Request('http://localhost/api/gift-memberships', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it('returns 402 if user lacks CREATOR access', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (hasFeatureAccess as any).mockResolvedValue(false);
    
    const req = new Request('http://localhost/api/gift-memberships', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req as any);
    expect(res.status).toBe(402);
  });

  it('returns 400 for duplicate transaction ID', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (hasFeatureAccess as any).mockResolvedValue(true);
    
    (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue({ id: 'txn1' });
    
    const req = new Request('http://localhost/api/gift-memberships', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmail: 'friend@test.com',
        tier: 'PRO',
        duration: 1,
        senderNumber: '123',
        transactionId: 'txn1'
      })
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/already been submitted/i);
  });

  it('creates gift membership and transaction correctly', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (hasFeatureAccess as any).mockResolvedValue(true);
    
    (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue(null);
    (prisma.giftMembership.findUnique as any).mockResolvedValue(null);
    
    (prisma.giftMembership.create as any).mockResolvedValue({ code: 'GIFT-123' });
    (prisma.subscriptionTransaction.create as any).mockResolvedValue({});

    const req = new Request('http://localhost/api/gift-memberships', {
      method: 'POST',
      headers: new Headers({ 'x-forwarded-for': '127.0.0.1' }),
      body: JSON.stringify({
        recipientEmail: 'friend@test.com',
        tier: 'CREATOR',
        duration: 2,
        senderNumber: '01700000000',
        transactionId: 'txn-fresh'
      })
    });
    const res = await POST(req as any);
    expect(res.status).toBe(201);
    
    const data = await res.json();
    expect(data.code).toBe('GIFT-123');
    
    // Test transaction call since it uses Promise.all inside $transaction
    expect(prisma.$transaction).toHaveBeenCalled();
  });
  it('returns user gifts via GET', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (prisma.giftMembership.findMany as any).mockResolvedValue([
      { id: 'g1', code: 'GIFT-111' }
    ]);
    
    // Import GET handler
    const { GET } = await import('../../../src/app/api/gift-memberships/route');
    const req = new Request('http://localhost/api/gift-memberships');
    const res = await GET(req as any);
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].code).toBe('GIFT-111');
  });
});
