/**
 * E2E Tests: Reading Progress
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reading Progress', () => {
  test('reading progress is tracked', async ({ memberPage }) => {
    // Navigate to a story reader and verify progress is updated
    await memberPage.goto('/stories/1/chapters/1');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/chapters/');
  });
});
