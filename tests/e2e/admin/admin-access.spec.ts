/**
 * E2E Tests: Admin Access
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Access', () => {
  test('admin dashboard loads for admin', async ({ adminPage }) => {
    await adminPage.goto('/admin');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin');
  });

  test('non-admin user is redirected', async ({ memberPage }) => {
    await memberPage.goto('/admin');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).not.toContain('/admin');
  });
});
