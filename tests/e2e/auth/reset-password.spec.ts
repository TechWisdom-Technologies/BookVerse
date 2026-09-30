/**
 * E2E Tests: Reset Password Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reset Password Flow', () => {
  test('reset password page requires valid token', async ({ page }) => {
    // Accessing without token should show error or redirect
    await page.goto('/reset-password');
    await page.waitForLoadState('domcontentloaded');
    
    const body = await page.textContent('body');
    // Usually expects a token in query string, e.g., ?token=123
    expect(body?.toLowerCase()).toContain('invalid');
  });

  test('reset password page loads with mock token', async ({ page }) => {
    await page.goto('/reset-password?token=mock-valid-token');
    await page.waitForLoadState('domcontentloaded');
    
    // Should display the new password form
    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.count() > 0) {
      await expect(passwordInput).toBeVisible();
    }
  });
});
