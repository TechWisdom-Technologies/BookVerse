/**
 * E2E Tests: Universe Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Universe Management', () => {
  test('universe management page loads', async ({ authorPage }) => {
    await authorPage.goto('/write/universes');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/universes');
  });
});
