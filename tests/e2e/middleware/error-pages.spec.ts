/**
 * E2E Tests: Error Pages
 */
import { test, expect } from '@playwright/test';

test.describe('Error Pages', () => {
  test('404 page renders for unknown routes', async ({ page }) => {
    await page.goto('/unknown-route-12345');
    await page.waitForLoadState('domcontentloaded');
    const body = await page.textContent('body');
    expect(
      body?.toLowerCase().includes('404') || 
      body?.toLowerCase().includes('not found')
    ).toBeTruthy();
  });
});
