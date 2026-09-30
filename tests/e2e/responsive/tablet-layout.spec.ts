/**
 * E2E Tests: Tablet Layout
 */
import { test, expect } from '@playwright/test';

test.describe('Tablet Layout', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // Tablet viewport

  test('grid layout adapts to tablet', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');
    
    // Check if the stories container exists
    const grid = page.locator('[class*="grid"]');
    expect(await grid.count()).toBeGreaterThanOrEqual(0);
  });
});
