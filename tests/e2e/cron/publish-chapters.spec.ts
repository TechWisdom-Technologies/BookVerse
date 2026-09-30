/**
 * E2E Tests: Publish Chapters Cron
 */
import { test, expect } from '@playwright/test';

test.describe('Publish Chapters Cron', () => {
  test('publish chapters endpoint security', async ({ request }) => {
    const response = await request.post('/api/cron/publish-chapters', {
      headers: { 'Authorization': 'Bearer invalid' }
    });
    // Should be unauthorized
    expect([401, 404, 405]).toContain(response.status());
  });
});
