/**
 * E2E Tests: Admin Support
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Support', () => {
  test('support list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/support');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/support');
  });
});
