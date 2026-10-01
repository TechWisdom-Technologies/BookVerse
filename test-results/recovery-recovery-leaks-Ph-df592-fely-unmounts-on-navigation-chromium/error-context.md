# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery\recovery-leaks.spec.ts >> Phase 20: Event Emitter & Listener Leak Recovery >> Observer Leak Recovery - IntersectionObserver safely unmounts on navigation
- Location: tests\e2e\recovery\recovery-leaks.spec.ts:40:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/?foo=2", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Phase 20: Event Emitter & Listener Leak Recovery', () => {
  4  | 
  5  |   test('Dangling Listener Recovery - UI survives extreme event spam without crashing', async ({ page }) => {
  6  |     await page.goto('/');
  7  | 
  8  |     const survivedSpam = await page.evaluate(async () => {
  9  |       // 1. Simulate an event that might accidentally leak or fire too rapidly (e.g., resize or scroll)
  10 |       let spamCount = 0;
  11 |       
  12 |       // We'll dispatch 50,000 synchronous scroll events!
  13 |       // If the app doesn't debounce or uses passive listeners incorrectly, 
  14 |       // this could completely freeze the browser or throw "Maximum call stack size exceeded".
  15 |       try {
  16 |         for (let i = 0; i < 50000; i++) {
  17 |           window.dispatchEvent(new Event('scroll'));
  18 |           spamCount++;
  19 |         }
  20 |       } catch (e) {
  21 |         return false;
  22 |       }
  23 |       
  24 |       // 2. Wait a tick to see if the event loop clears out and the app is still responsive
  25 |       return new Promise((resolve) => {
  26 |         setTimeout(() => {
  27 |           // If we got here, the event loop isn't permanently blocked
  28 |           resolve(spamCount === 50000);
  29 |         }, 100);
  30 |       });
  31 |     });
  32 | 
  33 |     expect(survivedSpam).toBe(true);
  34 |     
  35 |     // Ensure we can still interact with the page
  36 |     const bodyVisible = await page.locator('body').isVisible();
  37 |     expect(bodyVisible).toBe(true);
  38 |   });
  39 | 
  40 |   test('Observer Leak Recovery - IntersectionObserver safely unmounts on navigation', async ({ page }) => {
  41 |     // This tests if navigating back and forth creates duplicate observers.
  42 |     // In Playwright, we can simulate rapid navigation and check heap, but evaluating heap is tricky.
  43 |     // Instead, we just rapidly navigate 10 times and verify the page doesn't run out of memory.
  44 |     
  45 |     for (let i = 0; i < 10; i++) {
> 46 |       await page.goto('/?foo=' + i); // Query param forces a navigation/re-render
     |                  ^ Error: page.goto: Test timeout of 30000ms exceeded.
  47 |     }
  48 | 
  49 |     const isAlive = await page.evaluate(() => typeof window !== 'undefined');
  50 |     expect(isAlive).toBe(true);
  51 |   });
  52 | 
  53 | });
  54 | 
```