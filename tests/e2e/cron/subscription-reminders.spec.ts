/**
 * E2E Tests: Subscription Reminders Cron
 */
import { test, expect } from '@playwright/test';

test.describe('Subscription Reminders Cron', () => {
  test('subscription reminders endpoint security', async ({ request }) => {
    const response = await request.post('/api/cron/subscription-reminders');
    // Should be unauthorized
    expect([401, 404, 405]).toContain(response.status());
  });
});
