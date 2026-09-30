/**
 * E2E Tests: Book Upload
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Book Upload', () => {
  test('book upload page loads', async ({ authorPage }) => {
    await authorPage.goto('/upload');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/upload');
  });
});
