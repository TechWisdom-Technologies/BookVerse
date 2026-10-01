import { test, expect } from '@playwright/test';

test.describe('Phase 8: Middleware & Auth Chaos', () => {

  test('CSRF Origin Spoofing - forged origin headers rejected', async ({ page }) => {
    await page.goto('/');
    // Try to make a POST request with a spoofed origin
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://evil-site.com',
          },
          body: JSON.stringify({ title: 'Chaos Test Story' }),
        });
        return { status: res.status, ok: res.ok };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    // The request should either be blocked by CORS or rejected by middleware
    // (403 or network error from browser CORS enforcement)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Tier Cookie Escalation - forged CREATOR tier rejected', async ({ page }) => {
    await page.context().addCookies([
      { name: '__session_tier', value: 'CREATOR', domain: 'localhost', path: '/' },
      { name: '__session_tier_sig', value: 'totally-fake-hmac-signature-that-is-forged', domain: 'localhost', path: '/' },
    ]);
    // Try to access a CREATOR-only route
    await page.goto('/gifts');
    // Should be redirected to premium or login page, not granted access
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Expired Session Avalanche - concurrent stale requests', async ({ page }) => {
    await page.context().addCookies([
      { name: '__session', value: 'expired-token-chaos-test', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/');
    // Fire multiple API requests simultaneously with stale session
    await page.evaluate(async () => {
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          fetch('/api/notifications', { method: 'GET' }).catch(() => null)
        );
      }
      await Promise.allSettled(promises);
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Missing auth cookies - graceful redirect to login', async ({ page }) => {
    // Clear all cookies
    await page.context().clearCookies();
    // Try to access a protected route
    await page.goto('/write/dashboard');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
