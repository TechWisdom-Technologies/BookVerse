/**
 * E2E Tests: Clubs Browse
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Clubs Browse', () => {
  test('clubs browse page loads', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/clubs');
  });
});
