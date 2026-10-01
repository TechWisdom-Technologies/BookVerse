# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery\recovery-leaks.spec.ts >> Phase 20: Event Emitter & Listener Leak Recovery >> Observer Leak Recovery - IntersectionObserver safely unmounts on navigation
- Location: tests\e2e\recovery\recovery-leaks.spec.ts:40:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.goto: Test timeout of 90000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/?foo=7", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=f7e1]:
  - navigation "Bottom navigation" [ref=f7e2]:
    - generic [ref=f7e3]:
      - generic [ref=f7e4]:
        - link [ref=f7e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=f7e8]
          - generic: BookVerse
        - link [ref=f7e9] [cursor=pointer]:
          - /url: /support
        - link [ref=f7e15] [cursor=pointer]:
          - /url: /library
        - link [ref=f7e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=f7e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=f7e32] [cursor=pointer]:
          - /url: /series
        - link [ref=f7e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=f7e45] [cursor=pointer]:
        - /url: /
      - generic [ref=f7e50]:
        - link [ref=f7e51] [cursor=pointer]:
          - /url: /search
        - link [ref=f7e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=f7e62]:
          - generic: AI Librarian
  - paragraph [ref=f7e80]: Retrieving Archival Transmission...
  - contentinfo [ref=f7e81]:
    - generic [ref=f7e82]:
      - generic [ref=f7e83]:
        - generic [ref=f7e84]:
          - link "BookVerse Logo BookVerse" [ref=f7e85] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f7e86]
            - generic [ref=f7e87]: BookVerse
          - paragraph [ref=f7e89]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f7e90]:
            - generic [ref=f7e91]:
              - generic [ref=f7e92]: 10K+
              - generic [ref=f7e93]: Books
            - generic [ref=f7e94]:
              - generic [ref=f7e95]: 500+
              - generic [ref=f7e96]: Authors
            - generic [ref=f7e97]:
              - generic [ref=f7e98]: 50K+
              - generic [ref=f7e99]: Readers
        - generic [ref=f7e100]:
          - heading "Newsletter" [level=3] [ref=f7e101]
          - paragraph [ref=f7e102]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f7e104]:
            - textbox "Your email" [ref=f7e105]
            - button [ref=f7e106]
      - generic [ref=f7e110]:
        - generic [ref=f7e111]:
          - heading "Discover" [level=4] [ref=f7e112]
          - list [ref=f7e113]:
            - listitem [ref=f7e114]:
              - link "Home" [ref=f7e115] [cursor=pointer]:
                - /url: /
            - listitem [ref=f7e116]:
              - link "Browse Library" [ref=f7e117] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f7e118]:
              - link "Stories" [ref=f7e119] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f7e120]:
              - link "Universes" [ref=f7e121] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f7e122]:
              - link "Series" [ref=f7e123] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f7e124]:
              - link "Search" [ref=f7e125] [cursor=pointer]:
                - /url: /search
        - generic [ref=f7e126]:
          - heading "Community" [level=4] [ref=f7e127]
          - list [ref=f7e128]:
            - listitem [ref=f7e129]:
              - link "Book Clubs" [ref=f7e130] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f7e131]:
              - link "Activity Feed" [ref=f7e132] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f7e133]:
              - link "Challenges" [ref=f7e134] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f7e135]:
              - link "My Shelf" [ref=f7e136] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f7e137]:
              - link "Offline Stories" [ref=f7e138] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f7e139]:
          - heading "For Authors" [level=4] [ref=f7e140]
          - list [ref=f7e141]:
            - listitem [ref=f7e142]:
              - link "Author Dashboard" [ref=f7e143] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f7e144]:
              - link "Write a Story" [ref=f7e145] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f7e146]:
              - link "Story Universes" [ref=f7e147] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f7e148]:
              - link "Story Series" [ref=f7e149] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f7e150]:
              - link "Analytics" [ref=f7e151] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f7e152]:
              - link "Wallet" [ref=f7e153] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f7e154]:
              - link "Newsletter & Fans" [ref=f7e155] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f7e156]:
              - link "Upload Book" [ref=f7e157] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f7e158]:
          - heading "Support & Legal" [level=4] [ref=f7e159]
          - list [ref=f7e160]:
            - listitem [ref=f7e161]:
              - link "Premium" [ref=f7e162] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f7e163]:
              - link "Gifts" [ref=f7e164] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f7e165]:
              - link "Settings" [ref=f7e166] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f7e167]:
              - link "Support Desk" [ref=f7e168] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f7e169]:
              - link "Documentation" [ref=f7e170] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f7e171]:
              - link "Privacy Policy" [ref=f7e172] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f7e173]:
              - link "Terms of Service" [ref=f7e174] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f7e175]:
              - link "Cookie Policy" [ref=f7e176] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f7e177]:
              - link "DMCA" [ref=f7e178] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f7e179]:
          - heading "Get in Touch" [level=4] [ref=f7e180]
          - list [ref=f7e181]:
            - listitem [ref=f7e182]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f7e186] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f7e187]:
              - link "bookverse@gmail.com" [ref=f7e191] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f7e192]:
              - link "+880 1799-269699" [ref=f7e195] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f7e196]:
            - heading "Follow Us" [level=4] [ref=f7e197]
            - generic [ref=f7e198]:
              - link "Facebook" [ref=f7e199] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f7e202] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f7e206] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f7e209] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f7e214] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f7e217]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f7e221]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Phase 20: Event Emitter & Listener Leak Recovery', () => {
  4  | 
  5  |   test('Dangling Listener Recovery - UI survives extreme event spam without crashing', async ({ page }) => {
  6  |     await page.goto('/');
  7  | 
  8  |     const survivedSpam = await page.evaluate(async () => {
  9  |       // 1. Simulate an event that might accidentally leak or fire too rapidly (e.g., resize or scroll)
  10 |       let spamCount = 0;
  11 |       
  12 |       // We'll dispatch 50,000 synchronous scroll events!
  13 |       // If the app doesn't debounce or uses passive listeners incorrectly, 
  14 |       // this could completely freeze the browser or throw "Maximum call stack size exceeded".
  15 |       try {
  16 |         for (let i = 0; i < 50000; i++) {
  17 |           window.dispatchEvent(new Event('scroll'));
  18 |           spamCount++;
  19 |         }
  20 |       } catch (e) {
  21 |         return false;
  22 |       }
  23 |       
  24 |       // 2. Wait a tick to see if the event loop clears out and the app is still responsive
  25 |       return new Promise((resolve) => {
  26 |         setTimeout(() => {
  27 |           // If we got here, the event loop isn't permanently blocked
  28 |           resolve(spamCount === 50000);
  29 |         }, 100);
  30 |       });
  31 |     });
  32 | 
  33 |     expect(survivedSpam).toBe(true);
  34 |     
  35 |     // Ensure we can still interact with the page
  36 |     const bodyVisible = await page.locator('body').isVisible();
  37 |     expect(bodyVisible).toBe(true);
  38 |   });
  39 | 
  40 |   test('Observer Leak Recovery - IntersectionObserver safely unmounts on navigation', async ({ page }) => {
  41 |     // This tests if navigating back and forth creates duplicate observers.
  42 |     // In Playwright, we can simulate rapid navigation and check heap, but evaluating heap is tricky.
  43 |     // Instead, we just rapidly navigate 10 times and verify the page doesn't run out of memory.
  44 |     
  45 |     for (let i = 0; i < 10; i++) {
> 46 |       await page.goto('/?foo=' + i); // Query param forces a navigation/re-render
     |                  ^ Error: page.goto: Test timeout of 90000ms exceeded.
  47 |     }
  48 | 
  49 |     const isAlive = await page.evaluate(() => typeof window !== 'undefined');
  50 |     expect(isAlive).toBe(true);
  51 |   });
  52 | 
  53 | });
  54 | 
```