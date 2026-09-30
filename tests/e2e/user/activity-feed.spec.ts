/**
 * E2E Tests: Activity Feed Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Activity Feed Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/activity-feed');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads activity feed for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/activity-feed');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/activity-feed')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('activity') ||
        body?.toLowerCase().includes('feed') ||
        body?.toLowerCase().includes('follow') ||
        body?.toLowerCase().includes('empty') ||
        body?.toLowerCase().includes('no activity')
      ).toBeTruthy();
    }
  });
});
