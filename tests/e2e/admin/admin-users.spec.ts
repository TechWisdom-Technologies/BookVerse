/**
 * E2E Tests: Admin Users Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Users Management', () => {
  test('users list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/users');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/users');
    const body = await adminPage.textContent('body');
    expect(body?.toLowerCase().includes('user')).toBeTruthy();
  });
});
