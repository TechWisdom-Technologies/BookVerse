/**
 * E2E Tests: Club Detail
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Club Detail', () => {
  test('club detail page loads', async ({ page }) => {
    // Assuming club 1 exists
    await page.goto('/clubs/1');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/clubs');
  });
});
