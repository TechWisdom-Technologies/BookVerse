/**
 * E2E Tests: Admin Comments Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Comments Management', () => {
  test('comments list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/comments');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/comments');
  });
});
