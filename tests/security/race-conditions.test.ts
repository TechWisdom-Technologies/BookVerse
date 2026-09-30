/**
 * Phase 11: Race Conditions (TOCTOU)
 * Tests that double-spending and concurrent attacks are prevented.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as redeemGift } from '../../src/app/api/gift-memberships/redeem/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Phase 11: Race Conditions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prevents double-spending of gift codes via Prisma transactions (mock verification)', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1', email: 'test@test.com' });
    
    // Simulate initial check passing
    (prisma.giftMembership.findUnique as any).mockResolvedValue({
      id: 'g1',
      code: 'GIFT-RACE',
      status: 'PENDING',
      recipientEmail: 'test@test.com',
      expiresAt: new Date(Date.now() + 100000),
      duration: 1,
      tier: 'PRO',
    });

    // Simulate Prisma transaction
    // The key defense is the updateMany with count === 0 check
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback({
        giftMembership: {
          updateMany: vi.fn().mockResolvedValue({ count: 0 }), // SIMULATE RACE CONDITION: Another request already updated it
        }
      });
    });

    const req = new Request('http://localhost/api/gift-memberships/redeem', {
      method: 'POST',
      body: JSON.stringify({ code: 'GIFT-RACE' }),
    });

    const res = await redeemGift(req);
    // The route catches the error and returns a 500 response to avoid leaking internal state on concurrent requests
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to redeem');
  });
});
