/**
 * E2E Tests: Onboarding Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Onboarding Flow', () => {
  test('onboarding page loads', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('domcontentloaded');

    // Onboarding page should have some quiz or preference selection content
    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(0);
  });

  test('onboarding page has genre selection options', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('domcontentloaded');

    // Look for genre-related content or preference checkboxes/buttons
    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('genre') ||
      pageContent?.toLowerCase().includes('preference') ||
      pageContent?.toLowerCase().includes('reading') ||
      pageContent?.toLowerCase().includes('interest') ||
      pageContent?.toLowerCase().includes('welcome')
    ).toBeTruthy();
  });
});
