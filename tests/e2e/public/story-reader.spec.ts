/**
 * E2E Tests: Story Reader (Chapter View)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Reader', () => {
  test('chapter reader page loads for a valid story with chapters', async ({ page }) => {
    // Navigate to stories list
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    // Find and click on a story
    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      // Try to find a chapter link
      const chapterLink = page.locator('a[href*="/chapters/"]').first();
      if (await chapterLink.isVisible()) {
        await chapterLink.click();
        await page.waitForLoadState('domcontentloaded');

        // Verify chapter reader loaded
        const pageContent = await page.textContent('body');
        expect(pageContent?.length).toBeGreaterThan(50);
        expect(page.url()).toContain('/chapters/');
      }
    }
  });
});
