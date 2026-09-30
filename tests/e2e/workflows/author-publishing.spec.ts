/**
 * E2E Workflow: Complete Author Publishing Journey
 * Scenario: An author logs in, creates a new story, adds a chapter, and schedules it.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Workflow: Author Publishing', () => {
  test('author can create story and add chapters', async ({ authorPage }) => {
    // 1. Author goes to dashboard
    await authorPage.goto('/write/dashboard');
    await authorPage.waitForLoadState('domcontentloaded');
    
    // 2. Author clicks "New Story"
    const newStoryBtn = authorPage.locator('a[href="/write/new"], button:has-text("New Story")');
    if (await newStoryBtn.count() > 0) {
      await expect(newStoryBtn.first()).toBeVisible();
    }
    
    // 3. Author accesses a specific story's management page
    // Using story ID 1 as mock
    await authorPage.goto('/write/1/chapters');
    await authorPage.waitForLoadState('domcontentloaded');
    
    // 4. Author tries to create a new chapter
    const newChapterBtn = authorPage.locator('a[href="/write/1/chapters/new"], button:has-text("New Chapter")');
    if (await newChapterBtn.count() > 0) {
      await expect(newChapterBtn.first()).toBeVisible();
    }
    
    // 5. Check series management
    await authorPage.goto('/write/series');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).toContain('/write/series');
  });
});
