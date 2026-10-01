# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment\premium-checkout.spec.ts >> Premium Checkout >> redirects to login when not authenticated
- Location: tests\e2e\payment\premium-checkout.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/premium/checkout?plan=PRO"
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
        - link "Back to Plans" [ref=e75] [cursor=pointer]:
          - /url: /premium
        - generic [ref=e78]:
          - heading "Secure Checkout." [level=1] [ref=e79]
          - paragraph [ref=e80]: Finalize your premium access plan. Choose your preferred secure option below.
      - generic [ref=e81]:
        - generic [ref=e83]:
          - heading "Order Summary" [level=2] [ref=e85]
          - generic [ref=e86]:
            - generic [ref=e91]:
              - heading "BookVerse PRO" [level=3] [ref=e92]
              - paragraph [ref=e93]: Membership tier upgrade
            - generic [ref=e94]:
              - generic [ref=e95]: Select Duration
              - generic [ref=e96]:
                - combobox "Select Duration" [ref=e97] [cursor=pointer]:
                  - option "1 Month" [selected]
                  - option "3 Months"
                  - option "6 Months"
                  - option "12 Months"
                - generic: ▼
            - generic [ref=e98]:
              - generic [ref=e99]: Total Value
              - generic [ref=e100]: ৳199
            - generic [ref=e101]:
              - generic [ref=e102]: Billing Cycle
              - generic [ref=e103]: 1 Month Prepaid
          - generic [ref=e104]: Your payment details are encrypted. All transactions are secure.
        - generic [ref=e110]:
          - heading "Select Payment Option" [level=2] [ref=e112]
          - generic [ref=e115]:
            - button [ref=e116]:
              - generic [ref=e120]:
                - heading "Direct Manual bkash / Nagad" [level=4] [ref=e121]
                - paragraph [ref=e122]: Submit transaction credentials for manual wallet transfer
            - button "Pay with UddoktaPay bKash, Nagad, Rocket, Cards — Instant auto-verified gateway Instant" [ref=e123]:
              - generic [ref=e128]:
                - heading "Pay with UddoktaPay" [level=4] [ref=e129]
                - paragraph [ref=e130]: bKash, Nagad, Rocket, Cards — Instant auto-verified gateway
              - generic [ref=e131]: Instant
  - contentinfo [ref=e132]:
    - generic [ref=e133]:
      - generic [ref=e134]:
        - generic [ref=e135]:
          - link "BookVerse Logo BookVerse" [ref=e136] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e137]
            - generic [ref=e138]: BookVerse
          - paragraph [ref=e140]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e141]:
            - generic [ref=e142]:
              - generic [ref=e143]: 10K+
              - generic [ref=e144]: Books
            - generic [ref=e145]:
              - generic [ref=e146]: 500+
              - generic [ref=e147]: Authors
            - generic [ref=e148]:
              - generic [ref=e149]: 50K+
              - generic [ref=e150]: Readers
        - generic [ref=e151]:
          - heading "Newsletter" [level=3] [ref=e152]
          - paragraph [ref=e153]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e155]:
            - textbox "Your email" [ref=e156]
            - button [ref=e157]
      - generic [ref=e161]:
        - generic [ref=e162]:
          - heading "Discover" [level=4] [ref=e163]
          - list [ref=e164]:
            - listitem [ref=e165]:
              - link "Home" [ref=e166] [cursor=pointer]:
                - /url: /
            - listitem [ref=e167]:
              - link "Browse Library" [ref=e168] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e169]:
              - link "Stories" [ref=e170] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e171]:
              - link "Universes" [ref=e172] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e173]:
              - link "Series" [ref=e174] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e175]:
              - link "Search" [ref=e176] [cursor=pointer]:
                - /url: /search
        - generic [ref=e177]:
          - heading "Community" [level=4] [ref=e178]
          - list [ref=e179]:
            - listitem [ref=e180]:
              - link "Book Clubs" [ref=e181] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e182]:
              - link "Activity Feed" [ref=e183] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e184]:
              - link "Challenges" [ref=e185] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e186]:
              - link "My Shelf" [ref=e187] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e188]:
              - link "Offline Stories" [ref=e189] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e190]:
          - heading "For Authors" [level=4] [ref=e191]
          - list [ref=e192]:
            - listitem [ref=e193]:
              - link "Author Dashboard" [ref=e194] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e195]:
              - link "Write a Story" [ref=e196] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e197]:
              - link "Story Universes" [ref=e198] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e199]:
              - link "Story Series" [ref=e200] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e201]:
              - link "Analytics" [ref=e202] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e203]:
              - link "Wallet" [ref=e204] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e205]:
              - link "Newsletter & Fans" [ref=e206] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e207]:
              - link "Upload Book" [ref=e208] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e209]:
          - heading "Support & Legal" [level=4] [ref=e210]
          - list [ref=e211]:
            - listitem [ref=e212]:
              - link "Premium" [ref=e213] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e214]:
              - link "Gifts" [ref=e215] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e216]:
              - link "Settings" [ref=e217] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e218]:
              - link "Support Desk" [ref=e219] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e220]:
              - link "Documentation" [ref=e221] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e222]:
              - link "Privacy Policy" [ref=e223] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e224]:
              - link "Terms of Service" [ref=e225] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e226]:
              - link "Cookie Policy" [ref=e227] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e228]:
              - link "DMCA" [ref=e229] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e230]:
          - heading "Get in Touch" [level=4] [ref=e231]
          - list [ref=e232]:
            - listitem [ref=e233]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e237] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e238]:
              - link "bookverse@gmail.com" [ref=e242] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e243]:
              - link "+880 1799-269699" [ref=e246] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e247]:
            - heading "Follow Us" [level=4] [ref=e248]
            - generic [ref=e249]:
              - link "Facebook" [ref=e250] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e253] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e257] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e260] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e265] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e268]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e272]
  - button "Open Next.js Dev Tools" [ref=e280] [cursor=pointer]
  - alert [ref=e284]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Premium Checkout Flow
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Premium Checkout', () => {
  7  |   test('redirects to login when not authenticated', async ({ page }) => {
  8  |     await page.goto('/premium/checkout?plan=PRO');
  9  |     await page.waitForLoadState('domcontentloaded');
> 10 |     expect(page.url()).toContain('/login');
     |                        ^ Error: expect(received).toContain(expected) // indexOf
  11 |   });
  12 | 
  13 |   test('checkout page loads for member', async ({ memberPage }) => {
  14 |     await memberPage.goto('/premium/checkout?plan=PRO');
  15 |     await memberPage.waitForLoadState('domcontentloaded');
  16 |     const body = await memberPage.textContent('body');
  17 |     expect(body?.toLowerCase().includes('checkout')).toBeTruthy();
  18 |   });
  19 |   
  20 |   test('shows all three plans', async ({ memberPage }) => {
  21 |     await memberPage.goto('/premium');
  22 |     await memberPage.waitForLoadState('domcontentloaded');
  23 |     const body = await memberPage.textContent('body');
  24 |     expect(body?.toLowerCase().includes('author')).toBeTruthy();
  25 |     expect(body?.toLowerCase().includes('pro')).toBeTruthy();
  26 |     expect(body?.toLowerCase().includes('creator')).toBeTruthy();
  27 |   });
  28 | });
  29 | 
```