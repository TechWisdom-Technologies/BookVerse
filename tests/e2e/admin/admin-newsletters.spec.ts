/**
 * E2E Tests: Admin Newsletters
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Newsletters', () => {
  test('newsletters page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/newsletters');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/newsletters');
  });
});
