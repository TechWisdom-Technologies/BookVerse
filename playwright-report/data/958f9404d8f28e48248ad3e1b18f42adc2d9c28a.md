# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-panel.spec.ts >> Admin Users Management >> users list page loads for admin
- Location: tests\e2e\admin\admin-panel.spec.ts:44:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
  - paragraph [ref=f1e80]: Retrieving Archival Transmission...
  - contentinfo [ref=f1e81]:
    - generic [ref=f1e82]:
      - generic [ref=f1e83]:
        - generic [ref=f1e84]:
          - link "BookVerse Logo BookVerse" [ref=f1e85] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=f1e86]
            - generic [ref=f1e87]: BookVerse
          - paragraph [ref=f1e89]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=f1e90]:
            - generic [ref=f1e91]:
              - generic [ref=f1e92]: 10K+
              - generic [ref=f1e93]: Books
            - generic [ref=f1e94]:
              - generic [ref=f1e95]: 500+
              - generic [ref=f1e96]: Authors
            - generic [ref=f1e97]:
              - generic [ref=f1e98]: 50K+
              - generic [ref=f1e99]: Readers
        - generic [ref=f1e100]:
          - heading "Newsletter" [level=3] [ref=f1e101]
          - paragraph [ref=f1e102]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=f1e104]:
            - textbox "Your email" [ref=f1e105]
            - button [ref=f1e106]
      - generic [ref=f1e110]:
        - generic [ref=f1e111]:
          - heading "Discover" [level=4] [ref=f1e112]
          - list [ref=f1e113]:
            - listitem [ref=f1e114]:
              - link "Home" [ref=f1e115] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e116]:
              - link "Browse Library" [ref=f1e117] [cursor=pointer]:
                - /url: /library
            - listitem [ref=f1e118]:
              - link "Stories" [ref=f1e119] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=f1e120]:
              - link "Universes" [ref=f1e121] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=f1e122]:
              - link "Series" [ref=f1e123] [cursor=pointer]:
                - /url: /series
            - listitem [ref=f1e124]:
              - link "Search" [ref=f1e125] [cursor=pointer]:
                - /url: /search
        - generic [ref=f1e126]:
          - heading "Community" [level=4] [ref=f1e127]
          - list [ref=f1e128]:
            - listitem [ref=f1e129]:
              - link "Book Clubs" [ref=f1e130] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=f1e131]:
              - link "Activity Feed" [ref=f1e132] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=f1e133]:
              - link "Challenges" [ref=f1e134] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=f1e135]:
              - link "My Shelf" [ref=f1e136] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=f1e137]:
              - link "Offline Stories" [ref=f1e138] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=f1e139]:
          - heading "For Authors" [level=4] [ref=f1e140]
          - list [ref=f1e141]:
            - listitem [ref=f1e142]:
              - link "Author Dashboard" [ref=f1e143] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=f1e144]:
              - link "Write a Story" [ref=f1e145] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=f1e146]:
              - link "Story Universes" [ref=f1e147] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=f1e148]:
              - link "Story Series" [ref=f1e149] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=f1e150]:
              - link "Analytics" [ref=f1e151] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=f1e152]:
              - link "Wallet" [ref=f1e153] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=f1e154]:
              - link "Newsletter & Fans" [ref=f1e155] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=f1e156]:
              - link "Upload Book" [ref=f1e157] [cursor=pointer]:
                - /url: /upload
        - generic [ref=f1e158]:
          - heading "Support & Legal" [level=4] [ref=f1e159]
          - list [ref=f1e160]:
            - listitem [ref=f1e161]:
              - link "Premium" [ref=f1e162] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=f1e163]:
              - link "Gifts" [ref=f1e164] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=f1e165]:
              - link "Settings" [ref=f1e166] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=f1e167]:
              - link "Support Desk" [ref=f1e168] [cursor=pointer]:
                - /url: /support
            - listitem [ref=f1e169]:
              - link "Documentation" [ref=f1e170] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=f1e171]:
              - link "Privacy Policy" [ref=f1e172] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=f1e173]:
              - link "Terms of Service" [ref=f1e174] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=f1e175]:
              - link "Cookie Policy" [ref=f1e176] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=f1e177]:
              - link "DMCA" [ref=f1e178] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=f1e179]:
          - heading "Get in Touch" [level=4] [ref=f1e180]
          - list [ref=f1e181]:
            - listitem [ref=f1e182]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=f1e186] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=f1e187]:
              - link "bookverse@gmail.com" [ref=f1e191] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=f1e192]:
              - link "+880 1799-269699" [ref=f1e195] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=f1e196]:
            - heading "Follow Us" [level=4] [ref=f1e197]
            - generic [ref=f1e198]:
              - link "Facebook" [ref=f1e199] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=f1e202] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=f1e206] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=f1e209] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=f1e214] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=f1e217]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=f1e221]
