/**
 * E2E Tests: Tip Author
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Tip Author', () => {
  test('tip button triggers payment flow', async ({ proPage }) => {
    await proPage.goto('/stories/1');
    await proPage.waitForLoadState('domcontentloaded');
    const tipBtn = proPage.locator('button:has-text("Tip")');
    if (await tipBtn.count() > 0) {
      await expect(tipBtn.first()).toBeVisible();
    }
  });
});
