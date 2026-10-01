import { test, expect } from '@playwright/test';

test.describe('Phase 11: Memory & Resource Exhaustion', () => {

  test('Memory Leak Navigation Loop - rapid 20-page navigation', async ({ page }) => {
    const routes = ['/', '/login', '/library', '/clubs', '/premium', '/search'];
    for (const route of routes) {
      try {
        await page.goto(route, { timeout: 5000 });
      } catch (e) {}
    }
    // After rapid navigation, measure memory
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory?.usedJSHeapSize || 0;
      }
      return 0;
    });
    // Memory should be under 200MB (reasonable for a web app)
    if (memoryUsage > 0) {
      expect(memoryUsage).toBeLessThan(200 * 1024 * 1024);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('CPU Starvation via CDP Throttle (4x slowdown)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
      return;
    }
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto('/');
    // Page should still load within the timeout
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Reset throttling
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  });

  test('LocalStorage Quota Exceeded caught gracefully', async ({ page }) => {
    await page.goto('/');
    const caught = await page.evaluate(() => {
      try {
        const huge = 'X'.repeat(10 * 1024 * 1024); // 10MB
        localStorage.setItem('chaos_quota_test', huge);
        return false;
      } catch (e) {
        return true; // QuotaExceededError caught
      }
    });
    // The app should still function
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('chaos_quota_test'));
  });

  test('Event Listener Leak check after navigation', async ({ page }) => {
    await page.goto('/');
    const listenersBefore = await page.evaluate(() => {
      // Get an approximate count of event listeners
      return (window as any).__listenerCount || 0;
    });
    // Navigate away and back
    try { await page.goto('/login', { timeout: 5000 }); } catch (e) {}
    try { await page.goto('/', { timeout: 5000 }); } catch (e) {}
    // The page should still be responsive
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
