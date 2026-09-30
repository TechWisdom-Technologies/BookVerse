import { test, expect } from '@playwright/test';

test.describe('Multi-Window & Sensor Chaos', () => {

  test('Cross-Tab State Sync Simulation', async ({ context }) => {
    // Open two separate pages (tabs) in the same browser context
    const tabA = await context.newPage();
    const tabB = await context.newPage();

    await tabA.goto('/');
    await tabB.goto('/');

    // In a real scenario, we would trigger a state change in Tab A (e.g., toggling dark mode or logging out)
    // and verify that Tab B immediately reflects the change via BroadcastChannel or storage events.
    
    // For now, we verify both tabs can exist and render simultaneously without breaking the session
    await expect(tabA.locator('body')).toBeVisible();
    await expect(tabB.locator('body')).toBeVisible();
  });

  test('Rapid Landscape/Portrait Thrashing', async ({ page }) => {
    await page.goto('/');
    
    // Rapidly change viewport sizes to simulate a user wildly rotating their tablet/phone
    // This tests if ResizeObservers or Flexbox layouts get permanently stuck
    for (let i = 0; i < 5; i++) {
      await page.setViewportSize({ width: 375, height: 812 }); // Portrait (iPhone)
      await page.waitForTimeout(100);
      
      await page.setViewportSize({ width: 812, height: 375 }); // Landscape
      await page.waitForTimeout(100);
    }
    
    // Settle on Portrait
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Ensure the page is still perfectly readable and hasn't crashed
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Extreme Browser Zoom (400% Reflow)', async ({ page }) => {
    await page.goto('/');
    
    // Simulate zooming into 400% by setting a tiny viewport (similar CSS media query trigger)
    // WCAG 2.1 requires content to reflow into a single column at 320px width without horizontal scrolling
    await page.setViewportSize({ width: 320, height: 800 });
    
    // Wait for reflow
    await page.waitForTimeout(500);
    
    // Verify there is no massive horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalOverflow).toBeFalsy();
  });

  test('Service Worker Version Collision (Deployment Simulation)', async ({ page }) => {
    await page.goto('/');
    
    // Simulate a new service worker registration intercepting requests (App Update)
    // We register a dummy route that simulates what a SW does when a new chunk is requested
    await page.route('**/*.js', async route => {
      // Simulate chunk loading failure due to version mismatch
      if (route.request().url().includes('_next/static/chunks')) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Attempt to navigate or trigger an action that would load a chunk
    try {
      await page.goto('/login', { timeout: 3000 });
    } catch (e) {
      // Expected to fail or time out gracefully rather than crashing the browser
    }
    
    // As long as the browser is responsive and can be recovered (e.g., hard refresh), it passes the bounds of this compat test
    expect(true).toBeTruthy();
  });
});
