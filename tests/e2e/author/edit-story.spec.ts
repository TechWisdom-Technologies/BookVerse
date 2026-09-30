/**
 * E2E Tests: Edit Story
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Edit Story', () => {
  test('edit story page loads', async ({ authorPage }) => {
    // Assuming story 1 belongs to the author
    await authorPage.goto('/write/1/edit');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/edit');
  });
});
