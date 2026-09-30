/**
 * Phase 3: Cookie Forgery & HMAC Signature Bypass
 * Tests that HMAC-signed user-role and user-tier cookies cannot be forged.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signRole, verifyRole, signTier, verifyTier } from '@/lib/cookie-crypto';

describe('Phase 3: Cookie Forgery & HMAC Signature Bypass', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signRole / verifyRole', () => {
    it('produces a valid signature that verifyRole accepts', async () => {
      const sig = await signRole('ADMIN');
      const isValid = await verifyRole('ADMIN', sig);
      expect(isValid).toBe(true);
    });

    it('rejects a completely random/forged signature', async () => {
      const isValid = await verifyRole('ADMIN', 'deadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef');
      expect(isValid).toBe(false);
    });

    it('rejects an empty signature', async () => {
      const isValid = await verifyRole('ADMIN', '');
      expect(isValid).toBe(false);
    });

    it('rejects an empty role', async () => {
      const isValid = await verifyRole('', 'some-signature');
      expect(isValid).toBe(false);
    });

    it('rejects a signature for a different role (USER sig used for ADMIN)', async () => {
      const userSig = await signRole('USER');
      const isValidAsAdmin = await verifyRole('ADMIN', userSig);
      expect(isValidAsAdmin).toBe(false);
    });

    it('rejects a signature with different length (truncated attack)', async () => {
      const validSig = await signRole('ADMIN');
      const truncated = validSig.slice(0, 10);
      const isValid = await verifyRole('ADMIN', truncated);
      expect(isValid).toBe(false);
    });

    it('rejects a signature with appended characters', async () => {
      const validSig = await signRole('ADMIN');
      const extended = validSig + 'extra';
      const isValid = await verifyRole('ADMIN', extended);
      expect(isValid).toBe(false);
    });
  });

  describe('signTier / verifyTier', () => {
    it('signTier is the same function as signRole', () => {
      expect(signTier).toBe(signRole);
    });

    it('verifyTier is the same function as verifyRole', () => {
      expect(verifyTier).toBe(verifyRole);
    });

    it('produces valid tier signatures', async () => {
      const sig = await signTier('CREATOR');
      const isValid = await verifyTier('CREATOR', sig);
      expect(isValid).toBe(true);
    });

    it('rejects forged tier upgrade (FREE sig used for CREATOR)', async () => {
      const freeSig = await signTier('FREE');
      const isValid = await verifyTier('CREATOR', freeSig);
      expect(isValid).toBe(false);
    });
  });

  describe('Constant-time comparison', () => {
    it('rejects mismatched signatures regardless of character position', async () => {
      const validSig = await signRole('ADMIN');
      // Flip the first character
      const flipped = (validSig[0] === 'a' ? 'b' : 'a') + validSig.slice(1);
      const isValid = await verifyRole('ADMIN', flipped);
      expect(isValid).toBe(false);
    });
  });
});
