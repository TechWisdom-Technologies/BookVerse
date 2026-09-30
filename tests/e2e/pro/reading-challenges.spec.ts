/**
 * E2E Tests: Reading Challenges
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reading Challenges', () => {
  test('reading challenges page loads', async ({ proPage }) => {
    await proPage.goto('/reading-challenges');
    await proPage.waitForLoadState('domcontentloaded');
    expect(proPage.url()).toContain('/reading-challenges');
  });
});
