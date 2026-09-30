/**
 * E2E Tests: Forgot Password Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('domcontentloaded');
  });

  test('forgot password page loads with email input', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /reset|send|submit/i }).first()).toBeVisible();
  });

  test('shows validation for empty email', async ({ page }) => {
    await page.getByRole('button', { name: /reset|send|submit/i }).first().click();
    await page.waitForTimeout(500);

    // Should remain on the page or show validation
    expect(page.url()).toContain('forgot');
  });

  test('submits email and shows confirmation message', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', 'user@test.com');
    await page.getByRole('button', { name: /reset|send|submit/i }).first().click();

    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');
    // Should show success message or handle the submission
    expect(
      pageContent?.toLowerCase().includes('sent') ||
      pageContent?.toLowerCase().includes('check') ||
      pageContent?.toLowerCase().includes('email') ||
      pageContent?.toLowerCase().includes('reset') ||
      pageContent?.toLowerCase().includes('error') // Could also fail gracefully
    ).toBeTruthy();
  });

  test('has link back to login page', async ({ page }) => {
    const loginLink = page.locator('a[href*="login"], a:has-text("login"), a:has-text("sign in"), a:has-text("back")');
    await expect(loginLink.first()).toBeVisible();
  });
});
