/**
 * E2E Tests: Admin Monitoring
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Monitoring', () => {
  test('monitoring page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/monitoring');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/monitoring');
  });
});
