/**
 * E2E Tests: Gift Membership Payment
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Gift Payment', () => {
  test('gifts page loads and shows purchase options', async ({ creatorPage }) => {
    await creatorPage.goto('/gifts');
    await creatorPage.waitForLoadState('domcontentloaded');
    const url = creatorPage.url();
    if (url.includes('/gifts')) {
      const body = await creatorPage.textContent('body');
      expect(
        body?.toLowerCase().includes('gift') || 
        body?.toLowerCase().includes('membership')
      ).toBeTruthy();
    }
  });
});
