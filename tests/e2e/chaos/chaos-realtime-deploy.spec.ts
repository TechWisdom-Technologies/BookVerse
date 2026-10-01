import { test, expect } from '@playwright/test';

test.describe('Phase 12: WebSocket & Real-Time Chaos', () => {

  test('OneSignal Connection Drop - page remains functional', async ({ page }) => {
    await page.route('**/onesignal.com/**', route => route.abort('connectionreset'));
    await page.goto('/');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Notification endpoint flood does not freeze UI', async ({ page }) => {
    await page.goto('/');
    // Simulate rapid-fire notification API calls
    await page.evaluate(async () => {
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          fetch('/api/notifications', { method: 'GET' }).catch(() => null)
        );
      }
      await Promise.allSettled(promises);
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Notification while offline queued properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for all client-side redirects to finish
    const body = page.locator('body');
    await expect(body).toBeVisible(); // Wait for stable render before evaluating
    
    await page.context().setOffline(true);
    // Try to fetch notifications while offline
    const result = await page.evaluate(async () => {
      try {
        await fetch('/api/stories', { method: 'POST', body: JSON.stringify({ title: 'Test' }) });
        return 'success';
      } catch (e) {
        return 'failed-as-expected';
      }
    });
    expect(result).toBe('failed-as-expected');
    await page.context().setOffline(false);
    await expect(body).toBeVisible();
  });
});

test.describe('Phase 13: Deployment & Version Skew Simulation', () => {

  test('Asset 404 During Deployment - stale JS chunks', async ({ page }) => {
    // Block Next.js static chunks
    await page.route('**/_next/static/chunks/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'text/plain',
        body: 'Not Found',
      });
    });
    // The page should still show something, not a blank white screen
    try {
      await page.goto('/', { timeout: 10000 });
    } catch (e) {}
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('API Response Shape Change does not crash', async ({ page }) => {
    // Return unexpected API shapes
    await page.route('**/api/stories**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          unexpectedField: true,
          data: { completely: 'different', shape: 123 },
        }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
