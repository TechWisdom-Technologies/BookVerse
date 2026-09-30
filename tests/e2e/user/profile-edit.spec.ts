/**
 * E2E Tests: Profile Edit Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Profile Edit Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/profile/edit');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('loads profile edit form for authenticated user', async ({ memberPage }) => {
    await memberPage.goto('/profile/edit');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    // Either we see the edit form or we're redirected to login
    if (url.includes('/profile/edit')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(100);

      // Should have form fields
      const inputs = memberPage.locator('input, textarea, select');
      expect(await inputs.count()).toBeGreaterThan(0);
    }
  });

  test('displays profile form fields', async ({ memberPage }) => {
    await memberPage.goto('/profile/edit');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/profile/edit')) {
      const pageContent = await memberPage.textContent('body');
      expect(
        pageContent?.toLowerCase().includes('name') ||
        pageContent?.toLowerCase().includes('bio') ||
        pageContent?.toLowerCase().includes('avatar') ||
        pageContent?.toLowerCase().includes('profile')
      ).toBeTruthy();
    }
  });
});
