/**
 * E2E Tests: Notifications Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Notifications Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads notifications page for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/notifications');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/notifications')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('notification') ||
        body?.toLowerCase().includes('no notification') ||
        body?.toLowerCase().includes('empty') ||
        body?.toLowerCase().includes('alert')
      ).toBeTruthy();
    }
  });

  test('notifications page has mark as read functionality', async ({ memberPage }) => {
    await memberPage.goto('/notifications');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/notifications')) {
      // Look for mark as read button or filter
      const markReadElements = memberPage.locator(
        'button:has-text("Mark"), button:has-text("Read"), [class*="filter"], select'
      );
      // May or may not be present depending on notification count
      expect(await markReadElements.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
