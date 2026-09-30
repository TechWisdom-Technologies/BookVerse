/**
 * E2E Tests: Admin Universes Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Universes Management', () => {
  test('universes list page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/universes');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/universes');
  });
});
