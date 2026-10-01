# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility\a11y-core.spec.ts >> A11y Core & Visual Accessibility (Phases 1, 3, 4, 7) >> Color Contrast and 200% Zoom Compatibility
- Location: tests\e2e\accessibility\a11y-core.spec.ts:45:7

# Error details

```
Error: expect(received).toBeFalsy()

Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "Mobile navigation" [ref=e2]:
    - generic [ref=e3]:
      - link [ref=e4]:
        - /url: /library
      - link [ref=e9]:
        - /url: /search
      - link [ref=e15]:
        - /url: /
      - link [ref=e20]:
        - /url: /support
      - button "Toggle AI Librarian" [ref=e26]
      - button "Open navigation menu" [ref=e31]
  - main [ref=e35]:
    - generic [ref=e40]:
      - generic [ref=e43]:
        - textbox "Search books, stories..." [ref=e47]
        - button "Search" [ref=e49]
      - heading "Your Next Story Awaits." [level=1] [ref=e50]
      - paragraph [ref=e51]: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
      - generic [ref=e52]:
        - link "Start Reading" [ref=e53]:
          - /url: /library
        - link "Latest Stories" [ref=e59]:
          - /url: /stories
      - generic [ref=e64]:
        - generic [ref=e65]:
          - img "User" [ref=e67]
          - img "User" [ref=e69]
          - img "User" [ref=e71]
          - img "User" [ref=e73]
        - generic [ref=e74]: Trusted by 7+ readers
    - generic [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]: 0+
        - generic [ref=e92]: Books
      - generic [ref=e93]:
        - generic [ref=e94]: 0+
        - generic [ref=e95]: Stories
      - generic [ref=e96]:
        - generic [ref=e97]: 0+
        - generic [ref=e98]: Readers
      - generic [ref=e99]:
        - generic [ref=e100]: 0+
        - generic [ref=e101]: Minutes Read
    - generic [ref=e103]:
      - link "All" [ref=e104]:
        - /url: /stories
      - link "Action" [ref=e105]:
        - /url: /stories?genre=Action
      - link "Adventure" [ref=e106]:
        - /url: /stories?genre=Adventure
      - link "Comedy" [ref=e107]:
        - /url: /stories?genre=Comedy
      - link "Contemporary" [ref=e108]:
        - /url: /stories?genre=Contemporary
      - link "Drama" [ref=e109]:
        - /url: /stories?genre=Drama
      - link "Dystopian" [ref=e110]:
        - /url: /stories?genre=Dystopian
      - link "Fantasy" [ref=e111]:
        - /url: /stories?genre=Fantasy
      - link "Fiction" [ref=e112]:
        - /url: /stories?genre=Fiction
      - link "Historical" [ref=e113]:
        - /url: /stories?genre=Historical
      - link "Horror" [ref=e114]:
        - /url: /stories?genre=Horror
      - link "Mystery" [ref=e115]:
        - /url: /stories?genre=Mystery
      - link "Paranormal" [ref=e116]:
        - /url: /stories?genre=Paranormal
      - link "Poetry" [ref=e117]:
        - /url: /stories?genre=Poetry
      - link "Romance" [ref=e118]:
        - /url: /stories?genre=Romance
      - link "Science Fiction" [ref=e119]:
        - /url: /stories?genre=Science%20Fiction
      - link "Slice of Life" [ref=e120]:
        - /url: /stories?genre=Slice%20of%20Life
      - link "Supernatural" [ref=e121]:
        - /url: /stories?genre=Supernatural
      - link "Thriller" [ref=e122]:
        - /url: /stories?genre=Thriller
      - link "More" [ref=e123]:
        - /url: /search
    - generic [ref=e128]:
      - generic [ref=e129]:
        - generic [ref=e130]:
          - generic [ref=e131]: Recommended
          - heading "Editor's Choice" [level=2] [ref=e135]
        - link "Browse All" [ref=e136]:
          - /url: /library
      - generic [ref=e139]:
        - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0" [ref=e140]:
          - /url: /library/cmu3nme32000p586w9p7gjkzh
          - generic [ref=e141] [cursor=pointer]:
            - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [ref=e143]
            - generic [ref=e145]:
              - generic [ref=e146]: Fiction
              - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3] [ref=e148]
              - paragraph [ref=e149]: CamScanner
              - generic [ref=e150]:
                - generic [ref=e151]: "0.0"
                - generic [ref=e155]: "0"
        - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0" [ref=e159]:
          - /url: /library/cmu3nm10a000h586wwrlpn5uj
          - generic [ref=e160] [cursor=pointer]:
            - img "Ashoka the Ungreat" [ref=e162]
            - generic [ref=e164]:
              - generic [ref=e165]: Fiction
              - heading "Ashoka the Ungreat" [level=3] [ref=e167]
              - paragraph [ref=e168]: Subhodeep Mukhopadhyay
              - generic [ref=e169]:
                - generic [ref=e170]: "0.0"
                - generic [ref=e174]: "0"
        - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0" [ref=e178]:
          - /url: /library/cmu3nq25j002r586wbx4xw0fa
          - generic [ref=e179] [cursor=pointer]:
            - img "Julius Caesar" [ref=e181]
            - generic [ref=e183]:
              - generic [ref=e184]: Fiction
              - heading "Julius Caesar" [level=3] [ref=e186]
              - paragraph [ref=e187]: William Shakespeare
              - generic [ref=e188]:
                - generic [ref=e189]: "0.0"
                - generic [ref=e193]: "0"
        - link "The Odyssey Fiction The Odyssey Homer 0.0 0" [ref=e197]:
          - /url: /library/cmu3nvkcm006p586wlivwrrtw
          - generic [ref=e198] [cursor=pointer]:
            - img "The Odyssey" [ref=e200]
            - generic [ref=e202]:
              - generic [ref=e203]: Fiction
              - heading "The Odyssey" [level=3] [ref=e205]
              - paragraph [ref=e206]: Homer
              - generic [ref=e207]:
                - generic [ref=e208]: "0.0"
                - generic [ref=e212]: "0"
        - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0" [ref=e216]:
          - /url: /library/cmpshibdm00ah58z8ciyjdatz
          - generic [ref=e217] [cursor=pointer]:
            - img "যারা ভোর এনেছিল" [ref=e219]
            - generic [ref=e221]:
              - generic [ref=e222]: Fiction
              - heading "যারা ভোর এনেছিল" [level=3] [ref=e224]
              - paragraph [ref=e225]: Unknown Author
              - generic [ref=e226]:
                - generic [ref=e227]: "0.0"
                - generic [ref=e231]: "0"
        - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0" [ref=e235]:
          - /url: /library/cmu3nozxt0027586w1ebuaxf0
          - generic [ref=e236] [cursor=pointer]:
            - img "Frankenstein (1818 Edition)" [ref=e238]
            - generic [ref=e240]:
              - generic [ref=e241]: Fiction
              - heading "Frankenstein (1818 Edition)" [level=3] [ref=e243]
              - paragraph [ref=e244]: Mary Shelley
              - generic [ref=e245]:
                - generic [ref=e246]: "0.0"
                - generic [ref=e250]: "0"
        - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0" [ref=e254]:
          - /url: /library/cmpshhedo009x58z8fyt0etyg
          - generic [ref=e255] [cursor=pointer]:
            - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [ref=e257]
            - generic [ref=e259]:
              - generic [ref=e260]: Fiction
              - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3] [ref=e262]
              - paragraph [ref=e263]: Unknown Author
              - generic [ref=e264]:
                - generic [ref=e265]: "0.0"
                - generic [ref=e269]: "0"
        - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0" [ref=e273]:
          - /url: /library/cmu3nt84c004x586w78tspcz9
          - generic [ref=e274] [cursor=pointer]:
            - img "Siege of Rome" [ref=e276]
            - generic [ref=e278]:
              - generic [ref=e279]: Fiction
              - heading "Siege of Rome" [level=3] [ref=e281]
              - paragraph [ref=e282]: David Pilling
              - generic [ref=e283]:
                - generic [ref=e284]: "0.0"
                - generic [ref=e288]: "0"
    - generic [ref=e293]:
      - generic [ref=e294]:
        - generic [ref=e295]:
          - generic [ref=e296]: Latest Stories
          - heading "Community Feed" [level=2] [ref=e299]
        - link "View All" [ref=e300]:
          - /url: /stories
      - generic [ref=e303]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e304]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e305] [cursor=pointer]:
            - img "অন্ধকারের ডাক" [ref=e307]
            - generic [ref=e309]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e311]
              - generic [ref=e312]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e314]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e315]
                - paragraph [ref=e316]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e317]:
                - generic "Chapters" [ref=e318]: "10"
                - generic "Views" [ref=e321]: "40"
                - generic "Likes" [ref=e325]: "2"
                - generic "Comments" [ref=e328]: "4"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e331]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e332] [cursor=pointer]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e334]'
            - generic [ref=e336]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e338]'
              - generic [ref=e339]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e341]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e342]
                - paragraph [ref=e343]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e344]:
                - generic "Chapters" [ref=e345]: "8"
                - generic "Views" [ref=e348]: "19"
                - generic "Likes" [ref=e352]: "0"
                - generic "Comments" [ref=e355]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e358]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e359] [cursor=pointer]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e361]
            - generic [ref=e363]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e365]
              - generic [ref=e366]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e368]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e369]
                - paragraph [ref=e370]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e371]:
                - generic "Chapters" [ref=e372]: "9"
                - generic "Views" [ref=e375]: "17"
                - generic "Likes" [ref=e379]: "0"
                - generic "Comments" [ref=e382]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e385]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e386] [cursor=pointer]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e388]
            - generic [ref=e390]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e392]
              - generic [ref=e393]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e395]:
                - img "TechWisdom" [ref=e396]
                - paragraph [ref=e397]: TechWisdom
              - generic [ref=e398]:
                - generic "Chapters" [ref=e399]: "4"
                - generic "Views" [ref=e402]: "12"
                - generic "Likes" [ref=e406]: "1"
                - generic "Comments" [ref=e409]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e412]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e413] [cursor=pointer]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e415]
            - generic [ref=e417]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e419]
              - generic [ref=e420]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e422]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e423]
                - paragraph [ref=e424]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e425]:
                - generic "Chapters" [ref=e426]: "4"
                - generic "Views" [ref=e429]: "12"
                - generic "Likes" [ref=e433]: "1"
                - generic "Comments" [ref=e436]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e439]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e440] [cursor=pointer]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e442]
            - generic [ref=e444]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e446]
              - generic [ref=e447]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e449]:
                - img "TechWisdom" [ref=e450]
                - paragraph [ref=e451]: TechWisdom
              - generic [ref=e452]:
                - generic "Chapters" [ref=e453]: "8"
                - generic "Views" [ref=e456]: "12"
                - generic "Likes" [ref=e460]: "1"
                - generic "Comments" [ref=e463]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e466]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e467] [cursor=pointer]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e469]
            - generic [ref=e471]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e473]
              - generic [ref=e474]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e476]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e477]
                - paragraph [ref=e478]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e479]:
                - generic "Chapters" [ref=e480]: "8"
                - generic "Views" [ref=e483]: "10"
                - generic "Likes" [ref=e487]: "1"
                - generic "Comments" [ref=e490]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e493]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e494] [cursor=pointer]:
            - img "নীল জলের গুপ্তচর" [ref=e496]
            - generic [ref=e498]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e500]
              - generic [ref=e501]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e503]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e504]
                - paragraph [ref=e505]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e506]:
                - generic "Chapters" [ref=e507]: "8"
                - generic "Views" [ref=e510]: "7"
                - generic "Likes" [ref=e514]: "1"
                - generic "Comments" [ref=e517]: "0"
    - generic [ref=e521]:
      - generic [ref=e522]:
        - generic [ref=e523]: Explore
        - heading "Browse by Category" [level=2] [ref=e527]
      - generic [ref=e528]:
        - link [ref=e530]:
          - /url: /stories?genre=Action
          - heading "Action" [level=3] [ref=e534]
          - paragraph [ref=e535]: 0 Stories
        - link [ref=e537]:
          - /url: /stories?genre=Adventure
          - heading "Adventure" [level=3] [ref=e542]
          - paragraph [ref=e543]: 1 Stories
        - link [ref=e545]:
          - /url: /stories?genre=Comedy
          - heading "Comedy" [level=3] [ref=e549]
          - paragraph [ref=e550]: 0 Stories
        - link [ref=e552]:
          - /url: /stories?genre=Contemporary
          - heading "Contemporary" [level=3] [ref=e557]
          - paragraph [ref=e558]: 0 Stories
        - link [ref=e560]:
          - /url: /stories?genre=Drama
          - heading "Drama" [level=3] [ref=e564]
          - paragraph [ref=e565]: 1 Stories
        - link [ref=e567]:
          - /url: /stories?genre=Dystopian
          - heading "Dystopian" [level=3] [ref=e574]
          - paragraph [ref=e575]: 0 Stories
      - button "Load More" [ref=e577]
    - generic [ref=e581]:
      - generic [ref=e582]:
        - generic [ref=e583]:
          - generic [ref=e584]:
            - generic [ref=e585]: Explore Universes
            - heading "Explore Worlds" [level=2] [ref=e589]
          - link "Browse All" [ref=e590]:
            - /url: /universes
        - generic [ref=e593]:
          - link [ref=e594]:
            - /url: /universes/cmpll9h810005jl04zaj68jzz
            - generic [ref=e597]:
              - generic [ref=e598]:
                - generic [ref=e599]: Mystery
                - generic [ref=e600]: 11 Reads
              - generic [ref=e603]:
                - heading "ঢাকার ছায়া" [level=3] [ref=e604]
                - paragraph [ref=e605]: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
              - generic [ref=e606]:
                - generic [ref=e607]: Moizuddin Mohammad Mujahid Rashid
                - generic [ref=e610]: 6 Stories
          - link [ref=e613]:
            - /url: /universes/cmpjwhspx0002l204rwpflilv
            - generic [ref=e616]:
              - generic [ref=e617]:
                - generic [ref=e618]: Thriller
                - generic [ref=e619]: 38 Reads
              - generic [ref=e622]:
                - heading "THE DARK EMPIRE UNIVERSE" [level=3] [ref=e623]
                - paragraph [ref=e624]: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
              - generic [ref=e625]:
                - generic [ref=e626]: TechWisdom
                - generic [ref=e629]: 7 Stories
      - generic [ref=e632]:
        - heading "New Arrivals" [level=2] [ref=e637]
        - generic [ref=e638]:
          - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0" [ref=e639]:
            - /url: /library/cmu3nu3de005l586wjzfmehmw
            - generic [ref=e640] [cursor=pointer]:
              - img "The Adventures of Captain Hatteras" [ref=e642]
              - generic [ref=e644]:
                - generic [ref=e645]: Fiction
                - heading "The Adventures of Captain Hatteras" [level=3] [ref=e647]
                - paragraph [ref=e648]: Jules Verne
                - generic [ref=e649]:
                  - generic [ref=e650]: "0.0"
                  - generic [ref=e654]: "0"
          - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0" [ref=e658]':
            - /url: /library/cmu3npokm002j586wcufatvre
            - generic [ref=e659] [cursor=pointer]:
              - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [ref=e661]'
              - generic [ref=e663]:
                - generic [ref=e664]: Fiction
                - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3] [ref=e666]'
                - paragraph [ref=e667]: Carol Leonnig & Philip Rucker
                - generic [ref=e668]:
                  - generic [ref=e669]: "0.0"
                  - generic [ref=e673]: "0"
          - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0" [ref=e677]':
            - /url: /library/cmu3np67f002b586w60leadjk
            - generic [ref=e678] [cursor=pointer]:
              - 'img "Genghis: Lords of the Bow" [ref=e680]'
              - generic [ref=e682]:
                - generic [ref=e683]: Fiction
                - 'heading "Genghis: Lords of the Bow" [level=3] [ref=e685]'
                - paragraph [ref=e686]: Conn Iggulden
                - generic [ref=e687]:
                  - generic [ref=e688]: "0.0"
                  - generic [ref=e692]: "0"
          - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0" [ref=e696]:
            - /url: /library/cmu3no58a001p586wkary5auz
            - generic [ref=e697] [cursor=pointer]:
              - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [ref=e699]
              - generic [ref=e701]:
                - generic [ref=e702]: Fiction
                - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3] [ref=e704]
                - paragraph [ref=e705]: Unknown Author
                - generic [ref=e706]:
                  - generic [ref=e707]: "0.0"
                  - generic [ref=e711]: "0"
          - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0" [ref=e715]:
            - /url: /library/cmu3nlway000d586w6dcwg0e3
            - generic [ref=e716] [cursor=pointer]:
              - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [ref=e718]
              - generic [ref=e720]:
                - generic [ref=e721]: Fiction
                - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3] [ref=e723]
                - paragraph [ref=e724]: Unknown Author
                - generic [ref=e725]:
                  - generic [ref=e726]: "0.0"
                  - generic [ref=e730]: "0"
          - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0" [ref=e734]:
            - /url: /library/cmu3nl6pv0001586w9lrhc3b6
            - generic [ref=e735] [cursor=pointer]:
              - img "Against All Odds" [ref=e737]
              - generic [ref=e739]:
                - generic [ref=e740]: Fiction
                - heading "Against All Odds" [level=3] [ref=e742]
                - paragraph [ref=e743]: Craig Challen
                - generic [ref=e744]:
                  - generic [ref=e745]: "0.0"
                  - generic [ref=e749]: "0"
          - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0" [ref=e753]:
            - /url: /library/cmpshhihy009z58z81x7qjevf
            - generic [ref=e754] [cursor=pointer]:
              - img "মার্কিন দলিলে মুজিব হত্যাকান্ড" [ref=e756]
              - generic [ref=e758]:
                - generic [ref=e759]: Fiction
                - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3] [ref=e761]
                - paragraph [ref=e762]: Unknown Author
                - generic [ref=e763]:
                  - generic [ref=e764]: "0.0"
                  - generic [ref=e768]: "0"
          - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0" [ref=e772]:
            - /url: /library/cmpshghfv009f58z870y55pkn
            - generic [ref=e773] [cursor=pointer]:
              - img "ভারতীয় দর্শন By ড. দেবব্রত সেন" [ref=e775]
              - generic [ref=e777]:
                - generic [ref=e778]: Fiction
                - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3] [ref=e780]
                - paragraph [ref=e781]: Unknown Author
                - generic [ref=e782]:
                  - generic [ref=e783]: "0.0"
                  - generic [ref=e787]: "0"
    - generic [ref=e792]:
      - generic [ref=e793]:
        - heading "Archive" [level=3] [ref=e796]
        - paragraph [ref=e797]: Access 10,000+ volumes instantly.
      - generic [ref=e798]:
        - heading "Offline" [level=3] [ref=e802]
        - paragraph [ref=e803]: Read your favorite stories anywhere.
      - generic [ref=e804]:
        - heading "Library" [level=3] [ref=e807]
        - paragraph [ref=e808]: Track your reading progress easily.
      - generic [ref=e809]:
        - heading "Speed" [level=3] [ref=e812]
        - paragraph [ref=e813]: Lightning fast reading experience.
    - generic [ref=e815]:
      - heading "Start Your Journey." [level=2] [ref=e816]
      - paragraph [ref=e817]: Join our global community and discover stories that move you.
      - generic [ref=e818]:
        - link "Join Now" [ref=e819]:
          - /url: /login
        - link "Browse Library" [ref=e820]:
          - /url: /library
  - contentinfo [ref=e821]:
    - generic [ref=e822]:
      - generic [ref=e823]:
        - generic [ref=e824]:
          - link "BookVerse Logo BookVerse" [ref=e825]:
            - /url: /
            - img "BookVerse Logo" [ref=e826]
            - generic [ref=e827]: BookVerse
          - paragraph [ref=e829]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e830]:
            - generic [ref=e831]:
              - generic [ref=e832]: 807+
              - generic [ref=e833]: Books
            - generic [ref=e834]:
              - generic [ref=e835]: 4+
              - generic [ref=e836]: Authors
            - generic [ref=e837]:
              - generic [ref=e838]: 7+
              - generic [ref=e839]: Readers
        - generic [ref=e840]:
          - heading "Newsletter" [level=3] [ref=e841]
          - paragraph [ref=e842]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e844]:
            - textbox "Your email" [ref=e845]
            - button [ref=e846]
      - generic [ref=e850]:
        - generic [ref=e851]:
          - heading "Discover" [level=4] [ref=e852]
          - list [ref=e853]:
            - listitem [ref=e854]:
              - link "Home" [ref=e855]:
                - /url: /
            - listitem [ref=e856]:
              - link "Browse Library" [ref=e857]:
                - /url: /library
            - listitem [ref=e858]:
              - link "Stories" [ref=e859]:
                - /url: /stories
            - listitem [ref=e860]:
              - link "Universes" [ref=e861]:
                - /url: /universes
            - listitem [ref=e862]:
              - link "Series" [ref=e863]:
                - /url: /series
            - listitem [ref=e864]:
              - link "Search" [ref=e865]:
                - /url: /search
        - generic [ref=e866]:
          - heading "Community" [level=4] [ref=e867]
          - list [ref=e868]:
            - listitem [ref=e869]:
              - link "Book Clubs" [ref=e870]:
                - /url: /clubs
            - listitem [ref=e871]:
              - link "Activity Feed" [ref=e872]:
                - /url: /activity-feed
            - listitem [ref=e873]:
              - link "Challenges" [ref=e874]:
                - /url: /reading-challenges
            - listitem [ref=e875]:
              - link "My Shelf" [ref=e876]:
                - /url: /shelf
            - listitem [ref=e877]:
              - link "Offline Stories" [ref=e878]:
                - /url: /offline-stories
        - generic [ref=e879]:
          - heading "For Authors" [level=4] [ref=e880]
          - list [ref=e881]:
            - listitem [ref=e882]:
              - link "Author Dashboard" [ref=e883]:
                - /url: /write/dashboard
            - listitem [ref=e884]:
              - link "Write a Story" [ref=e885]:
                - /url: /write/new
            - listitem [ref=e886]:
              - link "Story Universes" [ref=e887]:
                - /url: /write/universes
            - listitem [ref=e888]:
              - link "Story Series" [ref=e889]:
                - /url: /write/series
            - listitem [ref=e890]:
              - link "Analytics" [ref=e891]:
                - /url: /author/analytics
            - listitem [ref=e892]:
              - link "Wallet" [ref=e893]:
                - /url: /wallet
            - listitem [ref=e894]:
              - link "Newsletter & Fans" [ref=e895]:
                - /url: /author/newsletter
            - listitem [ref=e896]:
              - link "Upload Book" [ref=e897]:
                - /url: /upload
        - generic [ref=e898]:
          - heading "Support & Legal" [level=4] [ref=e899]
          - list [ref=e900]:
            - listitem [ref=e901]:
              - link "Premium" [ref=e902]:
                - /url: /premium
            - listitem [ref=e903]:
              - link "Gifts" [ref=e904]:
                - /url: /gifts
            - listitem [ref=e905]:
              - link "Settings" [ref=e906]:
                - /url: /settings
            - listitem [ref=e907]:
              - link "Support Desk" [ref=e908]:
                - /url: /support
            - listitem [ref=e909]:
              - link "Documentation" [ref=e910]:
                - /url: /docs
            - listitem [ref=e911]:
              - link "Privacy Policy" [ref=e912]:
                - /url: /privacy
            - listitem [ref=e913]:
              - link "Terms of Service" [ref=e914]:
                - /url: /terms
            - listitem [ref=e915]:
              - link "Cookie Policy" [ref=e916]:
                - /url: /cookies
            - listitem [ref=e917]:
              - link "DMCA" [ref=e918]:
                - /url: /dmca
        - generic [ref=e919]:
          - heading "Get in Touch" [level=4] [ref=e920]
          - list [ref=e921]:
            - listitem [ref=e922]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e926]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e927]:
              - link "bookverse@gmail.com" [ref=e931]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e932]:
              - link "+880 1799-269699" [ref=e935]:
                - /url: tel:+8801799269699
          - generic [ref=e936]:
            - heading "Follow Us" [level=4] [ref=e937]
            - generic [ref=e938]:
              - link "Facebook" [ref=e939]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e942]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e946]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e949]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e954]:
                - /url: https://tiktok.com
      - generic [ref=e957]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e961]
  - button "Open Next.js Dev Tools" [ref=e969] [cursor=pointer]
  - iframe [aria-hidden] [ref=e973]
  - alert [ref=e974]
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
  25 |     expect(accessibilityScanResults.violations).toEqual([]);
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
> 62 |     expect(hasHorizontalOverflow).toBeFalsy();
     |                                   ^ Error: expect(received).toBeFalsy()
  63 |   });
  64 | });
  65 | 
```