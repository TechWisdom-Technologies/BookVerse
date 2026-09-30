/**
 * Phase 7: CSRF (Cross-Site Request Forgery)
 * Tests that the middleware blocks cross-origin state-changing requests.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from '../../middleware';

vi.mock('@/lib/cookie-crypto', () => ({
  verifyRole: vi.fn().mockResolvedValue(false),
  verifyTier: vi.fn().mockResolvedValue(false),
}));

function createMockRequest(
  url: string,
  method: string,
  origin?: string,
  cookies: Record<string, string> = {}
) {
  const cookieMap = new Map(Object.entries(cookies));
  return {
    method,
    nextUrl: new URL(url, 'http://localhost:3000'),
    headers: {
      get: vi.fn((name: string) => {
        if (name === 'origin') return origin || null;
        return null;
      }),
    },
    cookies: {
      get: vi.fn((name: string) => {
        const val = cookieMap.get(name);
        return val ? { value: val } : undefined;
      }),
    },
  } as any;
}

describe('Phase 7: CSRF Protection (Middleware)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = 'https://bookverse.app';
  });

  it('blocks POST requests with a foreign Origin header', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/stories',
      'POST',
      'https://evil-site.com'
    );
    const res = await middleware(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toMatch(/cross-origin/i);
  });

  it('blocks DELETE requests from a foreign origin', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/users/me',
      'DELETE',
      'https://attacker.com'
    );
    const res = await middleware(req);
    expect(res.status).toBe(403);
  });

  it('blocks PATCH requests from a foreign origin', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/users/me',
      'PATCH',
      'https://phishing.io'
    );
    const res = await middleware(req);
    expect(res.status).toBe(403);
  });

  it('allows POST requests with matching Origin', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/stories',
      'POST',
      'https://bookverse.app'
    );
    const res = await middleware(req);
    // Should pass through (not 403)
    expect(res.status).not.toBe(403);
  });

  it('allows GET requests regardless of Origin (read-only)', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/stories',
      'GET',
      'https://evil-site.com'
    );
    const res = await middleware(req);
    expect(res.status).not.toBe(403);
  });

  it('exempts webhook endpoint from origin check', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/payment/uddokta/webhook',
      'POST',
      'https://uddoktapay.com'
    );
    const res = await middleware(req);
    expect(res.status).not.toBe(403);
  });

  it('exempts cron endpoints from origin check', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/cron/publish-chapters',
      'POST',
      'https://vercel.com'
    );
    const res = await middleware(req);
    expect(res.status).not.toBe(403);
  });

  it('allows server-to-server requests (no Origin header)', async () => {
    const req = createMockRequest(
      'http://localhost:3000/api/stories',
      'POST',
      undefined // No origin header
    );
    const res = await middleware(req);
    expect(res.status).not.toBe(403);
  });
});
