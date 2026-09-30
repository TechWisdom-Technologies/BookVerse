/**
 * Unit tests for src/lib/cookie-crypto.ts
 *
 * Covers: signRole(), verifyRole(), signTier, verifyTier
 * (HMAC-SHA256 signing & verification for session cookies)
 */

import { describe, it, expect } from 'vitest';
import { signRole, verifyRole, signTier, verifyTier } from '@/lib/cookie-crypto';

describe('signRole()', () => {
  it('returns a hex string signature', async () => {
    const sig = await signRole('ADMIN');
    expect(sig).toMatch(/^[0-9a-f]+$/);
  });

  it('produces a 64-char hex string (SHA-256 = 32 bytes = 64 hex)', async () => {
    const sig = await signRole('USER');
    expect(sig.length).toBe(64);
  });

  it('produces deterministic output (same role → same signature)', async () => {
    const sig1 = await signRole('ADMIN');
    const sig2 = await signRole('ADMIN');
    expect(sig1).toBe(sig2);
  });

  it('produces different signatures for different roles', async () => {
    const adminSig = await signRole('ADMIN');
    const userSig = await signRole('USER');
    expect(adminSig).not.toBe(userSig);
  });
});

describe('verifyRole()', () => {
  it('returns true for a valid signature', async () => {
    const sig = await signRole('ADMIN');
    expect(await verifyRole('ADMIN', sig)).toBe(true);
  });

  it('returns false for a tampered signature', async () => {
    const sig = await signRole('ADMIN');
    // Flip one character
    const tampered = sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0');
    expect(await verifyRole('ADMIN', tampered)).toBe(false);
  });

  it('returns false for wrong role', async () => {
    const sig = await signRole('ADMIN');
    expect(await verifyRole('USER', sig)).toBe(false);
  });

  it('returns false for empty role', async () => {
    expect(await verifyRole('', 'some-sig')).toBe(false);
  });

  it('returns false for empty signature', async () => {
    expect(await verifyRole('ADMIN', '')).toBe(false);
  });

  it('returns false for both empty', async () => {
    expect(await verifyRole('', '')).toBe(false);
  });
});

describe('signTier / verifyTier (aliases)', () => {
  it('signTier is the same function as signRole', () => {
    expect(signTier).toBe(signRole);
  });

  it('verifyTier is the same function as verifyRole', () => {
    expect(verifyTier).toBe(verifyRole);
  });

  it('signTier produces valid signatures that verifyTier accepts', async () => {
    const sig = await signTier('PRO');
    expect(await verifyTier('PRO', sig)).toBe(true);
  });

  it('cross-verifies: signRole + verifyTier works', async () => {
    const sig = await signRole('CREATOR');
    expect(await verifyTier('CREATOR', sig)).toBe(true);
  });
});
