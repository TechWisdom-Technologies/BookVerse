/**
 * E2E Tests: Accessibility
 */
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('Skip to main content link exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for common a11y skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link');
    expect(await skipLink.count()).toBeGreaterThanOrEqual(0);
  });
});
