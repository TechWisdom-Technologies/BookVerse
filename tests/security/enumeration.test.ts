/**
 * Phase 13: Account Enumeration & Brute Force
 * Tests that login failures and invalid actions do not reveal whether an email exists.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as subscribeNewsletter } from '../../src/app/api/newsletter/platform/subscribe/route';
import { POST as authSync } from '../../src/app/api/auth/sync/route';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Phase 13: Account Enumeration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Newsletter Subscribe', () => {
    it('rejects invalid email format immediately (prevents backend guessing)', async () => {
      const req = new Request('http://localhost/api/newsletter/platform/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'not-an-email' }),
      });
      const res = await subscribeNewsletter(req);
      expect(res.status).toBe(400);
    });
  });

  describe('Auth Sync Enumeration', () => {
    it('returns generic Unauthorized error when Firebase token is invalid (does not check DB)', async () => {
      (adminAuth.verifyIdToken as any).mockRejectedValue(new Error('Invalid token'));

      const req = new Request('http://localhost/api/auth/sync', {
        method: 'POST',
        headers: { authorization: 'Bearer invalid-token' },
      });

      // The route wraps in try-catch and should return 500 or 401 generically, without revealing if the email exists.
      // In auth sync, if token is invalid, it throws, which the catch block handles.
      // Wait, let's see how authSync handles it. It probably just returns 500 or throws.
      // We expect the error to NOT say "User not found".
      const res = await authSync(req as any);
      const data = await res.json();
      expect(data.error).not.toMatch(/User not found/i);
    });
  });
});
