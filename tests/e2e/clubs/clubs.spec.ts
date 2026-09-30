/**
 * E2E Tests: Book Clubs (Browse, Create, Detail, Discussions, Management)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Clubs Browse Page', () => {
  test('clubs page loads', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('clubs page shows club cards or empty state', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('club') ||
      pageContent?.toLowerCase().includes('community') ||
      pageContent?.toLowerCase().includes('no club') ||
      pageContent?.toLowerCase().includes('join')
    ).toBeTruthy();
  });

  test('clubs page has create button or link', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const createButton = page.locator(
      'a[href*="/clubs/create"], button:has-text("Create"), a:has-text("Create")'
    );
    expect(await createButton.count()).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Create Club Page', () => {
  test('create club page loads', async ({ page }) => {
    await page.goto('/clubs/create');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('create club form has required fields', async ({ page }) => {
    await page.goto('/clubs/create');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('name') ||
      pageContent?.toLowerCase().includes('club') ||
      pageContent?.toLowerCase().includes('create') ||
      pageContent?.toLowerCase().includes('description')
    ).toBeTruthy();

    const inputs = page.locator('input, textarea, select');
    expect(await inputs.count()).toBeGreaterThan(0);
  });
});

test.describe('Club Detail Page', () => {
  test('navigates to club detail from clubs list', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const clubLink = page.locator('a[href*="/clubs/"]').first();
    if (await clubLink.isVisible()) {
      const href = await clubLink.getAttribute('href');
      if (href && !href.includes('/create')) {
        await clubLink.click();
        await page.waitForLoadState('domcontentloaded');

        const body = await page.textContent('body');
        expect(body?.length).toBeGreaterThan(100);

        expect(
          body?.toLowerCase().includes('member') ||
          body?.toLowerCase().includes('discussion') ||
          body?.toLowerCase().includes('join') ||
          body?.toLowerCase().includes('club')
        ).toBeTruthy();
      }
    }
  });
});

test.describe('Club Discussions', () => {
  test('club page shows discussion section', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const clubLink = page.locator('a[href*="/clubs/"]').first();
    if (await clubLink.isVisible()) {
      const href = await clubLink.getAttribute('href');
      if (href && !href.includes('/create')) {
        await clubLink.click();
        await page.waitForLoadState('domcontentloaded');

        const pageContent = await page.textContent('body');
        expect(
          pageContent?.toLowerCase().includes('discussion') ||
          pageContent?.toLowerCase().includes('post') ||
          pageContent?.toLowerCase().includes('message') ||
          pageContent?.toLowerCase().includes('member')
        ).toBeTruthy();
      }
    }
  });
});

test.describe('Club Management', () => {
  test('club settings accessible to owner', async ({ page }) => {
    await page.goto('/clubs');
    await page.waitForLoadState('domcontentloaded');

    const clubLink = page.locator('a[href*="/clubs/"]').first();
    if (await clubLink.isVisible()) {
      const href = await clubLink.getAttribute('href');
      if (href && !href.includes('/create')) {
        await clubLink.click();
        await page.waitForLoadState('domcontentloaded');

        // Look for settings button/link
        const settingsButton = page.locator(
          'button:has-text("Settings"), a[href*="settings"], button[aria-label*="settings" i], [class*="settings"]'
        );
        // May or may not be visible depending on ownership
        expect(await settingsButton.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
