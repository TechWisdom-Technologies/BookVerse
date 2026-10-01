# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced\multi-tab-sync.spec.ts >> Multi-Tab Sync >> logging out in one tab invalidates session in another
- Location: tests\e2e\advanced\multi-tab-sync.spec.ts:8:7

# Error details

```
Error: locator.fill: Error: strict mode violation: locator('input[type="email"], input[name="email"]') resolved to 2 elements:
    1) <input value="" type="email" autocomplete="email" placeholder="you@example.com" class="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"/> aka getByRole('textbox', { name: 'you@example.com' })
    2) <input value="" required="" type="email" placeholder="Your email" class="flex-1 px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm disabled:opacity-50"/> aka getByRole('textbox', { name: 'Your email' })

Call log:
  - waiting for locator('input[type="email"], input[name="email"]')

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
            - textbox "you@example.com" [ref=e91]
          - generic [ref=e92]:
            - text: Password
            - textbox "At least 8 characters" [ref=e93]
            - link "Forgot password?" [ref=e95] [cursor=pointer]:
              - /url: /forgot-password?redirect=%2F
          - generic [ref=e96]:
            - button "Sign In" [disabled] [ref=e97]
            - generic [ref=e98]: Or continue with
            - button "Google" [ref=e103]
        - paragraph [ref=e109]:
          - text: New to BookVerse?
          - link "Create Account" [ref=e110] [cursor=pointer]:
            - /url: /signup?redirect=%2F
  - contentinfo [ref=e111]:
    - generic [ref=e112]:
      - generic [ref=e113]:
        - generic [ref=e114]:
          - link "BookVerse Logo BookVerse" [ref=e115] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e116]
            - generic [ref=e117]: BookVerse
          - paragraph [ref=e119]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e120]:
            - generic [ref=e121]:
              - generic [ref=e122]: 807+
              - generic [ref=e123]: Books
            - generic [ref=e124]:
              - generic [ref=e125]: 4+
              - generic [ref=e126]: Authors
            - generic [ref=e127]:
              - generic [ref=e128]: 7+
              - generic [ref=e129]: Readers
        - generic [ref=e130]:
          - heading "Newsletter" [level=3] [ref=e131]
          - paragraph [ref=e132]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e134]:
            - textbox "Your email" [ref=e135]
            - button [ref=e136]
      - generic [ref=e140]:
        - generic [ref=e141]:
          - heading "Discover" [level=4] [ref=e142]
          - list [ref=e143]:
            - listitem [ref=e144]:
              - link "Home" [ref=e145] [cursor=pointer]:
                - /url: /
            - listitem [ref=e146]:
              - link "Browse Library" [ref=e147] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e148]:
              - link "Stories" [ref=e149] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e150]:
              - link "Universes" [ref=e151] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e152]:
              - link "Series" [ref=e153] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e154]:
              - link "Search" [ref=e155] [cursor=pointer]:
                - /url: /search
        - generic [ref=e156]:
          - heading "Community" [level=4] [ref=e157]
          - list [ref=e158]:
            - listitem [ref=e159]:
              - link "Book Clubs" [ref=e160] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e161]:
              - link "Activity Feed" [ref=e162] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e163]:
              - link "Challenges" [ref=e164] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e165]:
              - link "My Shelf" [ref=e166] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e167]:
              - link "Offline Stories" [ref=e168] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e169]:
          - heading "For Authors" [level=4] [ref=e170]
          - list [ref=e171]:
            - listitem [ref=e172]:
              - link "Author Dashboard" [ref=e173] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e174]:
              - link "Write a Story" [ref=e175] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e176]:
              - link "Story Universes" [ref=e177] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e178]:
              - link "Story Series" [ref=e179] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e180]:
              - link "Analytics" [ref=e181] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e182]:
              - link "Wallet" [ref=e183] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e184]:
              - link "Newsletter & Fans" [ref=e185] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e186]:
              - link "Upload Book" [ref=e187] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e188]:
          - heading "Support & Legal" [level=4] [ref=e189]
          - list [ref=e190]:
            - listitem [ref=e191]:
              - link "Premium" [ref=e192] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e193]:
              - link "Gifts" [ref=e194] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e195]:
              - link "Settings" [ref=e196] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e197]:
              - link "Support Desk" [ref=e198] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e199]:
              - link "Documentation" [ref=e200] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e201]:
              - link "Privacy Policy" [ref=e202] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e203]:
              - link "Terms of Service" [ref=e204] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e205]:
              - link "Cookie Policy" [ref=e206] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e207]:
              - link "DMCA" [ref=e208] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e209]:
          - heading "Get in Touch" [level=4] [ref=e210]
          - list [ref=e211]:
            - listitem [ref=e212]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e216] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e217]:
              - link "bookverse@gmail.com" [ref=e221] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e222]:
              - link "+880 1799-269699" [ref=e225] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e226]:
            - heading "Follow Us" [level=4] [ref=e227]
            - generic [ref=e228]:
              - link "Facebook" [ref=e229] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e232] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e236] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e239] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e244] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e247]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e251]
  - button "Open Next.js Dev Tools" [ref=e259] [cursor=pointer]
  - alert [ref=e263]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Multi-Tab Synchronization
  3  |  * Tests scenarios where a user has multiple tabs open.
  4  |  */
  5  | import { test, expect } from '../fixtures/auth.fixture';
  6  | 
  7  | test.describe('Multi-Tab Sync', () => {
  8  |   test('logging out in one tab invalidates session in another', async ({ browser }) => {
  9  |     const context = await browser.newContext();
  10 |     
  11 |     // Setup tab 1 (logged in manually to avoid fixture complexity for cross-tab)
  12 |     const tab1 = await context.newPage();
  13 |     await tab1.goto('/login');
  14 |     await tab1.waitForLoadState('domcontentloaded');
  15 |     
  16 |     const emailInput = tab1.locator('input[type="email"], input[name="email"]');
  17 |     const passwordInput = tab1.locator('input[type="password"], input[name="password"]');
  18 |     const submitBtn = tab1.locator('button[type="submit"], button:has-text("Login")');
  19 |     
  20 |     if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
  21 |       // Very basic login for test
> 22 |       await emailInput.fill('member@bookverse.com');
     |                        ^ Error: locator.fill: Error: strict mode violation: locator('input[type="email"], input[name="email"]') resolved to 2 elements:
  23 |       await passwordInput.fill('password123');
  24 |       await submitBtn.click();
  25 |       await tab1.waitForURL('**/');
  26 |       
  27 |       // Open tab 2
  28 |       const tab2 = await context.newPage();
  29 |       await tab2.goto('/');
  30 |       await tab2.waitForLoadState('domcontentloaded');
  31 |       
  32 |       // Tab 1 logs out
  33 |       await tab1.goto('/logout');
  34 |       await tab1.waitForLoadState('domcontentloaded');
  35 |       
  36 |       // Tab 2 attempts a private action (e.g. reload or go to profile)
  37 |       await tab2.goto('/profile/edit');
  38 |       await tab2.waitForLoadState('domcontentloaded');
  39 |       
  40 |       // Tab 2 should be redirected to login because cookie is gone
  41 |       expect(tab2.url()).toContain('/login');
  42 |     }
  43 |     
  44 |     await context.close();
  45 |   });
  46 | });
  47 | 
```