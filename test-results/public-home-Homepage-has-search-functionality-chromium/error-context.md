# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public\home.spec.ts >> Homepage >> has search functionality
- Location: tests\e2e\public\home.spec.ts:47:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"], button[aria-label*="search" i], a[href*="search"]').first()
Expected: visible
Received: hidden
Timeout:  15000ms

Call log:
  - Expect "toBeVisible" locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"], button[aria-label*="search" i], a[href*="search"]').first() with timeout 15000ms
  - waiting for locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"], button[aria-label*="search" i], a[href*="search"]').first()
    27 × locator resolved to <a href="/search" class="group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300">…</a>
       - unexpected value "hidden"

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
  - textbox "Search for 'Space Opera'..."
  - button "Voice Search"
  - button "Search"
  - heading "Your Next Story Awaits." [level=1]
  - paragraph: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
  - link "Start Reading":
    - /url: /library
  - link "Latest Stories":
    - /url: /stories
  - img "User"
  - img "User"
  - img "User"
  - img "User"
  - text: Trusted by 7+ readers 0+ Books 0+ Stories 0+ Readers 0+ Minutes Read
  - link "All":
    - /url: /stories
  - link "Action":
    - /url: /stories?genre=Action
  - link "Adventure":
    - /url: /stories?genre=Adventure
  - link "Comedy":
    - /url: /stories?genre=Comedy
  - link "Contemporary":
    - /url: /stories?genre=Contemporary
  - link "Drama":
    - /url: /stories?genre=Drama
  - link "Dystopian":
    - /url: /stories?genre=Dystopian
  - link "Fantasy":
    - /url: /stories?genre=Fantasy
  - link "Fiction":
    - /url: /stories?genre=Fiction
  - link "Historical":
    - /url: /stories?genre=Historical
  - link "Horror":
    - /url: /stories?genre=Horror
  - link "Mystery":
    - /url: /stories?genre=Mystery
  - link "Paranormal":
    - /url: /stories?genre=Paranormal
  - link "Poetry":
    - /url: /stories?genre=Poetry
  - link "Romance":
    - /url: /stories?genre=Romance
  - link "Science Fiction":
    - /url: /stories?genre=Science%20Fiction
  - link "Slice of Life":
    - /url: /stories?genre=Slice%20of%20Life
  - link "Supernatural":
    - /url: /stories?genre=Supernatural
  - link "Thriller":
    - /url: /stories?genre=Thriller
  - link "More":
    - /url: /search
  - text: Recommended
  - heading "Editor's Choice" [level=2]
  - link "Browse All":
    - /url: /library
  - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0":
    - /url: /library/cmu3nme32000p586w9p7gjkzh
    - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার"
    - text: Fiction
    - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3]
    - paragraph: CamScanner
    - text: 0.0 0
  - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0":
    - /url: /library/cmu3nm10a000h586wwrlpn5uj
    - img "Ashoka the Ungreat"
    - text: Fiction
    - heading "Ashoka the Ungreat" [level=3]
    - paragraph: Subhodeep Mukhopadhyay
    - text: 0.0 0
  - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0":
    - /url: /library/cmu3nq25j002r586wbx4xw0fa
    - img "Julius Caesar"
    - text: Fiction
    - heading "Julius Caesar" [level=3]
    - paragraph: William Shakespeare
    - text: 0.0 0
  - link "The Odyssey Fiction The Odyssey Homer 0.0 0":
    - /url: /library/cmu3nvkcm006p586wlivwrrtw
    - img "The Odyssey"
    - text: Fiction
    - heading "The Odyssey" [level=3]
    - paragraph: Homer
    - text: 0.0 0
  - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0":
    - /url: /library/cmpshibdm00ah58z8ciyjdatz
    - img "যারা ভোর এনেছিল"
    - text: Fiction
    - heading "যারা ভোর এনেছিল" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0":
    - /url: /library/cmu3nozxt0027586w1ebuaxf0
    - img "Frankenstein (1818 Edition)"
    - text: Fiction
    - heading "Frankenstein (1818 Edition)" [level=3]
    - paragraph: Mary Shelley
    - text: 0.0 0
  - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0":
    - /url: /library/cmpshhedo009x58z8fyt0etyg
    - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী"
    - text: Fiction
    - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0":
    - /url: /library/cmu3nt84c004x586w78tspcz9
    - img "Siege of Rome"
    - text: Fiction
    - heading "Siege of Rome" [level=3]
    - paragraph: David Pilling
    - text: 0.0 0
  - text: Latest Stories
  - heading "Community Feed" [level=2]
  - link "View All":
    - /url: /stories
  - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4":
    - /url: /stories/cmpmj9lbe0001la0467wfyaea
    - img "অন্ধকারের ডাক"
    - heading "অন্ধকারের ডাক" [level=3]
    - text: আজিজ ভিলা গ্যাং • Vol 1
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 10 40 2 4
  - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0"':
    - /url: /stories/cmpmjlfgq0001jp04r6fasd14
    - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ"'
    - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3]'
    - text: আজিজ ভিলা গ্যাং • Vol 2
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 8 19 0 0
  - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0":
    - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
    - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)"
    - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3]
    - text: আজিজ ভিলা গ্যাং • Vol 11
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 9 17 0 0
  - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0":
    - /url: /stories/cmpk77e2u0007js049sd7qdwl
    - img "সত্যের মূল্য - ২ The Whistleblower"
    - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3]
    - text: THE DARK EMPIRE UNIVERSE • Vol 5
    - img "TechWisdom"
    - paragraph: TechWisdom
    - text: 4 12 1 0
  - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0":
    - /url: /stories/cmpmk0xlz000bla049kzg96oy
    - img "অন্ধকারের শেষ সীমানা"
    - heading "অন্ধকারের শেষ সীমানা" [level=3]
    - text: আজিজ ভিলা গ্যাং • Vol 3
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 4 12 1 0
  - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0":
    - /url: /stories/cmpk7co0o000bjs04tadrq43x
    - img "অন্ধকারের শেষ যুদ্ধ"
    - heading "অন্ধকারের শেষ যুদ্ধ" [level=3]
    - text: THE DARK EMPIRE UNIVERSE • Vol 5
    - img "TechWisdom"
    - paragraph: TechWisdom
    - text: 8 12 1 0
  - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0":
    - /url: /stories/cmppvwt3m0001l8043895z6uj
    - img "জোয়ার-ভাটার ফাঁদ"
    - heading "জোয়ার-ভাটার ফাঁদ" [level=3]
    - text: আজিজ ভিলা গ্যাং • Vol 5
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 8 10 1 0
  - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0":
    - /url: /stories/cmppvw2nf0001l404uqqpdn36
    - img "নীল জলের গুপ্তচর"
    - heading "নীল জলের গুপ্তচর" [level=3]
    - text: আজিজ ভিলা গ্যাং • Vol 4
    - img "Moizuddin Mohammad Mujahid Rashid"
    - paragraph: Moizuddin Mohammad Mujahid Rashid
    - text: 8 7 1 0
  - text: Explore
  - heading "Browse by Category" [level=2]
  - link "Action 0 Stories":
    - /url: /stories?genre=Action
    - heading "Action" [level=3]
    - paragraph: 0 Stories
  - link "Adventure 1 Stories":
    - /url: /stories?genre=Adventure
    - heading "Adventure" [level=3]
    - paragraph: 1 Stories
  - link "Comedy 0 Stories":
    - /url: /stories?genre=Comedy
    - heading "Comedy" [level=3]
    - paragraph: 0 Stories
  - link "Contemporary 0 Stories":
    - /url: /stories?genre=Contemporary
    - heading "Contemporary" [level=3]
    - paragraph: 0 Stories
  - link "Drama 1 Stories":
    - /url: /stories?genre=Drama
    - heading "Drama" [level=3]
    - paragraph: 1 Stories
  - link "Dystopian 0 Stories":
    - /url: /stories?genre=Dystopian
    - heading "Dystopian" [level=3]
    - paragraph: 0 Stories
  - button "Load More"
  - text: Explore Universes
  - heading "Explore Worlds" [level=2]
  - link "Browse All":
    - /url: /universes
  - link:
    - /url: /universes/cmpll9h810005jl04zaj68jzz
    - text: Mystery 11 Reads
    - heading "ঢাকার ছায়া" [level=3]
    - paragraph: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
    - text: Moizuddin Mohammad Mujahid Rashid 6 Stories
  - link:
    - /url: /universes/cmpjwhspx0002l204rwpflilv
    - text: Thriller 38 Reads
    - heading "THE DARK EMPIRE UNIVERSE" [level=3]
    - paragraph: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
    - text: TechWisdom 7 Stories
  - heading "New Arrivals" [level=2]
  - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0":
    - /url: /library/cmu3nu3de005l586wjzfmehmw
    - img "The Adventures of Captain Hatteras"
    - text: Fiction
    - heading "The Adventures of Captain Hatteras" [level=3]
    - paragraph: Jules Verne
    - text: 0.0 0
  - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0"':
    - /url: /library/cmu3npokm002j586wcufatvre
    - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year"'
    - text: Fiction
    - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3]'
    - paragraph: Carol Leonnig & Philip Rucker
    - text: 0.0 0
  - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0"':
    - /url: /library/cmu3np67f002b586w60leadjk
    - 'img "Genghis: Lords of the Bow"'
    - text: Fiction
    - 'heading "Genghis: Lords of the Bow" [level=3]'
    - paragraph: Conn Iggulden
    - text: 0.0 0
  - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0":
    - /url: /library/cmu3no58a001p586wkary5auz
    - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)"
    - text: Fiction
    - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0":
    - /url: /library/cmu3nlway000d586w6dcwg0e3
    - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta"
    - text: Fiction
    - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0":
    - /url: /library/cmu3nl6pv0001586w9lrhc3b6
    - img "Against All Odds"
    - text: Fiction
    - heading "Against All Odds" [level=3]
    - paragraph: Craig Challen
    - text: 0.0 0
  - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0":
    - /url: /library/cmpshhihy009z58z81x7qjevf
    - img "মার্কিন দলিলে মুজিব হত্যাকান্ড"
    - text: Fiction
    - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0":
    - /url: /library/cmpshghfv009f58z870y55pkn
    - img "ভারতীয় দর্শন By ড. দেবব্রত সেন"
    - text: Fiction
    - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3]
    - paragraph: Unknown Author
    - text: 0.0 0
  - heading "Archive" [level=3]
  - paragraph: Access 10,000+ volumes instantly.
  - heading "Offline" [level=3]
  - paragraph: Read your favorite stories anywhere.
  - heading "Library" [level=3]
  - paragraph: Track your reading progress easily.
  - heading "Speed" [level=3]
  - paragraph: Lightning fast reading experience.
  - heading "Start Your Journey." [level=2]
  - paragraph: Join our global community and discover stories that move you.
  - link "Join Now":
    - /url: /login
  - link "Browse Library":
    - /url: /library
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
  2  |  * E2E Tests: Homepage
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Homepage', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/');
  9  |     await page.waitForLoadState('domcontentloaded');
  10 |   });
  11 | 
  12 |   test('homepage loads successfully', async ({ page }) => {
  13 |     await expect(page).toHaveURL('/');
  14 |     const body = await page.textContent('body');
  15 |     expect(body?.length).toBeGreaterThan(100);
  16 |   });
  17 | 
  18 |   test('displays hero section', async ({ page }) => {
  19 |     // Look for hero section or main heading
  20 |     const heading = page.locator('h1, [class*="hero"], [data-testid="hero"]').first();
  21 |     await expect(heading).toBeVisible();
  22 |   });
  23 | 
  24 |   test('displays category/genre grid', async ({ page }) => {
  25 |     // Look for category or genre links/cards
  26 |     const pageContent = await page.textContent('body');
  27 |     expect(
  28 |       pageContent?.toLowerCase().includes('fiction') ||
  29 |       pageContent?.toLowerCase().includes('fantasy') ||
  30 |       pageContent?.toLowerCase().includes('romance') ||
  31 |       pageContent?.toLowerCase().includes('mystery') ||
  32 |       pageContent?.toLowerCase().includes('genre') ||
  33 |       pageContent?.toLowerCase().includes('categories')
  34 |     ).toBeTruthy();
  35 |   });
  36 | 
  37 |   test('has navigation bar', async ({ page }) => {
  38 |     const nav = page.locator('nav, header, [role="navigation"]').first();
  39 |     await expect(nav).toBeVisible();
  40 |   });
  41 | 
  42 |   test('has footer', async ({ page }) => {
  43 |     const footer = page.locator('footer').first();
  44 |     await expect(footer).toBeVisible();
  45 |   });
  46 | 
  47 |   test('has search functionality', async ({ page }) => {
  48 |     // Look for search input or search button
  49 |     const searchElement = page.locator(
  50 |       'input[type="search"], input[placeholder*="search" i], [data-testid*="search"], button[aria-label*="search" i], a[href*="search"]'
  51 |     );
> 52 |     await expect(searchElement.first()).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  53 |   });
  54 | 
  55 |   test('has links to stories and library', async ({ page }) => {
  56 |     const storiesLink = page.locator('a[href*="/stories"], a:has-text("Stories")');
  57 |     const libraryLink = page.locator('a[href*="/library"], a:has-text("Library"), a:has-text("Books")');
  58 |     
  59 |     expect(
  60 |       (await storiesLink.count()) > 0 || (await libraryLink.count()) > 0
  61 |     ).toBeTruthy();
  62 |   });
  63 | 
  64 |   test('has login/signup links for visitors', async ({ page }) => {
  65 |     const authLinks = page.locator('a[href*="login"], a[href*="signup"], a:has-text("Log in"), a:has-text("Sign up")');
  66 |     // At least some auth-related links should be present for visitors
  67 |     expect(await authLinks.count()).toBeGreaterThanOrEqual(0);
  68 |   });
  69 | });
  70 | 
```