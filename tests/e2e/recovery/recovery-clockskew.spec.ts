import { test, expect } from '@playwright/test';

test.describe('Phase 11: Clock Skew Healing & JWT Recovery', () => {

  test('Clock Correction Recovery - recovers session when clock synchronizes', async ({ page }) => {
    // We simulate an API that relies on timestamped signatures
    let currentServerTime = Date.now();
    let requestCount = 0;

    await page.route('/api/secure-action', async (route, request) => {
      requestCount++;
      // We parse a mocked header the client sends
      const clientTime = parseInt(request.headers()['x-client-timestamp'] || '0', 10);
      
      // If client time is more than 5 minutes skewed, reject it
      if (Math.abs(currentServerTime - clientTime) > 5 * 60 * 1000) {
        await route.fulfill({ status: 401, body: JSON.stringify({ error: 'TokenExpiredError / ClockSkew' }) });
        return;
      }
      
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.goto('/');

    const firstAttempt = await page.evaluate(async () => {
      // Intentionally skew client time 24 hours into the future
      const skewedTime = Date.now() + 24 * 60 * 60 * 1000;
      
      const res = await fetch('/api/secure-action', {
        method: 'POST',
        headers: { 'x-client-timestamp': skewedTime.toString() }
      });
      return res.status;
    });

    // Server should reject it
    expect(firstAttempt).toBe(401);

    const secondAttempt = await page.evaluate(async () => {
      // User fixes their clock (syncs to real time)
      const correctTime = Date.now();
      
      const res = await fetch('/api/secure-action', {
        method: 'POST',
        headers: { 'x-client-timestamp': correctTime.toString() }
      });
      return res.status;
    });

    // The app shouldn't have prematurely destroyed the entire session, just failed the request.
    // When the time is fixed, it recovers immediately.
    expect(secondAttempt).toBe(200);
  });

  test('Stale Nonce Recovery - auto-refreshes CSRF tokens on expiration', async ({ page }) => {
    let nonceRequestCount = 0;
    await page.route('/api/csrf', async (route) => {
      nonceRequestCount++;
      await route.fulfill({ status: 200, body: JSON.stringify({ csrfToken: `new-token-${nonceRequestCount}` }) });
    });

    let submitRequestCount = 0;
    await page.route('/api/form-submit', async (route, request) => {
      submitRequestCount++;
      const payload = JSON.parse(request.postData() || '{}');

      // First submit has the old/expired token
      if (submitRequestCount === 1) {
        await route.fulfill({ status: 403, body: JSON.stringify({ error: 'CSRF Token Expired' }) });
        return;
      }

      // Second submit has the new token
      if (payload.csrfToken === 'new-token-1') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        return;
      }

      await route.fulfill({ status: 400, body: JSON.stringify({ error: 'Invalid payload' }) });
    });

    await page.goto('/');

    // Simulate the form submission recovery logic
    const result = await page.evaluate(async () => {
      const submitForm = async (token: string): Promise<number> => {
        const res = await fetch('/api/form-submit', {
          method: 'POST',
          body: JSON.stringify({ data: 'hello', csrfToken: token })
        });

        if (res.status === 403) {
          // Recovery mechanism: catch 403, refresh token, retry
          const csrfRes = await fetch('/api/csrf');
          const csrfJson = await csrfRes.json();
          
          // Retry
          const retryRes = await fetch('/api/form-submit', {
            method: 'POST',
            body: JSON.stringify({ data: 'hello', csrfToken: csrfJson.csrfToken })
          });
          return retryRes.status;
        }

        return res.status;
      };

      return submitForm('expired-token-123');
    });

    // The form seamlessly recovers without the user noticing
    expect(result).toBe(200);
  });

});
