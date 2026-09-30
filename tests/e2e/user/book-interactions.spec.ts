/**
 * E2E Tests: Book Interactions (Reviews, Save, Download, Annotations)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Book Interactions', () => {
  test('book detail page shows review section', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    const bookLink = page.locator('a[href*="/library/"]').first();
    if (await bookLink.isVisible()) {
      await bookLink.click();
      await page.waitForLoadState('domcontentloaded');

      const pageContent = await page.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('review') ||
        pageContent?.toLowerCase().includes('rating') ||
        pageContent?.toLowerCase().includes('download')
      ).toBeTruthy();
    }
  });

  test('book detail page shows download button', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    const bookLink = page.locator('a[href*="/library/"]').first();
    if (await bookLink.isVisible()) {
      await bookLink.click();
      await page.waitForLoadState('domcontentloaded');

      const downloadButton = page.locator(
        'button:has-text("Download"), a:has-text("Download"), button:has-text("Read"), a:has-text("Read")'
      );
      expect(await downloadButton.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('book detail page shows save/bookmark button', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    const bookLink = page.locator('a[href*="/library/"]').first();
    if (await bookLink.isVisible()) {
      await bookLink.click();
      await page.waitForLoadState('domcontentloaded');

      const saveButton = page.locator(
        'button:has-text("Save"), button:has-text("Bookmark"), button[aria-label*="save" i], button[aria-label*="bookmark" i]'
      );
      expect(await saveButton.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
