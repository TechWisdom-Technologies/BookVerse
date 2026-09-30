import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 19: Turnstile CAPTCHA Bypass ───
// In production, if TURNSTILE_SECRET_KEY is not set, the system BLOCKS all requests.
// In dev, it allows them (for convenience).
// If the Turnstile service is DOWN, the system should fail-open.
// This is a design choice — an attacker could theoretically DDoS cloudflare to bypass captcha.
// We test all branches.

import { verifyTurnstileToken } from '@/lib/turnstile';

describe('Phase 19: Turnstile CAPTCHA Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('blocks requests in production when TURNSTILE_SECRET_KEY is not set', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.stubEnv('NODE_ENV', 'production');

    const result = await verifyTurnstileToken('some-token');
    expect(result.success).toBe(false);
    expect(result.error).toContain('CAPTCHA service misconfigured');
  });

  it('rejects null/empty CAPTCHA token', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';

    const result1 = await verifyTurnstileToken(null);
    expect(result1.success).toBe(false);
    expect(result1.error).toContain('CAPTCHA verification required');

    const result2 = await verifyTurnstileToken(undefined);
    expect(result2.success).toBe(false);

    const result3 = await verifyTurnstileToken('');
    expect(result3.success).toBe(false);
  });
});
