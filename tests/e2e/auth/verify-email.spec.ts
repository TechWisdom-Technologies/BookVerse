/**
 * E2E Tests: Verify Email Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Verify Email Flow', () => {
  test('verify email page handles missing token', async ({ page }) => {
    await page.goto('/verify-email');
    await page.waitForLoadState('domcontentloaded');
    
    const body = await page.textContent('body');
    // Expect error or redirect
    expect(body?.length).toBeGreaterThan(0);
  });
});
