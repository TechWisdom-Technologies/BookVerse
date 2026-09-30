/**
 * E2E Tests: Premium Checkout Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Premium Checkout', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/premium/checkout?plan=PRO');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/login');
  });

  test('checkout page loads for member', async ({ memberPage }) => {
    await memberPage.goto('/premium/checkout?plan=PRO');
    await memberPage.waitForLoadState('domcontentloaded');
    const body = await memberPage.textContent('body');
    expect(body?.toLowerCase().includes('checkout')).toBeTruthy();
  });
  
  test('shows all three plans', async ({ memberPage }) => {
    await memberPage.goto('/premium');
    await memberPage.waitForLoadState('domcontentloaded');
    const body = await memberPage.textContent('body');
    expect(body?.toLowerCase().includes('author')).toBeTruthy();
    expect(body?.toLowerCase().includes('pro')).toBeTruthy();
    expect(body?.toLowerCase().includes('creator')).toBeTruthy();
  });
});
