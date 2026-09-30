import { test, expect } from '@playwright/test';

test.describe('Library Browse Performance', () => {
  test('library listing should load efficiently', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    const perfMetrics = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]));
    const metrics = JSON.parse(perfMetrics);

    const domInteractive = metrics.domInteractive - metrics.startTime;

    console.log(`Library DOM Interactive: ${domInteractive.toFixed(2)}ms`);

    expect(domInteractive).toBeLessThan(3500); 
  });
});
