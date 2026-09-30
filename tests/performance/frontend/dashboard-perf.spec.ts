import { test, expect } from '@playwright/test';

test.describe('Author Dashboard Performance', () => {
  test('heavy dashboard should load within acceptable thresholds', async ({ page, context }) => {
    // We mock the auth token so we can actually hit the dashboard without being redirected
    await context.addCookies([{
      name: 'next-auth.session-token',
      value: 'mock-valid-token',
      domain: 'localhost',
      path: '/',
    }]);

    await page.goto('/write/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const perfMetrics = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]));
    const metrics = JSON.parse(perfMetrics);

    const domInteractive = metrics.domInteractive - metrics.startTime;

    console.log(`Dashboard DOM Interactive: ${domInteractive.toFixed(2)}ms`);

    expect(domInteractive).toBeLessThan(4000); // Heavy dashboard can take a bit longer in dev
  });
});
