/**
 * E2E Tests: Admin Storage
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Storage', () => {
  test('storage page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/storage');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/storage');
  });
});
