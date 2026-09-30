/**
 * E2E Tests: Achievements
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Achievements', () => {
  test('achievements page loads', async ({ proPage }) => {
    await proPage.goto('/achievements');
    await proPage.waitForLoadState('domcontentloaded');
    expect(proPage.url()).toContain('/achievements');
  });
});
