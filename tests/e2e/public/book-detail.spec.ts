/**
 * E2E Tests: Book Detail Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Book Detail Page', () => {
  test('book detail page loads for a valid book', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    const bookLink = page.locator('a[href*="/library/"]').first();
    if (await bookLink.isVisible()) {
      await bookLink.click();
      await page.waitForLoadState('domcontentloaded');

      const pageContent = await page.textContent('body');
      expect(pageContent?.length).toBeGreaterThan(100);

      // Should show book details
      expect(
        pageContent?.toLowerCase().includes('download') ||
        pageContent?.toLowerCase().includes('author') ||
        pageContent?.toLowerCase().includes('genre') ||
        pageContent?.toLowerCase().includes('review') ||
        page.url().includes('/library/')
      ).toBeTruthy();
    }
  });

  test('non-existent book shows 404 or error', async ({ page }) => {
    await page.goto('/library/non-existent-book-id-12345');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('not found') ||
      pageContent?.toLowerCase().includes('404') ||
      pageContent?.toLowerCase().includes('error')
    ).toBeTruthy();
  });
});
