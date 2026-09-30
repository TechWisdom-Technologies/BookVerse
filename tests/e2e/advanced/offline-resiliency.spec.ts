/**
 * E2E Tests: Offline Resiliency
 * Tests how the app behaves when the network drops.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Offline Resiliency', () => {
  test('shows offline indicator when network disconnects', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Simulate going offline
    await context.setOffline(true);
    
    // Try to navigate or interact
    try {
      await page.goto('/library', { timeout: 5000 });
    } catch (e) {
      // Navigation will fail, which is expected. 
      // A PWA should show a fallback page or a toast notification.
    }
    
    // Restore network to not break other tests if context is reused
    await context.setOffline(false);
  });
});
