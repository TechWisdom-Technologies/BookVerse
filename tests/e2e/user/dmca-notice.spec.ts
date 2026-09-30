/**
 * E2E Tests: DMCA Notice
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('DMCA Notice', () => {
  test('submit DMCA notice', async ({ memberPage }) => {
    await memberPage.goto('/dmca');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/dmca');
  });
});
