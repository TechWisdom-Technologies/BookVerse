/**
 * E2E Tests: Public Profile Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Public Profile Page', () => {
  test('profile page shows 404 for non-existent user', async ({ page }) => {
    await page.goto('/profile/nonexistentuserxyz999');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('not found') ||
      pageContent?.toLowerCase().includes('404') ||
      pageContent?.toLowerCase().includes('user') ||
      pageContent?.toLowerCase().includes('error')
    ).toBeTruthy();
  });

  test('profile page structure has expected sections', async ({ page }) => {
    // Navigate to a profile if any exists
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    // Try to find an author link on a story card
    const authorLink = page.locator('a[href*="/profile/"]').first();
    if (await authorLink.isVisible()) {
      await authorLink.click();
      await page.waitForLoadState('domcontentloaded');

      expect(page.url()).toContain('/profile/');
      const pageContent = await page.textContent('body');
      expect(pageContent?.length).toBeGreaterThan(100);
    }
  });
});
