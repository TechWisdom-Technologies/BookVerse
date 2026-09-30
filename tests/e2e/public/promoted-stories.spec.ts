/**
 * E2E Tests: Promoted Stories Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Promoted Stories Page', () => {
  test('promoted stories page loads', async ({ page }) => {
    await page.goto('/stories/promoted');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('page shows promoted content or empty state', async ({ page }) => {
    await page.goto('/stories/promoted');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('promoted') ||
      pageContent?.toLowerCase().includes('featured') ||
      pageContent?.toLowerCase().includes('trending') ||
      pageContent?.toLowerCase().includes('no promoted') ||
      pageContent?.toLowerCase().includes('stories')
    ).toBeTruthy();
  });
});
