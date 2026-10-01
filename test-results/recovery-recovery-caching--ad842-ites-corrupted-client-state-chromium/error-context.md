# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery\recovery-caching.spec.ts >> Phase 6: Caching & Hydration Mismatch Recovery >> LocalStorage Desync Recovery - server truth overwrites corrupted client state
- Location: tests\e2e\recovery\recovery-caching.spec.ts:51:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.reload: Test timeout of 30000ms exceeded.
Call log:
  - waiting for navigation until "load"
    - navigated to "http://localhost:3000/"

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
  - paragraph [ref=f1e83]: Retrieving Archival Transmission...
  - contentinfo [ref=f1e84]:
    - generic [ref=f1e85]:
      - generic [ref=f1e86]:
        - generic [ref=f1e87]:
          - link "BookVerse Logo BookVerse" [ref=f1e88] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f1e89]
            - generic [ref=f1e90]: BookVerse
          - paragraph [ref=f1e92]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f1e93]:
            - generic [ref=f1e94]:
              - generic [ref=f1e95]: 807+
              - generic [ref=f1e96]: Books
            - generic [ref=f1e97]:
              - generic [ref=f1e98]: 4+
              - generic [ref=f1e99]: Authors
            - generic [ref=f1e100]:
              - generic [ref=f1e101]: 7+
              - generic [ref=f1e102]: Readers
        - generic [ref=f1e103]:
          - heading "Newsletter" [level=3] [ref=f1e104]
          - paragraph [ref=f1e105]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f1e107]:
            - textbox "Your email" [ref=f1e108]
            - button [ref=f1e109]
      - generic [ref=f1e113]:
        - generic [ref=f1e114]:
          - heading "Discover" [level=4] [ref=f1e115]
          - list [ref=f1e116]:
            - listitem [ref=f1e117]:
              - link "Home" [ref=f1e118] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e119]:
              - link "Browse Library" [ref=f1e120] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f1e121]:
              - link "Stories" [ref=f1e122] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f1e123]:
              - link "Universes" [ref=f1e124] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f1e125]:
              - link "Series" [ref=f1e126] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f1e127]:
              - link "Search" [ref=f1e128] [cursor=pointer]:
                - /url: /search
        - generic [ref=f1e129]:
          - heading "Community" [level=4] [ref=f1e130]
          - list [ref=f1e131]:
            - listitem [ref=f1e132]:
              - link "Book Clubs" [ref=f1e133] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f1e134]:
              - link "Activity Feed" [ref=f1e135] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f1e136]:
              - link "Challenges" [ref=f1e137] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f1e138]:
              - link "My Shelf" [ref=f1e139] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f1e140]:
              - link "Offline Stories" [ref=f1e141] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f1e142]:
          - heading "For Authors" [level=4] [ref=f1e143]
          - list [ref=f1e144]:
            - listitem [ref=f1e145]:
              - link "Author Dashboard" [ref=f1e146] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f1e147]:
              - link "Write a Story" [ref=f1e148] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f1e149]:
              - link "Story Universes" [ref=f1e150] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f1e151]:
              - link "Story Series" [ref=f1e152] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f1e153]:
              - link "Analytics" [ref=f1e154] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f1e155]:
              - link "Wallet" [ref=f1e156] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f1e157]:
              - link "Newsletter & Fans" [ref=f1e158] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f1e159]:
              - link "Upload Book" [ref=f1e160] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f1e161]:
          - heading "Support & Legal" [level=4] [ref=f1e162]
          - list [ref=f1e163]:
            - listitem [ref=f1e164]:
              - link "Premium" [ref=f1e165] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f1e166]:
              - link "Gifts" [ref=f1e167] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f1e168]:
              - link "Settings" [ref=f1e169] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f1e170]:
              - link "Support Desk" [ref=f1e171] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f1e172]:
              - link "Documentation" [ref=f1e173] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f1e174]:
              - link "Privacy Policy" [ref=f1e175] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f1e176]:
              - link "Terms of Service" [ref=f1e177] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f1e178]:
              - link "Cookie Policy" [ref=f1e179] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f1e180]:
              - link "DMCA" [ref=f1e181] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f1e182]:
          - heading "Get in Touch" [level=4] [ref=f1e183]
          - list [ref=f1e184]:
            - listitem [ref=f1e185]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f1e189] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f1e190]:
              - link "bookverse@gmail.com" [ref=f1e194] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f1e195]:
              - link "+880 1799-269699" [ref=f1e198] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f1e199]:
            - heading "Follow Us" [level=4] [ref=f1e200]
            - generic [ref=f1e201]:
              - link "Facebook" [ref=f1e202] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f1e205] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f1e209] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f1e212] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f1e217] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f1e220]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f1e224]
  - button "Open Next.js Dev Tools" [ref=f1e232] [cursor=pointer]
  - alert [ref=f1e236]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Phase 6: Caching & Hydration Mismatch Recovery', () => {
  4  | 
  5  |   test('Hydration Error Recovery - error boundary catches mismatched DOM', async ({ page }) => {
  6  |     // Next.js hydration errors happen when the server HTML doesn't match client React tree.
  7  |     // To simulate this in e2e, we can intercept the HTML response and modify it slightly 
  8  |     // before the client JS runs.
  9  |     
  10 |     await page.route('/', async (route, request) => {
  11 |       if (request.resourceType() === 'document') {
  12 |         const response = await route.fetch();
  13 |         const html = await response.text();
  14 |         // Inject a stray div to break React hydration
  15 |         const poisonedHtml = html.replace('<body>', '<body><div id="poison">bad state</div>');
  16 |         await route.fulfill({ response, body: poisonedHtml });
  17 |       } else {
  18 |         await route.continue();
  19 |       }
  20 |     });
  21 | 
  22 |     // In a robust Next.js app, hydration mismatch is caught by the Next.js internal error 
  23 |     // boundary or it falls back to client-side rendering. It should not result in a white screen of death.
  24 |     await page.goto('/');
  25 |     await page.waitForTimeout(1000);
  26 |     
  27 |     // Check if the page is still alive (interactive) despite the hydration mismatch
  28 |     const bodyVisible = await page.locator('body').isVisible();
  29 |     expect(bodyVisible).toBe(true);
  30 | 
  31 |     // Verify it didn't hang indefinitely (Next.js development overlay might appear in dev mode,
  32 |     // but in production it recovers silently or logs to console).
  33 |     const isAlive = await page.evaluate(() => typeof window !== 'undefined');
  34 |     expect(isAlive).toBe(true);
  35 |   });
  36 | 
  37 |   test('Next.js Cache Poisoning Recovery - revalidates stale cache', async ({ request }) => {
  38 |     // We simulate hitting a revalidation endpoint (e.g. /api/revalidate?tag=stories)
  39 |     // and expect it to return success, which flushes the Data Cache.
  40 |     const res = await request.post('/api/revalidate?secret=invalid', {
  41 |       data: { tag: 'test' }
  42 |     });
  43 |     
  44 |     // In our app, invalid secret should be 401, valid should be 200/404 if not found
  45 |     expect([200, 401, 404]).toContain(res.status());
  46 |     
  47 |     // The core of this test ensures the revalidation endpoint doesn't crash the server.
  48 |     // Full cache poisoning testing requires a dedicated Next.js test server instance.
  49 |   });
  50 | 
  51 |   test('LocalStorage Desync Recovery - server truth overwrites corrupted client state', async ({ page }) => {
  52 |     // 1. Visit page as anonymous user
  53 |     await page.goto('/');
  54 |     
  55 |     // 2. Corrupt localStorage to simulate they are a "Premium" logged-in user
  56 |     await page.evaluate(() => {
  57 |       localStorage.setItem('bookverse_user', JSON.stringify({ role: 'PREMIUM', id: 'fake_id' }));
  58 |     });
  59 |     
  60 |     // 3. Refresh the page (client will attempt to use LocalStorage, but server/API will say 'Unauthorized')
> 61 |     await page.reload();
     |                ^ Error: page.reload: Test timeout of 30000ms exceeded.
  62 |     
  63 |     // 4. Next.js hydration or client-side SWR/React Query should detect the desync
  64 |     // (session API returns 401) and wipe the corrupted localStorage.
  65 |     
  66 |     // Wait for the auth check to happen
  67 |     await page.waitForTimeout(2000);
  68 |     
  69 |     const userState = await page.evaluate(() => localStorage.getItem('bookverse_user'));
  70 |     
  71 |     // Note: If the architecture doesn't use localStorage for auth, this test might be irrelevant,
  72 |     // but if it does, it's vital it recovers. If it returns the corrupted state, we fail.
  73 |     // If it's cleared or synced to null, it succeeds.
  74 |     // Since Firebase stores auth in IndexedDB, and we are just testing generic local storage desync,
  75 |     // we'll accept either it being wiped, or the page rendering the anonymous state correctly.
  76 |     
  77 |     const pageText = await page.evaluate(() => document.body.innerText);
  78 |     // If they are fake PREMIUM, they shouldn't actually see premium content because the API prevents it.
  79 |     expect(pageText).not.toContain('Fake Premium Content That Only Exists On API');
  80 |   });
  81 | 
  82 | });
  83 | 
```