# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility\a11y-core.spec.ts >> A11y Core & Visual Accessibility (Phases 1, 3, 4, 7) >> Homepage passes automated Axe scans and generates HTML report
- Location: tests\e2e\accessibility\a11y-core.spec.ts:6:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 95

- Array []
+ Array [
+   Object {
+     "description": "Ensure buttons have discernible text",
+     "help": "Buttons must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright",
+     "id": "button-name",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"submit\" class=\"px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded transition-all hover:opacity-90 border border-zinc-900 dark:border-white shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[64px]\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".min-w-\\[64px\\]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.9.1",
+     ],
+   },
+ ]
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
        - link [ref=e16] [cursor=pointer]:
          - /url: /library
        - link [ref=e24] [cursor=pointer]:
          - /url: /stories
        - link [ref=e31] [cursor=pointer]:
          - /url: /universes
        - link [ref=e38] [cursor=pointer]:
          - /url: /series
        - link [ref=e45] [cursor=pointer]:
          - /url: /clubs
      - link [ref=e51] [cursor=pointer]:
        - /url: /
      - generic [ref=e56]:
        - link [ref=e57] [cursor=pointer]:
          - /url: /search
        - link [ref=e63] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=e68]:
          - generic: AI Librarian
        - link "Sign In" [ref=e75] [cursor=pointer]:
          - /url: /login
  - main [ref=e80]:
    - generic [ref=e87]:
      - generic [ref=e90]:
        - textbox "Try searching 'Adventure'..." [ref=e94]
        - button "Search" [ref=e96]
      - heading "Your Next Story Awaits." [level=1] [ref=e97]
      - paragraph [ref=e98]: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
      - generic [ref=e99]:
        - link "Start Reading" [ref=e100] [cursor=pointer]:
          - /url: /library
        - link "Latest Stories" [ref=e108] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e113]:
        - generic [ref=e114]:
          - img "User" [ref=e116]
          - img "User" [ref=e118]
          - img "User" [ref=e120]
          - img "User" [ref=e122]
        - generic [ref=e123]: Trusted by 7+ readers
    - generic [ref=e138]:
      - generic [ref=e139]:
        - generic [ref=e140]: 0+
        - generic [ref=e141]: Books
      - generic [ref=e142]:
        - generic [ref=e143]: 0+
        - generic [ref=e144]: Stories
      - generic [ref=e145]:
        - generic [ref=e146]: 0+
        - generic [ref=e147]: Readers
      - generic [ref=e148]:
        - generic [ref=e149]: 0+
        - generic [ref=e150]: Minutes Read
    - generic [ref=e152]:
      - link "All" [ref=e153] [cursor=pointer]:
        - /url: /stories
      - link "Action" [ref=e154] [cursor=pointer]:
        - /url: /stories?genre=Action
      - link "Adventure" [ref=e155] [cursor=pointer]:
        - /url: /stories?genre=Adventure
      - link "Comedy" [ref=e156] [cursor=pointer]:
        - /url: /stories?genre=Comedy
      - link "Contemporary" [ref=e157] [cursor=pointer]:
        - /url: /stories?genre=Contemporary
      - link "Drama" [ref=e158] [cursor=pointer]:
        - /url: /stories?genre=Drama
      - link "Dystopian" [ref=e159] [cursor=pointer]:
        - /url: /stories?genre=Dystopian
      - link "Fantasy" [ref=e160] [cursor=pointer]:
        - /url: /stories?genre=Fantasy
      - link "Fiction" [ref=e161] [cursor=pointer]:
        - /url: /stories?genre=Fiction
      - link "Historical" [ref=e162] [cursor=pointer]:
        - /url: /stories?genre=Historical
      - link "Horror" [ref=e163] [cursor=pointer]:
        - /url: /stories?genre=Horror
      - link "Mystery" [ref=e164] [cursor=pointer]:
        - /url: /stories?genre=Mystery
      - link "Paranormal" [ref=e165] [cursor=pointer]:
        - /url: /stories?genre=Paranormal
      - link "Poetry" [ref=e166] [cursor=pointer]:
        - /url: /stories?genre=Poetry
      - link "Romance" [ref=e167] [cursor=pointer]:
        - /url: /stories?genre=Romance
      - link "Science Fiction" [ref=e168] [cursor=pointer]:
        - /url: /stories?genre=Science%20Fiction
      - link "Slice of Life" [ref=e169] [cursor=pointer]:
        - /url: /stories?genre=Slice%20of%20Life
      - link "Supernatural" [ref=e170] [cursor=pointer]:
        - /url: /stories?genre=Supernatural
      - link "Thriller" [ref=e171] [cursor=pointer]:
        - /url: /stories?genre=Thriller
      - link "More" [ref=e172] [cursor=pointer]:
        - /url: /search
    - generic [ref=e177]:
      - generic [ref=e178]:
        - generic [ref=e179]:
          - generic [ref=e180]: Recommended
          - heading "Editor's Choice" [level=2] [ref=e184]
        - link "Browse All" [ref=e186] [cursor=pointer]:
          - /url: /library
      - generic [ref=e190]:
        - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0" [ref=e191] [cursor=pointer]:
          - /url: /library/cmu3nme32000p586w9p7gjkzh
          - generic [ref=e192]:
            - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [ref=e194]
            - generic [ref=e196]:
              - generic [ref=e197]: Fiction
              - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3] [ref=e199]
              - paragraph [ref=e200]: CamScanner
              - generic [ref=e201]:
                - generic [ref=e202]: "0.0"
                - generic [ref=e206]: "0"
        - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0" [ref=e211] [cursor=pointer]:
          - /url: /library/cmu3nm10a000h586wwrlpn5uj
          - generic [ref=e212]:
            - img "Ashoka the Ungreat" [ref=e214]
            - generic [ref=e216]:
              - generic [ref=e217]: Fiction
              - heading "Ashoka the Ungreat" [level=3] [ref=e219]
              - paragraph [ref=e220]: Subhodeep Mukhopadhyay
              - generic [ref=e221]:
                - generic [ref=e222]: "0.0"
                - generic [ref=e226]: "0"
        - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0" [ref=e231] [cursor=pointer]:
          - /url: /library/cmu3nq25j002r586wbx4xw0fa
          - generic [ref=e232]:
            - img "Julius Caesar" [ref=e234]
            - generic [ref=e236]:
              - generic [ref=e237]: Fiction
              - heading "Julius Caesar" [level=3] [ref=e239]
              - paragraph [ref=e240]: William Shakespeare
              - generic [ref=e241]:
                - generic [ref=e242]: "0.0"
                - generic [ref=e246]: "0"
        - link "The Odyssey Fiction The Odyssey Homer 0.0 0" [ref=e251] [cursor=pointer]:
          - /url: /library/cmu3nvkcm006p586wlivwrrtw
          - generic [ref=e252]:
            - img "The Odyssey" [ref=e254]
            - generic [ref=e256]:
              - generic [ref=e257]: Fiction
              - heading "The Odyssey" [level=3] [ref=e259]
              - paragraph [ref=e260]: Homer
              - generic [ref=e261]:
                - generic [ref=e262]: "0.0"
                - generic [ref=e266]: "0"
        - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0" [ref=e271] [cursor=pointer]:
          - /url: /library/cmpshibdm00ah58z8ciyjdatz
          - generic [ref=e272]:
            - img "যারা ভোর এনেছিল" [ref=e274]
            - generic [ref=e276]:
              - generic [ref=e277]: Fiction
              - heading "যারা ভোর এনেছিল" [level=3] [ref=e279]
              - paragraph [ref=e280]: Unknown Author
              - generic [ref=e281]:
                - generic [ref=e282]: "0.0"
                - generic [ref=e286]: "0"
        - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0" [ref=e291] [cursor=pointer]:
          - /url: /library/cmu3nozxt0027586w1ebuaxf0
          - generic [ref=e292]:
            - img "Frankenstein (1818 Edition)" [ref=e294]
            - generic [ref=e296]:
              - generic [ref=e297]: Fiction
              - heading "Frankenstein (1818 Edition)" [level=3] [ref=e299]
              - paragraph [ref=e300]: Mary Shelley
              - generic [ref=e301]:
                - generic [ref=e302]: "0.0"
                - generic [ref=e306]: "0"
        - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0" [ref=e311] [cursor=pointer]:
          - /url: /library/cmpshhedo009x58z8fyt0etyg
          - generic [ref=e312]:
            - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [ref=e314]
            - generic [ref=e316]:
              - generic [ref=e317]: Fiction
              - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3] [ref=e319]
              - paragraph [ref=e320]: Unknown Author
              - generic [ref=e321]:
                - generic [ref=e322]: "0.0"
                - generic [ref=e326]: "0"
        - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0" [ref=e331] [cursor=pointer]:
          - /url: /library/cmu3nt84c004x586w78tspcz9
          - generic [ref=e332]:
            - img "Siege of Rome" [ref=e334]
            - generic [ref=e336]:
              - generic [ref=e337]: Fiction
              - heading "Siege of Rome" [level=3] [ref=e339]
              - paragraph [ref=e340]: David Pilling
              - generic [ref=e341]:
                - generic [ref=e342]: "0.0"
                - generic [ref=e346]: "0"
    - generic [ref=e352]:
      - generic [ref=e353]:
        - generic [ref=e354]:
          - generic [ref=e355]: Latest Stories
          - heading "Community Feed" [level=2] [ref=e358]
        - link "View All" [ref=e360] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e364]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e365] [cursor=pointer]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e366]:
            - img "অন্ধকারের ডাক" [ref=e368]
            - generic [ref=e370]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e372]
              - generic [ref=e373]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e375]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e376]
                - paragraph [ref=e377]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e378]:
                - generic "Chapters" [ref=e379]: "10"
                - generic "Views" [ref=e383]: "40"
                - generic "Likes" [ref=e387]: "2"
                - generic "Comments" [ref=e390]: "4"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e393] [cursor=pointer]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e394]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e396]'
            - generic [ref=e398]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e400]'
              - generic [ref=e401]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e403]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e404]
                - paragraph [ref=e405]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e406]:
                - generic "Chapters" [ref=e407]: "8"
                - generic "Views" [ref=e411]: "19"
                - generic "Likes" [ref=e415]: "0"
                - generic "Comments" [ref=e418]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e421] [cursor=pointer]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e422]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e424]
            - generic [ref=e426]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e428]
              - generic [ref=e429]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e431]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e432]
                - paragraph [ref=e433]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e434]:
                - generic "Chapters" [ref=e435]: "9"
                - generic "Views" [ref=e439]: "17"
                - generic "Likes" [ref=e443]: "0"
                - generic "Comments" [ref=e446]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e449] [cursor=pointer]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e450]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e452]
            - generic [ref=e454]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e456]
              - generic [ref=e457]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e459]:
                - img "TechWisdom" [ref=e460]
                - paragraph [ref=e461]: TechWisdom
              - generic [ref=e462]:
                - generic "Chapters" [ref=e463]: "4"
                - generic "Views" [ref=e467]: "12"
                - generic "Likes" [ref=e471]: "1"
                - generic "Comments" [ref=e474]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e477] [cursor=pointer]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e478]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e480]
            - generic [ref=e482]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e484]
              - generic [ref=e485]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e487]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e488]
                - paragraph [ref=e489]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e490]:
                - generic "Chapters" [ref=e491]: "4"
                - generic "Views" [ref=e495]: "12"
                - generic "Likes" [ref=e499]: "1"
                - generic "Comments" [ref=e502]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e505] [cursor=pointer]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e506]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e508]
            - generic [ref=e510]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e512]
              - generic [ref=e513]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e515]:
                - img "TechWisdom" [ref=e516]
                - paragraph [ref=e517]: TechWisdom
              - generic [ref=e518]:
                - generic "Chapters" [ref=e519]: "8"
                - generic "Views" [ref=e523]: "12"
                - generic "Likes" [ref=e527]: "1"
                - generic "Comments" [ref=e530]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e533] [cursor=pointer]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e534]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e536]
            - generic [ref=e538]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e540]
              - generic [ref=e541]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e543]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e544]
                - paragraph [ref=e545]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e546]:
                - generic "Chapters" [ref=e547]: "8"
                - generic "Views" [ref=e551]: "10"
                - generic "Likes" [ref=e555]: "1"
                - generic "Comments" [ref=e558]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e561] [cursor=pointer]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e562]:
            - img "নীল জলের গুপ্তচর" [ref=e564]
            - generic [ref=e566]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e568]
              - generic [ref=e569]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e571]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e572]
                - paragraph [ref=e573]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e574]:
                - generic "Chapters" [ref=e575]: "8"
                - generic "Views" [ref=e579]: "7"
                - generic "Likes" [ref=e583]: "1"
                - generic "Comments" [ref=e586]: "0"
    - generic [ref=e590]:
      - generic [ref=e591]:
        - generic [ref=e592]: Explore
        - heading "Browse by Category" [level=2] [ref=e596]
      - generic [ref=e597]:
        - link [ref=e599] [cursor=pointer]:
          - /url: /stories?genre=Action
          - heading "Action" [level=3] [ref=e604]
          - paragraph [ref=e605]: 0 Stories
        - link [ref=e607] [cursor=pointer]:
          - /url: /stories?genre=Adventure
          - heading "Adventure" [level=3] [ref=e612]
          - paragraph [ref=e613]: 1 Stories
        - link [ref=e615] [cursor=pointer]:
          - /url: /stories?genre=Comedy
          - heading "Comedy" [level=3] [ref=e619]
          - paragraph [ref=e620]: 0 Stories
        - link [ref=e622] [cursor=pointer]:
          - /url: /stories?genre=Contemporary
          - heading "Contemporary" [level=3] [ref=e629]
          - paragraph [ref=e630]: 0 Stories
        - link [ref=e632] [cursor=pointer]:
          - /url: /stories?genre=Drama
          - heading "Drama" [level=3] [ref=e636]
          - paragraph [ref=e637]: 1 Stories
        - link [ref=e639] [cursor=pointer]:
          - /url: /stories?genre=Dystopian
          - heading "Dystopian" [level=3] [ref=e646]
          - paragraph [ref=e647]: 0 Stories
      - button "Load More" [ref=e649]
    - generic [ref=e653]:
      - generic [ref=e654]:
        - generic [ref=e655]:
          - generic [ref=e656]:
            - generic [ref=e657]: Explore Universes
            - heading "Explore Worlds" [level=2] [ref=e662]
          - link "Browse All" [ref=e664] [cursor=pointer]:
            - /url: /universes
        - generic [ref=e668]:
          - link [ref=e669] [cursor=pointer]:
            - /url: /universes/cmpll9h810005jl04zaj68jzz
            - generic [ref=e672]:
              - generic [ref=e673]:
                - generic [ref=e674]: Mystery
                - generic [ref=e675]: 11 Reads
              - generic [ref=e678]:
                - heading "ঢাকার ছায়া" [level=3] [ref=e679]
                - paragraph [ref=e680]: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
              - generic [ref=e681]:
                - generic [ref=e682]: Moizuddin Mohammad Mujahid Rashid
                - generic [ref=e685]: 6 Stories
          - link [ref=e689] [cursor=pointer]:
            - /url: /universes/cmpjwhspx0002l204rwpflilv
            - generic [ref=e692]:
              - generic [ref=e693]:
                - generic [ref=e694]: Thriller
                - generic [ref=e695]: 38 Reads
              - generic [ref=e698]:
                - heading "THE DARK EMPIRE UNIVERSE" [level=3] [ref=e699]
                - paragraph [ref=e700]: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
              - generic [ref=e701]:
                - generic [ref=e702]: TechWisdom
                - generic [ref=e705]: 7 Stories
      - generic [ref=e709]:
        - heading "New Arrivals" [level=2] [ref=e714]
        - generic [ref=e715]:
          - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0" [ref=e716] [cursor=pointer]:
            - /url: /library/cmu3nu3de005l586wjzfmehmw
            - generic [ref=e717]:
              - img "The Adventures of Captain Hatteras" [ref=e719]
              - generic [ref=e721]:
                - generic [ref=e722]: Fiction
                - heading "The Adventures of Captain Hatteras" [level=3] [ref=e724]
                - paragraph [ref=e725]: Jules Verne
                - generic [ref=e726]:
                  - generic [ref=e727]: "0.0"
                  - generic [ref=e731]: "0"
          - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0" [ref=e736] [cursor=pointer]':
            - /url: /library/cmu3npokm002j586wcufatvre
            - generic [ref=e737]:
              - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [ref=e739]'
              - generic [ref=e741]:
                - generic [ref=e742]: Fiction
                - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3] [ref=e744]'
                - paragraph [ref=e745]: Carol Leonnig & Philip Rucker
                - generic [ref=e746]:
                  - generic [ref=e747]: "0.0"
                  - generic [ref=e751]: "0"
          - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0" [ref=e756] [cursor=pointer]':
            - /url: /library/cmu3np67f002b586w60leadjk
            - generic [ref=e757]:
              - 'img "Genghis: Lords of the Bow" [ref=e759]'
              - generic [ref=e761]:
                - generic [ref=e762]: Fiction
                - 'heading "Genghis: Lords of the Bow" [level=3] [ref=e764]'
                - paragraph [ref=e765]: Conn Iggulden
                - generic [ref=e766]:
                  - generic [ref=e767]: "0.0"
                  - generic [ref=e771]: "0"
          - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0" [ref=e776] [cursor=pointer]:
            - /url: /library/cmu3no58a001p586wkary5auz
            - generic [ref=e777]:
              - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [ref=e779]
              - generic [ref=e781]:
                - generic [ref=e782]: Fiction
                - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3] [ref=e784]
                - paragraph [ref=e785]: Unknown Author
                - generic [ref=e786]:
                  - generic [ref=e787]: "0.0"
                  - generic [ref=e791]: "0"
          - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0" [ref=e796] [cursor=pointer]:
            - /url: /library/cmu3nlway000d586w6dcwg0e3
            - generic [ref=e797]:
              - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [ref=e799]
              - generic [ref=e801]:
                - generic [ref=e802]: Fiction
                - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3] [ref=e804]
                - paragraph [ref=e805]: Unknown Author
                - generic [ref=e806]:
                  - generic [ref=e807]: "0.0"
                  - generic [ref=e811]: "0"
          - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0" [ref=e816] [cursor=pointer]:
            - /url: /library/cmu3nl6pv0001586w9lrhc3b6
            - generic [ref=e817]:
              - img "Against All Odds" [ref=e819]
              - generic [ref=e821]:
                - generic [ref=e822]: Fiction
                - heading "Against All Odds" [level=3] [ref=e824]
                - paragraph [ref=e825]: Craig Challen
                - generic [ref=e826]:
                  - generic [ref=e827]: "0.0"
                  - generic [ref=e831]: "0"
          - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0" [ref=e836] [cursor=pointer]:
            - /url: /library/cmpshhihy009z58z81x7qjevf
            - generic [ref=e837]:
              - img "মার্কিন দলিলে মুজিব হত্যাকান্ড" [ref=e839]
              - generic [ref=e841]:
                - generic [ref=e842]: Fiction
                - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3] [ref=e844]
                - paragraph [ref=e845]: Unknown Author
                - generic [ref=e846]:
                  - generic [ref=e847]: "0.0"
                  - generic [ref=e851]: "0"
          - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0" [ref=e856] [cursor=pointer]:
            - /url: /library/cmpshghfv009f58z870y55pkn
            - generic [ref=e857]:
              - img "ভারতীয় দর্শন By ড. দেবব্রত সেন" [ref=e859]
              - generic [ref=e861]:
                - generic [ref=e862]: Fiction
                - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3] [ref=e864]
                - paragraph [ref=e865]: Unknown Author
                - generic [ref=e866]:
                  - generic [ref=e867]: "0.0"
                  - generic [ref=e871]: "0"
    - generic [ref=e877]:
      - generic [ref=e878]:
        - heading "Archive" [level=3] [ref=e884]
        - paragraph [ref=e885]: Access 10,000+ volumes instantly.
      - generic [ref=e886]:
        - heading "Offline" [level=3] [ref=e891]
        - paragraph [ref=e892]: Read your favorite stories anywhere.
      - generic [ref=e893]:
        - heading "Library" [level=3] [ref=e896]
        - paragraph [ref=e897]: Track your reading progress easily.
      - generic [ref=e898]:
        - heading "Speed" [level=3] [ref=e901]
        - paragraph [ref=e902]: Lightning fast reading experience.
    - generic [ref=e904]:
      - heading "Start Your Journey." [level=2] [ref=e905]
      - paragraph [ref=e906]: Join our global community and discover stories that move you.
      - generic [ref=e907]:
        - link "Join Now" [ref=e908] [cursor=pointer]:
          - /url: /login
        - link "Browse Library" [ref=e909] [cursor=pointer]:
          - /url: /library
  - contentinfo [ref=e910]:
    - generic [ref=e911]:
      - generic [ref=e912]:
        - generic [ref=e913]:
          - link "BookVerse Logo BookVerse" [ref=e914] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e915]
            - generic [ref=e916]: BookVerse
          - paragraph [ref=e918]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e919]:
            - generic [ref=e920]:
              - generic [ref=e921]: 807+
              - generic [ref=e922]: Books
            - generic [ref=e923]:
              - generic [ref=e924]: 4+
              - generic [ref=e925]: Authors
            - generic [ref=e926]:
              - generic [ref=e927]: 7+
              - generic [ref=e928]: Readers
        - generic [ref=e929]:
          - heading "Newsletter" [level=3] [ref=e930]
          - paragraph [ref=e931]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e933]:
            - textbox "Your email" [ref=e934]
            - button [ref=e935]
      - generic [ref=e939]:
        - generic [ref=e940]:
          - heading "Discover" [level=4] [ref=e941]
          - list [ref=e942]:
            - listitem [ref=e943]:
              - link "Home" [ref=e944] [cursor=pointer]:
                - /url: /
            - listitem [ref=e945]:
              - link "Browse Library" [ref=e946] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e947]:
              - link "Stories" [ref=e948] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e949]:
              - link "Universes" [ref=e950] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e951]:
              - link "Series" [ref=e952] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e953]:
              - link "Search" [ref=e954] [cursor=pointer]:
                - /url: /search
        - generic [ref=e955]:
          - heading "Community" [level=4] [ref=e956]
          - list [ref=e957]:
            - listitem [ref=e958]:
              - link "Book Clubs" [ref=e959] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e960]:
              - link "Activity Feed" [ref=e961] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e962]:
              - link "Challenges" [ref=e963] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e964]:
              - link "My Shelf" [ref=e965] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e966]:
              - link "Offline Stories" [ref=e967] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e968]:
          - heading "For Authors" [level=4] [ref=e969]
          - list [ref=e970]:
            - listitem [ref=e971]:
              - link "Author Dashboard" [ref=e972] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e973]:
              - link "Write a Story" [ref=e974] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e975]:
              - link "Story Universes" [ref=e976] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e977]:
              - link "Story Series" [ref=e978] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e979]:
              - link "Analytics" [ref=e980] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e981]:
              - link "Wallet" [ref=e982] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e983]:
              - link "Newsletter & Fans" [ref=e984] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e985]:
              - link "Upload Book" [ref=e986] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e987]:
          - heading "Support & Legal" [level=4] [ref=e988]
          - list [ref=e989]:
            - listitem [ref=e990]:
              - link "Premium" [ref=e991] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e992]:
              - link "Gifts" [ref=e993] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e994]:
              - link "Settings" [ref=e995] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e996]:
              - link "Support Desk" [ref=e997] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e998]:
              - link "Documentation" [ref=e999] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e1000]:
              - link "Privacy Policy" [ref=e1001] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e1002]:
              - link "Terms of Service" [ref=e1003] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e1004]:
              - link "Cookie Policy" [ref=e1005] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e1006]:
              - link "DMCA" [ref=e1007] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e1008]:
          - heading "Get in Touch" [level=4] [ref=e1009]
          - list [ref=e1010]:
            - listitem [ref=e1011]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e1015] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e1016]:
              - link "bookverse@gmail.com" [ref=e1020] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e1021]:
              - link "+880 1799-269699" [ref=e1024] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e1025]:
            - heading "Follow Us" [level=4] [ref=e1026]
            - generic [ref=e1027]:
              - link "Facebook" [ref=e1028] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e1031] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e1036] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e1039] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e1044] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e1047]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e1051]
  - button "Open Next.js Dev Tools" [ref=e1059] [cursor=pointer]:
    - generic [ref=e1062]:
      - text: Compiling
      - generic [ref=e1063]:
        - generic [ref=e1064]: .
        - generic [ref=e1065]: .
        - generic [ref=e1066]: .
  - alert [ref=e1067]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { createHtmlReport } from 'axe-html-reporter';
  4  | 
  5  | test.describe('A11y Core & Visual Accessibility (Phases 1, 3, 4, 7)', () => {
  6  |   test('Homepage passes automated Axe scans and generates HTML report', async ({ page }) => {
  7  |     await page.goto('/');
  8  |     
  9  |     // Phase 1: Automated Scan
  10 |     const accessibilityScanResults = await new AxeBuilder({ page })
  11 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  12 |       .analyze();
  13 |       
  14 |     // Phase 7: Axe HTML Reporting
  15 |     createHtmlReport({
  16 |       results: accessibilityScanResults,
  17 |       options: {
  18 |         projectKey: 'BookVerse',
  19 |         outputDir: 'axe-reports',
  20 |         reportFileName: 'accessibility-report.html'
  21 |       }
  22 |     });
  23 |       
  24 |     // We expect 0 violations for critical/serious rules
> 25 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  26 |   });
  27 | 
  28 |   test('Semantic HTML Landmarks exist', async ({ page }) => {
  29 |     await page.goto('/');
  30 |     
  31 |     // Phase 3: Screen Reader Semantics
  32 |     // Ensure critical landmarks are present so screen readers can navigate
  33 |     const main = page.locator('main');
  34 |     const header = page.locator('header:visible, nav:visible');
  35 |     
  36 |     // Just verifying they exist in the DOM and are visible
  37 |     if (await main.count() > 0) {
  38 |       await expect(main.first()).toBeVisible();
  39 |     }
  40 |     if (await header.count() > 0) {
  41 |       await expect(header.first()).toBeVisible();
  42 |     }
  43 |   });
  44 | 
  45 |   test('Color Contrast and 200% Zoom Compatibility', async ({ page }) => {
  46 |     // Phase 4: Visual Accessibility
  47 |     // Note: Axe already checks contrast, but we can explicitly test zoom constraints
  48 |     await page.goto('/');
  49 |     
  50 |     // Emulate 200% zoom (by cutting viewport in half, typical browser zoom simulation for CSS layout)
  51 |     const viewport = page.viewportSize();
  52 |     if (viewport) {
  53 |       await page.setViewportSize({ width: viewport.width / 2, height: viewport.height / 2 });
  54 |     }
  55 |     await page.waitForTimeout(500); // let reflow happen
  56 |     
  57 |     // Check for massive horizontal scrolling which violates WCAG 1.4.10 Reflow
  58 |     const hasHorizontalOverflow = await page.evaluate(() => {
  59 |       return document.documentElement.scrollWidth > window.innerWidth;
  60 |     });
  61 |     
  62 |     expect(hasHorizontalOverflow).toBeFalsy();
  63 |   });
  64 | });
  65 | 
```