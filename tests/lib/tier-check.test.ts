/**
 * Unit tests for src/lib/tier-check.ts
 *
 * Covers: checkTierAccess() — client-side tier/permission checking
 */

import { describe, it, expect } from 'vitest';
import { checkTierAccess } from '@/lib/tier-check';

describe('checkTierAccess()', () => {
  const currentPath = '/write';

  // ─── Null user → redirect to login ────────────────────────────
  describe('unauthenticated user', () => {
    it('redirects to login when user is null', () => {
      const result = checkTierAccess(null, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.requiredTier).toBe('USER');
        expect(result.redirectTo).toContain('/login');
        expect(result.redirectTo).toContain(encodeURIComponent(currentPath));
      }
    });

    it('redirects to login when user is undefined', () => {
      const result = checkTierAccess(undefined, 'PRO', currentPath);
      expect(result.allowed).toBe(false);
    });
  });

  // ─── Admin bypass ─────────────────────────────────────────────
  describe('admin users', () => {
    it('allows ADMIN access regardless of tier', () => {
      const result = checkTierAccess({ role: 'ADMIN', membershipTier: null }, 'CREATOR', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('allows ADMIN even with FREE tier', () => {
      const result = checkTierAccess({ role: 'ADMIN', membershipTier: 'FREE' }, 'PRO', currentPath);
      expect(result.allowed).toBe(true);
    });
  });

  // ─── BANNED / SUSPENDED → redirect to home ───────────────────
  describe('banned/suspended users', () => {
    it('denies BANNED users and redirects to home', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'BANNED' }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.redirectTo).toBe('/');
      }
    });

    it('denies SUSPENDED users and redirects to home', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'SUSPENDED' }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.redirectTo).toBe('/');
      }
    });
  });

  // ─── Tier hierarchy: CREATOR > PRO > AUTHOR > FREE ───────────
  describe('tier hierarchy', () => {
    it('allows CREATOR to access AUTHOR features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'CREATOR' }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('allows CREATOR to access PRO features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'CREATOR' }, 'PRO', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('allows CREATOR to access CREATOR features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'CREATOR' }, 'CREATOR', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('allows PRO to access AUTHOR features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'PRO' }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('allows PRO to access PRO features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'PRO' }, 'PRO', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('denies PRO from accessing CREATOR features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'PRO' }, 'CREATOR', currentPath);
      expect(result.allowed).toBe(false);
    });

    it('denies AUTHOR from accessing PRO features', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'AUTHOR' }, 'PRO', currentPath);
      expect(result.allowed).toBe(false);
    });

    it('denies FREE user from accessing any paid feature', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'FREE' }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(false);
    });

    it('treats null membershipTier as FREE', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: null }, 'AUTHOR', currentPath);
      expect(result.allowed).toBe(false);
    });
  });

  // ─── Redirect URLs for denied access ──────────────────────────
  describe('redirect URLs', () => {
    it('redirects to correct checkout URL for AUTHOR tier', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'FREE' }, 'AUTHOR', '/write');
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.redirectTo).toContain('/premium/checkout?plan=author');
        expect(result.redirectTo).toContain(encodeURIComponent('/write'));
      }
    });

    it('redirects to correct checkout URL for PRO tier', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'FREE' }, 'PRO', '/reading-challenges');
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.redirectTo).toContain('/premium/checkout?plan=pro');
      }
    });

    it('redirects to correct checkout URL for CREATOR tier', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'FREE' }, 'CREATOR', '/universes');
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.redirectTo).toContain('/premium/checkout?plan=creator');
      }
    });
  });

  // ─── Case insensitivity ───────────────────────────────────────
  describe('case insensitivity', () => {
    it('handles lowercase membershipTier', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'creator' }, 'CREATOR', currentPath);
      expect(result.allowed).toBe(true);
    });

    it('handles mixed-case membershipTier', () => {
      const result = checkTierAccess({ role: 'USER', membershipTier: 'Pro' }, 'PRO', currentPath);
      expect(result.allowed).toBe(true);
    });
  });
});
