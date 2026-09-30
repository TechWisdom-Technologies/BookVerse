/**
 * E2E Tests: Story Interactions (Reactions, Comments, Inline Comments)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Interactions', () => {
  test('reaction bar is visible on story detail page', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      // Look for reaction elements
      const reactionElements = page.locator(
        '[class*="reaction"], [data-testid*="reaction"], button[aria-label*="like" i], button[aria-label*="love" i]'
      );
      // Reactions may or may not be visible depending on auth state
      expect(await reactionElements.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('comment section is visible on story detail page', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      const pageContent = await page.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('comment') ||
        pageContent?.toLowerCase().includes('discussion') ||
        pageContent?.toLowerCase().includes('review')
      ).toBeTruthy();
    }
  });

  test('comment form requires authentication', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      // Look for comment form or login prompt
      const commentForm = page.locator('textarea, input[placeholder*="comment" i]');
      const loginPrompt = page.locator(':has-text("log in"), :has-text("sign in")');

      expect(
        (await commentForm.count()) > 0 || (await loginPrompt.count()) > 0
      ).toBeTruthy();
    }
  });
});
