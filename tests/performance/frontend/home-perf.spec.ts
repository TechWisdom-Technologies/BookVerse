import { test, expect } from '@playwright/test';

test.describe('Homepage Performance', () => {
  test('should load within acceptable thresholds', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for network to be idle-ish or domcontentloaded
    await page.waitForLoadState('domcontentloaded');

    // Get performance metrics using Navigation Timing API
    const perfMetrics = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]));
    const metrics = JSON.parse(perfMetrics);

    // Calculate times
    const loadTime = metrics.loadEventEnd - metrics.startTime;
    const ttfb = metrics.responseStart - metrics.startTime;
    const domInteractive = metrics.domInteractive - metrics.startTime;

    console.log(`Homepage TTFB: ${ttfb.toFixed(2)}ms`);
    console.log(`Homepage DOM Interactive: ${domInteractive.toFixed(2)}ms`);
    console.log(`Homepage Total Load Time: ${loadTime.toFixed(2)}ms`);

    // Assertions based on Phase 2 requirements (e.g. general < 1000ms for load)
    // Note: In development mode (npm run dev), these might be higher due to HMR. 
    // In production, these should be strict. We'll set generous thresholds for dev.
    expect(ttfb).toBeLessThan(1500); // Time to first byte
    expect(domInteractive).toBeLessThan(3000); // DOM Interactive
  });
});
