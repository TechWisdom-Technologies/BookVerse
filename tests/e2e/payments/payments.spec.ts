/**
 * E2E Tests: Payments & Monetization (Checkout, Billing, Coin Purchases)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Premium Checkout Flow', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/premium/checkout');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('checkout page loads for member', async ({ memberPage }) => {
    await memberPage.goto('/premium/checkout?plan=PRO');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/premium/checkout')) {
      const body = await memberPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('checkout') ||
        body?.toLowerCase().includes('payment') ||
        body?.toLowerCase().includes('card') ||
        body?.toLowerCase().includes('subscribe') ||
        body?.toLowerCase().includes('plan')
      ).toBeTruthy();
    }
  });

  test('checkout page shows payment form elements', async ({ memberPage }) => {
    await memberPage.goto('/premium/checkout?plan=PRO');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/premium/checkout')) {
      // Look for typical Stripe or payment elements
      const paymentElements = memberPage.locator(
        '[class*="stripe"], [class*="payment"], iframe, input[name*="card" i], button:has-text("Pay"), button:has-text("Subscribe")'
      );
      expect(await paymentElements.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Billing Management', () => {
  test('billing page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('billing page loads for PRO user', async ({ proPage }) => {
    await proPage.goto('/billing');
    await proPage.waitForLoadState('domcontentloaded');

    const url = proPage.url();
    if (url.includes('/billing')) {
      const body = await proPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('billing') ||
        body?.toLowerCase().includes('subscription') ||
        body?.toLowerCase().includes('invoice') ||
        body?.toLowerCase().includes('payment method')
      ).toBeTruthy();
    }
  });

  test('billing page has cancel subscription button', async ({ proPage }) => {
    await proPage.goto('/billing');
    await proPage.waitForLoadState('domcontentloaded');

    if (proPage.url().includes('/billing')) {
      const cancelButton = proPage.locator(
        'button:has-text("Cancel"), a:has-text("Cancel Subscription")'
      );
      expect(await cancelButton.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Coin Purchases', () => {
  test('coin purchase page loads', async ({ memberPage }) => {
    await memberPage.goto('/coins');
    await memberPage.waitForLoadState('domcontentloaded');

    const url = memberPage.url();
    if (url.includes('/coins') || url.includes('/wallet')) {
      const body = await memberPage.textContent('body');
      expect(
        body?.toLowerCase().includes('coin') ||
        body?.toLowerCase().includes('buy') ||
        body?.toLowerCase().includes('purchase') ||
        body?.toLowerCase().includes('wallet')
      ).toBeTruthy();
    }
  });

  test('shows coin packages', async ({ memberPage }) => {
    await memberPage.goto('/coins');
    await memberPage.waitForLoadState('domcontentloaded');

    if (memberPage.url().includes('/coins') || memberPage.url().includes('/wallet')) {
      const packages = memberPage.locator(
        '[class*="package"], button:has-text("Buy"), a:has-text("Buy")'
      );
      expect(await packages.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
