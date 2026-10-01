# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflows\admin-moderation.spec.ts >> Workflow: Admin Moderation >> admin can manage platform content and users
- Location: tests\e2e\workflows\admin-moderation.spec.ts:8:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/admin/reports"
Received string:    "http://localhost:3000/login?redirect=%2Fadmin%2Freports"
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - navigation "Bottom navigation" [ref=f2e2]:
    - generic [ref=f2e3]:
      - generic [ref=f2e4]:
        - link [ref=f2e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=f2e8]
          - generic: BookVerse
        - link [ref=f2e9] [cursor=pointer]:
          - /url: /support
        - link [ref=f2e15] [cursor=pointer]:
          - /url: /library
        - link [ref=f2e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=f2e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=f2e32] [cursor=pointer]:
          - /url: /series
        - link [ref=f2e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=f2e45] [cursor=pointer]:
        - /url: /
      - generic [ref=f2e50]:
        - link [ref=f2e51] [cursor=pointer]:
          - /url: /search
        - link [ref=f2e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=f2e62]:
          - generic: AI Librarian
        - link "Sign In" [ref=f2e67] [cursor=pointer]:
          - /url: /login
  - main [ref=f2e72]:
    - generic [ref=f2e73]:
      - link "BookVerse Logo BookVerse" [ref=f2e75] [cursor=pointer]:
        - /url: /
        - img "BookVerse Logo" [ref=f2e76]
        - generic [ref=f2e77]: BookVerse
      - link "Back to Archives" [ref=f2e79] [cursor=pointer]:
        - /url: /
      - generic [ref=f2e82]:
        - generic [ref=f2e83]:
          - generic [ref=f2e84]: Secure Login
          - heading "Welcome Back." [level=1] [ref=f2e87]
          - paragraph [ref=f2e88]: Sign in to access your library and continue your stories.
        - generic [ref=f2e89]:
          - generic [ref=f2e90]:
            - text: Email Address
            - textbox "you@example.com" [ref=f2e91]
          - generic [ref=f2e92]:
            - text: Password
            - textbox "At least 8 characters" [ref=f2e93]
            - link "Forgot password?" [ref=f2e95] [cursor=pointer]:
              - /url: /forgot-password?redirect=%2Fadmin%2Freports
          - generic [ref=f2e96]:
            - button "Sign In" [disabled] [ref=f2e97]
            - generic [ref=f2e98]: Or continue with
            - button "Google" [ref=f2e103]
        - paragraph [ref=f2e109]:
          - text: New to BookVerse?
          - link "Create Account" [ref=f2e110] [cursor=pointer]:
            - /url: /signup?redirect=%2Fadmin%2Freports
  - contentinfo [ref=f2e111]:
    - generic [ref=f2e112]:
      - generic [ref=f2e113]:
        - generic [ref=f2e114]:
          - link "BookVerse Logo BookVerse" [ref=f2e115] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f2e116]
            - generic [ref=f2e117]: BookVerse
          - paragraph [ref=f2e119]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f2e120]:
            - generic [ref=f2e121]:
              - generic [ref=f2e122]: 807+
              - generic [ref=f2e123]: Books
            - generic [ref=f2e124]:
              - generic [ref=f2e125]: 4+
              - generic [ref=f2e126]: Authors
            - generic [ref=f2e127]:
              - generic [ref=f2e128]: 7+
              - generic [ref=f2e129]: Readers
        - generic [ref=f2e130]:
          - heading "Newsletter" [level=3] [ref=f2e131]
          - paragraph [ref=f2e132]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f2e134]:
            - textbox "Your email" [ref=f2e135]
            - button [ref=f2e136]
      - generic [ref=f2e140]:
        - generic [ref=f2e141]:
          - heading "Discover" [level=4] [ref=f2e142]
          - list [ref=f2e143]:
            - listitem [ref=f2e144]:
              - link "Home" [ref=f2e145] [cursor=pointer]:
                - /url: /
            - listitem [ref=f2e146]:
              - link "Browse Library" [ref=f2e147] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f2e148]:
              - link "Stories" [ref=f2e149] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f2e150]:
              - link "Universes" [ref=f2e151] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f2e152]:
              - link "Series" [ref=f2e153] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f2e154]:
              - link "Search" [ref=f2e155] [cursor=pointer]:
                - /url: /search
        - generic [ref=f2e156]:
          - heading "Community" [level=4] [ref=f2e157]
          - list [ref=f2e158]:
            - listitem [ref=f2e159]:
              - link "Book Clubs" [ref=f2e160] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f2e161]:
              - link "Activity Feed" [ref=f2e162] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f2e163]:
              - link "Challenges" [ref=f2e164] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f2e165]:
              - link "My Shelf" [ref=f2e166] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f2e167]:
              - link "Offline Stories" [ref=f2e168] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f2e169]:
          - heading "For Authors" [level=4] [ref=f2e170]
          - list [ref=f2e171]:
            - listitem [ref=f2e172]:
              - link "Author Dashboard" [ref=f2e173] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f2e174]:
              - link "Write a Story" [ref=f2e175] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f2e176]:
              - link "Story Universes" [ref=f2e177] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f2e178]:
              - link "Story Series" [ref=f2e179] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f2e180]:
              - link "Analytics" [ref=f2e181] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f2e182]:
              - link "Wallet" [ref=f2e183] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f2e184]:
              - link "Newsletter & Fans" [ref=f2e185] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f2e186]:
              - link "Upload Book" [ref=f2e187] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f2e188]:
          - heading "Support & Legal" [level=4] [ref=f2e189]
          - list [ref=f2e190]:
            - listitem [ref=f2e191]:
              - link "Premium" [ref=f2e192] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f2e193]:
              - link "Gifts" [ref=f2e194] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f2e195]:
              - link "Settings" [ref=f2e196] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f2e197]:
              - link "Support Desk" [ref=f2e198] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f2e199]:
              - link "Documentation" [ref=f2e200] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f2e201]:
              - link "Privacy Policy" [ref=f2e202] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f2e203]:
              - link "Terms of Service" [ref=f2e204] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f2e205]:
              - link "Cookie Policy" [ref=f2e206] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f2e207]:
              - link "DMCA" [ref=f2e208] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f2e209]:
          - heading "Get in Touch" [level=4] [ref=f2e210]
          - list [ref=f2e211]:
            - listitem [ref=f2e212]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f2e216] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f2e217]:
              - link "bookverse@gmail.com" [ref=f2e221] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f2e222]:
              - link "+880 1799-269699" [ref=f2e225] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f2e226]:
            - heading "Follow Us" [level=4] [ref=f2e227]
            - generic [ref=f2e228]:
              - link "Facebook" [ref=f2e229] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f2e232] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f2e236] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f2e239] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f2e244] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f2e247]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f2e251]
  - button "Open Next.js Dev Tools" [ref=f2e259] [cursor=pointer]
  - alert [ref=f2e263]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Workflow: Admin Moderation
  3  |  * Scenario: Admin checks reports, reviews a user, and views system logs.
  4  |  */
  5  | import { test, expect } from '../fixtures/auth.fixture';
  6  | 
  7  | test.describe('Workflow: Admin Moderation', () => {
  8  |   test('admin can manage platform content and users', async ({ adminPage }) => {
  9  |     // 1. Visit admin dashboard
  10 |     await adminPage.goto('/admin');
  11 |     await adminPage.waitForLoadState('domcontentloaded');
  12 |     
  13 |     // 2. Check Reports
  14 |     await adminPage.goto('/admin/reports');
  15 |     await adminPage.waitForLoadState('domcontentloaded');
> 16 |     expect(adminPage.url()).toContain('/admin/reports');
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  17 |     
  18 |     // 3. Manage Users
  19 |     await adminPage.goto('/admin/users');
  20 |     await adminPage.waitForLoadState('domcontentloaded');
  21 |     
  22 |     // Look for search input to find a specific user
  23 |     const searchInput = adminPage.locator('input[type="search"], input[placeholder*="search" i]').first();
  24 |     if (await searchInput.count() > 0) {
  25 |       await searchInput.fill('spammer');
  26 |       await searchInput.press('Enter');
  27 |     }
  28 |     
  29 |     // 4. View System Monitoring
  30 |     await adminPage.goto('/admin/monitoring');
  31 |     await adminPage.waitForLoadState('domcontentloaded');
  32 |     expect(adminPage.url()).toContain('/admin/monitoring');
  33 |   });
  34 | });
  35 | 
```