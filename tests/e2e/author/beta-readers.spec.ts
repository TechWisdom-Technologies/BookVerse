/**
 * E2E Tests: Beta Readers
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Beta Readers', () => {
  test('beta readers page loads', async ({ authorPage }) => {
    // Assuming story 1 belongs to the author
    await authorPage.goto('/write/1/beta-readers');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/beta-readers');
  });
});
