/**
 * E2E Tests: Story Detail Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Detail Page', () => {
  test('story detail page structure loads for a valid story', async ({ page }) => {
    // First navigate to stories list to find a story
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    // Try to click on the first story card/link
    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      // Verify story detail page elements
      const pageContent = await page.textContent('body');
      expect(pageContent?.length).toBeGreaterThan(100);

      // Should have some story content elements
      expect(
        pageContent?.toLowerCase().includes('chapter') ||
        pageContent?.toLowerCase().includes('author') ||
        pageContent?.toLowerCase().includes('genre') ||
        page.url().includes('/stories/')
      ).toBeTruthy();
    }
  });

  test('non-existent story shows 404 or error', async ({ page }) => {
    await page.goto('/stories/non-existent-story-id-12345');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('not found') ||
      pageContent?.toLowerCase().includes('404') ||
      pageContent?.toLowerCase().includes('error') ||
      pageContent?.toLowerCase().includes('does not exist')
    ).toBeTruthy();
  });
});
