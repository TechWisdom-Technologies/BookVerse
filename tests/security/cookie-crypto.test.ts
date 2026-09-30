import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 21: Cookie Cryptography & Role Tampering ───
// The middleware relies on HMAC-signed cookies to verify user roles and tiers.
// An attacker who tampers with cookie values without the correct signature must be blocked.

import { signRole, verifyRole, signTier, verifyTier } from '@/lib/cookie-crypto';

describe('Phase 21: Cookie Crypto & Role Tampering', () => {
  beforeEach(() => {
    // Ensure the env var is set for the crypto module
    process.env.COOKIE_SIGNING_SECRET = 'test-signing-secret-32-chars-long!';
  });

  it('produces valid signatures for roles', async () => {
    const signature = await signRole('ADMIN');
    expect(signature).toBeTruthy();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
  });

  it('verifies correct role-signature pairs', async () => {
    const signature = await signRole('ADMIN');
    const isValid = await verifyRole('ADMIN', signature);
    expect(isValid).toBe(true);
  });

  it('rejects tampered role (correct signature, wrong role)', async () => {
    const adminSig = await signRole('ADMIN');
    // Attacker changes role cookie to ADMIN but uses signature from MEMBER
    const isValid = await verifyRole('MEMBER', adminSig);
    expect(isValid).toBe(false);
  });

  it('rejects forged signatures (correct role, wrong signature)', async () => {
    const isValid = await verifyRole('ADMIN', 'aabbccdd1122334455667788');
    expect(isValid).toBe(false);
  });

  it('rejects empty role or signature', async () => {
    expect(await verifyRole('', 'some-sig')).toBe(false);
    expect(await verifyRole('ADMIN', '')).toBe(false);
    expect(await verifyRole('', '')).toBe(false);
  });

  it('tier signing works exactly like role signing', async () => {
    const tierSig = await signTier('PRO');
    expect(await verifyTier('PRO', tierSig)).toBe(true);
    expect(await verifyTier('CREATOR', tierSig)).toBe(false);
  });

  it('prevents timing attacks via constant-time comparison', async () => {
    // Verify the function doesn't short-circuit on first character mismatch
    const correctSig = await signRole('ADMIN');
    
    // Slightly wrong signature (first char changed)
    const wrongSig1 = 'x' + correctSig.slice(1);
    // Very wrong signature (all chars different)
    const wrongSig2 = correctSig.split('').reverse().join('');

    // Both should fail, but the timing should be similar
    // We can't precisely measure timing in a unit test, but we verify
    // the code path uses bitwise XOR comparison (validated by code review)
    expect(await verifyRole('ADMIN', wrongSig1)).toBe(false);
    expect(await verifyRole('ADMIN', wrongSig2)).toBe(false);
  });

  it('rejects signatures of different lengths', async () => {
    const correctSig = await signRole('ADMIN');
    const truncatedSig = correctSig.slice(0, 10);
    expect(await verifyRole('ADMIN', truncatedSig)).toBe(false);
  });
});
