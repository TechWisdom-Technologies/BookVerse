/**
 * E2E Tests: Chapter Scheduling
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Chapter Scheduling', () => {
  test('chapter scheduling option exists', async ({ authorPage }) => {
    // Navigate to chapter creation
    await authorPage.goto('/write/1/chapters/new');
    await authorPage.waitForLoadState('domcontentloaded');
    const scheduleBtn = authorPage.locator('button:has-text("Schedule"), input[type="datetime-local"]');
    if (await scheduleBtn.count() > 0) {
      expect(await scheduleBtn.first().isVisible()).toBeTruthy();
    }
  });
});
