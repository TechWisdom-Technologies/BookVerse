/**
 * E2E Tests: Offline Stories
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Offline Stories', () => {
  test('offline stories page loads', async ({ memberPage }) => {
    await memberPage.goto('/offline-stories');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/offline-stories');
  });
});
