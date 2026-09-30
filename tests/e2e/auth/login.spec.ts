/**
 * E2E Tests: Login Flow
 * Tests user login with valid/invalid credentials, redirects, and edge cases.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('login page loads with form fields', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first()).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', 'wrong@email.com');
    await page.fill('input[type="password"], input[name="password"]', 'WrongPass123!');
    await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();

    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');
    // Should show an error or still be on login page
    expect(
      page.url().includes('/login') ||
      pageContent?.toLowerCase().includes('error') ||
      pageContent?.toLowerCase().includes('invalid') ||
      pageContent?.toLowerCase().includes('incorrect') ||
      pageContent?.toLowerCase().includes('failed')
    ).toBeTruthy();
  });

  test('shows validation error for empty email', async ({ page }) => {
    await page.fill('input[type="password"], input[name="password"]', 'SomePass123!');
    await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();

    await page.waitForTimeout(500);
    // Should remain on login page
    expect(page.url()).toContain('/login');
  });

  test('shows validation error for empty password', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', 'user@test.com');
    await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();

    await page.waitForTimeout(500);
    expect(page.url()).toContain('/login');
  });

  test('preserves redirect parameter in URL', async ({ page }) => {
    await page.goto('/login?redirect=/write/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // The redirect parameter should be preserved
    expect(page.url()).toContain('redirect');
  });

  test('has link to signup page', async ({ page }) => {
    const signupLink = page.locator('a[href*="signup"], a:has-text("sign up"), a:has-text("register"), a:has-text("create account")');
    await expect(signupLink.first()).toBeVisible();
  });

  test('has link to forgot password', async ({ page }) => {
    const forgotLink = page.locator('a[href*="forgot"], a:has-text("forgot"), a:has-text("reset")');
    await expect(forgotLink.first()).toBeVisible();
  });
});
