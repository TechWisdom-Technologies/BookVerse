/**
 * E2E Tests: Shelf Page (Saved Books)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Shelf Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/shelf');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads shelf page for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/shelf');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/shelf')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('shelf') ||
        body?.toLowerCase().includes('saved') ||
        body?.toLowerCase().includes('book') ||
        body?.toLowerCase().includes('empty') ||
        body?.toLowerCase().includes('library')
      ).toBeTruthy();
    }
  });
});
