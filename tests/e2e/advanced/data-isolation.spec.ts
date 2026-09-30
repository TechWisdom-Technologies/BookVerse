/**
 * E2E Tests: Data Isolation & Privacy
 * Ensures users cannot access data belonging to other users.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Data Isolation', () => {
  test('user cannot edit another users profile', async ({ memberPage }) => {
    // Attempt to PUT to another user's profile API
    const response = await memberPage.request.put('/api/users/999/profile', {
      data: { bio: 'Hacked' }
    });
    // Should be forbidden or unauthorized
    expect([401, 403, 404]).toContain(response.status());
  });

  test('user cannot access another authors private drafts', async ({ authorPage }) => {
    // Assuming story 999 belongs to someone else
    await authorPage.goto('/write/999/edit');
    await authorPage.waitForLoadState('domcontentloaded');
    
    // The page should redirect away or show an error
    const body = await authorPage.textContent('body');
    const isError = body?.toLowerCase().includes('not found') || body?.toLowerCase().includes('unauthorized') || authorPage.url().includes('/dashboard');
    expect(isError).toBeTruthy();
  });
});
