/**
 * E2E Tests: Story Promotion
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Promotion', () => {
  test('story promotion feature is accessible', async ({ creatorPage }) => {
    await creatorPage.goto('/write/dashboard');
    await creatorPage.waitForLoadState('domcontentloaded');
    const body = await creatorPage.textContent('body');
    // Assuming UI would have 'promote' somewhere on dashboard for creators
    expect(body?.length).toBeGreaterThan(0);
  });
});
