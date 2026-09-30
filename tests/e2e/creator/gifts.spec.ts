/**
 * E2E Tests: Gifts
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Gifts', () => {
  test('gifts page loads', async ({ creatorPage }) => {
    await creatorPage.goto('/gifts');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/gifts');
  });
});
