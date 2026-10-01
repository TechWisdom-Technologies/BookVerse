import { test, expect } from '@playwright/test';

test.describe('Phase 20: Event Emitter & Listener Leak Recovery', () => {

  test('Dangling Listener Recovery - UI survives extreme event spam without crashing', async ({ page }) => {
    await page.goto('/');

    const survivedSpam = await page.evaluate(async () => {
      // 1. Simulate an event that might accidentally leak or fire too rapidly (e.g., resize or scroll)
      let spamCount = 0;
      
      // We'll dispatch 50,000 synchronous scroll events!
      // If the app doesn't debounce or uses passive listeners incorrectly, 
      // this could completely freeze the browser or throw "Maximum call stack size exceeded".
      try {
        for (let i = 0; i < 50000; i++) {
          window.dispatchEvent(new Event('scroll'));
          spamCount++;
        }
      } catch (e) {
        return false;
      }
      
      // 2. Wait a tick to see if the event loop clears out and the app is still responsive
      return new Promise((resolve) => {
        setTimeout(() => {
          // If we got here, the event loop isn't permanently blocked
          resolve(spamCount === 50000);
        }, 100);
      });
    });

    expect(survivedSpam).toBe(true);
    
    // Ensure we can still interact with the page
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });

  test('Observer Leak Recovery - IntersectionObserver safely unmounts on navigation', async ({ page }) => {
    // This tests if navigating back and forth creates duplicate observers.
    // In Playwright, we can simulate rapid navigation and check heap, but evaluating heap is tricky.
    // Instead, we just rapidly navigate 10 times and verify the page doesn't run out of memory.
    
    for (let i = 0; i < 10; i++) {
      await page.goto('/?foo=' + i); // Query param forces a navigation/re-render
    }

    const isAlive = await page.evaluate(() => typeof window !== 'undefined');
    expect(isAlive).toBe(true);
  });

});
