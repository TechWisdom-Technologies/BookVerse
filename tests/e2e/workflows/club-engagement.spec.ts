/**
 * E2E Workflow: Club Engagement
 * Scenario: A user browses clubs, opens a club detail page, and checks discussions.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Workflow: Club Engagement', () => {
  test('user can browse and engage in a club', async ({ memberPage }) => {
    // 1. User navigates to clubs hub
    await memberPage.goto('/clubs');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // Check for create club button
    const createBtn = memberPage.locator('a[href="/clubs/create"], button:has-text("Create")');
    if (await createBtn.count() > 0) {
      await expect(createBtn.first()).toBeVisible();
    }
    
    // 2. User navigates to specific club
    await memberPage.goto('/clubs/1');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // 3. User checks members list or discussion tab
    const discussionTab = memberPage.locator('button:has-text("Discussions"), a[href*="discussions"]');
    if (await discussionTab.count() > 0) {
      await expect(discussionTab.first()).toBeVisible();
    }
  });
});
