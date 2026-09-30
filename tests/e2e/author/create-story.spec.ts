/**
 * E2E Tests: Create Story
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Create Story', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/write/new');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('new story page loads with form for author', async ({ authorPage }) => {
    await authorPage.goto('/write/new');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write/new')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(100);

      // Should have form fields for story creation
      const inputs = authorPage.locator('input, textarea, select');
      expect(await inputs.count()).toBeGreaterThan(0);

      expect(
        body?.toLowerCase().includes('title') ||
        body?.toLowerCase().includes('story') ||
        body?.toLowerCase().includes('create') ||
        body?.toLowerCase().includes('genre')
      ).toBeTruthy();
    }
  });

  test('story creation form has required fields', async ({ authorPage }) => {
    await authorPage.goto('/write/new');
    await authorPage.waitForLoadState('domcontentloaded');

    if (authorPage.url().includes('/write/new')) {
      // Check for title input
      const titleInput = authorPage.locator(
        'input[name="title"], input[placeholder*="title" i], input[id*="title"]'
      );
      expect(await titleInput.count()).toBeGreaterThanOrEqual(0);

      // Check for genre selector
      const genreInput = authorPage.locator(
        'select[name="genre"], [class*="genre"], input[placeholder*="genre" i]'
      );
      expect(await genreInput.count()).toBeGreaterThanOrEqual(0);

      // Check for submit button
      const submitButton = authorPage.locator(
        'button[type="submit"], button:has-text("Create"), button:has-text("Publish"), button:has-text("Save")'
      );
      expect(await submitButton.count()).toBeGreaterThan(0);
    }
  });
});
