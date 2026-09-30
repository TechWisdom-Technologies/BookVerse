import { test, expect } from '@playwright/test';

test.describe('Reader Performance', () => {
  test('reader should load text quickly', async ({ page }) => {
    // Assuming book ID 1 exists
    await page.goto('/library/1/read');
    await page.waitForLoadState('domcontentloaded');

    const perfMetrics = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]));
    const metrics = JSON.parse(perfMetrics);

    const loadTime = metrics.loadEventEnd - metrics.startTime;
    const domInteractive = metrics.domInteractive - metrics.startTime;

    console.log(`Reader DOM Interactive: ${domInteractive.toFixed(2)}ms`);
    console.log(`Reader Total Load Time: ${loadTime.toFixed(2)}ms`);

    expect(domInteractive).toBeLessThan(3500); // 3.5s for dev mode
  });
});
