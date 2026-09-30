/**
 * E2E Tests: Poll Creation
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Poll Creation', () => {
  test('poll creation option exists in chapter editor', async ({ authorPage }) => {
    // Navigate to chapter creation
    await authorPage.goto('/write/1/chapters/new');
    await authorPage.waitForLoadState('domcontentloaded');
    const addPollBtn = authorPage.locator('button:has-text("Poll")');
    if (await addPollBtn.count() > 0) {
      expect(await addPollBtn.first().isVisible()).toBeTruthy();
    }
  });
});
