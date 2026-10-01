# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chaos\chaos-realtime-deploy.spec.ts >> Phase 12: WebSocket & Real-Time Chaos >> Notification while offline queued properly
- Location: tests\e2e\chaos\chaos-realtime-deploy.spec.ts:29:7

# Error details

```
Error: page.evaluate: Execution context was destroyed, most likely because of a navigation.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Phase 12: WebSocket & Real-Time Chaos', () => {
  4  | 
  5  |   test('OneSignal Connection Drop - page remains functional', async ({ page }) => {
  6  |     await page.route('**/onesignal.com/**', route => route.abort('connectionreset'));
  7  |     await page.goto('/');
  8  |     await page.waitForTimeout(2000);
  9  |     const body = page.locator('body');
  10 |     await expect(body).toBeVisible();
  11 |   });
  12 | 
  13 |   test('Notification endpoint flood does not freeze UI', async ({ page }) => {
  14 |     await page.goto('/');
  15 |     // Simulate rapid-fire notification API calls
  16 |     await page.evaluate(async () => {
  17 |       const promises = [];
  18 |       for (let i = 0; i < 50; i++) {
  19 |         promises.push(
  20 |           fetch('/api/notifications', { method: 'GET' }).catch(() => null)
  21 |         );
  22 |       }
  23 |       await Promise.allSettled(promises);
  24 |     });
  25 |     const body = page.locator('body');
  26 |     await expect(body).toBeVisible();
  27 |   });
  28 | 
  29 |   test('Notification while offline queued properly', async ({ page }) => {
  30 |     await page.goto('/');
  31 |     await page.waitForTimeout(2000); // Wait for all client-side redirects to finish
  32 |     const body = page.locator('body');
  33 |     await expect(body).toBeVisible(); // Wait for stable render before evaluating
  34 |     
  35 |     await page.context().setOffline(true);
  36 |     // Try to fetch notifications while offline
> 37 |     const result = await page.evaluate(async () => {
     |                               ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation.
  38 |       try {
  39 |         await fetch('/api/stories', { method: 'POST', body: JSON.stringify({ title: 'Test' }) });
  40 |         return 'success';
  41 |       } catch (e) {
  42 |         return 'failed-as-expected';
  43 |       }
  44 |     });
  45 |     expect(result).toBe('failed-as-expected');
  46 |     await page.context().setOffline(false);
  47 |     await expect(body).toBeVisible();
  48 |   });
  49 | });
  50 | 
  51 | test.describe('Phase 13: Deployment & Version Skew Simulation', () => {
  52 | 
  53 |   test('Asset 404 During Deployment - stale JS chunks', async ({ page }) => {
  54 |     // Block Next.js static chunks
  55 |     await page.route('**/_next/static/chunks/**', route => {
  56 |       route.fulfill({
  57 |         status: 404,
  58 |         contentType: 'text/plain',
  59 |         body: 'Not Found',
  60 |       });
  61 |     });
  62 |     // The page should still show something, not a blank white screen
  63 |     try {
  64 |       await page.goto('/', { timeout: 10000 });
  65 |     } catch (e) {}
  66 |     const body = page.locator('body');
  67 |     await expect(body).toBeVisible();
  68 |   });
  69 | 
  70 |   test('API Response Shape Change does not crash', async ({ page }) => {
  71 |     // Return unexpected API shapes
  72 |     await page.route('**/api/stories**', route => {
  73 |       route.fulfill({
  74 |         status: 200,
  75 |         contentType: 'application/json',
  76 |         body: JSON.stringify({
  77 |           unexpectedField: true,
  78 |           data: { completely: 'different', shape: 123 },
  79 |         }),
  80 |       });
  81 |     });
  82 |     await page.goto('/');
  83 |     const body = page.locator('body');
  84 |     await expect(body).toBeVisible();
  85 |   });
  86 | });
  87 | 
```