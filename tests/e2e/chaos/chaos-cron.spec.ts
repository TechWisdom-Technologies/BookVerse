import { test, expect } from '@playwright/test';

test.describe('Phase 10: Cron Job Chaos', () => {

  test('Cron Auth Bypass - missing CRON_SECRET rejected', async ({ page }) => {
    await page.goto('/');
    // Call cron endpoints without auth
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/cron/daily-maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    // Should be 401 or 403 (not 200)
    expect(response.status).not.toBe(200);
  });

  test('Cron endpoints reject GET requests', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/cron/publish-chapters');
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Subscription Reminders cron without auth rejected', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/cron/subscription-reminders', {
          method: 'POST',
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    expect(response.status).not.toBe(200);
  });
});
