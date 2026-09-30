import { test, expect } from '@playwright/test';

test.describe('Extreme Compatibility & Responsiveness', () => {
  test('Navbar adapts to mobile viewport', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isSmallScreen = viewport ? viewport.width < 768 : false;

    if (isSmallScreen) {
      // On small screens, the desktop nav links should be hidden, and a hamburger menu should appear
      const desktopNav = page.locator('nav.hidden.md\\:flex');
      await expect(desktopNav).toBeHidden();
      
      const hamburger = page.locator('button[aria-label="Open menu"], .mobile-menu-button');
      // If we have a hamburger, it should be visible
      if (await hamburger.count() > 0) {
        await expect(hamburger).toBeVisible();
      }
    } else {
      // On large screens, the hamburger should be hidden
      const hamburger = page.locator('button[aria-label="Open menu"], .mobile-menu-button');
      if (await hamburger.count() > 0) {
        await expect(hamburger).toBeHidden();
      }
    }
  });

  test('Gracefully handles RTL (Right-to-Left) injection', async ({ page }) => {
    await page.goto('/');
    
    // Force the HTML dir attribute to RTL to simulate Arabic/Hebrew environment
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
    });

    // Wait a moment for reflow
    await page.waitForTimeout(500);

    // Verify the page hasn't produced massive horizontal overflow due to broken flex/grid
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    // It's acceptable for some tiny pixel overflow in complex apps, but massive overflow means broken layout
    expect(hasHorizontalOverflow).toBeFalsy();
  });

  test('Handles Forced Colors (High Contrast Mode)', async ({ page }) => {
    await page.goto('/');

    // Force High Contrast Mode
    await page.emulateMedia({ forcedColors: 'active' });
    await page.waitForTimeout(500);

    // Check that critical elements are still in the DOM and haven't crashed
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Gracefully handles Google Fonts failure (Network Block)', async ({ page }) => {
    // Block all requests to Google Fonts to simulate a hostile network or offline scenario
    await page.route('**/*fonts.googleapis.com/**', route => route.abort('failed'));
    await page.route('**/*fonts.gstatic.com/**', route => route.abort('failed'));

    await page.goto('/');

    // Ensure the page still loads and renders text (using fallback system fonts)
    const mainTitle = page.locator('h1').first();
    // Assuming there's an h1 on the homepage
    if (await mainTitle.count() > 0) {
      await expect(mainTitle).toBeVisible();
    }
  });

  test('Handles Third-Party Image Failure (Cloudinary Block)', async ({ page }) => {
    // Block Cloudinary images to simulate ad-blocker or strict tracking protection
    await page.route('**/*res.cloudinary.com/**', route => route.abort('failed'));

    await page.goto('/');

    // We just want to ensure the app doesn't white-screen crash when images fail to load
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
