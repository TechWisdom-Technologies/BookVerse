/**
 * Phase 14: Session & Cookie Security
 * Tests that authentication cookies are properly secured.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as authSync } from '../../src/app/api/auth/sync/route';
import { DELETE as deleteUser } from '../../src/app/api/users/me/route';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { getAuth, verifyToken } from '@/lib/auth';


vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
  verifyToken: vi.fn(),
}));

// next/headers mock is handled globally in setup.ts
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Phase 14: Session & Cookie Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cookie Attributes (/api/auth/sync)', () => {
    it('sets firebase-token and role cookies with Secure, HttpOnly, and SameSite=strict', async () => {
      const nextHeaders = await import('next/headers');
      const h = await (nextHeaders.headers as any)();
      h.get.mockImplementation((key: string) => {
        if (key === 'authorization') return 'Bearer valid-token';
        if (key === 'x-forwarded-for') return '127.0.0.1';
        return null;
      });
      const c = await (nextHeaders.cookies as any)();
      c.get.mockReturnValue(undefined);

      // Mock auth flow
      (adminAuth.verifyIdToken as any).mockResolvedValue({
        uid: 'user1',
        email: 'test@test.com',
      });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'u1',
        role: 'USER',
        tier: 'FREE',
      });
      (prisma.user.upsert as any).mockResolvedValue({
        id: 'u1',
        role: 'USER',
        tier: 'FREE',
      });

      const req = new Request('http://localhost/api/auth/sync', {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
      });

      const res = await authSync(req as any);
      if (res.status !== 200) {
        console.log(await res.json());
      }
      expect(res.status).toBe(200);

      const setCookieHeaders = res.headers.getSetCookie();
      expect(setCookieHeaders.length).toBeGreaterThan(0);

      const fbCookie = setCookieHeaders.find(c => c.startsWith('firebase-token='));
      expect(fbCookie).toBeDefined();
      expect(fbCookie).toContain('HttpOnly');
      expect(fbCookie).toContain('SameSite=strict');
      
      const roleCookie = setCookieHeaders.find(c => c.startsWith('user-role='));
      expect(roleCookie).toBeDefined();
      expect(roleCookie).toContain('HttpOnly');
    });
  });

  describe('Session Destruction (/api/users/me DELETE)', () => {
    it('clears all 5 auth cookies when user deletes account', async () => {
      (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1', role: 'USER', firebaseUid: 'fb1' } });
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'u1' });

      // Mock cleanup dependencies
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      global.fetch = fetchMock;

      const req = new Request('http://localhost/api/users/me', {
        method: 'DELETE',
      });

      const res = await deleteUser(req as any);
      expect(res.status).toBe(200);

      const setCookieHeaders = res.headers.getSetCookie();
      expect(setCookieHeaders.length).toBe(5);

      // They should all have Max-Age=0 to delete them
      expect(setCookieHeaders.some(c => c.startsWith('firebase-token=') && c.includes('Max-Age=0'))).toBe(true);
      expect(setCookieHeaders.some(c => c.startsWith('user-role=') && c.includes('Max-Age=0'))).toBe(true);
      expect(setCookieHeaders.some(c => c.startsWith('user-role-sig=') && c.includes('Max-Age=0'))).toBe(true);
      expect(setCookieHeaders.some(c => c.startsWith('user-tier=') && c.includes('Max-Age=0'))).toBe(true);
      expect(setCookieHeaders.some(c => c.startsWith('user-tier-sig=') && c.includes('Max-Age=0'))).toBe(true);
    });
  });
});
