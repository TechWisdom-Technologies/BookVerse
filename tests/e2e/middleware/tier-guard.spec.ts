/**
 * E2E Tests: Tier Guard
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Tier Guard Middleware', () => {
  test('FREE user cannot access AUTHOR routes', async ({ memberPage }) => {
    await memberPage.goto('/write/dashboard');
    await memberPage.waitForTimeout(1000);
    const body = await memberPage.textContent('body');
    expect(
      !memberPage.url().includes('/write/dashboard') ||
      body?.toLowerCase().includes('upgrade') ||
      body?.toLowerCase().includes('access denied')
    ).toBeTruthy();
  });

  test('AUTHOR user cannot access PRO routes', async ({ authorPage }) => {
    await authorPage.goto('/wallet');
    await authorPage.waitForTimeout(1000);
    const body = await authorPage.textContent('body');
    expect(
      !authorPage.url().includes('/wallet') ||
      body?.toLowerCase().includes('upgrade') ||
      body?.toLowerCase().includes('access denied')
    ).toBeTruthy();
  });

  test('PRO user cannot access CREATOR routes', async ({ proPage }) => {
    await proPage.goto('/gifts');
    await proPage.waitForTimeout(1000);
    const body = await proPage.textContent('body');
    expect(
      !proPage.url().includes('/gifts') ||
      body?.toLowerCase().includes('upgrade') ||
      body?.toLowerCase().includes('access denied')
    ).toBeTruthy();
  });

  test('ADMIN bypasses tier checks', async ({ adminPage }) => {
    await adminPage.goto('/write/dashboard');
    await expect(adminPage).toHaveURL(/.*write\/dashboard.*/);
    
    await adminPage.goto('/wallet');
    await expect(adminPage).toHaveURL(/.*wallet.*/);
  });
});
