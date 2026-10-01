# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\profile-edit.spec.ts >> Profile Edit Page >> redirects to login when not authenticated
- Location: tests\e2e\user\profile-edit.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/profile/edit"
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
  - contentinfo [ref=f1e68]:
    - generic [ref=f1e69]:
      - generic [ref=f1e70]:
        - generic [ref=f1e71]:
          - link "BookVerse Logo BookVerse" [ref=f1e72] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f1e73]
            - generic [ref=f1e74]: BookVerse
          - paragraph [ref=f1e76]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f1e77]:
            - generic [ref=f1e78]:
              - generic [ref=f1e79]: 10K+
              - generic [ref=f1e80]: Books
            - generic [ref=f1e81]:
              - generic [ref=f1e82]: 500+
              - generic [ref=f1e83]: Authors
            - generic [ref=f1e84]:
              - generic [ref=f1e85]: 50K+
              - generic [ref=f1e86]: Readers
        - generic [ref=f1e87]:
          - heading "Newsletter" [level=3] [ref=f1e88]
          - paragraph [ref=f1e89]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f1e91]:
            - textbox "Your email" [ref=f1e92]
            - button [ref=f1e93]
      - generic [ref=f1e97]:
        - generic [ref=f1e98]:
          - heading "Discover" [level=4] [ref=f1e99]
          - list [ref=f1e100]:
            - listitem [ref=f1e101]:
              - link "Home" [ref=f1e102] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e103]:
              - link "Browse Library" [ref=f1e104] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f1e105]:
              - link "Stories" [ref=f1e106] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f1e107]:
              - link "Universes" [ref=f1e108] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f1e109]:
              - link "Series" [ref=f1e110] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f1e111]:
              - link "Search" [ref=f1e112] [cursor=pointer]:
                - /url: /search
        - generic [ref=f1e113]:
          - heading "Community" [level=4] [ref=f1e114]
          - list [ref=f1e115]:
            - listitem [ref=f1e116]:
              - link "Book Clubs" [ref=f1e117] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f1e118]:
              - link "Activity Feed" [ref=f1e119] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f1e120]:
              - link "Challenges" [ref=f1e121] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f1e122]:
              - link "My Shelf" [ref=f1e123] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f1e124]:
              - link "Offline Stories" [ref=f1e125] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f1e126]:
          - heading "For Authors" [level=4] [ref=f1e127]
          - list [ref=f1e128]:
            - listitem [ref=f1e129]:
              - link "Author Dashboard" [ref=f1e130] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f1e131]:
              - link "Write a Story" [ref=f1e132] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f1e133]:
              - link "Story Universes" [ref=f1e134] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f1e135]:
              - link "Story Series" [ref=f1e136] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f1e137]:
              - link "Analytics" [ref=f1e138] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f1e139]:
              - link "Wallet" [ref=f1e140] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f1e141]:
              - link "Newsletter & Fans" [ref=f1e142] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f1e143]:
              - link "Upload Book" [ref=f1e144] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f1e145]:
          - heading "Support & Legal" [level=4] [ref=f1e146]
          - list [ref=f1e147]:
            - listitem [ref=f1e148]:
              - link "Premium" [ref=f1e149] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f1e150]:
              - link "Gifts" [ref=f1e151] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f1e152]:
              - link "Settings" [ref=f1e153] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f1e154]:
              - link "Support Desk" [ref=f1e155] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f1e156]:
              - link "Documentation" [ref=f1e157] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f1e158]:
              - link "Privacy Policy" [ref=f1e159] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f1e160]:
              - link "Terms of Service" [ref=f1e161] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f1e162]:
              - link "Cookie Policy" [ref=f1e163] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f1e164]:
              - link "DMCA" [ref=f1e165] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f1e166]:
          - heading "Get in Touch" [level=4] [ref=f1e167]
          - list [ref=f1e168]:
            - listitem [ref=f1e169]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f1e173] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f1e174]:
              - link "bookverse@gmail.com" [ref=f1e178] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f1e179]:
              - link "+880 1799-269699" [ref=f1e182] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f1e183]:
            - heading "Follow Us" [level=4] [ref=f1e184]
            - generic [ref=f1e185]:
              - link "Facebook" [ref=f1e186] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f1e189] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f1e193] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f1e196] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f1e201] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f1e204]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f1e208]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Profile Edit Page
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Profile Edit Page', () => {
  7  |   test('redirects to login when not authenticated', async ({ page }) => {
  8  |     await page.goto('/profile/edit');
  9  |     await page.waitForLoadState('domcontentloaded');
  10 | 
> 11 |     expect(page.url()).toContain('/login');
     |                        ^ Error: expect(received).toContain(expected) // indexOf
  12 |   });
  13 | 
  14 |   test('loads profile edit form for authenticated user', async ({ memberPage }) => {
  15 |     await memberPage.goto('/profile/edit');
  16 |     await memberPage.waitForLoadState('domcontentloaded');
  17 | 
  18 |     const url = memberPage.url();
  19 |     // Either we see the edit form or we're redirected to login
  20 |     if (url.includes('/profile/edit')) {
  21 |       const body = await memberPage.textContent('body');
  22 |       expect(body?.length).toBeGreaterThan(100);
  23 | 
  24 |       // Should have form fields
  25 |       const inputs = memberPage.locator('input, textarea, select');
  26 |       expect(await inputs.count()).toBeGreaterThan(0);
  27 |     }
  28 |   });
  29 | 
  30 |   test('displays profile form fields', async ({ memberPage }) => {
  31 |     await memberPage.goto('/profile/edit');
  32 |     await memberPage.waitForLoadState('domcontentloaded');
  33 | 
  34 |     if (memberPage.url().includes('/profile/edit')) {
  35 |       const pageContent = await memberPage.textContent('body');
  36 |       expect(
  37 |         pageContent?.toLowerCase().includes('name') ||
  38 |         pageContent?.toLowerCase().includes('bio') ||
  39 |         pageContent?.toLowerCase().includes('avatar') ||
  40 |         pageContent?.toLowerCase().includes('profile')
  41 |       ).toBeTruthy();
  42 |     }
  43 |   });
  44 | });
  45 | 
```