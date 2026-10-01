# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payments\payments.spec.ts >> Premium Checkout Flow >> redirects to login when not authenticated
- Location: tests\e2e\payments\payments.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/premium/checkout"
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
  - main [ref=e69]:
    - generic [ref=e70]:
      - generic [ref=e71]:
        - link "Back to Plans" [ref=e72] [cursor=pointer]:
          - /url: /premium
        - generic [ref=e75]:
          - heading "Secure Checkout." [level=1] [ref=e76]
          - paragraph [ref=e77]: Finalize your premium access plan. Choose your preferred secure option below.
      - generic [ref=e78]:
        - generic [ref=e80]:
          - heading "Order Summary" [level=2] [ref=e82]
          - generic [ref=e83]:
            - generic [ref=e88]:
              - heading "BookVerse PRO" [level=3] [ref=e89]
              - paragraph [ref=e90]: Membership tier upgrade
            - generic [ref=e91]:
              - generic [ref=e92]: Select Duration
              - generic [ref=e93]:
                - combobox "Select Duration" [ref=e94] [cursor=pointer]:
                  - option "1 Month" [selected]
                  - option "3 Months"
                  - option "6 Months"
                  - option "12 Months"
                - generic: ▼
            - generic [ref=e95]:
              - generic [ref=e96]: Total Value
              - generic [ref=e97]: ৳199
            - generic [ref=e98]:
              - generic [ref=e99]: Billing Cycle
              - generic [ref=e100]: 1 Month Prepaid
          - generic [ref=e101]: Your payment details are encrypted. All transactions are secure.
        - generic [ref=e107]:
          - heading "Select Payment Option" [level=2] [ref=e109]
          - generic [ref=e112]:
            - button [ref=e113]:
              - generic [ref=e117]:
                - heading "Direct Manual bkash / Nagad" [level=4] [ref=e118]
                - paragraph [ref=e119]: Submit transaction credentials for manual wallet transfer
            - button "Pay with UddoktaPay bKash, Nagad, Rocket, Cards — Instant auto-verified gateway Instant" [ref=e120]:
              - generic [ref=e125]:
                - heading "Pay with UddoktaPay" [level=4] [ref=e126]
                - paragraph [ref=e127]: bKash, Nagad, Rocket, Cards — Instant auto-verified gateway
              - generic [ref=e128]: Instant
  - contentinfo [ref=e129]:
    - generic [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - link "BookVerse Logo BookVerse" [ref=e133] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e134]
            - generic [ref=e135]: BookVerse
          - paragraph [ref=e137]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e138]:
            - generic [ref=e139]:
              - generic [ref=e140]: 10K+
              - generic [ref=e141]: Books
            - generic [ref=e142]:
              - generic [ref=e143]: 500+
              - generic [ref=e144]: Authors
            - generic [ref=e145]:
              - generic [ref=e146]: 50K+
              - generic [ref=e147]: Readers
        - generic [ref=e148]:
          - heading "Newsletter" [level=3] [ref=e149]
          - paragraph [ref=e150]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e152]:
            - textbox "Your email" [ref=e153]
            - button [ref=e154]
      - generic [ref=e158]:
        - generic [ref=e159]:
          - heading "Discover" [level=4] [ref=e160]
          - list [ref=e161]:
            - listitem [ref=e162]:
              - link "Home" [ref=e163] [cursor=pointer]:
                - /url: /
            - listitem [ref=e164]:
              - link "Browse Library" [ref=e165] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e166]:
              - link "Stories" [ref=e167] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e168]:
              - link "Universes" [ref=e169] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e170]:
              - link "Series" [ref=e171] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e172]:
              - link "Search" [ref=e173] [cursor=pointer]:
                - /url: /search
        - generic [ref=e174]:
          - heading "Community" [level=4] [ref=e175]
          - list [ref=e176]:
            - listitem [ref=e177]:
              - link "Book Clubs" [ref=e178] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e179]:
              - link "Activity Feed" [ref=e180] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e181]:
              - link "Challenges" [ref=e182] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e183]:
              - link "My Shelf" [ref=e184] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e185]:
              - link "Offline Stories" [ref=e186] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e187]:
          - heading "For Authors" [level=4] [ref=e188]
          - list [ref=e189]:
            - listitem [ref=e190]:
              - link "Author Dashboard" [ref=e191] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e192]:
              - link "Write a Story" [ref=e193] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e194]:
              - link "Story Universes" [ref=e195] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e196]:
              - link "Story Series" [ref=e197] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e198]:
              - link "Analytics" [ref=e199] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e200]:
              - link "Wallet" [ref=e201] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e202]:
              - link "Newsletter & Fans" [ref=e203] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e204]:
              - link "Upload Book" [ref=e205] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e206]:
          - heading "Support & Legal" [level=4] [ref=e207]
          - list [ref=e208]:
            - listitem [ref=e209]:
              - link "Premium" [ref=e210] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e211]:
              - link "Gifts" [ref=e212] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e213]:
              - link "Settings" [ref=e214] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e215]:
              - link "Support Desk" [ref=e216] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e217]:
              - link "Documentation" [ref=e218] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e219]:
              - link "Privacy Policy" [ref=e220] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e221]:
              - link "Terms of Service" [ref=e222] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e223]:
              - link "Cookie Policy" [ref=e224] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e225]:
              - link "DMCA" [ref=e226] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e227]:
          - heading "Get in Touch" [level=4] [ref=e228]
          - list [ref=e229]:
            - listitem [ref=e230]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e234] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e235]:
              - link "bookverse@gmail.com" [ref=e239] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e240]:
              - link "+880 1799-269699" [ref=e243] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e244]:
            - heading "Follow Us" [level=4] [ref=e245]
            - generic [ref=e246]:
              - link "Facebook" [ref=e247] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e250] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e254] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e257] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e262] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e265]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e269]
  - button "Open Next.js Dev Tools" [ref=e277] [cursor=pointer]
  - alert [ref=e281]
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
> 11  |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
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
  52  |     expect(page.url()).toContain('/login');
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
```