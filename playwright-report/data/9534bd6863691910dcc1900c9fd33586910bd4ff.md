# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payments\payments.spec.ts >> Billing Management >> billing page redirects to login when not authenticated
- Location: tests\e2e\payments\payments.spec.ts:48:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/billing"
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
      - generic [ref=e74]:
        - link "BookVerse Logo BookVerse" [ref=e75] [cursor=pointer]:
          - /url: /
          - img "BookVerse Logo" [ref=e76]
          - generic [ref=e77]: BookVerse
        - generic [ref=e79]: Page Not Found
        - heading "404." [level=1] [ref=e82]
        - paragraph [ref=e83]: The page you're looking for doesn't exist or has been moved.
      - generic [ref=e84]:
        - generic [ref=e85]: "404"
        - generic [ref=e86]: Not Found
      - generic [ref=e87]:
        - link "Go Home" [ref=e88] [cursor=pointer]:
          - /url: /
        - button "Go Back" [ref=e92]
      - generic [ref=e95]:
        - paragraph [ref=e96]: Looking for something?
        - link "Search BookVerse" [ref=e97] [cursor=pointer]:
          - /url: /search
  - contentinfo [ref=e101]:
    - generic [ref=e102]:
      - generic [ref=e103]:
        - generic [ref=e104]:
          - link "BookVerse Logo BookVerse" [ref=e105] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e106]
            - generic [ref=e107]: BookVerse
          - paragraph [ref=e109]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]: 10K+
              - generic [ref=e113]: Books
            - generic [ref=e114]:
              - generic [ref=e115]: 500+
              - generic [ref=e116]: Authors
            - generic [ref=e117]:
              - generic [ref=e118]: 50K+
              - generic [ref=e119]: Readers
        - generic [ref=e120]:
          - heading "Newsletter" [level=3] [ref=e121]
          - paragraph [ref=e122]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e124]:
            - textbox "Your email" [ref=e125]
            - button [ref=e126]
      - generic [ref=e130]:
        - generic [ref=e131]:
          - heading "Discover" [level=4] [ref=e132]
          - list [ref=e133]:
            - listitem [ref=e134]:
              - link "Home" [ref=e135] [cursor=pointer]:
                - /url: /
            - listitem [ref=e136]:
              - link "Browse Library" [ref=e137] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e138]:
              - link "Stories" [ref=e139] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e140]:
              - link "Universes" [ref=e141] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e142]:
              - link "Series" [ref=e143] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e144]:
              - link "Search" [ref=e145] [cursor=pointer]:
                - /url: /search
        - generic [ref=e146]:
          - heading "Community" [level=4] [ref=e147]
          - list [ref=e148]:
            - listitem [ref=e149]:
              - link "Book Clubs" [ref=e150] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e151]:
              - link "Activity Feed" [ref=e152] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e153]:
              - link "Challenges" [ref=e154] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e155]:
              - link "My Shelf" [ref=e156] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e157]:
              - link "Offline Stories" [ref=e158] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e159]:
          - heading "For Authors" [level=4] [ref=e160]
          - list [ref=e161]:
            - listitem [ref=e162]:
              - link "Author Dashboard" [ref=e163] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e164]:
              - link "Write a Story" [ref=e165] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e166]:
              - link "Story Universes" [ref=e167] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e168]:
              - link "Story Series" [ref=e169] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e170]:
              - link "Analytics" [ref=e171] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e172]:
              - link "Wallet" [ref=e173] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e174]:
              - link "Newsletter & Fans" [ref=e175] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e176]:
              - link "Upload Book" [ref=e177] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e178]:
          - heading "Support & Legal" [level=4] [ref=e179]
          - list [ref=e180]:
            - listitem [ref=e181]:
              - link "Premium" [ref=e182] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e183]:
              - link "Gifts" [ref=e184] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e185]:
              - link "Settings" [ref=e186] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e187]:
              - link "Support Desk" [ref=e188] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e189]:
              - link "Documentation" [ref=e190] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e191]:
              - link "Privacy Policy" [ref=e192] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e193]:
              - link "Terms of Service" [ref=e194] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e195]:
              - link "Cookie Policy" [ref=e196] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e197]:
              - link "DMCA" [ref=e198] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e199]:
          - heading "Get in Touch" [level=4] [ref=e200]
          - list [ref=e201]:
            - listitem [ref=e202]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e206] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e207]:
              - link "bookverse@gmail.com" [ref=e211] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e212]:
              - link "+880 1799-269699" [ref=e215] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e216]:
            - heading "Follow Us" [level=4] [ref=e217]
            - generic [ref=e218]:
              - link "Facebook" [ref=e219] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e222] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e226] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e229] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e234] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e237]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e241]
  - button "Open Next.js Dev Tools" [ref=e249] [cursor=pointer]
  - alert [ref=e253]
