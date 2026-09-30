/**
 * E2E Tests: Admin Promotions
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Promotions', () => {
  test('promotions list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/promotions');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/promotions');
  });
});
