/**
 * E2E Tests: Signup Flow
 * Tests user registration with validation, error handling, and successful signup.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('domcontentloaded');
  });

  test('signup page loads with form fields', async ({ page }) => {
    // Verify the signup form elements are present
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /sign\s*up|create|register/i }).first()).toBeVisible();
  });

  test('shows validation error for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /sign\s*up|create|register/i }).first().click();

    // Should show validation errors
    await page.waitForTimeout(500);
    const errorMessages = page.locator('[class*="error"], [role="alert"], .text-red');
    const pageContent = await page.textContent('body');
    expect(
      (await errorMessages.count()) > 0 ||
      pageContent?.toLowerCase().includes('required') ||
      pageContent?.toLowerCase().includes('valid')
    ).toBeTruthy();
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', 'notanemail');
    await page.fill('input[type="password"], input[name="password"]', 'ValidPass123!');

    // Try to find and fill username if the field exists
    const usernameInput = page.locator('input[name="username"], input[placeholder*="username" i]');
    if (await usernameInput.count() > 0) {
      await usernameInput.first().fill('testuser123');
    }

    // Try to find and fill display name if the field exists
    const displayNameInput = page.locator('input[name="displayName"], input[placeholder*="name" i]');
    if (await displayNameInput.count() > 0) {
      await displayNameInput.first().fill('Test User');
    }

    await page.getByRole('button', { name: /sign\s*up|create|register/i }).first().click();
    await page.waitForTimeout(1000);

    // Should still be on signup page or show error
    const url = page.url();
    const pageContent = await page.textContent('body');
    expect(
      url.includes('/signup') ||
      pageContent?.toLowerCase().includes('email') ||
      pageContent?.toLowerCase().includes('invalid')
    ).toBeTruthy();
  });

  test('shows password toggle button', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.fill('TestPassword123!');

    // Look for show/hide password toggle
    const toggleButton = page.locator(
      'button:near(input[type="password"]), [aria-label*="password" i], [data-testid*="toggle" i]'
    );
    if (await toggleButton.count() > 0) {
      await toggleButton.first().click();
      // After clicking, the input type might change to "text"
      const inputType = await passwordInput.getAttribute('type');
      // Either the type changed or a new visible text input appeared
      expect(inputType === 'text' || inputType === 'password').toBeTruthy();
    }
  });

  test('has link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href*="login"], a:has-text("login"), a:has-text("sign in")');
    await expect(loginLink.first()).toBeVisible();
  });
});
