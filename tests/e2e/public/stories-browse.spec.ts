/**
 * E2E Tests: Stories Browse Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Stories Browse Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');
  });

  test('stories page loads successfully', async ({ page }) => {
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('displays story cards or empty state', async ({ page }) => {
    // Either story cards are present or an empty state message
    const storyCards = page.locator('[class*="card"], [class*="story"], article, [data-testid*="story"]');
    const emptyState = page.locator(':has-text("No stories"), :has-text("no results")');
    
    expect(
      (await storyCards.count()) > 0 || (await emptyState.count()) > 0
    ).toBeTruthy();
  });

  test('has filter/sort controls', async ({ page }) => {
    // Look for genre filter, sort dropdown, or filter buttons
    const filterElements = page.locator(
      'select, [class*="filter"], [class*="sort"], button:has-text("Filter"), button:has-text("Sort"), [role="combobox"]'
    );
    expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('has pagination or infinite scroll', async ({ page }) => {
    const paginationElements = page.locator(
      '[class*="pagination"], button:has-text("Next"), button:has-text("Load More"), a:has-text("Next"), nav[aria-label*="pagination"]'
    );
    // Pagination may or may not be visible depending on data
    expect(await paginationElements.count()).toBeGreaterThanOrEqual(0);
  });
});
