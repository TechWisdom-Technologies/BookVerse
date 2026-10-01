# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-clubs.spec.ts >> Admin Clubs Management >> clubs list page loads
- Location: tests\e2e\admin\admin-clubs.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/admin/clubs"
Received string:    "http://localhost:3000/login?redirect=%2Fadmin%2Fclubs"
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - navigation "Bottom navigation" [ref=f1e2]:
    - generic [ref=f1e3]:
      - generic [ref=f1e4]:
        - link [ref=f1e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=f1e8]
          - generic: BookVerse
        - link [ref=f1e9] [cursor=pointer]:
          - /url: /support
        - link [ref=f1e15] [cursor=pointer]:
          - /url: /library
        - link [ref=f1e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=f1e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=f1e32] [cursor=pointer]:
          - /url: /series
        - link [ref=f1e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=f1e45] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e50]:
        - link [ref=f1e51] [cursor=pointer]:
          - /url: /search
        - link [ref=f1e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=f1e62]:
          - generic: AI Librarian
        - link "Sign In" [ref=f1e67] [cursor=pointer]:
          - /url: /login
  - main [ref=f1e72]:
    - generic [ref=f1e73]:
      - link "BookVerse Logo BookVerse" [ref=f1e75] [cursor=pointer]:
        - /url: /
        - img "BookVerse Logo" [ref=f1e76]
        - generic [ref=f1e77]: BookVerse
      - link "Back to Archives" [ref=f1e79] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e82]:
        - generic [ref=f1e83]:
          - generic [ref=f1e84]: Secure Login
          - heading "Welcome Back." [level=1] [ref=f1e87]
          - paragraph [ref=f1e88]: Sign in to access your library and continue your stories.
        - generic [ref=f1e89]:
          - generic [ref=f1e90]:
            - text: Email Address
            - textbox "you@example.com" [ref=f1e91]
          - generic [ref=f1e92]:
            - text: Password
            - textbox "At least 8 characters" [ref=f1e93]
            - link "Forgot password?" [ref=f1e95] [cursor=pointer]:
              - /url: /forgot-password?redirect=%2Fadmin%2Fclubs
          - generic [ref=f1e96]:
            - button "Sign In" [disabled] [ref=f1e97]
            - generic [ref=f1e98]: Or continue with
            - button "Google" [ref=f1e103]
        - paragraph [ref=f1e109]:
          - text: New to BookVerse?
          - link "Create Account" [ref=f1e110] [cursor=pointer]:
            - /url: /signup?redirect=%2Fadmin%2Fclubs
  - contentinfo [ref=f1e111]:
    - generic [ref=f1e112]:
      - generic [ref=f1e113]:
        - generic [ref=f1e114]:
          - link "BookVerse Logo BookVerse" [ref=f1e115] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f1e116]
            - generic [ref=f1e117]: BookVerse
          - paragraph [ref=f1e119]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f1e120]:
            - generic [ref=f1e121]:
              - generic [ref=f1e122]: 807+
              - generic [ref=f1e123]: Books
            - generic [ref=f1e124]:
              - generic [ref=f1e125]: 4+
              - generic [ref=f1e126]: Authors
            - generic [ref=f1e127]:
              - generic [ref=f1e128]: 7+
              - generic [ref=f1e129]: Readers
        - generic [ref=f1e130]:
          - heading "Newsletter" [level=3] [ref=f1e131]
          - paragraph [ref=f1e132]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f1e134]:
            - textbox "Your email" [ref=f1e135]
            - button [ref=f1e136]
      - generic [ref=f1e140]:
        - generic [ref=f1e141]:
          - heading "Discover" [level=4] [ref=f1e142]
          - list [ref=f1e143]:
            - listitem [ref=f1e144]:
              - link "Home" [ref=f1e145] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e146]:
              - link "Browse Library" [ref=f1e147] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f1e148]:
              - link "Stories" [ref=f1e149] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f1e150]:
              - link "Universes" [ref=f1e151] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f1e152]:
              - link "Series" [ref=f1e153] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f1e154]:
              - link "Search" [ref=f1e155] [cursor=pointer]:
                - /url: /search
        - generic [ref=f1e156]:
          - heading "Community" [level=4] [ref=f1e157]
          - list [ref=f1e158]:
            - listitem [ref=f1e159]:
              - link "Book Clubs" [ref=f1e160] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f1e161]:
              - link "Activity Feed" [ref=f1e162] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f1e163]:
              - link "Challenges" [ref=f1e164] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f1e165]:
              - link "My Shelf" [ref=f1e166] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f1e167]:
              - link "Offline Stories" [ref=f1e168] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f1e169]:
          - heading "For Authors" [level=4] [ref=f1e170]
          - list [ref=f1e171]:
            - listitem [ref=f1e172]:
              - link "Author Dashboard" [ref=f1e173] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f1e174]:
              - link "Write a Story" [ref=f1e175] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f1e176]:
              - link "Story Universes" [ref=f1e177] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f1e178]:
              - link "Story Series" [ref=f1e179] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f1e180]:
              - link "Analytics" [ref=f1e181] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f1e182]:
              - link "Wallet" [ref=f1e183] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f1e184]:
              - link "Newsletter & Fans" [ref=f1e185] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f1e186]:
              - link "Upload Book" [ref=f1e187] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f1e188]:
          - heading "Support & Legal" [level=4] [ref=f1e189]
          - list [ref=f1e190]:
            - listitem [ref=f1e191]:
              - link "Premium" [ref=f1e192] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f1e193]:
              - link "Gifts" [ref=f1e194] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f1e195]:
              - link "Settings" [ref=f1e196] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f1e197]:
              - link "Support Desk" [ref=f1e198] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f1e199]:
              - link "Documentation" [ref=f1e200] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f1e201]:
              - link "Privacy Policy" [ref=f1e202] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f1e203]:
              - link "Terms of Service" [ref=f1e204] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f1e205]:
              - link "Cookie Policy" [ref=f1e206] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f1e207]:
              - link "DMCA" [ref=f1e208] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f1e209]:
          - heading "Get in Touch" [level=4] [ref=f1e210]
          - list [ref=f1e211]:
            - listitem [ref=f1e212]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f1e216] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f1e217]:
              - link "bookverse@gmail.com" [ref=f1e221] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f1e222]:
              - link "+880 1799-269699" [ref=f1e225] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f1e226]:
            - heading "Follow Us" [level=4] [ref=f1e227]
            - generic [ref=f1e228]:
              - link "Facebook" [ref=f1e229] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f1e232] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f1e236] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f1e239] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f1e244] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f1e247]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f1e251]
  - button "Open Next.js Dev Tools" [ref=f1e259] [cursor=pointer]
  - alert [ref=f1e263]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Admin Clubs Management
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Admin Clubs Management', () => {
  7  |   test('clubs list page loads', async ({ adminPage }) => {
  8  |     await adminPage.goto('/admin/clubs');
  9  |     await adminPage.waitForLoadState('domcontentloaded');
> 10 |     expect(adminPage.url()).toContain('/admin/clubs');
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  11 |   });
  12 | });
  13 | 
```