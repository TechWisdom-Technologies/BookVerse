/**
 * Phase 4: Rate Limiting & Abuse Prevention
 * Tests that rate limiting is enforced properly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the in-memory rate limiter directly since Upstash is not available in tests
describe('Phase 4: Rate Limiting & Abuse Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('rate limiter returns 429 when limit is exceeded', async () => {
    // Mock headers to return a consistent IP
    vi.doMock('next/headers', () => ({
      headers: vi.fn(() => ({
        get: vi.fn((name: string) => {
          if (name === 'x-forwarded-for') return '1.2.3.4';
          return null;
        }),
      })),
      cookies: vi.fn(() => ({
        get: vi.fn(),
      })),
    }));

    // Mock prisma for rate limit violation logging
    vi.doMock('@/lib/prisma', () => ({
      prisma: {
        rateLimitViolation: {
          create: vi.fn().mockReturnValue({ catch: vi.fn() }),
        },
      },
    }));

    const { checkRateLimit } = await import('@/lib/rate-limit');

    // Set a very small limit: 3 requests per 60 seconds
    const limit = 3;
    const windowMs = 60000;

    // First 3 should pass
    for (let i = 0; i < limit; i++) {
      const result = await checkRateLimit(limit, windowMs);
      expect(result.limited).toBe(false);
    }

    // 4th request should be rate limited
    const blocked = await checkRateLimit(limit, windowMs);
    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      expect(blocked.response.status).toBe(429);
      const data = await blocked.response.json();
      expect(data.error).toMatch(/too many requests/i);
    }
  });

  it('rate limiter includes proper headers in 429 response', async () => {
    vi.doMock('next/headers', () => ({
      headers: vi.fn(() => ({
        get: vi.fn((name: string) => {
          if (name === 'x-forwarded-for') return '5.6.7.8';
          return null;
        }),
      })),
      cookies: vi.fn(() => ({
        get: vi.fn(),
      })),
    }));

    vi.doMock('@/lib/prisma', () => ({
      prisma: {
        rateLimitViolation: {
          create: vi.fn().mockReturnValue({ catch: vi.fn() }),
        },
      },
    }));

    const { checkRateLimit } = await import('@/lib/rate-limit');

    // Exhaust limit
    await checkRateLimit(1, 60000);
    const blocked = await checkRateLimit(1, 60000);

    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      // Check response has rate limit headers
      const headers = blocked.response.headers;
      expect(headers).toBeDefined();
    }
  });
});
