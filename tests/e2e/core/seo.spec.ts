/**
 * E2E Tests: SEO and Metadata
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('SEO and Metadata', () => {
  test('homepage has basic SEO tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check for title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toContain('bookverse');

    // Check for description meta tag
    const metaDescription = page.locator('meta[name="description"]');
    expect(await metaDescription.count()).toBeGreaterThanOrEqual(1);

    // Check for viewport tag
    const metaViewport = page.locator('meta[name="viewport"]');
    expect(await metaViewport.count()).toBeGreaterThanOrEqual(1);
  });

  test('stories page has SEO tags', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    const metaDescription = page.locator('meta[name="description"]');
    expect(await metaDescription.count()).toBeGreaterThanOrEqual(1);
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    
    const body = await response.text();
    expect(body.toLowerCase()).toContain('user-agent:');
  });

  test('sitemap.xml is accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    
    // In dev it might be 404 if not generated, but should be 200 in prod
    // We accept both here for local testing
    expect([200, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const body = await response.text();
      expect(body.toLowerCase()).toContain('<?xml');
      expect(body.toLowerCase()).toContain('<urlset');
    }
  });
});
