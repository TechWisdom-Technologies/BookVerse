/**
 * E2E Tests: Admin Settings
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Settings', () => {
  test('settings page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/settings');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/settings');
  });
});
