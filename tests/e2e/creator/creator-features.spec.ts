/**
 * E2E Tests: CREATOR Tier Features (Analytics, Newsletter, Gifts, Promotions)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Author Analytics Page', () => {
  test('analytics page requires auth', async ({ page }) => {
    await page.goto('/author/analytics');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads analytics for creator user', async ({ creatorPage }) => {
    await creatorPage.goto('/author/analytics');
    await creatorPage.waitForLoadState('domcontentloaded');

    const url = creatorPage.url();
    if (url.includes('/author/analytics')) {
      const body = await creatorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('analytics') ||
        body?.toLowerCase().includes('views') ||
        body?.toLowerCase().includes('stat') ||
        body?.toLowerCase().includes('chart')
      ).toBeTruthy();
    }
  });
});

test.describe('Author Newsletter Page', () => {
  test('newsletter page requires auth', async ({ page }) => {
    await page.goto('/author/newsletter');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads newsletter page for creator', async ({ creatorPage }) => {
    await creatorPage.goto('/author/newsletter');
    await creatorPage.waitForLoadState('domcontentloaded');

    const url = creatorPage.url();
    if (url.includes('/author/newsletter')) {
      const body = await creatorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('newsletter') ||
        body?.toLowerCase().includes('subscriber') ||
        body?.toLowerCase().includes('compose') ||
        body?.toLowerCase().includes('send')
      ).toBeTruthy();
    }
  });
});

test.describe('Gifts Page', () => {
  test('gifts page requires auth', async ({ page }) => {
    await page.goto('/gifts');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads gifts page for creator', async ({ creatorPage }) => {
    await creatorPage.goto('/gifts');
    await creatorPage.waitForLoadState('domcontentloaded');

    const url = creatorPage.url();
    if (url.includes('/gifts')) {
      const body = await creatorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('gift') ||
        body?.toLowerCase().includes('membership') ||
        body?.toLowerCase().includes('send') ||
        body?.toLowerCase().includes('redeem')
      ).toBeTruthy();
    }
  });
});

test.describe('Story Promotion', () => {
  test('promoted stories page loads', async ({ page }) => {
    await page.goto('/stories/promoted');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });
});
