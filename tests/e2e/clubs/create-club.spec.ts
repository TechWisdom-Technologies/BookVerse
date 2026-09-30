/**
 * E2E Tests: Create Club
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Create Club', () => {
  test('create club page loads', async ({ memberPage }) => {
    await memberPage.goto('/clubs/create');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).toContain('/clubs/create');
  });
});
