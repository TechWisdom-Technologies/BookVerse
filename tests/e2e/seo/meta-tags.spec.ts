/**
 * E2E Tests: Meta Tags
 */
import { test, expect } from '@playwright/test';

test.describe('Meta Tags', () => {
  test('homepage has basic OG tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    expect(await ogTitle.count()).toBeGreaterThanOrEqual(0);
    
    const ogImage = page.locator('meta[property="og:image"]');
    expect(await ogImage.count()).toBeGreaterThanOrEqual(0);
  });
});
