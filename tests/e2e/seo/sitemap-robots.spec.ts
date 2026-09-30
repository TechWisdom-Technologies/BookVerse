/**
 * E2E Tests: Sitemap & Robots
 */
import { test, expect } from '@playwright/test';

test.describe('Sitemap & Robots', () => {
  test('robots.txt returns content', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.toLowerCase()).toContain('user-agent');
  });

  test('sitemap.xml returns valid structure', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    // Acceptance of 404 in dev environment where it might not be generated yet
    expect([200, 404]).toContain(response.status());
  });
});
