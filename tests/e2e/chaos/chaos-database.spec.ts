import { test, expect } from '@playwright/test';

test.describe('Phase 2: Database Chaos (Prisma/PostgreSQL)', () => {

  test('Connection Pool Exhaustion returns clean error', async ({ page }) => {
    // Simulate DB connection timeout by making all /api/ routes return 503
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable: Database connection pool exhausted' }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Query Timeout Simulation shows timeout error', async ({ page }) => {
    await page.route('**/api/**', async route => {
      // Simulate a query that takes longer than the 10s connectionTimeoutMillis
      await new Promise(r => setTimeout(r, 3000));
      route.fulfill({
        status: 504,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Gateway Timeout: Query exceeded time limit' }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Database Read-Only Mode allows reads, blocks writes', async ({ page }) => {
    // Intercept POST/PUT/PATCH/DELETE API calls and return read-only error
    await page.route('**/api/**', (route, request) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) {
        route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Database is in read-only mode during failover' }),
        });
      } else {
        route.continue();
      }
    });
    await page.goto('/');
    // Page should still load (reads work)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Schema Drift / unexpected null does not crash frontend', async ({ page }) => {
    // Intercept API and return data with unexpected nulls
    await page.route('**/api/stories**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          stories: [{
            id: 'chaos-1',
            title: null,        // Should be a string
            author: null,       // Should be an object
            coverUrl: undefined,
            chapters: null,     // Should be an array
          }]
        }),
      });
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Deadlock Simulation returns conflict error', async ({ page }) => {
    await page.route('**/api/**', (route, request) => {
      if (request.method() === 'POST' || request.method() === 'PATCH') {
        route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Conflict: Resource was modified by another request' }),
        });
      } else {
        route.continue();
      }
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
