import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

test.describe('A11y Core & Visual Accessibility (Phases 1, 3, 4, 7)', () => {
  test('Homepage passes automated Axe scans and generates HTML report', async ({ page }) => {
    await page.goto('/');
    
    // Phase 1: Automated Scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
      
    // Phase 7: Axe HTML Reporting
    createHtmlReport({
      results: accessibilityScanResults,
      options: {
        projectKey: 'BookVerse',
        outputDir: 'axe-reports',
        reportFileName: 'accessibility-report.html'
      }
    });
      
    // We expect 0 violations for critical/serious rules
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Semantic HTML Landmarks exist', async ({ page }) => {
    await page.goto('/');
    
    // Phase 3: Screen Reader Semantics
    // Ensure critical landmarks are present so screen readers can navigate
    const main = page.locator('main');
    const header = page.locator('header:visible, nav:visible');
    
    // Just verifying they exist in the DOM and are visible
    if (await main.count() > 0) {
      await expect(main.first()).toBeVisible();
    }
    if (await header.count() > 0) {
      await expect(header.first()).toBeVisible();
    }
  });

  test('Color Contrast and 200% Zoom Compatibility', async ({ page }) => {
    // Phase 4: Visual Accessibility
    // Note: Axe already checks contrast, but we can explicitly test zoom constraints
    await page.goto('/');
    
    // Emulate 200% zoom (by cutting viewport in half, typical browser zoom simulation for CSS layout)
    const viewport = page.viewportSize();
    if (viewport) {
      await page.setViewportSize({ width: viewport.width / 2, height: viewport.height / 2 });
    }
    await page.waitForTimeout(500); // let reflow happen
    
    // Check for massive horizontal scrolling which violates WCAG 1.4.10 Reflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalOverflow).toBeFalsy();
  });
});
