/**
 * E2E Tests: Admin DMCA Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin DMCA Management', () => {
  test('DMCA list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/dmca');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/dmca');
  });
});
