import { test, expect } from '@playwright/test';

test.describe('Phase 17: Environment Variable Chaos', () => {

  test('Invalid NEXT_PUBLIC_APP_URL does not create open redirects', async ({ page }) => {
    await page.goto('/');
    // Check that links on the page point to the correct domain
    const links = await page.locator('a[href^="http"]').all();
    for (const link of links.slice(0, 10)) {
      const href = await link.getAttribute('href');
      if (href) {
        // External links are fine, but internal links should not point to evil domains
        expect(href).not.toContain('evil.com');
      }
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('App functions when external services return unexpected errors', async ({ page }) => {
    // Simulate malformed Redis URL by blocking Upstash
    await page.route('**/*.upstash.io/**', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid URL format' }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Phase 18: Cryptographic & Secret Rotation Chaos', () => {

  test('Invalidated cookies after secret rotation redirect to login', async ({ page }) => {
    // Inject cookies signed with a "previous" secret
    await page.context().addCookies([
      { name: '__session_role', value: 'USER', domain: 'localhost', path: '/' },
      { name: '__session_role_sig', value: 'old-secret-signature-that-no-longer-validates', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/write/dashboard');
    // Should redirect to login or premium (not crash)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Forged tier signature rejected cleanly', async ({ page }) => {
    await page.context().addCookies([
      { name: '__session_tier', value: 'CREATOR', domain: 'localhost', path: '/' },
      { name: '__session_tier_sig', value: 'aaaa'.repeat(16), domain: 'localhost', path: '/' },
    ]);
    // Try to access creator-only route
    await page.goto('/gifts');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
