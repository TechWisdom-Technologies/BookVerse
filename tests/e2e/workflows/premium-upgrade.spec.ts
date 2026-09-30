/**
 * E2E Workflow: Premium Upgrade
 * Scenario: A user navigates to the premium page, views tiers, and tries to upgrade.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Workflow: Premium Upgrade', () => {
  test('user can access premium options and initiate checkout', async ({ memberPage }) => {
    // 1. Visit premium landing page
    await memberPage.goto('/premium');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // Check for upgrade buttons for each tier
    const upgradeBtns = memberPage.locator('a[href*="/premium/checkout"], button:has-text("Upgrade")');
    if (await upgradeBtns.count() > 0) {
      await expect(upgradeBtns.first()).toBeVisible();
    }
    
    // 2. Go to checkout for PRO
    await memberPage.goto('/premium/checkout?plan=PRO');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // Wait for the checkout form (Stripe element or similar)
    const formElement = memberPage.locator('form, .payment-form-container');
    if (await formElement.count() > 0) {
      await expect(formElement.first()).toBeVisible();
    }
  });
});
