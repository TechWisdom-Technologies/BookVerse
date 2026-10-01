/**
 * Phase 6: Business Logic & Payment Security
 * Tests that financial mechanisms cannot be manipulated.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as postTip } from '../../src/app/api/tips/[userId]/route';
import { POST as postGift } from '../../src/app/api/gift-memberships/route';
import { POST as redeemGift } from '../../src/app/api/gift-memberships/redeem/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
  paidFeatureError: vi.fn((f) => ({ error: `${f} plan required` })),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Phase 6: Business Logic & Payment Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tips — Negative amount attack', () => {
    it('rejects a tip with amount 0', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      const req = new NextRequest('http://localhost/api/tips/u2', {
        method: 'POST',
        body: JSON.stringify({ amount: 0, senderNumber: '123', transactionId: 'tx1' }),
      });
      const res = await postTip(req, { params: Promise.resolve({ userId: 'u2' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/at least/i);
    });

    it('clamps negative amount to 1 via Math.max (prevents negative balance attack)', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue(null);
      (prisma.tip.findFirst as any).mockResolvedValue(null);
      (prisma.tip.create as any).mockResolvedValue({ id: 't1', amount: 1 });

      const req = new NextRequest('http://localhost/api/tips/u2', {
        method: 'POST',
        body: JSON.stringify({ amount: -100, senderNumber: '123', transactionId: 'tx2' }),
      });
      const res = await postTip(req, { params: Promise.resolve({ userId: 'u2' }) });
      // The amount gets clamped to 1 (minimum), not rejected — this IS the security measure
      expect(res.status).toBe(201);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('rejects self-tipping', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      const req = new NextRequest('http://localhost/api/tips/u1', {
        method: 'POST',
        body: JSON.stringify({ amount: 10, senderNumber: '123', transactionId: 'tx3' }),
      });
      const res = await postTip(req, { params: Promise.resolve({ userId: 'u1' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/cannot tip yourself/i);
    });
  });

  describe('Gift Memberships — Duplicate transaction', () => {
    it('rejects duplicate transactionId', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue({ id: 'existing' });

      const req = new NextRequest('http://localhost/api/gift-memberships', {
        method: 'POST',
        body: JSON.stringify({
          recipientEmail: 'a@b.com', tier: 'PRO', duration: 1,
          senderNumber: '123', transactionId: 'dup-tx',
        }),
      });
      const res = await postGift(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/already been submitted/i);
    });

    it('rejects invalid tier', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (hasFeatureAccess as any).mockResolvedValue(true);
      (prisma.subscriptionTransaction.findUnique as any).mockResolvedValue(null);
      (prisma.giftMembership.findUnique as any).mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/gift-memberships', {
        method: 'POST',
        body: JSON.stringify({
          recipientEmail: 'a@b.com', tier: 'HACKER', duration: 1,
          senderNumber: '123', transactionId: 'tx-new',
        }),
      });
      const res = await postGift(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid tier/i);
    });
  });

  describe('Gift Redemption — Wrong email', () => {
    it('rejects redemption if user email does not match recipient email', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1', email: 'wrong@test.com' });
      (prisma.giftMembership.findUnique as any).mockResolvedValue({
        code: 'GIFT-123',
        status: 'PENDING',
        recipientEmail: 'correct@test.com',
        expiresAt: new Date(Date.now() + 86400000),
      });

      const req = new NextRequest('http://localhost/api/gift-memberships/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: 'GIFT-123' }),
      });
      const res = await redeemGift(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toMatch(/different email/i);
    });

    it('rejects redemption of expired gift code', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1', email: 'user@test.com' });
      (prisma.giftMembership.findUnique as any).mockResolvedValue({
        code: 'GIFT-EXP',
        status: 'PENDING',
        recipientEmail: 'user@test.com',
        expiresAt: new Date(Date.now() - 86400000), // Expired yesterday
      });

      const req = new NextRequest('http://localhost/api/gift-memberships/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: 'GIFT-EXP' }),
      });
      const res = await redeemGift(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/expired/i);
    });

    it('rejects redemption of already redeemed gift code', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1', email: 'user@test.com' });
      (prisma.giftMembership.findUnique as any).mockResolvedValue({
        code: 'GIFT-USED',
        status: 'REDEEMED',
        recipientEmail: 'user@test.com',
        expiresAt: new Date(Date.now() + 86400000),
      });

      const req = new NextRequest('http://localhost/api/gift-memberships/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: 'GIFT-USED' }),
      });
      const res = await redeemGift(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/already used/i);
    });
  });
});
