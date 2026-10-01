# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\forgot-password.spec.ts >> Forgot Password Flow >> shows validation for empty email
- Location: tests\e2e\auth\forgot-password.spec.ts:17:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /reset|send|submit/i }).first()
    - locator resolved to <button disabled type="submit" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all">Send Reset Link</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    18 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - link "Back to Sign In" [ref=e79] [cursor=pointer]:
        - /url: /login?redirect=%2F
      - generic [ref=e82]:
        - generic [ref=e83]:
          - generic [ref=e84]: Password Reset
          - heading "Reset Password." [level=1] [ref=e89]
          - paragraph [ref=e90]: Enter your account email and we will send you a reset link.
        - generic [ref=e91]:
          - generic [ref=e92]:
            - text: Email Address
            - textbox "you@example.com" [ref=e93]
          - button "Send Reset Link" [disabled] [ref=e99]
        - paragraph [ref=e100]:
          - text: Remembered your password?
          - link "Sign In" [ref=e101] [cursor=pointer]:
            - /url: /login?redirect=%2F
  - contentinfo [ref=e102]:
    - generic [ref=e103]:
      - generic [ref=e104]:
        - generic [ref=e105]:
          - link "BookVerse Logo BookVerse" [ref=e106] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e107]
            - generic [ref=e108]: BookVerse
          - paragraph [ref=e110]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e111]:
            - generic [ref=e112]:
              - generic [ref=e113]: 807+
              - generic [ref=e114]: Books
            - generic [ref=e115]:
              - generic [ref=e116]: 4+
              - generic [ref=e117]: Authors
            - generic [ref=e118]:
              - generic [ref=e119]: 7+
              - generic [ref=e120]: Readers
        - generic [ref=e121]:
          - heading "Newsletter" [level=3] [ref=e122]
          - paragraph [ref=e123]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e125]:
            - textbox "Your email" [ref=e126]
            - button [ref=e127]
      - generic [ref=e131]:
        - generic [ref=e132]:
          - heading "Discover" [level=4] [ref=e133]
          - list [ref=e134]:
            - listitem [ref=e135]:
              - link "Home" [ref=e136] [cursor=pointer]:
                - /url: /
            - listitem [ref=e137]:
              - link "Browse Library" [ref=e138] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e139]:
              - link "Stories" [ref=e140] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e141]:
              - link "Universes" [ref=e142] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e143]:
              - link "Series" [ref=e144] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e145]:
              - link "Search" [ref=e146] [cursor=pointer]:
                - /url: /search
        - generic [ref=e147]:
          - heading "Community" [level=4] [ref=e148]
          - list [ref=e149]:
            - listitem [ref=e150]:
              - link "Book Clubs" [ref=e151] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e152]:
              - link "Activity Feed" [ref=e153] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e154]:
              - link "Challenges" [ref=e155] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e156]:
              - link "My Shelf" [ref=e157] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e158]:
              - link "Offline Stories" [ref=e159] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e160]:
          - heading "For Authors" [level=4] [ref=e161]
          - list [ref=e162]:
            - listitem [ref=e163]:
              - link "Author Dashboard" [ref=e164] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e165]:
              - link "Write a Story" [ref=e166] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e167]:
              - link "Story Universes" [ref=e168] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e169]:
              - link "Story Series" [ref=e170] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e171]:
              - link "Analytics" [ref=e172] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e173]:
              - link "Wallet" [ref=e174] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e175]:
              - link "Newsletter & Fans" [ref=e176] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e177]:
              - link "Upload Book" [ref=e178] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e179]:
          - heading "Support & Legal" [level=4] [ref=e180]
          - list [ref=e181]:
            - listitem [ref=e182]:
              - link "Premium" [ref=e183] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e184]:
              - link "Gifts" [ref=e185] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e186]:
              - link "Settings" [ref=e187] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e188]:
              - link "Support Desk" [ref=e189] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e190]:
              - link "Documentation" [ref=e191] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e192]:
              - link "Privacy Policy" [ref=e193] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e194]:
              - link "Terms of Service" [ref=e195] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e196]:
              - link "Cookie Policy" [ref=e197] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e198]:
              - link "DMCA" [ref=e199] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e200]:
          - heading "Get in Touch" [level=4] [ref=e201]
          - list [ref=e202]:
            - listitem [ref=e203]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e207] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e208]:
              - link "bookverse@gmail.com" [ref=e212] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e213]:
              - link "+880 1799-269699" [ref=e216] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e217]:
            - heading "Follow Us" [level=4] [ref=e218]
            - generic [ref=e219]:
              - link "Facebook" [ref=e220] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e223] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e227] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e230] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e235] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e238]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e242]
  - button "Open Next.js Dev Tools" [ref=e250] [cursor=pointer]
  - alert [ref=e254]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Forgot Password Flow
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Forgot Password Flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/forgot-password');
  9  |     await page.waitForLoadState('domcontentloaded');
  10 |   });
  11 | 
  12 |   test('forgot password page loads with email input', async ({ page }) => {
  13 |     await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  14 |     await expect(page.getByRole('button', { name: /reset|send|submit/i }).first()).toBeVisible();
  15 |   });
  16 | 
  17 |   test('shows validation for empty email', async ({ page }) => {
> 18 |     await page.getByRole('button', { name: /reset|send|submit/i }).first().click();
     |                                                                            ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  19 |     await page.waitForTimeout(500);
  20 | 
  21 |     // Should remain on the page or show validation
  22 |     expect(page.url()).toContain('forgot');
  23 |   });
  24 | 
  25 |   test('submits email and shows confirmation message', async ({ page }) => {
  26 |     await page.fill('input[type="email"], input[name="email"]', 'user@test.com');
  27 |     await page.getByRole('button', { name: /reset|send|submit/i }).first().click();
  28 | 
  29 |     await page.waitForTimeout(2000);
  30 |     const pageContent = await page.textContent('body');
  31 |     // Should show success message or handle the submission
  32 |     expect(
  33 |       pageContent?.toLowerCase().includes('sent') ||
  34 |       pageContent?.toLowerCase().includes('check') ||
  35 |       pageContent?.toLowerCase().includes('email') ||
  36 |       pageContent?.toLowerCase().includes('reset') ||
  37 |       pageContent?.toLowerCase().includes('error') // Could also fail gracefully
  38 |     ).toBeTruthy();
  39 |   });
  40 | 
  41 |   test('has link back to login page', async ({ page }) => {
  42 |     const loginLink = page.locator('a[href*="login"], a:has-text("login"), a:has-text("sign in"), a:has-text("back")');
  43 |     await expect(loginLink.first()).toBeVisible();
  44 |   });
  45 | });
  46 | 
```