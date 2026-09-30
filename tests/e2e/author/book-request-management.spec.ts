/**
 * E2E Tests: Book Request Management
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Book Request Management', () => {
  test('book requests page loads', async ({ authorPage }) => {
    await authorPage.goto('/write/requests');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/requests');
  });
});
