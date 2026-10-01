# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compatibility-functional.spec.ts >> Core Functional, A11y, and Input Compatibility >> Memory Leak Simulation (Repeated Navigation)
- Location: tests\e2e\compatibility-functional.spec.ts:32:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.goto: Test timeout of 90000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=f30e1]:
  - navigation "Bottom navigation" [ref=f30e2]:
    - generic [ref=f30e3]:
      - generic [ref=f30e4]:
        - link [ref=f30e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=f30e8]
          - generic: BookVerse
        - link [ref=f30e9] [cursor=pointer]:
          - /url: /support
        - link [ref=f30e15] [cursor=pointer]:
          - /url: /library
        - link [ref=f30e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=f30e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=f30e32] [cursor=pointer]:
          - /url: /series
        - link [ref=f30e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=f30e45] [cursor=pointer]:
        - /url: /
      - generic [ref=f30e50]:
        - link [ref=f30e51] [cursor=pointer]:
          - /url: /search
        - link [ref=f30e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=f30e62]:
          - generic: AI Librarian
        - link "Sign In" [ref=f30e67] [cursor=pointer]:
          - /url: /login
  - paragraph [ref=f30e83]: Retrieving Archival Transmission...
  - contentinfo [ref=f30e84]:
    - generic [ref=f30e85]:
      - generic [ref=f30e86]:
        - generic [ref=f30e87]:
          - link "BookVerse Logo BookVerse" [ref=f30e88] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f30e89]
            - generic [ref=f30e90]: BookVerse
          - paragraph [ref=f30e92]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f30e93]:
            - generic [ref=f30e94]:
              - generic [ref=f30e95]: 807+
              - generic [ref=f30e96]: Books
            - generic [ref=f30e97]:
              - generic [ref=f30e98]: 4+
              - generic [ref=f30e99]: Authors
            - generic [ref=f30e100]:
              - generic [ref=f30e101]: 7+
              - generic [ref=f30e102]: Readers
        - generic [ref=f30e103]:
          - heading "Newsletter" [level=3] [ref=f30e104]
          - paragraph [ref=f30e105]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f30e107]:
            - textbox "Your email" [ref=f30e108]
            - button [ref=f30e109]
      - generic [ref=f30e113]:
        - generic [ref=f30e114]:
          - heading "Discover" [level=4] [ref=f30e115]
          - list [ref=f30e116]:
            - listitem [ref=f30e117]:
              - link "Home" [ref=f30e118] [cursor=pointer]:
                - /url: /
            - listitem [ref=f30e119]:
              - link "Browse Library" [ref=f30e120] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f30e121]:
              - link "Stories" [ref=f30e122] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f30e123]:
              - link "Universes" [ref=f30e124] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f30e125]:
              - link "Series" [ref=f30e126] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f30e127]:
              - link "Search" [ref=f30e128] [cursor=pointer]:
                - /url: /search
        - generic [ref=f30e129]:
          - heading "Community" [level=4] [ref=f30e130]
          - list [ref=f30e131]:
            - listitem [ref=f30e132]:
              - link "Book Clubs" [ref=f30e133] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f30e134]:
              - link "Activity Feed" [ref=f30e135] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f30e136]:
              - link "Challenges" [ref=f30e137] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f30e138]:
              - link "My Shelf" [ref=f30e139] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f30e140]:
              - link "Offline Stories" [ref=f30e141] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f30e142]:
          - heading "For Authors" [level=4] [ref=f30e143]
          - list [ref=f30e144]:
            - listitem [ref=f30e145]:
              - link "Author Dashboard" [ref=f30e146] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f30e147]:
              - link "Write a Story" [ref=f30e148] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f30e149]:
              - link "Story Universes" [ref=f30e150] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f30e151]:
              - link "Story Series" [ref=f30e152] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f30e153]:
              - link "Analytics" [ref=f30e154] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f30e155]:
              - link "Wallet" [ref=f30e156] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f30e157]:
              - link "Newsletter & Fans" [ref=f30e158] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f30e159]:
              - link "Upload Book" [ref=f30e160] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f30e161]:
          - heading "Support & Legal" [level=4] [ref=f30e162]
          - list [ref=f30e163]:
            - listitem [ref=f30e164]:
              - link "Premium" [ref=f30e165] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f30e166]:
              - link "Gifts" [ref=f30e167] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f30e168]:
              - link "Settings" [ref=f30e169] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f30e170]:
              - link "Support Desk" [ref=f30e171] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f30e172]:
              - link "Documentation" [ref=f30e173] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f30e174]:
              - link "Privacy Policy" [ref=f30e175] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f30e176]:
              - link "Terms of Service" [ref=f30e177] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f30e178]:
              - link "Cookie Policy" [ref=f30e179] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f30e180]:
              - link "DMCA" [ref=f30e181] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f30e182]:
          - heading "Get in Touch" [level=4] [ref=f30e183]
          - list [ref=f30e184]:
            - listitem [ref=f30e185]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f30e189] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f30e190]:
              - link "bookverse@gmail.com" [ref=f30e194] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f30e195]:
              - link "+880 1799-269699" [ref=f30e198] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f30e199]:
            - heading "Follow Us" [level=4] [ref=f30e200]
            - generic [ref=f30e201]:
              - link "Facebook" [ref=f30e202] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f30e205] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f30e209] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f30e212] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f30e217] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f30e220]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f30e224]
  - button "Open Next.js Dev Tools" [ref=f30e232] [cursor=pointer]
  - alert [ref=f30e236]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Core Functional, A11y, and Input Compatibility', () => {
  4   |   
  5   |   test('Keyboard Navigation (Tab, Enter)', async ({ page }) => {
  6   |     await page.goto('/');
  7   |     
  8   |     // Press Tab multiple times to ensure focus moves
  9   |     await page.keyboard.press('Tab');
  10  |     await page.keyboard.press('Tab');
  11  |     
  12  |     // Check if an element is focused
  13  |     const focusedElement = await page.evaluate(() => {
  14  |       return document.activeElement ? document.activeElement.tagName : null;
  15  |     });
  16  |     
  17  |     expect(focusedElement).not.toBeNull();
  18  |     // Assuming the app has focus rings or outlines on active elements
  19  |   });
  20  |   
  21  |   test('Reduced Motion OS Preference', async ({ page }) => {
  22  |     // Emulate reduced motion
  23  |     await page.emulateMedia({ reducedMotion: 'reduce' });
  24  |     await page.goto('/');
  25  |     
  26  |     // Verify a CSS animation is not running, or just verify the page loads safely
  27  |     // without crashing.
  28  |     const body = page.locator('body');
  29  |     await expect(body).toBeVisible();
  30  |   });
  31  |   
  32  |   test('Memory Leak Simulation (Repeated Navigation)', async ({ page }) => {
  33  |     // Navigate multiple times to simulate long sessions
  34  |     await page.goto('/');
  35  |     for (let i = 0; i < 5; i++) {
  36  |       await page.goto('/login');
> 37  |       await page.goto('/');
      |                  ^ Error: page.goto: Test timeout of 90000ms exceeded.
  38  |     }
  39  |     
  40  |     // Page should still be responsive
  41  |     const body = page.locator('body');
  42  |     await expect(body).toBeVisible();
  43  |   });
  44  | 
  45  |   test('Foldable Device Viewport Simulation', async ({ page }) => {
  46  |     // Simulate a foldable by passing specific viewport segments
  47  |     // Playwright doesn't natively expose CSS viewport segments API yet,
  48  |     // so we just test an unusual aspect ratio like Galaxy Fold (e.g., 844x844 or similar)
  49  |     await page.setViewportSize({ width: 884, height: 1104 });
  50  |     await page.goto('/');
  51  |     
  52  |     // Check for massive horizontal overflow
  53  |     const hasHorizontalOverflow = await page.evaluate(() => {
  54  |       return document.documentElement.scrollWidth > window.innerWidth;
  55  |     });
  56  |     expect(hasHorizontalOverflow).toBeFalsy();
  57  |   });
  58  | 
  59  |   test('Hostile Permissions (Clipboard & Notifications)', async ({ page, context }) => {
  60  |     // Aggressively deny all permissions
  61  |     await context.grantPermissions([], { origin: 'http://localhost:3000' });
  62  |     await page.goto('/');
  63  |     
  64  |     // Just verify the app loads. In a real scenario, we would click "Share" and expect it to fail gracefully
  65  |     const body = page.locator('body');
  66  |     await expect(body).toBeVisible();
  67  |   });
  68  | 
  69  |   test('Virtual Keyboard Overlap Simulation', async ({ page }) => {
  70  |     await page.goto('/');
  71  |     // Simulate keyboard opening by shrinking viewport height
  72  |     const viewport = page.viewportSize();
  73  |     if (viewport) {
  74  |       await page.setViewportSize({ width: viewport.width, height: viewport.height / 2 });
  75  |     }
  76  |     
  77  |     const body = page.locator('body');
  78  |     await expect(body).toBeVisible();
  79  |   });
  80  | 
  81  |   test('Iframe Embed & CSP Compatibility Simulation', async ({ page }) => {
  82  |     // Navigate to a blank page and inject an iframe pointing to our app
  83  |     await page.setContent(`
  84  |       <html>
  85  |         <body>
  86  |           <iframe id="test-iframe" src="http://localhost:3000/" sandbox="allow-scripts allow-same-origin"></iframe>
  87  |         </body>
  88  |       </html>
  89  |     `);
  90  |     
  91  |     // Wait for iframe to load
  92  |     const frameElement = page.locator('#test-iframe');
  93  |     await expect(frameElement).toBeVisible();
  94  |     
  95  |     // Verify the contents of the iframe don't completely crash (assuming it's allowed to frame itself or X-Frame-Options is SAMEORIGIN)
  96  |     // If blocked by CSP, we just verify the host page remains stable
  97  |     expect(true).toBeTruthy();
  98  |   });
  99  | });
  100 | 
```