```

# Test source

```ts
  1   | /**
  2   |  * E2E Tests: Payments & Monetization (Checkout, Billing, Coin Purchases)
  3   |  */
  4   | import { test, expect } from '../fixtures/auth.fixture';
  5   | 
  6   | test.describe('Premium Checkout Flow', () => {
  7   |   test('redirects to login when not authenticated', async ({ page }) => {
  8   |     await page.goto('/premium/checkout');
  9   |     await page.waitForLoadState('domcontentloaded');
  10  | 
  11  |     expect(page.url()).toContain('/login');
  12  |   });
  13  | 
  14  |   test('checkout page loads for member', async ({ memberPage }) => {
  15  |     await memberPage.goto('/premium/checkout?plan=PRO');
  16  |     await memberPage.waitForLoadState('domcontentloaded');
  17  | 
  18  |     const url = memberPage.url();
  19  |     if (url.includes('/premium/checkout')) {
  20  |       const body = await memberPage.textContent('body');
  21  |       expect(body?.length).toBeGreaterThan(50);
  22  | 
  23  |       expect(
  24  |         body?.toLowerCase().includes('checkout') ||
  25  |         body?.toLowerCase().includes('payment') ||
  26  |         body?.toLowerCase().includes('card') ||
  27  |         body?.toLowerCase().includes('subscribe') ||
  28  |         body?.toLowerCase().includes('plan')
  29  |       ).toBeTruthy();
  30  |     }
  31  |   });
  32  | 
  33  |   test('checkout page shows payment form elements', async ({ memberPage }) => {
  34  |     await memberPage.goto('/premium/checkout?plan=PRO');
  35  |     await memberPage.waitForLoadState('domcontentloaded');
  36  | 
  37  |     if (memberPage.url().includes('/premium/checkout')) {
  38  |       // Look for typical Stripe or payment elements
  39  |       const paymentElements = memberPage.locator(
  40  |         '[class*="stripe"], [class*="payment"], iframe, input[name*="card" i], button:has-text("Pay"), button:has-text("Subscribe")'
  41  |       );
  42  |       expect(await paymentElements.count()).toBeGreaterThanOrEqual(0);
  43  |     }
  44  |   });
  45  | });
  46  | 
  47  | test.describe('Billing Management', () => {
  48  |   test('billing page redirects to login when not authenticated', async ({ page }) => {
  49  |     await page.goto('/billing');
  50  |     await page.waitForLoadState('domcontentloaded');
  51  | 
> 52  |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  53  |   });
  54  | 
  55  |   test('billing page loads for PRO user', async ({ proPage }) => {
  56  |     await proPage.goto('/billing');
  57  |     await proPage.waitForLoadState('domcontentloaded');
  58  | 
  59  |     const url = proPage.url();
  60  |     if (url.includes('/billing')) {
  61  |       const body = await proPage.textContent('body');
  62  |       expect(body?.length).toBeGreaterThan(50);
  63  | 
  64  |       expect(
  65  |         body?.toLowerCase().includes('billing') ||
  66  |         body?.toLowerCase().includes('subscription') ||
  67  |         body?.toLowerCase().includes('invoice') ||
  68  |         body?.toLowerCase().includes('payment method')
  69  |       ).toBeTruthy();
  70  |     }
  71  |   });
  72  | 
  73  |   test('billing page has cancel subscription button', async ({ proPage }) => {
  74  |     await proPage.goto('/billing');
  75  |     await proPage.waitForLoadState('domcontentloaded');
  76  | 
  77  |     if (proPage.url().includes('/billing')) {
  78  |       const cancelButton = proPage.locator(
  79  |         'button:has-text("Cancel"), a:has-text("Cancel Subscription")'
  80  |       );
  81  |       expect(await cancelButton.count()).toBeGreaterThanOrEqual(0);
  82  |     }
  83  |   });
  84  | });
  85  | 
  86  | test.describe('Coin Purchases', () => {
  87  |   test('coin purchase page loads', async ({ memberPage }) => {
  88  |     await memberPage.goto('/coins');
  89  |     await memberPage.waitForLoadState('domcontentloaded');
  90  | 
  91  |     const url = memberPage.url();
  92  |     if (url.includes('/coins') || url.includes('/wallet')) {
  93  |       const body = await memberPage.textContent('body');
  94  |       expect(
  95  |         body?.toLowerCase().includes('coin') ||
  96  |         body?.toLowerCase().includes('buy') ||
  97  |         body?.toLowerCase().includes('purchase') ||
  98  |         body?.toLowerCase().includes('wallet')
  99  |       ).toBeTruthy();
  100 |     }
  101 |   });
  102 | 
  103 |   test('shows coin packages', async ({ memberPage }) => {
  104 |     await memberPage.goto('/coins');
  105 |     await memberPage.waitForLoadState('domcontentloaded');
  106 | 
  107 |     if (memberPage.url().includes('/coins') || memberPage.url().includes('/wallet')) {
  108 |       const packages = memberPage.locator(
  109 |         '[class*="package"], button:has-text("Buy"), a:has-text("Buy")'
  110 |       );
  111 |       expect(await packages.count()).toBeGreaterThanOrEqual(0);
  112 |     }
  113 |   });
  114 | });
  115 | 
```