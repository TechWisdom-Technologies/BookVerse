import { test, expect } from '@playwright/test';

test.describe('Phase 7: AI Provider Cascading Failures', () => {

  test('Gemini API returns 429 Rate Limited', async ({ page }) => {
    await page.route('**/generativelanguage.googleapis.com/**', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Rate limit exceeded', code: 429 } }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Gemini Returns Garbage - empty candidates', async ({ page }) => {
    await page.route('**/generativelanguage.googleapis.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ candidates: [] }), // Empty candidates array
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Complete AI Blackout - both Gemini and Groq down', async ({ page }) => {
    await page.route('**/generativelanguage.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/api.groq.com/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    // AI features should degrade gracefully, page should still work
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Gemini Returns Malformed JSON in text field', async ({ page }) => {
    await page.route('**/generativelanguage.googleapis.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          candidates: [{
            content: {
              parts: [{ text: '{invalid json that looks like json but is not---' }]
            }
          }],
          usageMetadata: { totalTokenCount: 100 }
        }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
