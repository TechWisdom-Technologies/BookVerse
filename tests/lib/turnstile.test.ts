/**
 * Unit tests for src/lib/turnstile.ts
 *
 * Covers: verifyTurnstileToken() — Cloudflare Turnstile CAPTCHA verification
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyTurnstileToken } from '@/lib/turnstile';

describe('verifyTurnstileToken()', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  // ─── No secret key configured ─────────────────────────────────
  describe('when TURNSTILE_SECRET_KEY is not set', () => {
    beforeEach(() => {
      delete process.env.TURNSTILE_SECRET_KEY;
      vi.stubEnv('NODE_ENV', 'test');
    });

    it('returns success in non-production (dev skip)', async () => {
      const result = await verifyTurnstileToken('some-token');
      expect(result.success).toBe(true);
    });

    it('returns failure in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const result = await verifyTurnstileToken('some-token');
      expect(result.success).toBe(false);
      expect(result.error).toContain('CAPTCHA service misconfigured');
    });
  });

  // ─── Token validation ─────────────────────────────────────────
  describe('when TURNSTILE_SECRET_KEY is set', () => {
    beforeEach(() => {
      process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    });

    it('returns failure when token is null', async () => {
      const result = await verifyTurnstileToken(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('CAPTCHA verification required.');
    });

    it('returns failure when token is undefined', async () => {
      const result = await verifyTurnstileToken(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('CAPTCHA verification required.');
    });

    it('returns failure when token is empty string', async () => {
      const result = await verifyTurnstileToken('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('CAPTCHA verification required.');
    });
  });

  // ─── Successful verification ──────────────────────────────────
  describe('API verification', () => {
    beforeEach(() => {
      process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    });

    it('returns success when Cloudflare responds with success', async () => {
      (global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
      });

      const result = await verifyTurnstileToken('valid-token');
      expect(result.success).toBe(true);
    });

    it('returns failure when Cloudflare responds with failure', async () => {
      (global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({ success: false, 'error-codes': ['invalid-input-response'] }),
      });

      const result = await verifyTurnstileToken('invalid-token');
      expect(result.success).toBe(false);
      expect(result.error).toBe('CAPTCHA verification failed. Please try again.');
    });

    it('returns success when fetch throws (service down — graceful degradation)', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await verifyTurnstileToken('some-token');
      expect(result.success).toBe(true);
    });

    it('calls the correct Cloudflare URL', async () => {
      (global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
      });

      await verifyTurnstileToken('test-token');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});
