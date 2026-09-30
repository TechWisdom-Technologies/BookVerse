/**
 * E2E Tests: Genre Page
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Genre Page', () => {
  test('genre page loads for Fiction', async ({ page }) => {
    await page.goto('/genre/Fiction');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('genre page loads for Fantasy', async ({ page }) => {
    await page.goto('/genre/Fantasy');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('genre page loads for Romance', async ({ page }) => {
    await page.goto('/genre/Romance');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });
});
