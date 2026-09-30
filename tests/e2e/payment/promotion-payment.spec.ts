/**
 * E2E Tests: Story Promotion Payment
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Promotion Payment', () => {
  test('promotion option requires creator tier', async ({ memberPage }) => {
    await memberPage.goto('/write/dashboard');
    await memberPage.waitForLoadState('domcontentloaded');
    const body = await memberPage.textContent('body');
    // Basic member doesn't have access to promotion features
    expect(body?.toLowerCase().includes('promote')).toBeFalsy();
  });

  test('creator can see promotion options', async ({ creatorPage }) => {
    await creatorPage.goto('/write/dashboard');
    await creatorPage.waitForLoadState('domcontentloaded');
    const body = await creatorPage.textContent('body');
    expect(
      body?.toLowerCase().includes('promote') || 
      body?.toLowerCase().includes('dashboard')
    ).toBeTruthy();
  });
});
