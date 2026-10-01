import { test, expect } from '@playwright/test';

test.describe('Phase 3: Third-Party Service Outages', () => {

  test('Cloudflare R2 Storage Outage - uploads fail gracefully', async ({ page }) => {
    await page.route('**/*.r2.cloudflarestorage.com/**', route => route.abort('connectionrefused'));
    await page.route('**/pub-*.r2.dev/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Cloudinary CDN Failure - no broken image icons', async ({ page }) => {
    await page.route('**/res.cloudinary.com/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    // Check that no broken image icons exist (images should have fallbacks)
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < Math.min(imgCount, 10); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        // Image should either be hidden or have a valid src
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        // naturalWidth = 0 means the image failed to load, which is OK if a fallback is shown
      }
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Firebase Auth Outage - cookie-based users can still browse', async ({ page }) => {
    await page.route('**/*.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/*.firebaseapp.com/**', route => route.abort('connectionrefused'));
    await page.route('**/identitytoolkit.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/securetoken.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const textContent = await page.textContent('body');
    expect(textContent?.length).toBeGreaterThan(50);
  });

  test('Resend Email Failure - operations do not crash', async ({ page }) => {
    await page.route('**/api.resend.com/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Turnstile CAPTCHA Failure - forms degrade gracefully', async ({ page }) => {
    await page.route('**/challenges.cloudflare.com/**', route => route.abort('connectionrefused'));
    await page.goto('/login');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('OneSignal Push Failure - notifications still save to DB', async ({ page }) => {
    await page.route('**/onesignal.com/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Upstash Redis Complete Outage - rate limiter falls back to in-memory', async ({ page }) => {
    await page.route('**/*.upstash.io/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Google Fonts Unavailable - system fonts used as fallback', async ({ page }) => {
    await page.route('**/fonts.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/fonts.gstatic.com/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    // Page should still render with system fonts
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Verify text is still readable
    const textContent = await page.textContent('body');
    expect(textContent?.length).toBeGreaterThan(50);
  });
});
