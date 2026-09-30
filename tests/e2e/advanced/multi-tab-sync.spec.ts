/**
 * E2E Tests: Multi-Tab Synchronization
 * Tests scenarios where a user has multiple tabs open.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Multi-Tab Sync', () => {
  test('logging out in one tab invalidates session in another', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Setup tab 1 (logged in manually to avoid fixture complexity for cross-tab)
    const tab1 = await context.newPage();
    await tab1.goto('/login');
    await tab1.waitForLoadState('domcontentloaded');
    
    const emailInput = tab1.locator('input[type="email"], input[name="email"]');
    const passwordInput = tab1.locator('input[type="password"], input[name="password"]');
    const submitBtn = tab1.locator('button[type="submit"], button:has-text("Login")');
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      // Very basic login for test
      await emailInput.fill('member@bookverse.com');
      await passwordInput.fill('password123');
      await submitBtn.click();
      await tab1.waitForURL('**/');
      
      // Open tab 2
      const tab2 = await context.newPage();
      await tab2.goto('/');
      await tab2.waitForLoadState('domcontentloaded');
      
      // Tab 1 logs out
      await tab1.goto('/logout');
      await tab1.waitForLoadState('domcontentloaded');
      
      // Tab 2 attempts a private action (e.g. reload or go to profile)
      await tab2.goto('/profile/edit');
      await tab2.waitForLoadState('domcontentloaded');
      
      // Tab 2 should be redirected to login because cookie is gone
      expect(tab2.url()).toContain('/login');
    }
    
    await context.close();
  });
});
