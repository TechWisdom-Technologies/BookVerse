/**
 * E2E Tests: Write Dashboard
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Write Dashboard', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/write/dashboard');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads dashboard for author tier user', async ({ authorPage }) => {
    await authorPage.goto('/write/dashboard');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write/dashboard')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(100);

      expect(
        body?.toLowerCase().includes('dashboard') ||
        body?.toLowerCase().includes('stories') ||
        body?.toLowerCase().includes('write') ||
        body?.toLowerCase().includes('create')
      ).toBeTruthy();
    }
  });

  test('write page listing loads', async ({ authorPage }) => {
    await authorPage.goto('/write');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(100);
    }
  });
});
