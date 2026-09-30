/**
 * Unit tests for src/lib/rate-limit.ts
 *
 * Tests the in-memory rate limiter fallback by calling checkRateLimit()
 * with mocked Next.js headers() and no Upstash configuration.
 * This forces the code to use the rateLimitInMemory() path.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { headers } from 'next/headers';

// Ensure no Upstash env vars so it falls back to in-memory
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

describe('checkRateLimit() — in-memory fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    // Mock headers() to return a consistent IP
    (headers as any).mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === 'x-forwarded-for') return '192.168.1.100';
        return null;
      }),
    });
  });

  it('allows requests under the limit', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit');

    const result = await checkRateLimit(10, 60000, 'test-route');
    expect(result.limited).toBe(false);
    if (!result.limited) {
      expect(result.remaining).toBeDefined();
    }
  });

  it('blocks requests when limit is exceeded', async () => {
    // Use a unique IP per test to avoid cross-test contamination
    let callCount = 0;
    (headers as any).mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === 'x-forwarded-for') return '10.0.0.1';
        return null;
      }),
    });

    const { checkRateLimit } = await import('@/lib/rate-limit');

    // Set limit to 3 requests
    for (let i = 0; i < 3; i++) {
      const result = await checkRateLimit(3, 60000, 'test-route');
      expect(result.limited).toBe(false);
    }

    // 4th request should be blocked
    const blocked = await checkRateLimit(3, 60000, 'test-route');
    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      expect(blocked.response).toBeDefined();
    }
  });

  it('returns remaining count correctly', async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === 'x-forwarded-for') return '10.0.0.2';
        return null;
      }),
    });

    const { checkRateLimit } = await import('@/lib/rate-limit');

    const result = await checkRateLimit(5, 60000, 'test-route');
    expect(result.limited).toBe(false);
    if (!result.limited) {
      expect(result.remaining).toBe(4); // 5 limit - 1 used = 4 remaining
    }
  });

  it('uses x-real-ip when x-forwarded-for is absent', async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === 'x-forwarded-for') return null;
        if (name === 'x-real-ip') return '172.16.0.1';
        return null;
      }),
    });

    const { checkRateLimit } = await import('@/lib/rate-limit');

    const result = await checkRateLimit(10, 60000, 'test-route');
    expect(result.limited).toBe(false);
  });

  it('falls back to 127.0.0.1 when no IP headers present', async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn(() => null),
    });

    const { checkRateLimit } = await import('@/lib/rate-limit');

    const result = await checkRateLimit(10, 60000, 'test-route');
    expect(result.limited).toBe(false);
  });

  it('defaults to limit=60 and windowMs=60000', async () => {
    (headers as any).mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === 'x-forwarded-for') return '10.0.0.3';
        return null;
      }),
    });

    const { checkRateLimit } = await import('@/lib/rate-limit');

    // Call with defaults
    const result = await checkRateLimit();
    expect(result.limited).toBe(false);
    if (!result.limited) {
      expect(result.remaining).toBe(59); // 60 - 1 = 59
    }
  });
});
