/**
 * E2E Tests: Admin Stories Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Stories Management', () => {
  test('stories list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/stories');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/stories');
  });
});
