/**
 * Phase 2: Authorization & IDOR (Insecure Direct Object Reference)
 * Tests that users can only access/modify their own data.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH as patchMetadata } from '../../src/app/api/stories/[id]/metadata/route';
import { GET as getTips, POST as postTip } from '../../src/app/api/tips/[userId]/route';
import { POST as postGift } from '../../src/app/api/gift-memberships/route';
import { POST as postClubDiscussion } from '../../src/app/api/clubs/[clubId]/discussions/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess } from '@/lib/entitlements';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
  getCurrentUser: vi.fn(),
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/entitlements', () => ({
  hasFeatureAccess: vi.fn(),
  paidFeatureError: vi.fn((f) => ({ error: `${f} plan required`, requiredTier: f })),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn().mockResolvedValue({}),
}));

describe('Phase 2: Authorization & IDOR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Story Metadata IDOR', () => {
    it('blocks User A from editing User B story metadata', async () => {
      // User A is logged in
      (getAuth as any).mockResolvedValue({ id: 'userA', role: 'USER' });
      // Story belongs to User B
      (prisma.story.findUnique as any).mockResolvedValue({ authorId: 'userB' });

      const req = new Request('http://localhost/api/stories/story1/metadata', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Hacked Title' }),
      });

      const res = await patchMetadata(req as any, { params: Promise.resolve({ id: 'story1' }) });
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Forbidden');
    });

    it('allows story author to edit their own metadata', async () => {
      (getAuth as any).mockResolvedValue({ id: 'userA', role: 'USER' });
      (prisma.story.findUnique as any).mockResolvedValue({ authorId: 'userA' });
      (prisma.story.update as any).mockResolvedValue({ id: 'story1', title: 'New Title' });

      const req = new Request('http://localhost/api/stories/story1/metadata', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'New Title' }),
      });

      const res = await patchMetadata(req as any, { params: Promise.resolve({ id: 'story1' }) });
      expect(res.status).toBe(200);
    });
  });

  describe('Tips IDOR', () => {
    it('blocks User A from viewing User B tips', async () => {
      (getAuth as any).mockResolvedValue({ id: 'userA', role: 'USER' });

      const req = new Request('http://localhost/api/tips/userB');
      const res = await getTips(req as any, { params: Promise.resolve({ userId: 'userB' }) });
      expect(res.status).toBe(401);
    });

    it('allows admin to view any user tips', async () => {
      (getAuth as any).mockResolvedValue({ id: 'admin1', role: 'ADMIN' });
      (prisma.tip.findMany as any).mockResolvedValue([]);

      const req = new Request('http://localhost/api/tips/userB');
      const res = await getTips(req as any, { params: Promise.resolve({ userId: 'userB' }) });
      expect(res.status).toBe(200);
    });
  });

  describe('Entitlement gating', () => {
    it('blocks non-CREATOR user from creating gift memberships', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1', role: 'USER' });
      (hasFeatureAccess as any).mockResolvedValue(false);

      const req = new Request('http://localhost/api/gift-memberships', {
        method: 'POST',
        body: JSON.stringify({ recipientEmail: 'a@b.com', tier: 'PRO', duration: 1 }),
      });
      const res = await postGift(req as any);
      expect(res.status).toBe(402);
    });
  });

  describe('Club membership gating', () => {
    it('blocks non-member from posting club discussion', async () => {
      const { getCurrentUser } = await import('@/lib/auth');
      (getCurrentUser as any).mockResolvedValue({ id: 'u1', username: 'tester', displayName: 'Tester' });

      // Mock: user is NOT a member
      (prisma as any).clubMember = { findUnique: vi.fn().mockResolvedValue(null) };

      const req = new Request('http://localhost/api/clubs/club1/discussions', {
        method: 'POST',
        body: JSON.stringify({ content: 'Hello club!' }),
      });
      const res = await postClubDiscussion(req as any, { params: Promise.resolve({ clubId: 'club1' }) });
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toMatch(/club member/i);
    });
  });
});
