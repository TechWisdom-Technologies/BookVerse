/**
 * E2E Tests: Series Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Series Management', () => {
  test('series management page loads', async ({ authorPage }) => {
    await authorPage.goto('/write/series');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/series');
  });
});
