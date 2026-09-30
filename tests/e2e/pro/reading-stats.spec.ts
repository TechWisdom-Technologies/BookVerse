/**
 * E2E Tests: Reading Stats
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reading Stats', () => {
  test('reading stats page loads', async ({ proPage }) => {
    await proPage.goto('/reading-stats');
    await proPage.waitForLoadState('domcontentloaded');
    expect(proPage.url()).toContain('/reading-stats');
  });
});
