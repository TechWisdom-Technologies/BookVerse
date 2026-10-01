# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public\stories-browse.spec.ts >> Stories Browse Page >> displays story cards or empty state
- Location: tests\e2e\public\stories-browse.spec.ts:17:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
        - generic [ref=e75]:
          - link "Back Home" [ref=e76] [cursor=pointer]:
            - /url: /
          - generic [ref=e79]:
            - heading "Community Stories." [level=1] [ref=e80]
            - paragraph [ref=e81]: Read original stories shared by independent authors across the BookVerse.
        - link "Start a Story" [ref=e82] [cursor=pointer]:
          - /url: /write/new
      - generic [ref=e116]:
        - generic [ref=e117]:
          - generic [ref=e118]:
            - button "Popular" [ref=e119]
            - button "Newest" [ref=e120]
            - button "Most Viewed" [ref=e121]
            - button "Most Reactions" [ref=e122]
          - combobox "All Genres" [ref=e124]
          - combobox "All Authors" [ref=e126]
          - generic [ref=e127]:
            - button "Grid View" [ref=e128]
            - button "List View" [ref=e134]
        - generic [ref=e136]: 27 Stories Found
      - generic [ref=e140]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e141] [cursor=pointer]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e142]:
            - img "অন্ধকারের ডাক" [ref=e144]
            - generic [ref=e146]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e148]
              - generic [ref=e149]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e151]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e152]
                - paragraph [ref=e153]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e154]:
                - generic "Chapters" [ref=e155]: "10"
                - generic "Views" [ref=e158]: "40"
                - generic "Likes" [ref=e162]: "2"
                - generic "Comments" [ref=e165]: "4"
        - link "দ্য ফাইনাল রেকনিং (The Final Reckoning) দ্য ফাইনাল রেকনিং (The Final Reckoning) আজিজ ভিলা গ্যাং • Vol 15 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 7 0 2" [ref=e168] [cursor=pointer]:
          - /url: /stories/cmqbcoeo20001jm04mqg0pxgu
          - generic [ref=e169]:
            - img "দ্য ফাইনাল রেকনিং (The Final Reckoning)" [ref=e171]
            - generic [ref=e173]:
              - heading "দ্য ফাইনাল রেকনিং (The Final Reckoning)" [level=3] [ref=e175]
              - generic [ref=e176]: আজিজ ভিলা গ্যাং • Vol 15
              - generic [ref=e178]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e179]
                - paragraph [ref=e180]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e181]:
                - generic "Chapters" [ref=e182]: "10"
                - generic "Views" [ref=e185]: "7"
                - generic "Likes" [ref=e189]: "0"
                - generic "Comments" [ref=e192]: "2"
        - link "দ্য ভেনম ইনসাইড (The Venom Inside) দ্য ভেনম ইনসাইড (The Venom Inside) আজিজ ভিলা গ্যাং • Vol 14 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 6 6 0 0" [ref=e195] [cursor=pointer]:
          - /url: /stories/cmqbbxr1t0001jl04xx3ycjbn
          - generic [ref=e196]:
            - img "দ্য ভেনম ইনসাইড (The Venom Inside)" [ref=e198]
            - generic [ref=e200]:
              - heading "দ্য ভেনম ইনসাইড (The Venom Inside)" [level=3] [ref=e202]
              - generic [ref=e203]: আজিজ ভিলা গ্যাং • Vol 14
              - generic [ref=e205]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e206]
                - paragraph [ref=e207]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e208]:
                - generic "Chapters" [ref=e209]: "6"
                - generic "Views" [ref=e212]: "6"
                - generic "Likes" [ref=e216]: "0"
                - generic "Comments" [ref=e219]: "0"
        - link "দ্য আরাকান অ্যাবিস (The Arakan Abyss) দ্য আরাকান অ্যাবিস (The Arakan Abyss) আজিজ ভিলা গ্যাং • Vol 12 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 1 0 0" [ref=e222] [cursor=pointer]:
          - /url: /stories/cmqba1x9u0001l704nmjus2bl
          - generic [ref=e223]:
            - img "দ্য আরাকান অ্যাবিস (The Arakan Abyss)" [ref=e225]
            - generic [ref=e227]:
              - heading "দ্য আরাকান অ্যাবিস (The Arakan Abyss)" [level=3] [ref=e229]
              - generic [ref=e230]: আজিজ ভিলা গ্যাং • Vol 12
              - generic [ref=e232]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e233]
                - paragraph [ref=e234]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e235]:
                - generic "Chapters" [ref=e236]: "8"
                - generic "Views" [ref=e239]: "1"
                - generic "Likes" [ref=e243]: "0"
                - generic "Comments" [ref=e246]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e249] [cursor=pointer]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e250]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e252]
            - generic [ref=e254]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e256]
              - generic [ref=e257]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e259]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e260]
                - paragraph [ref=e261]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e262]:
                - generic "Chapters" [ref=e263]: "9"
                - generic "Views" [ref=e266]: "17"
                - generic "Likes" [ref=e270]: "0"
                - generic "Comments" [ref=e273]: "0"
        - link "দ্য ব্লাড-সোকড ব্রাদারহুড (The Blood-Soaked Brotherhood) দ্য ব্লাড-সোকড ব্রাদারহুড (The Blood-Soaked Brotherhood) আজিজ ভিলা গ্যাং • Vol 13 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 3 0 0" [ref=e276] [cursor=pointer]:
          - /url: /stories/cmqbbi5yk003bjj04gle88el5
          - generic [ref=e277]:
            - img "দ্য ব্লাড-সোকড ব্রাদারহুড (The Blood-Soaked Brotherhood)" [ref=e279]
            - generic [ref=e281]:
              - heading "দ্য ব্লাড-সোকড ব্রাদারহুড (The Blood-Soaked Brotherhood)" [level=3] [ref=e283]
              - generic [ref=e284]: আজিজ ভিলা গ্যাং • Vol 13
              - generic [ref=e286]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e287]
                - paragraph [ref=e288]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e289]:
                - generic "Chapters" [ref=e290]: "8"
                - generic "Views" [ref=e293]: "3"
                - generic "Likes" [ref=e297]: "0"
                - generic "Comments" [ref=e300]: "0"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e303] [cursor=pointer]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e304]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e306]'
            - generic [ref=e308]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e310]'
              - generic [ref=e311]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e313]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e314]
                - paragraph [ref=e315]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e316]:
                - generic "Chapters" [ref=e317]: "8"
                - generic "Views" [ref=e320]: "19"
                - generic "Likes" [ref=e324]: "0"
                - generic "Comments" [ref=e327]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e330] [cursor=pointer]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e331]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e333]
            - generic [ref=e335]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e337]
              - generic [ref=e338]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e340]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e341]
                - paragraph [ref=e342]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e343]:
                - generic "Chapters" [ref=e344]: "4"
                - generic "Views" [ref=e347]: "12"
                - generic "Likes" [ref=e351]: "1"
                - generic "Comments" [ref=e354]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e357] [cursor=pointer]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e358]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e360]
            - generic [ref=e362]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e364]
              - generic [ref=e365]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e367]:
                - img "TechWisdom" [ref=e368]
                - paragraph [ref=e369]: TechWisdom
              - generic [ref=e370]:
                - generic "Chapters" [ref=e371]: "8"
                - generic "Views" [ref=e374]: "12"
                - generic "Likes" [ref=e378]: "1"
                - generic "Comments" [ref=e381]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e384] [cursor=pointer]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e385]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e387]
            - generic [ref=e389]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e391]
              - generic [ref=e392]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e394]:
                - img "TechWisdom" [ref=e395]
                - paragraph [ref=e396]: TechWisdom
              - generic [ref=e397]:
                - generic "Chapters" [ref=e398]: "4"
                - generic "Views" [ref=e401]: "12"
                - generic "Likes" [ref=e405]: "1"
                - generic "Comments" [ref=e408]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e411] [cursor=pointer]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e412]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e414]
            - generic [ref=e416]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e418]
              - generic [ref=e419]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e421]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e422]
                - paragraph [ref=e423]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e424]:
                - generic "Chapters" [ref=e425]: "8"
                - generic "Views" [ref=e428]: "10"
                - generic "Likes" [ref=e432]: "1"
                - generic "Comments" [ref=e435]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e438] [cursor=pointer]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e439]:
            - img "নীল জলের গুপ্তচর" [ref=e441]
            - generic [ref=e443]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e445]
              - generic [ref=e446]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e448]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e449]
                - paragraph [ref=e450]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e451]:
                - generic "Chapters" [ref=e452]: "8"
                - generic "Views" [ref=e455]: "7"
                - generic "Likes" [ref=e459]: "1"
                - generic "Comments" [ref=e462]: "0"
      - generic [ref=e466]:
        - button [disabled] [ref=e467]
        - generic [ref=e470]:
          - link "01" [ref=e471] [cursor=pointer]:
            - /url: /stories?page=1
          - link "02" [ref=e472] [cursor=pointer]:
            - /url: /stories?page=2
          - link "03" [ref=e473] [cursor=pointer]:
            - /url: /stories?page=3
        - link [ref=e474] [cursor=pointer]:
          - /url: /stories?page=2
  - contentinfo [ref=e477]:
    - generic [ref=e478]:
      - generic [ref=e479]:
        - generic [ref=e480]:
          - link "BookVerse Logo BookVerse" [ref=e481] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e482]
            - generic [ref=e483]: BookVerse
          - paragraph [ref=e485]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e486]:
            - generic [ref=e487]:
              - generic [ref=e488]: 807+
              - generic [ref=e489]: Books
            - generic [ref=e490]:
              - generic [ref=e491]: 4+
              - generic [ref=e492]: Authors
            - generic [ref=e493]:
              - generic [ref=e494]: 7+
              - generic [ref=e495]: Readers
        - generic [ref=e496]:
          - heading "Newsletter" [level=3] [ref=e497]
          - paragraph [ref=e498]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e500]:
            - textbox "Your email" [ref=e501]
            - button [ref=e502]
      - generic [ref=e506]:
        - generic [ref=e507]:
          - heading "Discover" [level=4] [ref=e508]
          - list [ref=e509]:
            - listitem [ref=e510]:
              - link "Home" [ref=e511] [cursor=pointer]:
                - /url: /
            - listitem [ref=e512]:
              - link "Browse Library" [ref=e513] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e514]:
              - link "Stories" [ref=e515] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e516]:
              - link "Universes" [ref=e517] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e518]:
              - link "Series" [ref=e519] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e520]:
              - link "Search" [ref=e521] [cursor=pointer]:
                - /url: /search
        - generic [ref=e522]:
          - heading "Community" [level=4] [ref=e523]
          - list [ref=e524]:
            - listitem [ref=e525]:
              - link "Book Clubs" [ref=e526] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e527]:
              - link "Activity Feed" [ref=e528] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e529]:
              - link "Challenges" [ref=e530] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e531]:
              - link "My Shelf" [ref=e532] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e533]:
              - link "Offline Stories" [ref=e534] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e535]:
          - heading "For Authors" [level=4] [ref=e536]
          - list [ref=e537]:
            - listitem [ref=e538]:
              - link "Author Dashboard" [ref=e539] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e540]:
              - link "Write a Story" [ref=e541] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e542]:
              - link "Story Universes" [ref=e543] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e544]:
              - link "Story Series" [ref=e545] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e546]:
              - link "Analytics" [ref=e547] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e548]:
              - link "Wallet" [ref=e549] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e550]:
              - link "Newsletter & Fans" [ref=e551] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e552]:
              - link "Upload Book" [ref=e553] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e554]:
          - heading "Support & Legal" [level=4] [ref=e555]
          - list [ref=e556]:
            - listitem [ref=e557]:
              - link "Premium" [ref=e558] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e559]:
              - link "Gifts" [ref=e560] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e561]:
              - link "Settings" [ref=e562] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e563]:
              - link "Support Desk" [ref=e564] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e565]:
              - link "Documentation" [ref=e566] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e567]:
              - link "Privacy Policy" [ref=e568] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e569]:
              - link "Terms of Service" [ref=e570] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e571]:
              - link "Cookie Policy" [ref=e572] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e573]:
              - link "DMCA" [ref=e574] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e575]:
          - heading "Get in Touch" [level=4] [ref=e576]
          - list [ref=e577]:
            - listitem [ref=e578]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e582] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e583]:
              - link "bookverse@gmail.com" [ref=e587] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e588]:
              - link "+880 1799-269699" [ref=e591] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e592]:
            - heading "Follow Us" [level=4] [ref=e593]
            - generic [ref=e594]:
              - link "Facebook" [ref=e595] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e598] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e602] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e605] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e610] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e613]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e617]
  - button "Open Next.js Dev Tools" [ref=e625] [cursor=pointer]
  - alert [ref=e629]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Stories Browse Page
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Stories Browse Page', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/stories');
  9  |     await page.waitForLoadState('domcontentloaded');
  10 |   });
  11 | 
  12 |   test('stories page loads successfully', async ({ page }) => {
  13 |     const body = await page.textContent('body');
  14 |     expect(body?.length).toBeGreaterThan(100);
  15 |   });
  16 | 
  17 |   test('displays story cards or empty state', async ({ page }) => {
  18 |     // Either story cards are present or an empty state message
  19 |     const storyCards = page.locator('[class*="card"], [class*="story"], article, [data-testid*="story"]');
  20 |     const emptyState = page.locator(':has-text("No stories"), :has-text("no results")');
  21 |     
  22 |     expect(
  23 |       (await storyCards.count()) > 0 || (await emptyState.count()) > 0
> 24 |     ).toBeTruthy();
     |       ^ Error: expect(received).toBeTruthy()
  25 |   });
  26 | 
  27 |   test('has filter/sort controls', async ({ page }) => {
  28 |     // Look for genre filter, sort dropdown, or filter buttons
  29 |     const filterElements = page.locator(
  30 |       'select, [class*="filter"], [class*="sort"], button:has-text("Filter"), button:has-text("Sort"), [role="combobox"]'
  31 |     );
  32 |     expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  33 |   });
  34 | 
  35 |   test('has pagination or infinite scroll', async ({ page }) => {
  36 |     const paginationElements = page.locator(
  37 |       '[class*="pagination"], button:has-text("Next"), button:has-text("Load More"), a:has-text("Next"), nav[aria-label*="pagination"]'
  38 |     );
  39 |     // Pagination may or may not be visible depending on data
  40 |     expect(await paginationElements.count()).toBeGreaterThanOrEqual(0);
  41 |   });
  42 | });
  43 | 
```