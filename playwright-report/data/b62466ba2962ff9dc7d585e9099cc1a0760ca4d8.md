# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: middleware\tier-guard.spec.ts >> Tier Guard Middleware >> ADMIN bypasses tier checks
- Location: tests\e2e\middleware\tier-guard.spec.ts:40:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*write\/dashboard.*/
Received string:  "http://localhost:3000/login?redirect=%2Fwrite%2Fdashboard"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    31 × locator resolved to <html lang="en" class="h-full antialiased plus_jakarta_sans_7d753922-module__N5oDTq__variable merriweather_1c1d663-module__5NXrrq__variable hind_siliguri_26d35420-module__bR54YG__variable light">…</html>
       - unexpected value "http://localhost:3000/login?redirect=%2Fwrite%2Fdashboard"

```

```yaml
- navigation "Bottom navigation":
  - link "BookVerse BookVerse":
    - /url: /
    - img "BookVerse"
    - text: BookVerse
  - link "Support":
    - /url: /support
  - link "Library":
    - /url: /library
  - link "Stories":
    - /url: /stories
  - link "Universes":
    - /url: /universes
  - link "Series":
    - /url: /series
  - link "Clubs":
    - /url: /clubs
  - link "Home":
    - /url: /
  - link "Search":
    - /url: /search
  - link "Feed":
    - /url: /activity-feed
  - button "Toggle AI Librarian": AI Librarian
  - link "Sign In":
    - /url: /login
- main:
  - link "BookVerse Logo BookVerse":
    - /url: /
    - img "BookVerse Logo"
    - text: BookVerse
  - link "Back to Archives":
    - /url: /
  - text: Secure Login
  - heading "Welcome Back." [level=1]
  - paragraph: Sign in to access your library and continue your stories.
  - text: Email Address
  - textbox "you@example.com"
  - text: Password
  - textbox "At least 8 characters"
  - link "Forgot password?":
    - /url: /forgot-password?redirect=%2Fwrite%2Fdashboard
  - button "Sign In" [disabled]
  - text: Or continue with
  - button "Google":
    - img
    - text: Google
  - paragraph:
    - text: New to BookVerse?
    - link "Create Account":
      - /url: /signup?redirect=%2Fwrite%2Fdashboard
- contentinfo:
  - link "BookVerse Logo BookVerse":
    - /url: /
    - img "BookVerse Logo"
    - text: BookVerse
  - paragraph: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
  - text: 807+ Books 4+ Authors 7+ Readers
  - heading "Newsletter" [level=3]
  - paragraph: Weekly book recommendations and author updates, straight to your inbox.
  - textbox "Your email"
  - button
  - heading "Discover" [level=4]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Browse Library":
        - /url: /library
    - listitem:
      - link "Stories":
        - /url: /stories
    - listitem:
      - link "Universes":
        - /url: /universes
    - listitem:
      - link "Series":
        - /url: /series
    - listitem:
      - link "Search":
        - /url: /search
  - heading "Community" [level=4]
  - list:
    - listitem:
      - link "Book Clubs":
        - /url: /clubs
    - listitem:
      - link "Activity Feed":
        - /url: /activity-feed
    - listitem:
      - link "Challenges":
        - /url: /reading-challenges
    - listitem:
      - link "My Shelf":
        - /url: /shelf
    - listitem:
      - link "Offline Stories":
        - /url: /offline-stories
  - heading "For Authors" [level=4]
  - list:
    - listitem:
      - link "Author Dashboard":
        - /url: /write/dashboard
    - listitem:
      - link "Write a Story":
        - /url: /write/new
    - listitem:
      - link "Story Universes":
        - /url: /write/universes
    - listitem:
      - link "Story Series":
        - /url: /write/series
    - listitem:
      - link "Analytics":
        - /url: /author/analytics
    - listitem:
      - link "Wallet":
        - /url: /wallet
    - listitem:
      - link "Newsletter & Fans":
        - /url: /author/newsletter
    - listitem:
      - link "Upload Book":
        - /url: /upload
  - heading "Support & Legal" [level=4]
  - list:
    - listitem:
      - link "Premium":
        - /url: /premium
    - listitem:
      - link "Gifts":
        - /url: /gifts
    - listitem:
      - link "Settings":
        - /url: /settings
    - listitem:
      - link "Support Desk":
        - /url: /support
    - listitem:
      - link "Documentation":
        - /url: /docs
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms of Service":
        - /url: /terms
    - listitem:
      - link "Cookie Policy":
        - /url: /cookies
    - listitem:
      - link "DMCA":
        - /url: /dmca
  - heading "Get in Touch" [level=4]
  - list:
    - listitem:
      - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh":
        - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
    - listitem:
      - link "bookverse@gmail.com":
        - /url: mailto:bookverse@gmail.com
    - listitem:
      - link "+880 1799-269699":
        - /url: tel:+8801799269699
  - heading "Follow Us" [level=4]
  - link "Facebook":
    - /url: https://facebook.com
    - img
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - link "Twitter":
    - /url: https://twitter.com
    - img
  - link "LinkedIn":
    - /url: https://linkedin.com
    - img
  - link "TikTok":
    - /url: https://tiktok.com
    - img
  - text: © 2026 BookVerse. All rights reserved.
  - button "Back to top"
- alert
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Tier Guard
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Tier Guard Middleware', () => {
  7  |   test('FREE user cannot access AUTHOR routes', async ({ memberPage }) => {
  8  |     await memberPage.goto('/write/dashboard');
  9  |     await memberPage.waitForTimeout(1000);
  10 |     const body = await memberPage.textContent('body');
  11 |     expect(
  12 |       !memberPage.url().includes('/write/dashboard') ||
  13 |       body?.toLowerCase().includes('upgrade') ||
  14 |       body?.toLowerCase().includes('access denied')
  15 |     ).toBeTruthy();
  16 |   });
  17 | 
  18 |   test('AUTHOR user cannot access PRO routes', async ({ authorPage }) => {
  19 |     await authorPage.goto('/wallet');
  20 |     await authorPage.waitForTimeout(1000);
  21 |     const body = await authorPage.textContent('body');
  22 |     expect(
  23 |       !authorPage.url().includes('/wallet') ||
  24 |       body?.toLowerCase().includes('upgrade') ||
  25 |       body?.toLowerCase().includes('access denied')
  26 |     ).toBeTruthy();
  27 |   });
  28 | 
  29 |   test('PRO user cannot access CREATOR routes', async ({ proPage }) => {
  30 |     await proPage.goto('/gifts');
  31 |     await proPage.waitForTimeout(1000);
  32 |     const body = await proPage.textContent('body');
  33 |     expect(
  34 |       !proPage.url().includes('/gifts') ||
  35 |       body?.toLowerCase().includes('upgrade') ||
  36 |       body?.toLowerCase().includes('access denied')
  37 |     ).toBeTruthy();
  38 |   });
  39 | 
  40 |   test('ADMIN bypasses tier checks', async ({ adminPage }) => {
  41 |     await adminPage.goto('/write/dashboard');
> 42 |     await expect(adminPage).toHaveURL(/.*write\/dashboard.*/);
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  43 |     
  44 |     await adminPage.goto('/wallet');
  45 |     await expect(adminPage).toHaveURL(/.*wallet.*/);
  46 |   });
  47 | });
  48 | 
```