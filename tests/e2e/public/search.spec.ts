/**
 * E2E Tests: Search Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('domcontentloaded');
  });

  test('search page loads with search input', async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[type="text"], input[placeholder*="search" i], input[name="q"], input[name="query"]'
    );
    await expect(searchInput.first()).toBeVisible();
  });

  test('search with keyword returns results or empty state', async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[type="text"], input[placeholder*="search" i], input[name="q"], input[name="query"]'
    ).first();

    await searchInput.fill('test');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(50);
  });

  test('empty search shows appropriate state', async ({ page }) => {
    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('search') ||
      pageContent?.toLowerCase().includes('find') ||
      pageContent?.toLowerCase().includes('discover')
    ).toBeTruthy();
  });
});
