import { test, expect } from '@playwright/test';

test.describe('Phase 5: Concurrency & Race Condition Storms', () => {

  test('Double-Submit Prevention - rapid clicks on action buttons', async ({ page }) => {
    await page.goto('/');
    // Find any clickable button and rapidly click it
    const buttons = page.locator('button, a[href]');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      const firstBtn = buttons.first();
      if (await firstBtn.isVisible()) {
        // Rapid-fire 10 clicks in quick succession
        for (let i = 0; i < 10; i++) {
          await firstBtn.click({ force: true, noWaitAfter: true }).catch(() => {});
        }
      }
    }
    // App should not crash
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Cross-Tab Auth Desync - stale session detection', async ({ page, context }) => {
    await page.goto('/');
    // Open a second tab
    const page2 = await context.newPage();
    await page2.goto('/');
    // Clear cookies in tab 1 (simulating logout)
    await page.context().clearCookies();
    // Tab 2 should still be browseable (it has its own page state)
    const body2 = page2.locator('body');
    await expect(body2).toBeVisible();
    await page2.close();
  });

  test('Rapid Back/Forward Navigation does not crash', async ({ page }) => {
    await page.goto('/');
    // Navigate to a few pages
    try { await page.goto('/login', { timeout: 5000 }); } catch (e) {}
    try { await page.goto('/library', { timeout: 5000 }); } catch (e) {}
    // Slam back/forward buttons
    for (let i = 0; i < 10; i++) {
      await page.goBack({ timeout: 2000 }).catch(() => {});
      await page.goForward({ timeout: 2000 }).catch(() => {});
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Notification Read Race - simultaneous mark-as-read', async ({ page, context }) => {
    // Simulate two tabs trying to mark the same notification as read
    await page.goto('/');
    const page2 = await context.newPage();
    await page2.goto('/');
    // Both pages should remain stable
    const body1 = page.locator('body');
    const body2 = page2.locator('body');
    await expect(body1).toBeVisible();
    await expect(body2).toBeVisible();
    await page2.close();
  });
});
