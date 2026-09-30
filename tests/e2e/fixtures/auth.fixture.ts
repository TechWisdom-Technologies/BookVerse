/**
 * Shared E2E Test Fixtures for BookVerse
 * 
 * Provides pre-authenticated page contexts for different user tiers,
 * plus utility helpers for common test operations.
 */
import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';

// ─── Test User Credentials ──────────────────────────────────────
// These users must exist in the test database (seeded via seed script).
// In a real CI environment, these would be created per-run.
export const TEST_USERS = {
  visitor: {
    email: '',
    password: '',
    username: '',
  },
  member: {
    email: 'testmember@bookverse.test',
    password: 'TestMember123!',
    username: 'testmember',
  },
  author: {
    email: 'testauthor@bookverse.test',
    password: 'TestAuthor123!',
    username: 'testauthor',
  },
  pro: {
    email: 'testpro@bookverse.test',
    password: 'TestPro123!',
    username: 'testpro',
  },
  creator: {
    email: 'testcreator@bookverse.test',
    password: 'TestCreator123!',
    username: 'testcreator',
  },
  admin: {
    email: 'testadmin@bookverse.test',
    password: 'TestAdmin123!',
    username: 'testadmin',
  },
};

// ─── Helper: Login via UI ────────────────────────────────────────
async function loginViaUI(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  // Fill in login form
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Wait for redirect away from login page
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

// ─── Helper: Set Auth Cookies Directly ───────────────────────────
// For faster test setup, we can set cookies directly instead of going through the UI.
// This requires the cookies to match what the app expects.
async function setAuthCookies(
  context: BrowserContext,
  options: {
    token?: string;
    role?: string;
    roleSig?: string;
    tier?: string;
    tierSig?: string;
  }
): Promise<void> {
  const baseURL = 'http://localhost:3000';
  const cookies: Array<{
    name: string;
    value: string;
    url: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }> = [];

  if (options.token) {
    cookies.push({
      name: 'firebase-token',
      value: options.token,
      url: baseURL,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
  }

  if (options.role) {
    cookies.push({
      name: 'user-role',
      value: options.role,
      url: baseURL,
    });
  }

  if (options.roleSig) {
    cookies.push({
      name: 'user-role-sig',
      value: options.roleSig,
      url: baseURL,
    });
  }

  if (options.tier) {
    cookies.push({
      name: 'user-tier',
      value: options.tier,
      url: baseURL,
    });
  }

  if (options.tierSig) {
    cookies.push({
      name: 'user-tier-sig',
      value: options.tierSig,
      url: baseURL,
    });
  }

  if (cookies.length > 0) {
    await context.addCookies(cookies);
  }
}

// ─── Extended Test Fixtures ──────────────────────────────────────
type TestFixtures = {
  /** A page that is not logged in */
  visitorPage: Page;
  /** A page logged in as a regular MEMBER */
  memberPage: Page;
  /** A page logged in as an AUTHOR tier user */
  authorPage: Page;
  /** A page logged in as a PRO tier user */
  proPage: Page;
  /** A page logged in as a CREATOR tier user */
  creatorPage: Page;
  /** A page logged in as an ADMIN */
  adminPage: Page;
  /** Helper to login */
  login: (page: Page, email: string, password: string) => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  visitorPage: async ({ page }, use) => {
    await use(page);
  },

  memberPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await setAuthCookies(context, {
      token: 'test-firebase-token-member',
      role: 'MEMBER',
      tier: 'FREE',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  authorPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await setAuthCookies(context, {
      token: 'test-firebase-token-author',
      role: 'AUTHOR',
      tier: 'AUTHOR',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  proPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await setAuthCookies(context, {
      token: 'test-firebase-token-pro',
      role: 'MEMBER',
      tier: 'PRO',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  creatorPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await setAuthCookies(context, {
      token: 'test-firebase-token-creator',
      role: 'AUTHOR',
      tier: 'CREATOR',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await setAuthCookies(context, {
      token: 'test-firebase-token-admin',
      role: 'ADMIN',
      tier: 'CREATOR',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  login: async ({}, use) => {
    await use(loginViaUI);
  },
});

export { expect };

// ─── Common Test Helpers ─────────────────────────────────────────

/**
 * Wait for a page to finish loading (no pending network requests).
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Check that a page has the expected title pattern.
 */
export async function expectPageTitle(page: Page, titlePattern: RegExp | string): Promise<void> {
  if (typeof titlePattern === 'string') {
    await expect(page).toHaveTitle(titlePattern);
  } else {
    await expect(page).toHaveTitle(titlePattern);
  }
}

/**
 * Check that the page URL matches a given path.
 */
export async function expectPath(page: Page, path: string): Promise<void> {
  expect(new URL(page.url()).pathname).toBe(path);
}

/**
 * Check that a toast/notification with given text appears.
 */
export async function expectToast(page: Page, text: string | RegExp): Promise<void> {
  const toast = page.locator('[role="status"], .toast, [data-sonner-toast]');
  await expect(toast.filter({ hasText: text }).first()).toBeVisible({ timeout: 10000 });
}

/**
 * Fill a form field by its label text.
 */
export async function fillByLabel(page: Page, label: string, value: string): Promise<void> {
  await page.getByLabel(label).fill(value);
}

/**
 * Click a button by its visible text.
 */
export async function clickButton(page: Page, text: string): Promise<void> {
  await page.getByRole('button', { name: text }).click();
}

/**
 * Assert an element with given text is visible on the page.
 */
export async function expectVisible(page: Page, text: string | RegExp): Promise<void> {
  await expect(page.getByText(text).first()).toBeVisible();
}

/**
 * Assert an element with given text is NOT visible on the page.
 */
export async function expectNotVisible(page: Page, text: string | RegExp): Promise<void> {
  await expect(page.getByText(text).first()).not.toBeVisible();
}
