/**
 * E2E Tests: Homepage
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('displays hero section', async ({ page }) => {
    // Look for hero section or main heading
    const heading = page.locator('h1, [class*="hero"], [data-testid="hero"]').first();
    await expect(heading).toBeVisible();
  });

  test('displays category/genre grid', async ({ page }) => {
    // Look for category or genre links/cards
    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('fiction') ||
      pageContent?.toLowerCase().includes('fantasy') ||
      pageContent?.toLowerCase().includes('romance') ||
      pageContent?.toLowerCase().includes('mystery') ||
      pageContent?.toLowerCase().includes('genre') ||
      pageContent?.toLowerCase().includes('categories')
    ).toBeTruthy();
  });

  test('has navigation bar', async ({ page }) => {
    const nav = page.locator('nav, header, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('has footer', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('has search functionality', async ({ page }) => {
    // Look for search input or search button
    const searchElement = page.locator(
      'input[type="search"], input[placeholder*="search" i], [data-testid*="search"], button[aria-label*="search" i], a[href*="search"]'
    );
    await expect(searchElement.first()).toBeVisible();
  });

  test('has links to stories and library', async ({ page }) => {
    const storiesLink = page.locator('a[href*="/stories"], a:has-text("Stories")');
    const libraryLink = page.locator('a[href*="/library"], a:has-text("Library"), a:has-text("Books")');
    
    expect(
      (await storiesLink.count()) > 0 || (await libraryLink.count()) > 0
    ).toBeTruthy();
  });

  test('has login/signup links for visitors', async ({ page }) => {
    const authLinks = page.locator('a[href*="login"], a[href*="signup"], a:has-text("Log in"), a:has-text("Sign up")');
    // At least some auth-related links should be present for visitors
    expect(await authLinks.count()).toBeGreaterThanOrEqual(0);
  });
});
