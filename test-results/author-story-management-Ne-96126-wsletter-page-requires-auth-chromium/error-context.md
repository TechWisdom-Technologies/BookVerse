# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: author\story-management.spec.ts >> Newsletter Management (Author) >> newsletter page requires auth
- Location: tests\e2e\author\story-management.spec.ts:122:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/write/newsletter"
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
  26  |   test('series management page loads for author', async ({ authorPage }) => {
  27  |     await authorPage.goto('/write/series');
  28  |     await authorPage.waitForLoadState('domcontentloaded');
  29  | 
  30  |     const url = authorPage.url();
  31  |     if (url.includes('/write/series')) {
  32  |       const body = await authorPage.textContent('body');
  33  |       expect(body?.length).toBeGreaterThan(50);
  34  | 
  35  |       expect(
  36  |         body?.toLowerCase().includes('series') ||
  37  |         body?.toLowerCase().includes('create') ||
  38  |         body?.toLowerCase().includes('no series')
  39  |       ).toBeTruthy();
  40  |     }
  41  |   });
  42  | });
  43  | 
  44  | test.describe('Universe Management', () => {
  45  |   test('redirects to login when not authenticated', async ({ page }) => {
  46  |     await page.goto('/write/universes');
  47  |     await page.waitForLoadState('domcontentloaded');
  48  | 
  49  |     expect(page.url()).toContain('/login');
  50  |   });
  51  | 
  52  |   test('universe management page loads for author', async ({ authorPage }) => {
  53  |     await authorPage.goto('/write/universes');
  54  |     await authorPage.waitForLoadState('domcontentloaded');
  55  | 
  56  |     const url = authorPage.url();
  57  |     if (url.includes('/write/universes')) {
  58  |       const body = await authorPage.textContent('body');
  59  |       expect(body?.length).toBeGreaterThan(50);
  60  | 
  61  |       expect(
  62  |         body?.toLowerCase().includes('universe') ||
  63  |         body?.toLowerCase().includes('create') ||
  64  |         body?.toLowerCase().includes('world')
  65  |       ).toBeTruthy();
  66  |     }
  67  |   });
  68  | });
  69  | 
  70  | test.describe('Book Upload', () => {
  71  |   test('redirects to login when not authenticated', async ({ page }) => {
  72  |     await page.goto('/upload');
  73  |     await page.waitForLoadState('domcontentloaded');
  74  | 
  75  |     expect(page.url()).toContain('/login');
  76  |   });
  77  | 
  78  |   test('upload page loads for author', async ({ authorPage }) => {
  79  |     await authorPage.goto('/upload');
  80  |     await authorPage.waitForLoadState('domcontentloaded');
  81  | 
  82  |     const url = authorPage.url();
  83  |     if (url.includes('/upload')) {
  84  |       const body = await authorPage.textContent('body');
  85  |       expect(body?.length).toBeGreaterThan(50);
  86  | 
  87  |       expect(
  88  |         body?.toLowerCase().includes('upload') ||
  89  |         body?.toLowerCase().includes('file') ||
  90  |         body?.toLowerCase().includes('book') ||
  91  |         body?.toLowerCase().includes('pdf') ||
  92  |         body?.toLowerCase().includes('epub')
  93  |       ).toBeTruthy();
  94  |     }
  95  |   });
  96  | 
  97  |   test('upload form has file input', async ({ authorPage }) => {
  98  |     await authorPage.goto('/upload');
  99  |     await authorPage.waitForLoadState('domcontentloaded');
  100 | 
  101 |     if (authorPage.url().includes('/upload')) {
  102 |       const fileInput = authorPage.locator('input[type="file"]');
  103 |       expect(await fileInput.count()).toBeGreaterThanOrEqual(0);
  104 |     }
  105 |   });
  106 | });
  107 | 
  108 | test.describe('Book Requests', () => {
  109 |   test('book requests page loads for pro user', async ({ proPage }) => {
  110 |     await proPage.goto('/write/requests');
  111 |     await proPage.waitForLoadState('domcontentloaded');
  112 | 
  113 |     const url = proPage.url();
  114 |     if (url.includes('/write/requests')) {
  115 |       const body = await proPage.textContent('body');
  116 |       expect(body?.length).toBeGreaterThan(50);
  117 |     }
  118 |   });
  119 | });
  120 | 
  121 | test.describe('Newsletter Management (Author)', () => {
  122 |   test('newsletter page requires auth', async ({ page }) => {
  123 |     await page.goto('/write/newsletter');
  124 |     await page.waitForLoadState('domcontentloaded');
  125 | 
> 126 |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  127 |   });
  128 | 
  129 |   test('newsletter page loads for author', async ({ authorPage }) => {
  130 |     await authorPage.goto('/write/newsletter');
  131 |     await authorPage.waitForLoadState('domcontentloaded');
  132 | 
  133 |     const url = authorPage.url();
  134 |     if (url.includes('/write/newsletter')) {
  135 |       const body = await authorPage.textContent('body');
  136 |       expect(body?.length).toBeGreaterThan(50);
  137 |     }
  138 |   });
  139 | });
  140 | 
```