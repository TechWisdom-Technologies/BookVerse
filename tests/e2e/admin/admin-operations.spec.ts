/**
 * E2E Tests: Admin Operations
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Operations', () => {
  test('operations page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/operations');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/operations');
  });
});
