/**
 * E2E Tests: Admin Reports Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Reports Management', () => {
  test('reports list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/reports');
  });
});
