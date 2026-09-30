/**
 * E2E Tests: Admin Payouts
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Payouts', () => {
  test('payouts list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/payouts');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/payouts');
  });
});