```

# Test source

```ts
  1   | /**
  2   |  * E2E Tests: Moderation & Admin Panel
  3   |  */
  4   | import { test, expect } from '../fixtures/auth.fixture';
  5   | 
  6   | test.describe('Admin Panel Dashboard', () => {
  7   |   test('redirects non-admin users', async ({ memberPage }) => {
  8   |     await memberPage.goto('/admin');
  9   |     await memberPage.waitForLoadState('domcontentloaded');
  10  | 
  11  |     // Should redirect to home or show unauthorized
  12  |     const url = memberPage.url();
  13  |     const body = await memberPage.textContent('body');
  14  |     
  15  |     expect(
  16  |       !url.includes('/admin') ||
  17  |       body?.toLowerCase().includes('unauthorized') ||
  18  |       body?.toLowerCase().includes('access denied') ||
  19  |       body?.toLowerCase().includes('not found') ||
  20  |       body?.toLowerCase().includes('404')
  21  |     ).toBeTruthy();
  22  |   });
  23  | 
  24  |   test('loads dashboard for admin user', async ({ adminPage }) => {
  25  |     await adminPage.goto('/admin');
  26  |     await adminPage.waitForLoadState('domcontentloaded');
  27  | 
  28  |     const url = adminPage.url();
  29  |     if (url.includes('/admin')) {
  30  |       const body = await adminPage.textContent('body');
  31  |       expect(body?.length).toBeGreaterThan(50);
  32  | 
  33  |       expect(
  34  |         body?.toLowerCase().includes('admin') ||
  35  |         body?.toLowerCase().includes('dashboard') ||
  36  |         body?.toLowerCase().includes('users') ||
  37  |         body?.toLowerCase().includes('reports')
  38  |       ).toBeTruthy();
  39  |     }
  40  |   });
  41  | });
  42  | 
  43  | test.describe('Admin Users Management', () => {
  44  |   test('users list page loads for admin', async ({ adminPage }) => {
  45  |     await adminPage.goto('/admin/users');
  46  |     await adminPage.waitForLoadState('domcontentloaded');
  47  | 
  48  |     const url = adminPage.url();
  49  |     if (url.includes('/admin/users')) {
  50  |       const body = await adminPage.textContent('body');
  51  |       expect(body?.length).toBeGreaterThan(50);
  52  |       
  53  |       expect(
  54  |         body?.toLowerCase().includes('user') ||
  55  |         body?.toLowerCase().includes('role') ||
  56  |         body?.toLowerCase().includes('status')
> 57  |       ).toBeTruthy();
      |         ^ Error: expect(received).toBeTruthy()
  58  |     }
  59  |   });
  60  | 
  61  |   test('users list has search and filter controls', async ({ adminPage }) => {
  62  |     await adminPage.goto('/admin/users');
  63  |     await adminPage.waitForLoadState('domcontentloaded');
  64  | 
  65  |     if (adminPage.url().includes('/admin/users')) {
  66  |       const controls = adminPage.locator(
  67  |         'input[type="search"], input[placeholder*="search" i], select'
  68  |       );
  69  |       expect(await controls.count()).toBeGreaterThanOrEqual(0);
  70  |     }
  71  |   });
  72  | });
  73  | 
  74  | test.describe('Admin Content Moderation', () => {
  75  |   test('reports page loads for admin', async ({ adminPage }) => {
  76  |     await adminPage.goto('/admin/reports');
  77  |     await adminPage.waitForLoadState('domcontentloaded');
  78  | 
  79  |     const url = adminPage.url();
  80  |     if (url.includes('/admin/reports')) {
  81  |       const body = await adminPage.textContent('body');
  82  |       expect(body?.length).toBeGreaterThan(50);
  83  |       
  84  |       expect(
  85  |         body?.toLowerCase().includes('report') ||
  86  |         body?.toLowerCase().includes('content') ||
  87  |         body?.toLowerCase().includes('action')
  88  |       ).toBeTruthy();
  89  |     }
  90  |   });
  91  | });
  92  | 
  93  | test.describe('Admin System Logs', () => {
  94  |   test('logs page loads for admin', async ({ adminPage }) => {
  95  |     await adminPage.goto('/admin/logs');
  96  |     await adminPage.waitForLoadState('domcontentloaded');
  97  | 
  98  |     const url = adminPage.url();
  99  |     if (url.includes('/admin/logs')) {
  100 |       const body = await adminPage.textContent('body');
  101 |       expect(body?.length).toBeGreaterThan(50);
  102 |     }
  103 |   });
  104 | });
  105 | 
```