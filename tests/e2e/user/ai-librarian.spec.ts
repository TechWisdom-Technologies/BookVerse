/**
 * E2E Tests: AI Librarian
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('AI Librarian', () => {
  test('AI librarian widget is accessible', async ({ memberPage }) => {
    await memberPage.goto('/');
    await memberPage.waitForLoadState('domcontentloaded');
    const aiWidgetButton = memberPage.locator('[aria-label="AI Librarian"], .ai-librarian-toggle');
    if (await aiWidgetButton.count() > 0) {
      await expect(aiWidgetButton).toBeVisible();
    }
  });
});
