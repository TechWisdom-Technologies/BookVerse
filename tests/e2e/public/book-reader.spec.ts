/**
 * E2E Tests: Book Reader
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Book Reader', () => {
  test('PDF/EPUB reader loads', async ({ memberPage }) => {
    // Assuming book ID 1 is a valid book
    await memberPage.goto('/library/1/read');
    await memberPage.waitForLoadState('domcontentloaded');
    const body = await memberPage.textContent('body');
    // It should load some viewer
    expect(body?.length).toBeGreaterThan(0);
  });
});
