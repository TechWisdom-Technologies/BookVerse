/**
 * E2E Tests: CSRF Protection
 */
import { test, expect } from '@playwright/test';

test.describe('CSRF Protection', () => {
  test('Cross-origin POST to API is blocked', async ({ request }) => {
    const response = await request.post('/api/auth/session', {
      headers: {
        'Origin': 'https://malicious-site.com'
      },
      data: {}
    });
    // Expected to fail validation
    expect([400, 401, 403]).toContain(response.status());
  });
});
