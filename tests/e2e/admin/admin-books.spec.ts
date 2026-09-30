/**
 * E2E Tests: Admin Books Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Books Management', () => {
  test('books list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/books');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/books');
  });
});
