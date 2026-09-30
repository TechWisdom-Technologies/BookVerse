/**
 * E2E Tests: Middleware and Role-based Access Control
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Middleware Access Control', () => {
  test('visitor is redirected from /write routes', async ({ visitorPage }) => {
    await visitorPage.goto('/write/dashboard');
    await visitorPage.waitForLoadState('domcontentloaded');
    expect(visitorPage.url()).toContain('/login');
  });

  test('visitor is redirected from /admin routes', async ({ visitorPage }) => {
    await visitorPage.goto('/admin');
    await visitorPage.waitForLoadState('domcontentloaded');
    
    const url = visitorPage.url();
    const body = await visitorPage.textContent('body');
    // Either redirected to login, home, or shown 404/unauthorized
    expect(
      url.includes('/login') ||
      !url.includes('/admin') ||
      body?.toLowerCase().includes('404') ||
      body?.toLowerCase().includes('unauthorized')
    ).toBeTruthy();
  });

  test('MEMBER tier cannot access AUTHOR routes', async ({ memberPage }) => {
    await memberPage.goto('/write/dashboard');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // Member doesn't have AUTHOR role, so should be redirected (e.g. to premium page) or shown unauthorized
    const url = memberPage.url();
    const body = await memberPage.textContent('body');
    expect(
      !url.includes('/write/dashboard') ||
      body?.toLowerCase().includes('upgrade') ||
      body?.toLowerCase().includes('unauthorized') ||
      body?.toLowerCase().includes('access denied')
    ).toBeTruthy();
  });

  test('AUTHOR tier cannot access PRO routes', async ({ authorPage }) => {
    await authorPage.goto('/wallet');
    await authorPage.waitForLoadState('domcontentloaded');
    
    // Wallet is PRO feature, AUTHOR has FREE tier logic (unless explicitly upgraded)
    const url = authorPage.url();
    const body = await authorPage.textContent('body');
    expect(
      !url.includes('/wallet') ||
      body?.toLowerCase().includes('upgrade') ||
      body?.toLowerCase().includes('unauthorized')
    ).toBeTruthy();
  });

  test('CREATOR tier can access all feature routes', async ({ creatorPage }) => {
    // Creator should access Write dashboard
    await creatorPage.goto('/write/dashboard');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/write/dashboard');

    // Creator should access Wallet
    await creatorPage.goto('/wallet');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/wallet');

    // Creator should access Analytics
    await creatorPage.goto('/author/analytics');
    await creatorPage.waitForLoadState('domcontentloaded');
    expect(creatorPage.url()).toContain('/author/analytics');
  });
});
