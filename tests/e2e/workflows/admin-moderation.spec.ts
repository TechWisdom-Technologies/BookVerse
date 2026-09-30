/**
 * E2E Workflow: Admin Moderation
 * Scenario: Admin checks reports, reviews a user, and views system logs.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Workflow: Admin Moderation', () => {
  test('admin can manage platform content and users', async ({ adminPage }) => {
    // 1. Visit admin dashboard
    await adminPage.goto('/admin');
    await adminPage.waitForLoadState('domcontentloaded');
    
    // 2. Check Reports
    await adminPage.goto('/admin/reports');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/reports');
    
    // 3. Manage Users
    await adminPage.goto('/admin/users');
    await adminPage.waitForLoadState('domcontentloaded');
    
    // Look for search input to find a specific user
    const searchInput = adminPage.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('spammer');
      await searchInput.press('Enter');
    }
    
    // 4. View System Monitoring
    await adminPage.goto('/admin/monitoring');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/monitoring');
  });
});
