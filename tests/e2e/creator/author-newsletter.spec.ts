/**
 * E2E Tests: Author Newsletter
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Author Newsletter', () => {
  test('author newsletter page loads', async ({ creatorPage }) => {
    await creatorPage.goto('/author/newsletter');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/author/newsletter');
  });
});
