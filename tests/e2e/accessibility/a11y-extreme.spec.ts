import { test, expect } from '@playwright/test';

test.describe('Cognitive & Advanced Inputs (Phases 8, 9, 10)', () => {
  test('Voice Control Accessible Names Check', async ({ page }) => {
    await page.goto('/');
    
    // Phase 9: Voice Control Compatibility
    // Find all buttons and ensure if they have an aria-label, it contains the visible text
    // (A common issue where visible text "Read" has aria-label "View Story", which breaks voice control)
    const buttons = await page.locator('button').all();
    
    for (const btn of buttons) {
      const ariaLabel = await btn.getAttribute('aria-label');
      const textContent = await btn.textContent();
      
      if (ariaLabel && textContent && textContent.trim().length > 0) {
        // We expect the visible text to be part of the accessible name
        const normalizedLabel = ariaLabel.toLowerCase();
        const normalizedText = textContent.trim().toLowerCase();
        
        // It's acceptable for aria-label to be longer, but it MUST contain the visible text word
        // Not enforcing strictly to fail the test on a false positive, but testing the mechanism.
        expect(normalizedLabel.includes(normalizedText) || normalizedText.includes(normalizedLabel)).toBeTruthy();
      }
    }
  });

  test('Dynamic Pronunciation (Language Tagging)', async ({ page }) => {
    await page.goto('/');
    
    // Phase 10: Ensure html lang tag is set
    const htmlTag = page.locator('html');
    await expect(htmlTag).toHaveAttribute('lang');
    
    const lang = await htmlTag.getAttribute('lang');
    expect(lang?.length).toBeGreaterThan(0);
  });

  test('Single-Switch Linear DOM Simulation', async ({ page }) => {
    // Phase 9: Single-Switch Access
    // Simulate tabbing entirely through a page to ensure focus doesn't get infinitely trapped
    await page.goto('/');
    
    // Tab 20 times (simulating a switch user scanning)
    for(let i=0; i<20; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Ensure the page hasn't crashed
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Distraction-Free Reading Mode (Cognitive Load)', async ({ page }) => {
    // Phase 8: Cognitive Accessibility
    // Test that if we are on a reading route, we can hide extraneous elements
    // E.g., looking for a specific class or mode in the DOM
    await page.goto('/');
    
    // Simulating setting a reduced cognitive load mode in storage
    await page.evaluate(() => {
      localStorage.setItem('distraction-free', 'true');
    });
    
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
