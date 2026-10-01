/**
 * E2E Tests: Auth Guard
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Auth Guard Middleware', () => {
  const protectedRoutes = [
    '/write/dashboard',
    '/upload',
    '/admin',
    '/shelf',
    '/profile/edit',
    '/settings',
    '/wallet',
    '/notifications',
    '/activity-feed',
    '/gifts'
  ];

  for (const route of protectedRoutes) {
    test(`redirects unauthenticated user from ${route}`, async ({ visitorPage }) => {
      await visitorPage.goto(route);
      await expect(visitorPage).toHaveURL(/.*login.*/);
    });
  }
});
