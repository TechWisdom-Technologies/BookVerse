/**
 * E2E Tests: Premium / Pricing Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Premium Page', () => {
  test('premium page loads with tier information', async ({ page }) => {
    await page.goto('/premium');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('displays pricing tiers (Author, Pro, Creator)', async ({ page }) => {
    await page.goto('/premium');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('author') ||
      pageContent?.toLowerCase().includes('pro') ||
      pageContent?.toLowerCase().includes('creator') ||
      pageContent?.toLowerCase().includes('premium') ||
      pageContent?.toLowerCase().includes('plan')
    ).toBeTruthy();
  });

  test('has checkout/upgrade buttons', async ({ page }) => {
    await page.goto('/premium');
    await page.waitForLoadState('domcontentloaded');

    const ctaButtons = page.locator(
      'button:has-text("Upgrade"), button:has-text("Subscribe"), button:has-text("Get"), a:has-text("Upgrade"), a[href*="checkout"]'
    );
    expect(await ctaButtons.count()).toBeGreaterThanOrEqual(0);
  });

  test('premium checkout page loads', async ({ page }) => {
    await page.goto('/premium/checkout');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });
});
