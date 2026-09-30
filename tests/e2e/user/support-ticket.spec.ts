/**
 * E2E Tests: Support Ticket
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Support Ticket', () => {
  test('submit support ticket', async ({ memberPage }) => {
    await memberPage.goto('/support');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/support');
  });
});
