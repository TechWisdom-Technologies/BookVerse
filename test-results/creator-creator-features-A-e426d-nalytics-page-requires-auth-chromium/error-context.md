# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: creator\creator-features.spec.ts >> Author Analytics Page >> analytics page requires auth
- Location: tests\e2e\creator\creator-features.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/author/analytics"
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
  - contentinfo [ref=e72]:
    - generic [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - link "BookVerse Logo BookVerse" [ref=e76] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e77]
            - generic [ref=e78]: BookVerse
          - paragraph [ref=e80]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e81]:
            - generic [ref=e82]:
              - generic [ref=e83]: 10K+
              - generic [ref=e84]: Books
            - generic [ref=e85]:
              - generic [ref=e86]: 500+
              - generic [ref=e87]: Authors
            - generic [ref=e88]:
              - generic [ref=e89]: 50K+
              - generic [ref=e90]: Readers
        - generic [ref=e91]:
          - heading "Newsletter" [level=3] [ref=e92]
          - paragraph [ref=e93]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e95]:
            - textbox "Your email" [ref=e96]
            - button [ref=e97]
      - generic [ref=e101]:
        - generic [ref=e102]:
          - heading "Discover" [level=4] [ref=e103]
          - list [ref=e104]:
            - listitem [ref=e105]:
              - link "Home" [ref=e106] [cursor=pointer]:
                - /url: /
            - listitem [ref=e107]:
              - link "Browse Library" [ref=e108] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e109]:
              - link "Stories" [ref=e110] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e111]:
              - link "Universes" [ref=e112] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e113]:
              - link "Series" [ref=e114] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e115]:
              - link "Search" [ref=e116] [cursor=pointer]:
                - /url: /search
        - generic [ref=e117]:
          - heading "Community" [level=4] [ref=e118]
          - list [ref=e119]:
            - listitem [ref=e120]:
              - link "Book Clubs" [ref=e121] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e122]:
              - link "Activity Feed" [ref=e123] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e124]:
              - link "Challenges" [ref=e125] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e126]:
              - link "My Shelf" [ref=e127] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e128]:
              - link "Offline Stories" [ref=e129] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e130]:
          - heading "For Authors" [level=4] [ref=e131]
          - list [ref=e132]:
            - listitem [ref=e133]:
              - link "Author Dashboard" [ref=e134] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e135]:
              - link "Write a Story" [ref=e136] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e137]:
              - link "Story Universes" [ref=e138] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e139]:
              - link "Story Series" [ref=e140] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e141]:
              - link "Analytics" [ref=e142] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e143]:
              - link "Wallet" [ref=e144] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e145]:
              - link "Newsletter & Fans" [ref=e146] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e147]:
              - link "Upload Book" [ref=e148] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e149]:
          - heading "Support & Legal" [level=4] [ref=e150]
          - list [ref=e151]:
            - listitem [ref=e152]:
              - link "Premium" [ref=e153] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e154]:
              - link "Gifts" [ref=e155] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e156]:
              - link "Settings" [ref=e157] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e158]:
              - link "Support Desk" [ref=e159] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e160]:
              - link "Documentation" [ref=e161] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e162]:
              - link "Privacy Policy" [ref=e163] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e164]:
              - link "Terms of Service" [ref=e165] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e166]:
              - link "Cookie Policy" [ref=e167] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e168]:
              - link "DMCA" [ref=e169] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e170]:
          - heading "Get in Touch" [level=4] [ref=e171]
          - list [ref=e172]:
            - listitem [ref=e173]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e177] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e178]:
              - link "bookverse@gmail.com" [ref=e182] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e183]:
              - link "+880 1799-269699" [ref=e186] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e187]:
            - heading "Follow Us" [level=4] [ref=e188]
            - generic [ref=e189]:
              - link "Facebook" [ref=e190] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e193] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e197] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e200] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e205] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e208]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e212]
  - button "Open Next.js Dev Tools" [ref=e220] [cursor=pointer]
  - alert [ref=e224]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: CREATOR Tier Features (Analytics, Newsletter, Gifts, Promotions)
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Author Analytics Page', () => {
  7  |   test('analytics page requires auth', async ({ page }) => {
  8  |     await page.goto('/author/analytics');
  9  |     await page.waitForLoadState('domcontentloaded');
  10 | 
> 11 |     expect(page.url()).toContain('/login');
     |                        ^ Error: expect(received).toContain(expected) // indexOf
  12 |   });
  13 | 
  14 |   test('loads analytics for creator user', async ({ creatorPage }) => {
  15 |     await creatorPage.goto('/author/analytics');
  16 |     await creatorPage.waitForLoadState('domcontentloaded');
  17 | 
  18 |     const url = creatorPage.url();
  19 |     if (url.includes('/author/analytics')) {
  20 |       const body = await creatorPage.textContent('body');
  21 |       expect(body?.length).toBeGreaterThan(50);
  22 | 
  23 |       expect(
  24 |         body?.toLowerCase().includes('analytics') ||
  25 |         body?.toLowerCase().includes('views') ||
  26 |         body?.toLowerCase().includes('stat') ||
  27 |         body?.toLowerCase().includes('chart')
  28 |       ).toBeTruthy();
  29 |     }
  30 |   });
  31 | });
  32 | 
  33 | test.describe('Author Newsletter Page', () => {
  34 |   test('newsletter page requires auth', async ({ page }) => {
  35 |     await page.goto('/author/newsletter');
  36 |     await page.waitForLoadState('domcontentloaded');
  37 | 
  38 |     expect(page.url()).toContain('/login');
  39 |   });
  40 | 
  41 |   test('loads newsletter page for creator', async ({ creatorPage }) => {
  42 |     await creatorPage.goto('/author/newsletter');
  43 |     await creatorPage.waitForLoadState('domcontentloaded');
  44 | 
  45 |     const url = creatorPage.url();
  46 |     if (url.includes('/author/newsletter')) {
  47 |       const body = await creatorPage.textContent('body');
  48 |       expect(body?.length).toBeGreaterThan(50);
  49 | 
  50 |       expect(
  51 |         body?.toLowerCase().includes('newsletter') ||
  52 |         body?.toLowerCase().includes('subscriber') ||
  53 |         body?.toLowerCase().includes('compose') ||
  54 |         body?.toLowerCase().includes('send')
  55 |       ).toBeTruthy();
  56 |     }
  57 |   });
  58 | });
  59 | 
  60 | test.describe('Gifts Page', () => {
  61 |   test('gifts page requires auth', async ({ page }) => {
  62 |     await page.goto('/gifts');
  63 |     await page.waitForLoadState('domcontentloaded');
  64 | 
  65 |     expect(page.url()).toContain('/login');
  66 |   });
  67 | 
  68 |   test('loads gifts page for creator', async ({ creatorPage }) => {
  69 |     await creatorPage.goto('/gifts');
  70 |     await creatorPage.waitForLoadState('domcontentloaded');
  71 | 
  72 |     const url = creatorPage.url();
  73 |     if (url.includes('/gifts')) {
  74 |       const body = await creatorPage.textContent('body');
  75 |       expect(body?.length).toBeGreaterThan(50);
  76 | 
  77 |       expect(
  78 |         body?.toLowerCase().includes('gift') ||
  79 |         body?.toLowerCase().includes('membership') ||
  80 |         body?.toLowerCase().includes('send') ||
  81 |         body?.toLowerCase().includes('redeem')
  82 |       ).toBeTruthy();
  83 |     }
  84 |   });
  85 | });
  86 | 
  87 | test.describe('Story Promotion', () => {
  88 |   test('promoted stories page loads', async ({ page }) => {
  89 |     await page.goto('/stories/promoted');
  90 |     await page.waitForLoadState('domcontentloaded');
  91 | 
  92 |     const body = await page.textContent('body');
  93 |     expect(body?.length).toBeGreaterThan(50);
  94 |   });
  95 | });
  96 | 
```