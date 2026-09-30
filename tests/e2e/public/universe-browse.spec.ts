/**
 * E2E Tests: Universe Browse Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Universe Browse Page', () => {
  test('universes listing page loads', async ({ page }) => {
    await page.goto('/universes');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('universes page displays universe cards or empty state', async ({ page }) => {
    await page.goto('/universes');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('universe') ||
      pageContent?.toLowerCase().includes('world') ||
      pageContent?.toLowerCase().includes('no universe')
    ).toBeTruthy();
  });
});
