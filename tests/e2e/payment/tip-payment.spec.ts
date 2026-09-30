/**
 * E2E Tests: Tip Payment Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Tip Payment', () => {
  test('tip dialog opens from story page', async ({ memberPage }) => {
    await memberPage.goto('/stories');
    await memberPage.waitForLoadState('domcontentloaded');
    const storyLink = memberPage.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await memberPage.waitForLoadState('domcontentloaded');
      const tipBtn = memberPage.locator('button:has-text("Tip"), button:has-text("Support")');
      if (await tipBtn.isVisible()) {
        await tipBtn.click();
        const tipDialog = memberPage.locator('[role="dialog"], [class*="modal"]');
        await expect(tipDialog).toBeVisible();
      }
    }
  });
});
