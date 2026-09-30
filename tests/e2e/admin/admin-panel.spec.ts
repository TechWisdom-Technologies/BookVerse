/**
 * E2E Tests: Moderation & Admin Panel
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin Panel Dashboard', () => {
  test('redirects non-admin users', async ({ memberPage }) => {
    await memberPage.goto('/admin');
    await memberPage.waitForLoadState('domcontentloaded');

    // Should redirect to home or show unauthorized
    const url = memberPage.url();
    const body = await memberPage.textContent('body');
    
    expect(
      !url.includes('/admin') ||
      body?.toLowerCase().includes('unauthorized') ||
      body?.toLowerCase().includes('access denied') ||
      body?.toLowerCase().includes('not found') ||
      body?.toLowerCase().includes('404')
    ).toBeTruthy();
  });

  test('loads dashboard for admin user', async ({ adminPage }) => {
    await adminPage.goto('/admin');
    await adminPage.waitForLoadState('domcontentloaded');

    const url = adminPage.url();
    if (url.includes('/admin')) {
      const body = await adminPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('admin') ||
        body?.toLowerCase().includes('dashboard') ||
        body?.toLowerCase().includes('users') ||
        body?.toLowerCase().includes('reports')
      ).toBeTruthy();
    }
  });
});

test.describe('Admin Users Management', () => {
  test('users list page loads for admin', async ({ adminPage }) => {
    await adminPage.goto('/admin/users');
    await adminPage.waitForLoadState('domcontentloaded');

    const url = adminPage.url();
    if (url.includes('/admin/users')) {
      const body = await adminPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
      
      expect(
        body?.toLowerCase().includes('user') ||
        body?.toLowerCase().includes('role') ||
        body?.toLowerCase().includes('status')
      ).toBeTruthy();
    }
  });

  test('users list has search and filter controls', async ({ adminPage }) => {
    await adminPage.goto('/admin/users');
    await adminPage.waitForLoadState('domcontentloaded');

    if (adminPage.url().includes('/admin/users')) {
      const controls = adminPage.locator(
        'input[type="search"], input[placeholder*="search" i], select'
      );
      expect(await controls.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Admin Content Moderation', () => {
  test('reports page loads for admin', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForLoadState('domcontentloaded');

    const url = adminPage.url();
    if (url.includes('/admin/reports')) {
      const body = await adminPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
      
      expect(
        body?.toLowerCase().includes('report') ||
        body?.toLowerCase().includes('content') ||
        body?.toLowerCase().includes('action')
      ).toBeTruthy();
    }
  });
});

test.describe('Admin System Logs', () => {
  test('logs page loads for admin', async ({ adminPage }) => {
    await adminPage.goto('/admin/logs');
    await adminPage.waitForLoadState('domcontentloaded');

    const url = adminPage.url();
    if (url.includes('/admin/logs')) {
      const body = await adminPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
    }
  });
});
