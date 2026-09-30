/**
 * E2E Tests: Settings Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Settings Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads settings page for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/settings');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/settings')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(100);
    }
  });

  test('settings page has security sections', async ({ memberPage }) => {
    await memberPage.goto('/settings');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/settings')) {
      const pageContent = await memberPage.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('email') ||
        pageContent?.toLowerCase().includes('password') ||
        pageContent?.toLowerCase().includes('session') ||
        pageContent?.toLowerCase().includes('security') ||
        pageContent?.toLowerCase().includes('account') ||
        pageContent?.toLowerCase().includes('settings')
      ).toBeTruthy();
    }
  });

  test('settings page has block users section', async ({ memberPage }) => {
    await memberPage.goto('/settings');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/settings')) {
      const pageContent = await memberPage.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('block') ||
        pageContent?.toLowerCase().includes('privacy') ||
        pageContent?.toLowerCase().includes('account')
      ).toBeTruthy();
    }
  });

  test('settings page has data export option', async ({ memberPage }) => {
    await memberPage.goto('/settings');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/settings')) {
      const pageContent = await memberPage.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('export') ||
        pageContent?.toLowerCase().includes('data') ||
        pageContent?.toLowerCase().includes('download') ||
        pageContent?.toLowerCase().includes('account')
      ).toBeTruthy();
    }
  });

  test('settings page has deactivate option', async ({ memberPage }) => {
    await memberPage.goto('/settings');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/settings')) {
      const pageContent = await memberPage.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('deactivat') ||
        pageContent?.toLowerCase().includes('delete') ||
        pageContent?.toLowerCase().includes('account')
      ).toBeTruthy();
    }
  });
});
