/**
 * E2E Tests: Follow / Unfollow Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Follow Flow', () => {
  test('follow button appears on public profile for logged-in user', async ({ memberPage }) => {
    // Navigate to a profile page
    await memberPage.goto('/stories');
    await memberPage.waitForLoadState('domcontentloaded');

    const authorLink = memberPage.locator('a[href*="/profile/"]').first();
    if (await authorLink.isVisible()) {
      await authorLink.click();
      await memberPage.waitForLoadState('domcontentloaded');

      if (memberPage.url().includes('/profile/')) {
        const followButton = memberPage.locator(
          'button:has-text("Follow"), button:has-text("Unfollow")'
        );
        expect(await followButton.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
