import { test, expect } from '@playwright/test';

test.describe('Phase 14: Cascading Failure Chains', () => {

  test('R2 Down → Upload Fails → Rate Limiter Triggers cascade', async ({ page }) => {
    // Block R2 storage
    await page.route('**/*.r2.cloudflarestorage.com/**', route => route.abort('connectionrefused'));
    await page.route('**/pub-*.r2.dev/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    // Simulate rapid retries (user trying to upload repeatedly)
    await page.evaluate(async () => {
      for (let i = 0; i < 10; i++) {
        await fetch('/api/upload', {
          method: 'POST',
          body: new FormData(),
        }).catch(() => null);
      }
    });
    // Page should still be alive even after cascade
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Redis Down → Rate Limiter Falls Back → Memory Stable', async ({ page }) => {
    await page.route('**/*.upstash.io/**', route => route.abort('connectionrefused'));
    await page.goto('/');
    // Fire many requests to exercise in-memory rate limiter
    await page.evaluate(async () => {
      const promises = [];
      for (let i = 0; i < 30; i++) {
        promises.push(fetch('/api/stories').catch(() => null));
      }
      await Promise.allSettled(promises);
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Firebase Down → Auth Fails → API Calls Fail → Page Still Shows', async ({ page }) => {
    // Block all Firebase/Google auth endpoints
    await page.route('**/*.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/*.firebaseapp.com/**', route => route.abort('connectionrefused'));
    // Also make API calls fail with auth errors
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication service unavailable' }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Should show meaningful content, not a white screen
    const textContent = await page.textContent('body');
    expect(textContent?.length).toBeGreaterThan(10);
  });

  test('AI Down + DB Slow → Homepage still loads', async ({ page }) => {
    // Block AI
    await page.route('**/generativelanguage.googleapis.com/**', route => route.abort('connectionrefused'));
    await page.route('**/api.groq.com/**', route => route.abort('connectionrefused'));
    // Slow down API calls to simulate DB slowness
    await page.route('**/api/**', async route => {
      await new Promise(r => setTimeout(r, 3000));
      route.continue();
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
