/**
 * E2E Tests: Tier Guard
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Tier Guard Middleware', () => {
  test('FREE user cannot access AUTHOR routes', async ({ memberPage }) => {
    await memberPage.goto('/write/dashboard');
    await memberPage.waitForLoadState('domcontentloaded');
    expect(memberPage.url()).not.toContain('/write/dashboard');
  });

  test('AUTHOR user cannot access PRO routes', async ({ authorPage }) => {
    await authorPage.goto('/wallet');
    await authorPage.waitForLoadState('domcontentloaded');
    expect(authorPage.url()).not.toContain('/wallet');
  });

  test('PRO user cannot access CREATOR routes', async ({ proPage }) => {
    await proPage.goto('/gifts');
    await proPage.waitForLoadState('domcontentloaded');
    expect(proPage.url()).not.toContain('/gifts');
  });

  test('ADMIN bypasses tier checks', async ({ adminPage }) => {
    await adminPage.goto('/write/dashboard');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/write/dashboard');
    
    await adminPage.goto('/wallet');
    await adminPage.waitForLoadState('domcontentloaded');
    expect(adminPage.url()).toContain('/wallet');
  });
});
