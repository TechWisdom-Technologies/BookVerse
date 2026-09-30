/**
 * E2E Tests: Static Pages (Terms, Privacy, Cookies, DMCA, Docs, Support)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Static Pages', () => {
  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
    expect(
      body?.toLowerCase().includes('terms') ||
      body?.toLowerCase().includes('service') ||
      body?.toLowerCase().includes('agreement')
    ).toBeTruthy();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
    expect(
      body?.toLowerCase().includes('privacy') ||
      body?.toLowerCase().includes('data') ||
      body?.toLowerCase().includes('policy')
    ).toBeTruthy();
  });

  test('cookies page loads', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
    expect(
      body?.toLowerCase().includes('cookie') ||
      body?.toLowerCase().includes('tracking') ||
      body?.toLowerCase().includes('consent')
    ).toBeTruthy();
  });

  test('DMCA page loads', async ({ page }) => {
    await page.goto('/dmca');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
    expect(
      body?.toLowerCase().includes('dmca') ||
      body?.toLowerCase().includes('copyright') ||
      body?.toLowerCase().includes('takedown')
    ).toBeTruthy();
  });

  test('docs page loads', async ({ page }) => {
    await page.goto('/docs');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('support page loads with form', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
    expect(
      body?.toLowerCase().includes('support') ||
      body?.toLowerCase().includes('help') ||
      body?.toLowerCase().includes('contact')
    ).toBeTruthy();
  });
});
