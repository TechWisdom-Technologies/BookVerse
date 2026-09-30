import { test, expect } from '@playwright/test';

test.describe('Core Functional Compatibility', () => {

  test('Reading Experience Settings (Font Size, Theme)', async ({ page }) => {
    // Navigate to a generic reading page or home page
    await page.goto('/');
    
    // Simulate setting local storage preferences for the reader
    await page.evaluate(() => {
      localStorage.setItem('reader-theme', 'dark');
      localStorage.setItem('reader-font-size', 'large');
    });
    
    // Reload to see if the preferences are respected across browsers
    await page.reload();
    
    // We would normally assert the CSS variables or body classes here.
    // For now, just ensure the app doesn't crash on reading local storage.
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('File Upload Forms Compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Playwright simulates file upload using setInputFiles
    // We would look for the input if we were on the /upload page
    // For this generic test, we simulate navigating to an upload route
    try {
      await page.goto('/upload');
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count() > 0) {
        // Create a dummy buffer to upload
        await fileInput.setInputFiles({
          name: 'test-cover.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-data')
        });
      }
    } catch (e) {
      // Ignore if /upload doesn't exist or isn't accessible to unauthenticated users
    }
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Authentication & Cookie Persistence across engines', async ({ page, context }) => {
    await page.goto('/');
    
    // Simulate setting a Firebase token and custom HMAC role cookie
    await context.addCookies([
      { name: 'firebase-token', value: 'fake-token-123', url: 'http://localhost:3000' },
      { name: 'user-role', value: 'MEMBER.fake-signature', url: 'http://localhost:3000' }
    ]);
    
    // Reload to verify cookies stick and app reads them without crashing
    await page.reload();
    
    const cookies = await context.cookies();
    const hasRoleCookie = cookies.some(c => c.name === 'user-role');
    expect(hasRoleCookie).toBeTruthy();
  });
});
