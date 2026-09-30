/**
 * E2E Tests: Series Browse Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Series Browse Page', () => {
  test('series listing page loads', async ({ page }) => {
    await page.goto('/series');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('series page displays series cards or empty state', async ({ page }) => {
    await page.goto('/series');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('series') ||
      pageContent?.toLowerCase().includes('no series') ||
      pageContent?.toLowerCase().includes('collection')
    ).toBeTruthy();
  });
});
