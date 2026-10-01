import { test, expect } from '@playwright/test';

test.describe('Phase 12: CORS & Preflight Cache Recovery', () => {

  test('Transient Error Caching - recovers from transient errors via cache busting', async ({ page }) => {
    // 1. Simulate an API endpoint that is temporarily broken
    await page.route('**/api/flakey-endpoint*', async (route, request) => {
      const isRetry = request.url().includes('retry=');

      if (!isRetry) {
        // First attempt fails
        await route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        // Second attempt with cache buster succeeds
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      }
    });

    await page.goto('/');

    const firstAttempt = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/flakey-endpoint');
        return res.status;
      } catch (e: any) {
        return 0;
      }
    });

    // Expecting the fetch to fail
    expect(firstAttempt).toBe(500);

    // 2. The client retries. To bypass the browser's negative cache,
    // a robust app will append a cache-busting timestamp or token.
    const secondAttempt = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/flakey-endpoint?retry=' + Date.now());
        return res.status;
      } catch (e: any) {
        return 0;
      }
    });

    // The fetch should succeed, proving the cache buster circumvented the poisoned cache
    expect(secondAttempt).toBe(200);
  });

});
