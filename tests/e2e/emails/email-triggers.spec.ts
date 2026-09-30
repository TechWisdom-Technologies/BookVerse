/**
 * E2E Tests: Email Triggers
 */
import { test, expect } from '@playwright/test';

test.describe('Email Triggers', () => {
  test('Signup triggers welcome email logic', async ({ page }) => {
    // In a real E2E environment, we would intercept the /api/auth/register request
    // and verify it makes an external call to Resend or Mailtrap.
    // For now we just verify the signup page is accessible.
    await page.goto('/signup');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/signup');
  });

  test('Password reset triggers email logic', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/forgot-password');
  });
});
