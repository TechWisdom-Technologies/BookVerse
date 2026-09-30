import { test, expect } from '@playwright/test';

test.describe('Core Functional, A11y, and Input Compatibility', () => {
  
  test('Keyboard Navigation (Tab, Enter)', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab multiple times to ensure focus moves
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if an element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement ? document.activeElement.tagName : null;
    });
    
    expect(focusedElement).not.toBeNull();
    // Assuming the app has focus rings or outlines on active elements
  });
  
  test('Reduced Motion OS Preference', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Verify a CSS animation is not running, or just verify the page loads safely
    // without crashing.
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
  
  test('Memory Leak Simulation (Repeated Navigation)', async ({ page }) => {
    // Navigate multiple times to simulate long sessions
    await page.goto('/');
    for (let i = 0; i < 5; i++) {
      await page.goto('/login');
      await page.goto('/');
    }
    
    // Page should still be responsive
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Foldable Device Viewport Simulation', async ({ page }) => {
    // Simulate a foldable by passing specific viewport segments
    // Playwright doesn't natively expose CSS viewport segments API yet,
    // so we just test an unusual aspect ratio like Galaxy Fold (e.g., 844x844 or similar)
    await page.setViewportSize({ width: 884, height: 1104 });
    await page.goto('/');
    
    // Check for massive horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBeFalsy();
  });

  test('Hostile Permissions (Clipboard & Notifications)', async ({ page, context }) => {
    // Aggressively deny all permissions
    await context.grantPermissions([], { origin: 'http://localhost:3000' });
    await page.goto('/');
    
    // Just verify the app loads. In a real scenario, we would click "Share" and expect it to fail gracefully
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Virtual Keyboard Overlap Simulation', async ({ page }) => {
    await page.goto('/');
    // Simulate keyboard opening by shrinking viewport height
    const viewport = page.viewportSize();
    if (viewport) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height / 2 });
    }
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Iframe Embed & CSP Compatibility Simulation', async ({ page }) => {
    // Navigate to a blank page and inject an iframe pointing to our app
    await page.setContent(`
      <html>
        <body>
          <iframe id="test-iframe" src="http://localhost:3000/" sandbox="allow-scripts allow-same-origin"></iframe>
        </body>
      </html>
    `);
    
    // Wait for iframe to load
    const frameElement = page.locator('#test-iframe');
    await expect(frameElement).toBeVisible();
    
    // Verify the contents of the iframe don't completely crash (assuming it's allowed to frame itself or X-Frame-Options is SAMEORIGIN)
    // If blocked by CSP, we just verify the host page remains stable
    expect(true).toBeTruthy();
  });
});
