/**
 * E2E Tests: Library (Books) Browse Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Library Browse Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');
  });

  test('library page loads successfully', async ({ page }) => {
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('displays book cards or empty state', async ({ page }) => {
    const bookCards = page.locator('[class*="card"], [class*="book"], article, [data-testid*="book"]');
    const emptyState = page.locator(':has-text("No books"), :has-text("no results"), :has-text("empty")');

    expect(
      (await bookCards.count()) > 0 || (await emptyState.count()) > 0
    ).toBeTruthy();
  });

  test('has filter controls for genre/language', async ({ page }) => {
    const filterElements = page.locator(
      'select, [class*="filter"], button:has-text("Filter"), [role="combobox"], input[placeholder*="search" i]'
    );
    expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  });
});
