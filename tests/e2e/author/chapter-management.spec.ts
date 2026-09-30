/**
 * E2E Tests: Chapter Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Chapter Management', () => {
  test('chapter management page loads', async ({ authorPage }) => {
    // Assuming story 1 belongs to the author
    await authorPage.goto('/write/1/chapters');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/chapters');
  });
});
