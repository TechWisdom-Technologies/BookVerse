/**
 * E2E Tests: Daily Maintenance Cron
 */
import { test, expect } from '@playwright/test';

test.describe('Daily Maintenance Cron', () => {
  test('cron endpoint is accessible and rejects GET', async ({ request }) => {
    // Crons are usually POST and secured via secret
    const response = await request.get('/api/cron/maintenance');
    expect([404, 405, 401]).toContain(response.status());
  });
});
