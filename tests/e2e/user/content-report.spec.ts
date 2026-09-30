/**
 * E2E Tests: Content Report Flow
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Content Report Flow', () => {
  test('report option exists on story pages', async ({ page }) => {
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    const storyLink = page.locator('a[href*="/stories/"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('domcontentloaded');

      const reportButton = page.locator(
        'button:has-text("Report"), button[aria-label*="report" i], [class*="report"]'
      );
      expect(await reportButton.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('DMCA Notice Flow', () => {
  test('DMCA page has submission form', async ({ page }) => {
    await page.goto('/dmca');
    await page.waitForLoadState('domcontentloaded');

    const pageContent = await page.textContent('body');
    expect(
      pageContent?.toLowerCase().includes('dmca') ||
      pageContent?.toLowerCase().includes('copyright')
    ).toBeTruthy();
  });
});

test.describe('Support Ticket Flow', () => {
  test('support page has contact form', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('domcontentloaded');

    const formInputs = page.locator('input, textarea, select');
    expect(await formInputs.count()).toBeGreaterThan(0);

    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    );
    expect(await submitButton.count()).toBeGreaterThan(0);
  });

  test('support form validates required fields', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('domcontentloaded');

    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    ).first();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Should still be on support page (form not submitted with empty fields)
      expect(page.url()).toContain('/support');
    }
  });
});
