/**
 * Unit tests for src/lib/entitlements.ts
 *
 * Covers: paidFeatureError() — the pure function (no DB access).
 * 
 * Note: hasFeatureAccess() and isFoundingUser() require Prisma
 * and are integration-level tests, not pure unit tests.
 */

import { describe, it, expect } from 'vitest';
import { paidFeatureError } from '@/lib/entitlements';

describe('paidFeatureError()', () => {
  it('returns correct message for AUTHOR tier', () => {
    const result = paidFeatureError('AUTHOR');
    expect(result.error).toBe('Author plan required');
    expect(result.requiredTier).toBe('AUTHOR');
    expect(result.upgradeUrl).toBe('/premium/checkout?plan=author');
  });

  it('returns correct message for PRO tier', () => {
    const result = paidFeatureError('PRO');
    expect(result.error).toBe('Pro plan required');
    expect(result.requiredTier).toBe('PRO');
    expect(result.upgradeUrl).toBe('/premium/checkout?plan=pro');
  });

  it('returns correct message for CREATOR tier', () => {
    const result = paidFeatureError('CREATOR');
    expect(result.error).toBe('Creator plan required');
    expect(result.requiredTier).toBe('CREATOR');
    expect(result.upgradeUrl).toBe('/premium/checkout?plan=creator');
  });

  it('always includes upgradeUrl', () => {
    const result = paidFeatureError('AUTHOR');
    expect(result.upgradeUrl).toBeTruthy();
    expect(result.upgradeUrl).toContain('/premium/checkout');
  });
});
