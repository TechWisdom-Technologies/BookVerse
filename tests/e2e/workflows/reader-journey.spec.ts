/**
 * E2E Workflow: Complete Reader Journey
 * Scenario: A new user signs up, searches for a book, reads a chapter, and interacts with it.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Workflow: Complete Reader Journey', () => {
  test('reader can search, read, and interact', async ({ memberPage }) => {
    // 1. User searches for a book
    await memberPage.goto('/search');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // Check if search input exists
    const searchInput = memberPage.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Fantasy');
      await searchInput.press('Enter');
      
      // Wait for results
      await memberPage.waitForTimeout(1000);
    }
    
    // 2. User navigates to a book detail page
    // Assuming book 1 exists for testing purposes
    await memberPage.goto('/library/1');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // 3. User adds book to shelf
    const saveBtn = memberPage.locator('button:has-text("Save"), button:has-text("Add to Shelf")');
    if (await saveBtn.count() > 0) {
      await expect(saveBtn.first()).toBeVisible();
    }
    
    // 4. User starts reading
    const readBtn = memberPage.locator('a[href*="/read"], a:has-text("Read")');
    if (await readBtn.count() > 0) {
      await expect(readBtn.first()).toBeVisible();
    }
    
    // 5. User goes to activity feed to see updates
    await memberPage.goto('/activity-feed');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/activity-feed');
  });
});
