/**
 * E2E Tests: Admin Transactions
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Transactions', () => {
  test('transactions list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/transactions');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/transactions');
  });
});
