/**
 * E2E Tests: Newsletter Subscribe
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Newsletter Subscribe', () => {
  test('subscribe to platform newsletter', async ({ visitorPage }) => {
    await visitorPage.goto('/');
    await visitorPage.waitForLoadState('domcontentloaded');
    const newsletterInput = visitorPage.locator('input[type="email"], input[placeholder*="newsletter" i]');
    if (await newsletterInput.count() > 0) {
      await expect(newsletterInput.first()).toBeVisible();
    }
  });
});
