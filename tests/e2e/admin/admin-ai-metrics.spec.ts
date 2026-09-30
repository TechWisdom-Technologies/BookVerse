/**
 * E2E Tests: Admin AI Metrics
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin AI Metrics', () => {
  test('AI metrics page loads', async ({ adminPage }) => {
    await adminPage.goto('/admin/ai-metrics');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/admin/ai-metrics');
  });
});
