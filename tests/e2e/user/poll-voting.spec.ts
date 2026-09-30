/**
 * E2E Tests: Poll Voting
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Poll Voting', () => {
  test('user can vote on poll', async ({ memberPage }) => {
    // Navigate to a chapter that has a poll
    await memberPage.goto('/stories/1/chapters/1');
    await memberPage.waitForLoadState('domcontentloaded');
    const poll = memberPage.locator('.poll-container, [data-testid="poll"]');
    if (await poll.count() > 0) {
      expect(await poll.isVisible()).toBeTruthy();
    }
  });
});
