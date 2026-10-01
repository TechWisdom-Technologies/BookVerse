# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\login.spec.ts >> Login Flow >> shows validation error for empty password
- Location: tests\e2e\auth\login.spec.ts:45:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first()
    - locator resolved to <button disabled type="submit" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">Sign In</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is not enabled
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    17 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation "Bottom navigation" [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link [ref=e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=e8]
          - generic: BookVerse
        - link [ref=e9] [cursor=pointer]:
          - /url: /support
        - link [ref=e15] [cursor=pointer]:
          - /url: /library
        - link [ref=e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=e32] [cursor=pointer]:
          - /url: /series
        - link [ref=e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=e45] [cursor=pointer]:
        - /url: /
      - generic [ref=e50]:
        - link [ref=e51] [cursor=pointer]:
          - /url: /search
        - link [ref=e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=e62]:
          - generic: AI Librarian
        - link "Sign In" [ref=e67] [cursor=pointer]:
          - /url: /login
  - main [ref=e72]:
    - generic [ref=e73]:
      - link "BookVerse Logo BookVerse" [ref=e75] [cursor=pointer]:
        - /url: /
        - img "BookVerse Logo" [ref=e76]
        - generic [ref=e77]: BookVerse
      - link "Back to Archives" [ref=e79] [cursor=pointer]:
        - /url: /
      - generic [ref=e82]:
        - generic [ref=e83]:
          - generic [ref=e84]: Secure Login
          - heading "Welcome Back." [level=1] [ref=e87]
          - paragraph [ref=e88]: Sign in to access your library and continue your stories.
        - generic [ref=e89]:
          - generic [ref=e90]:
            - text: Email Address
            - textbox "you@example.com" [active] [ref=e91]: user@test.com
          - generic [ref=e92]:
            - text: Password
            - textbox "At least 8 characters" [ref=e93]
            - link "Forgot password?" [ref=e95] [cursor=pointer]:
              - /url: /forgot-password?redirect=%2F
          - generic [ref=e96]:
            - button "Sign In" [disabled] [ref=e101]
            - generic [ref=e102]: Or continue with
            - button "Google" [ref=e107]
        - paragraph [ref=e113]:
          - text: New to BookVerse?
          - link "Create Account" [ref=e114] [cursor=pointer]:
            - /url: /signup?redirect=%2F
  - contentinfo [ref=e115]:
    - generic [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - link "BookVerse Logo BookVerse" [ref=e119] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e120]
            - generic [ref=e121]: BookVerse
          - paragraph [ref=e123]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e124]:
            - generic [ref=e125]:
              - generic [ref=e126]: 807+
              - generic [ref=e127]: Books
            - generic [ref=e128]:
              - generic [ref=e129]: 4+
              - generic [ref=e130]: Authors
            - generic [ref=e131]:
              - generic [ref=e132]: 7+
              - generic [ref=e133]: Readers
        - generic [ref=e134]:
          - heading "Newsletter" [level=3] [ref=e135]
          - paragraph [ref=e136]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e138]:
            - textbox "Your email" [ref=e139]
            - button [ref=e140]
      - generic [ref=e144]:
        - generic [ref=e145]:
          - heading "Discover" [level=4] [ref=e146]
          - list [ref=e147]:
            - listitem [ref=e148]:
              - link "Home" [ref=e149] [cursor=pointer]:
                - /url: /
            - listitem [ref=e150]:
              - link "Browse Library" [ref=e151] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e152]:
              - link "Stories" [ref=e153] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e154]:
              - link "Universes" [ref=e155] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e156]:
              - link "Series" [ref=e157] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e158]:
              - link "Search" [ref=e159] [cursor=pointer]:
                - /url: /search
        - generic [ref=e160]:
          - heading "Community" [level=4] [ref=e161]
          - list [ref=e162]:
            - listitem [ref=e163]:
              - link "Book Clubs" [ref=e164] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e165]:
              - link "Activity Feed" [ref=e166] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e167]:
              - link "Challenges" [ref=e168] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e169]:
              - link "My Shelf" [ref=e170] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e171]:
              - link "Offline Stories" [ref=e172] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e173]:
          - heading "For Authors" [level=4] [ref=e174]
          - list [ref=e175]:
            - listitem [ref=e176]:
              - link "Author Dashboard" [ref=e177] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e178]:
              - link "Write a Story" [ref=e179] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e180]:
              - link "Story Universes" [ref=e181] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e182]:
              - link "Story Series" [ref=e183] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e184]:
              - link "Analytics" [ref=e185] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e186]:
              - link "Wallet" [ref=e187] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e188]:
              - link "Newsletter & Fans" [ref=e189] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e190]:
              - link "Upload Book" [ref=e191] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e192]:
          - heading "Support & Legal" [level=4] [ref=e193]
          - list [ref=e194]:
            - listitem [ref=e195]:
              - link "Premium" [ref=e196] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e197]:
              - link "Gifts" [ref=e198] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e199]:
              - link "Settings" [ref=e200] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e201]:
              - link "Support Desk" [ref=e202] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e203]:
              - link "Documentation" [ref=e204] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e205]:
              - link "Privacy Policy" [ref=e206] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e207]:
              - link "Terms of Service" [ref=e208] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e209]:
              - link "Cookie Policy" [ref=e210] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e211]:
              - link "DMCA" [ref=e212] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e213]:
          - heading "Get in Touch" [level=4] [ref=e214]
          - list [ref=e215]:
            - listitem [ref=e216]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e220] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e221]:
              - link "bookverse@gmail.com" [ref=e225] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e226]:
              - link "+880 1799-269699" [ref=e229] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e230]:
            - heading "Follow Us" [level=4] [ref=e231]
            - generic [ref=e232]:
              - link "Facebook" [ref=e233] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e236] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e240] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e243] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e248] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e251]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e255]
  - button "Open Next.js Dev Tools" [ref=e263] [cursor=pointer]
  - alert [ref=e267]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Login Flow
  3  |  * Tests user login with valid/invalid credentials, redirects, and edge cases.
  4  |  */
  5  | import { test, expect } from '../fixtures/auth.fixture';
  6  | 
  7  | test.describe('Login Flow', () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto('/login');
  10 |     await page.waitForLoadState('domcontentloaded');
  11 |   });
  12 | 
  13 |   test('login page loads with form fields', async ({ page }) => {
  14 |     await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  15 |     await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
  16 |     await expect(page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first()).toBeVisible();
  17 |   });
  18 | 
  19 |   test('shows error for invalid credentials', async ({ page }) => {
  20 |     await page.fill('input[type="email"], input[name="email"]', 'wrong@email.com');
  21 |     await page.fill('input[type="password"], input[name="password"]', 'WrongPass123!');
  22 |     await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();
  23 | 
  24 |     await page.waitForTimeout(2000);
  25 |     const pageContent = await page.textContent('body');
  26 |     // Should show an error or still be on login page
  27 |     expect(
  28 |       page.url().includes('/login') ||
  29 |       pageContent?.toLowerCase().includes('error') ||
  30 |       pageContent?.toLowerCase().includes('invalid') ||
  31 |       pageContent?.toLowerCase().includes('incorrect') ||
  32 |       pageContent?.toLowerCase().includes('failed')
  33 |     ).toBeTruthy();
  34 |   });
  35 | 
  36 |   test('shows validation error for empty email', async ({ page }) => {
  37 |     await page.fill('input[type="password"], input[name="password"]', 'SomePass123!');
  38 |     await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();
  39 | 
  40 |     await page.waitForTimeout(500);
  41 |     // Should remain on login page
  42 |     expect(page.url()).toContain('/login');
  43 |   });
  44 | 
  45 |   test('shows validation error for empty password', async ({ page }) => {
  46 |     await page.fill('input[type="email"], input[name="email"]', 'user@test.com');
> 47 |     await page.getByRole('button', { name: /log\s*in|sign\s*in|submit/i }).first().click();
     |                                                                                    ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  48 | 
  49 |     await page.waitForTimeout(500);
  50 |     expect(page.url()).toContain('/login');
  51 |   });
  52 | 
  53 |   test('preserves redirect parameter in URL', async ({ page }) => {
  54 |     await page.goto('/login?redirect=/write/dashboard');
  55 |     await page.waitForLoadState('domcontentloaded');
  56 | 
  57 |     // The redirect parameter should be preserved
  58 |     expect(page.url()).toContain('redirect');
  59 |   });
  60 | 
  61 |   test('has link to signup page', async ({ page }) => {
  62 |     const signupLink = page.locator('a[href*="signup"], a:has-text("sign up"), a:has-text("register"), a:has-text("create account")');
  63 |     await expect(signupLink.first()).toBeVisible();
  64 |   });
  65 | 
  66 |   test('has link to forgot password', async ({ page }) => {
  67 |     const forgotLink = page.locator('a[href*="forgot"], a:has-text("forgot"), a:has-text("reset")');
  68 |     await expect(forgotLink.first()).toBeVisible();
  69 |   });
  70 | });
  71 | 
```