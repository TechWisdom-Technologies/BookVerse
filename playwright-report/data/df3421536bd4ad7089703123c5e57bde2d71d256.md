# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\signup.spec.ts >> Signup Flow >> shows validation error for empty fields
- Location: tests\e2e\auth\signup.spec.ts:20:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /sign\s*up|create|register/i }).first()
    - locator resolved to <button disabled type="submit" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">Create Account</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    18 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

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
      - link "BookVerse Logo BookVerse" [ref=e75] [cursor=pointer]:
        - /url: /
        - img "BookVerse Logo" [ref=e76]
        - generic [ref=e77]: BookVerse
      - link "Back to Archives" [ref=e79] [cursor=pointer]:
        - /url: /
      - generic [ref=e82]:
        - generic [ref=e83]:
          - generic [ref=e84]: Create Account
          - heading "Join BookVerse." [level=1] [ref=e88]
          - paragraph [ref=e89]: Create an account to read, save, and share your own stories.
        - generic [ref=e90]:
          - generic [ref=e91]:
            - text: Email Address
            - textbox "you@example.com" [ref=e92]
          - generic [ref=e93]:
            - text: Password
            - textbox "At least 8 characters" [ref=e94]
          - generic [ref=e95]:
            - text: Confirm Password
            - textbox "Repeat your password" [ref=e96]
          - generic [ref=e97]:
            - button "Create Account" [disabled] [ref=e102]
            - generic [ref=e103]: Or continue with
            - button "Google" [ref=e108]
        - paragraph [ref=e114]:
          - text: Already registered?
          - link "Sign In" [ref=e115] [cursor=pointer]:
            - /url: /login?redirect=%2F
  - contentinfo [ref=e116]:
    - generic [ref=e117]:
      - generic [ref=e118]:
        - generic [ref=e119]:
          - link "BookVerse Logo BookVerse" [ref=e120] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e121]
            - generic [ref=e122]: BookVerse
          - paragraph [ref=e124]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e125]:
            - generic [ref=e126]:
              - generic [ref=e127]: 807+
              - generic [ref=e128]: Books
            - generic [ref=e129]:
              - generic [ref=e130]: 4+
              - generic [ref=e131]: Authors
            - generic [ref=e132]:
              - generic [ref=e133]: 7+
              - generic [ref=e134]: Readers
        - generic [ref=e135]:
          - heading "Newsletter" [level=3] [ref=e136]
          - paragraph [ref=e137]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e139]:
            - textbox "Your email" [ref=e140]
            - button [ref=e141]
      - generic [ref=e145]:
        - generic [ref=e146]:
          - heading "Discover" [level=4] [ref=e147]
          - list [ref=e148]:
            - listitem [ref=e149]:
              - link "Home" [ref=e150] [cursor=pointer]:
                - /url: /
            - listitem [ref=e151]:
              - link "Browse Library" [ref=e152] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e153]:
              - link "Stories" [ref=e154] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e155]:
              - link "Universes" [ref=e156] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e157]:
              - link "Series" [ref=e158] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e159]:
              - link "Search" [ref=e160] [cursor=pointer]:
                - /url: /search
        - generic [ref=e161]:
          - heading "Community" [level=4] [ref=e162]
          - list [ref=e163]:
            - listitem [ref=e164]:
              - link "Book Clubs" [ref=e165] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e166]:
              - link "Activity Feed" [ref=e167] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e168]:
              - link "Challenges" [ref=e169] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e170]:
              - link "My Shelf" [ref=e171] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e172]:
              - link "Offline Stories" [ref=e173] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e174]:
          - heading "For Authors" [level=4] [ref=e175]
          - list [ref=e176]:
            - listitem [ref=e177]:
              - link "Author Dashboard" [ref=e178] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e179]:
              - link "Write a Story" [ref=e180] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e181]:
              - link "Story Universes" [ref=e182] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e183]:
              - link "Story Series" [ref=e184] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e185]:
              - link "Analytics" [ref=e186] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e187]:
              - link "Wallet" [ref=e188] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e189]:
              - link "Newsletter & Fans" [ref=e190] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e191]:
              - link "Upload Book" [ref=e192] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e193]:
          - heading "Support & Legal" [level=4] [ref=e194]
          - list [ref=e195]:
            - listitem [ref=e196]:
              - link "Premium" [ref=e197] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e198]:
              - link "Gifts" [ref=e199] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e200]:
              - link "Settings" [ref=e201] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e202]:
              - link "Support Desk" [ref=e203] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e204]:
              - link "Documentation" [ref=e205] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e206]:
              - link "Privacy Policy" [ref=e207] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e208]:
              - link "Terms of Service" [ref=e209] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e210]:
              - link "Cookie Policy" [ref=e211] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e212]:
              - link "DMCA" [ref=e213] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e214]:
          - heading "Get in Touch" [level=4] [ref=e215]
          - list [ref=e216]:
            - listitem [ref=e217]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e221] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e222]:
              - link "bookverse@gmail.com" [ref=e226] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e227]:
              - link "+880 1799-269699" [ref=e230] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e231]:
            - heading "Follow Us" [level=4] [ref=e232]
            - generic [ref=e233]:
              - link "Facebook" [ref=e234] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e237] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e241] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e244] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e249] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e252]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e256]
  - button "Open Next.js Dev Tools" [ref=e264] [cursor=pointer]
  - alert [ref=e268]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Signup Flow
  3  |  * Tests user registration with validation, error handling, and successful signup.
  4  |  */
  5  | import { test, expect } from '../fixtures/auth.fixture';
  6  | 
  7  | test.describe('Signup Flow', () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto('/signup');
  10 |     await page.waitForLoadState('domcontentloaded');
  11 |   });
  12 | 
  13 |   test('signup page loads with form fields', async ({ page }) => {
  14 |     // Verify the signup form elements are present
  15 |     await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  16 |     await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
  17 |     await expect(page.getByRole('button', { name: /sign\s*up|create|register/i }).first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('shows validation error for empty fields', async ({ page }) => {
  21 |     // Try to submit empty form
> 22 |     await page.getByRole('button', { name: /sign\s*up|create|register/i }).first().click();
     |                                                                                    ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  23 | 
  24 |     // Should show validation errors
  25 |     await page.waitForTimeout(500);
  26 |     const errorMessages = page.locator('[class*="error"], [role="alert"], .text-red');
  27 |     const pageContent = await page.textContent('body');
  28 |     expect(
  29 |       (await errorMessages.count()) > 0 ||
  30 |       pageContent?.toLowerCase().includes('required') ||
  31 |       pageContent?.toLowerCase().includes('valid')
  32 |     ).toBeTruthy();
  33 |   });
  34 | 
  35 |   test('shows validation error for invalid email format', async ({ page }) => {
  36 |     await page.fill('input[type="email"], input[name="email"]', 'notanemail');
  37 |     await page.fill('input[type="password"], input[name="password"]', 'ValidPass123!');
  38 | 
  39 |     // Try to find and fill username if the field exists
  40 |     const usernameInput = page.locator('input[name="username"], input[placeholder*="username" i]');
  41 |     if (await usernameInput.count() > 0) {
  42 |       await usernameInput.first().fill('testuser123');
  43 |     }
  44 | 
  45 |     // Try to find and fill display name if the field exists
  46 |     const displayNameInput = page.locator('input[name="displayName"], input[placeholder*="name" i]');
  47 |     if (await displayNameInput.count() > 0) {
  48 |       await displayNameInput.first().fill('Test User');
  49 |     }
  50 | 
  51 |     await page.getByRole('button', { name: /sign\s*up|create|register/i }).first().click();
  52 |     await page.waitForTimeout(1000);
  53 | 
  54 |     // Should still be on signup page or show error
  55 |     const url = page.url();
  56 |     const pageContent = await page.textContent('body');
  57 |     expect(
  58 |       url.includes('/signup') ||
  59 |       pageContent?.toLowerCase().includes('email') ||
  60 |       pageContent?.toLowerCase().includes('invalid')
  61 |     ).toBeTruthy();
  62 |   });
  63 | 
  64 |   test('shows password toggle button', async ({ page }) => {
  65 |     const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  66 |     await passwordInput.fill('TestPassword123!');
  67 | 
  68 |     // Look for show/hide password toggle
  69 |     const toggleButton = page.locator(
  70 |       'button:near(input[type="password"]), [aria-label*="password" i], [data-testid*="toggle" i]'
  71 |     );
  72 |     if (await toggleButton.count() > 0) {
  73 |       await toggleButton.first().click();
  74 |       // After clicking, the input type might change to "text"
  75 |       const inputType = await passwordInput.getAttribute('type');
  76 |       // Either the type changed or a new visible text input appeared
  77 |       expect(inputType === 'text' || inputType === 'password').toBeTruthy();
  78 |     }
  79 |   });
  80 | 
  81 |   test('has link to login page', async ({ page }) => {
  82 |     const loginLink = page.locator('a[href*="login"], a:has-text("login"), a:has-text("sign in")');
  83 |     await expect(loginLink.first()).toBeVisible();
  84 |   });
  85 | });
  86 | 
```