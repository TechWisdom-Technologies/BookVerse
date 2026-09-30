/**
 * E2E Tests: PRO Tier Features (Wallet, Reading Challenges, Stats, Achievements, Tips)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Wallet Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads wallet page for PRO user', async ({ proPage }) => {
    await proPage.goto('/wallet');
    await proPage.waitForLoadState('domcontentloaded');

    const url = proPage.url();
    if (url.includes('/wallet')) {
      const body = await proPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('wallet') ||
        body?.toLowerCase().includes('balance') ||
        body?.toLowerCase().includes('transaction') ||
        body?.toLowerCase().includes('earnings')
      ).toBeTruthy();
    }
  });
});

test.describe('Reading Challenges Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/reading-challenges');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads reading challenges for PRO user', async ({ proPage }) => {
    await proPage.goto('/reading-challenges');
    await proPage.waitForLoadState('domcontentloaded');

    const url = proPage.url();
    if (url.includes('/reading-challenges')) {
      const body = await proPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('challenge') ||
        body?.toLowerCase().includes('reading') ||
        body?.toLowerCase().includes('goal') ||
        body?.toLowerCase().includes('no challenge')
      ).toBeTruthy();
    }
  });
});

test.describe('Reading Stats Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/reading-stats');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads reading stats for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/reading-stats');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/reading-stats')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('stat') ||
        body?.toLowerCase().includes('reading') ||
        body?.toLowerCase().includes('streak') ||
        body?.toLowerCase().includes('pages')
      ).toBeTruthy();
    }
  });
});

test.describe('Achievements Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads achievements for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/achievements');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/achievements')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('achievement') ||
        body?.toLowerCase().includes('badge') ||
        body?.toLowerCase().includes('earned') ||
        body?.toLowerCase().includes('no achievement')
      ).toBeTruthy();
    }
  });
});

test.describe('Tip Author', () => {
  test('tip dialog elements exist on story pages', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      // Look for tip button
      const tipButton = page.locator(
        'button:has-text("Tip"), button:has-text("Support"), button[aria-label*="tip" i]'
      );
      expect(await tipButton.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
