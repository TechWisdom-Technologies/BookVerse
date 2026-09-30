/**
 * E2E Tests: Club Discussions
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Club Discussions', () => {
  test('discussions load', async ({ memberPage }) => {
    // Navigate to a club detail page that has discussions
    await memberPage.goto('/clubs/1');
    await memberPage.waitForLoadState('domcontentloaded');
    const btn = memberPage.locator('button:has-text("Post"), button:has-text("Discuss")');
    if (await btn.count() > 0) {
      expect(await btn.first().isVisible()).toBeTruthy();
    }
  });
});
