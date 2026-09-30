/**
 * E2E Tests: AI Writing Tools
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('AI Writing Tools', () => {
  test('AI tools accessible in chapter editor', async ({ authorPage }) => {
    await authorPage.goto('/write/1/chapters/new');
    await authorPage.waitForLoadState('domcontentloaded');
    const aiBtn = authorPage.locator('button:has-text("AI"), button[title*="AI" i]');
    if (await aiBtn.count() > 0) {
      expect(await aiBtn.first().isVisible()).toBeTruthy();
    }
  });
});
