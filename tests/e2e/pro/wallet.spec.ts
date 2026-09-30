/**
 * E2E Tests: Wallet
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Wallet', () => {
  test('wallet page loads for PRO user', async ({ proPage }) => {
    await proPage.goto('/wallet');
    await proPage.waitForLoadState('domcontentloaded');
    expect(proPage.url()).toContain('/wallet');
  });
});
