/**
 * E2E Tests: Admin Clubs Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Clubs Management', () => {
  test('clubs list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/clubs');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/clubs');
  });
});
