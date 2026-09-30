/**
 * E2E Tests: Admin Series Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Series Management', () => {
  test('series list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/series');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/series');
  });
});
