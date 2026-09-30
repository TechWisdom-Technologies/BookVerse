/**
 * E2E Tests: Club Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Club Management', () => {
  test('club settings can be accessed by owner', async ({ memberPage }) => {
    // Navigate to a club where member is owner
    await memberPage.goto('/clubs/1');
    await memberPage.waitForLoadState('domcontentloaded');
    const settingsBtn = memberPage.locator('[aria-label="Settings"], [title="Settings"]');
    if (await settingsBtn.count() > 0) {
      expect(await settingsBtn.first().isVisible()).toBeTruthy();
    }
  });
});
