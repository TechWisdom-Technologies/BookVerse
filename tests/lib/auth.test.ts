import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentUser, verifyToken, getAuth } from '../../src/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { cookies, headers } from 'next/headers';

describe('Auth Service (src/lib/auth.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default safe returns for cookies and headers so they don't crash
    (cookies as any).mockReturnValue({ get: () => undefined });
    (headers as any).mockReturnValue({ get: () => undefined });
  });

  describe('verifyToken()', () => {
    it('throws UNAUTHORIZED if no token is found', async () => {
      await expect(verifyToken()).rejects.toThrow('UNAUTHORIZED');
    });

    it('uses token from cookies if available', async () => {
      (cookies as any).mockReturnValue({ get: () => ({ value: 'cookie-token' }) });
      
      (adminAuth.verifyIdToken as any).mockResolvedValue({ uid: 'user123' });
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'db123' });

      const result = await verifyToken();
      expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('cookie-token');
      expect(result.firebaseUser.uid).toBe('user123');
      expect(result.dbUser.id).toBe('db123');
    });

    it('prefers token from authorization header over cookies', async () => {
      (cookies as any).mockReturnValue({ get: () => ({ value: 'cookie-token' }) });
      (headers as any).mockReturnValue({ get: () => 'Bearer header-token' });
      
      (adminAuth.verifyIdToken as any).mockResolvedValue({ uid: 'user123' });
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'db123' });

      const result = await verifyToken();
      expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('header-token');
      expect(result.firebaseUser.uid).toBe('user123');
    });

    it('throws UNAUTHORIZED if token is expired', async () => {
      (headers as any).mockReturnValue({ get: () => 'Bearer token' });
      (adminAuth.verifyIdToken as any).mockRejectedValue({ code: 'auth/id-token-expired' });

      await expect(verifyToken()).rejects.toThrow('UNAUTHORIZED');
    });

    it('throws original error if verifyIdToken fails with non-expired error', async () => {
      (headers as any).mockReturnValue({ get: () => 'Bearer token' });
      (adminAuth.verifyIdToken as any).mockRejectedValue(new Error('Firebase error'));

      await expect(verifyToken()).rejects.toThrow('Firebase error');
    });

    it('throws USER_NOT_FOUND if user is not in database', async () => {
      (headers as any).mockReturnValue({ get: () => 'Bearer token' });
      (adminAuth.verifyIdToken as any).mockResolvedValue({ uid: 'user123' });
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(verifyToken()).rejects.toThrow('USER_NOT_FOUND');
    });
  });

  describe('getCurrentUser() / getAuth()', () => {
    it('returns dbUser if token is valid', async () => {
      (headers as any).mockReturnValue({ get: () => 'Bearer token' });
      (adminAuth.verifyIdToken as any).mockResolvedValue({ uid: 'user123' });
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'db123', name: 'Test User' });

      const user = await getCurrentUser();
      expect(user).toEqual({ id: 'db123', name: 'Test User' });
      
      // Test legacy export too
      const legacyUser = await getAuth();
      expect(legacyUser).toEqual({ id: 'db123', name: 'Test User' });
    });

    it('returns null if token is invalid (UNAUTHORIZED)', async () => {
      (headers as any).mockReturnValue({ get: () => undefined });
      (cookies as any).mockReturnValue({ get: () => undefined });
      
      // Should not throw, should just return null
      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it('logs error and returns null if a generic error occurs', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      (headers as any).mockReturnValue({ get: () => 'Bearer token' });
      (adminAuth.verifyIdToken as any).mockRejectedValue(new Error('Some weird error'));

      const user = await getCurrentUser();
      expect(user).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});
