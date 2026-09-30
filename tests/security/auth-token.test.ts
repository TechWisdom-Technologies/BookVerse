/**
 * Phase 1: Authentication & Token Security
 * Tests that verifyToken / getAuth cannot be bypassed, forged, or leaked.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyToken, getAuth } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual('@/lib/auth');
  return actual;
});

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn().mockReturnValue(undefined),
  })),
  headers: vi.fn(() => ({
    get: vi.fn().mockReturnValue(null),
  })),
}));

describe('Phase 1: Authentication & Token Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verifyToken()', () => {
    it('throws UNAUTHORIZED when no token is provided (no cookie, no header)', async () => {
      await expect(verifyToken()).rejects.toThrow('UNAUTHORIZED');
    });

    it('throws UNAUTHORIZED when Firebase rejects an expired token', async () => {
      // Supply a token via cookie
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'expired-token-abc' }),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      });

      (adminAuth.verifyIdToken as any).mockRejectedValue({
        code: 'auth/id-token-expired',
      });

      await expect(verifyToken()).rejects.toThrow('UNAUTHORIZED');
    });

    it('throws UNAUTHORIZED when Firebase rejects a malformed/garbage token', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'garbage-not-a-jwt' }),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      });

      (adminAuth.verifyIdToken as any).mockRejectedValue(
        new Error('Decoding Firebase ID token failed')
      );

      await expect(verifyToken()).rejects.toThrow();
    });

    it('throws USER_NOT_FOUND when Firebase validates token but user is not in DB', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      });

      (adminAuth.verifyIdToken as any).mockResolvedValue({
        uid: 'firebase-uid-123',
        email: 'test@test.com',
      });
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(verifyToken()).rejects.toThrow('USER_NOT_FOUND');
    });

    it('returns firebaseUser and dbUser when token is valid and user exists', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      });

      const mockFirebaseUser = { uid: 'fb-uid', email: 'test@test.com' };
      const mockDbUser = { id: 'u1', firebaseUid: 'fb-uid', role: 'USER' };

      (adminAuth.verifyIdToken as any).mockResolvedValue(mockFirebaseUser);
      (prisma.user.findUnique as any).mockResolvedValue(mockDbUser);

      const result = await verifyToken();
      expect(result.firebaseUser).toEqual(mockFirebaseUser);
      expect(result.dbUser).toEqual(mockDbUser);
    });

    it('accepts token from Authorization header (Bearer scheme)', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue(undefined),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn((name: string) => {
          if (name === 'authorization') return 'Bearer header-token-xyz';
          return null;
        }),
      });

      const mockFirebaseUser = { uid: 'fb-uid', email: 'test@test.com' };
      const mockDbUser = { id: 'u1', firebaseUid: 'fb-uid' };

      (adminAuth.verifyIdToken as any).mockResolvedValue(mockFirebaseUser);
      (prisma.user.findUnique as any).mockResolvedValue(mockDbUser);

      const result = await verifyToken();
      expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('header-token-xyz');
      expect(result.dbUser).toEqual(mockDbUser);
    });
  });

  describe('getAuth() (alias for getCurrentUser)', () => {
    it('returns null when no token is available (does not throw)', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue(undefined),
      });
      const { headers } = await import('next/headers');
      (headers as any).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      });

      const result = await getAuth();
      expect(result).toBeNull();
    });

    it('returns null on expired token (suppresses UNAUTHORIZED error)', async () => {
      const { cookies } = await import('next/headers');
      (cookies as any).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'expired' }),
      });

      (adminAuth.verifyIdToken as any).mockRejectedValue({
        code: 'auth/id-token-expired',
      });

      const result = await getAuth();
      expect(result).toBeNull();
    });
  });
});
