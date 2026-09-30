/**
 * E2E Tests: Admin Marketing
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Marketing', () => {
  test('marketing page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/marketing');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/marketing');
  });
});
