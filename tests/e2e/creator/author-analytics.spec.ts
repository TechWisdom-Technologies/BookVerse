/**
 * E2E Tests: Author Analytics
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Author Analytics', () => {
  test('author analytics page loads for creator', async ({ creatorPage }) => {
    await creatorPage.goto('/author/analytics');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/author/analytics');
  });
});
