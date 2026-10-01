# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery\recovery-network.spec.ts >> Phase 1: Client-Side Network & Sync Recovery >> Stale Data Revalidation - updates UI after network drop
- Location: tests\e2e\recovery\recovery-network.spec.ts:111:7

# Error details

```
Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - navigation "Bottom navigation" [ref=f2e2]:
    - generic [ref=f2e3]:
      - generic [ref=f2e4]:
        - link [ref=f2e5] [cursor=pointer]:
          - /url: /
          - img "BookVerse" [ref=f2e8]
          - generic: BookVerse
        - link [ref=f2e9] [cursor=pointer]:
          - /url: /support
        - link [ref=f2e15] [cursor=pointer]:
          - /url: /library
        - link [ref=f2e20] [cursor=pointer]:
          - /url: /stories
        - link [ref=f2e26] [cursor=pointer]:
          - /url: /universes
        - link [ref=f2e32] [cursor=pointer]:
          - /url: /series
        - link [ref=f2e39] [cursor=pointer]:
          - /url: /clubs
      - link [ref=f2e45] [cursor=pointer]:
        - /url: /
      - generic [ref=f2e50]:
        - link [ref=f2e51] [cursor=pointer]:
          - /url: /search
        - link [ref=f2e57] [cursor=pointer]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=f2e62]:
          - generic: AI Librarian
  - main [ref=f2e69]
```

# Test source

```ts
  33  |     await page.waitForTimeout(4000);
  34  | 
  35  |     // Go offline
  36  |     await page.context().setOffline(true);
  37  | 
  38  |     // Mock an IndexedDB write
  39  |     try {
  40  |       await page.evaluate(async () => {
  41  |         return new Promise((resolve) => {
  42  |           const req = indexedDB.open('bookverse_offline', 1);
  43  |           req.onerror = () => resolve(false);
  44  |           req.onupgradeneeded = (e: any) => {
  45  |             const db = e.target.result;
  46  |             if (!db.objectStoreNames.contains('drafts')) {
  47  |               db.createObjectStore('drafts', { keyPath: 'id' });
  48  |             }
  49  |           };
  50  |           req.onsuccess = (e: any) => {
  51  |             const db = e.target.result;
  52  |             const tx = db.transaction('drafts', 'readwrite');
  53  |             const putReq = tx.objectStore('drafts').put({ id: 'test-draft', content: 'Offline work', synced: false });
  54  |             putReq.onsuccess = () => resolve(true);
  55  |             putReq.onerror = () => resolve(false);
  56  |           };
  57  |         });
  58  |       });
  59  |     } catch(e) {}
  60  | 
  61  |     // We verify the draft is locally saved
  62  |     let draftContent = null;
  63  |     for (let i = 0; i < 3; i++) {
  64  |       try {
  65  |         draftContent = await page.evaluate(async () => {
  66  |           return new Promise((resolve) => {
  67  |             const req = indexedDB.open('bookverse_offline', 1);
  68  |             req.onerror = () => resolve(null);
  69  |             req.onsuccess = (e: any) => {
  70  |               const db = e.target.result;
  71  |               try {
  72  |                 const tx = db.transaction('drafts', 'readonly');
  73  |                 const getReq = tx.objectStore('drafts').get('test-draft');
  74  |                 getReq.onsuccess = () => resolve(getReq.result?.content || null);
  75  |                 getReq.onerror = () => resolve(null);
  76  |               } catch(err) {
  77  |                 resolve(null);
  78  |               }
  79  |             };
  80  |           });
  81  |         });
  82  |         if (draftContent) break;
  83  |       } catch (e) {
  84  |         await page.waitForTimeout(1000);
  85  |       }
  86  |     }
  87  |     expect(draftContent).toBe('Offline work');
  88  | 
  89  |     // Setup an intercept to catch the sync POST request when online
  90  |     let syncFired = false;
  91  |     await page.route('/api/stories/sync', (route) => {
  92  |       syncFired = true;
  93  |       route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
  94  |     });
  95  | 
  96  |     // Go back online
  97  |     await page.context().setOffline(false);
  98  |     await page.waitForTimeout(1000);
  99  | 
  100 |     // Trigger an online event listener or wait for the auto-sync interval
  101 |     try {
  102 |       await page.evaluate(() => {
  103 |         window.dispatchEvent(new Event('online'));
  104 |       });
  105 |     } catch(e) {}
  106 | 
  107 |     await page.waitForTimeout(1000);
  108 |     expect(page.url()).toContain('/');
  109 |   });
  110 | 
  111 |   test('Stale Data Revalidation - updates UI after network drop', async ({ page }) => {
  112 |     // We will inject a client-side fetch polling mechanism and verify it recovers
  113 |     await page.goto('/');
  114 |     await page.waitForTimeout(4000);
  115 | 
  116 |     await page.context().setOffline(true);
  117 |     
  118 |     // Attempt fetch offline
  119 |     const res1 = await page.evaluate(async () => {
  120 |       try {
  121 |         await fetch('/api/stories', { method: 'POST', body: JSON.stringify({ title: 'test' }) });
  122 |         return 'success';
  123 |       } catch (e) {
  124 |         return 'failed';
  125 |       }
  126 |     });
  127 |     expect(res1).toBe('failed');
  128 | 
  129 |     await page.context().setOffline(false);
  130 |     await page.waitForTimeout(1000);
  131 |     
  132 |     // Attempt fetch online
> 133 |     const res2 = await page.evaluate(async () => {
      |                             ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
  134 |       try {
  135 |         await fetch('/api/stories', { method: 'POST', body: JSON.stringify({ title: 'test' }) });
  136 |         return 'success';
  137 |       } catch (e) {
  138 |         return 'failed';
  139 |       }
  140 |     });
  141 |     expect(res2).toBe('success');
  142 |   });
  143 | 
  144 |   test('Form Submission Recovery - double submission prevention after offline failure', async ({ page }) => {
  145 |     // Do not use page.route here, because page.route bypasses page.context().setOffline()
  146 |     // It intercepts inside the browser, making the request succeed even when offline!
  147 | 
  148 |     await page.goto('/');
  149 |     await page.waitForTimeout(4000); // stable context
  150 | 
  151 |     // Go offline
  152 |     await page.context().setOffline(true);
  153 | 
  154 |     // Attempt submission via fetch to simulate form behavior
  155 |     let result1 = 'failed';
  156 |     try {
  157 |       result1 = await page.evaluate(async () => {
  158 |         try {
  159 |           await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ message: 'test' }) });
  160 |           return 'success';
  161 |         } catch (e) {
  162 |           return 'failed';
  163 |         }
  164 |       });
  165 |     } catch(e) {
  166 |       // Ignore execution context destroyed
  167 |     }
  168 |     
  169 |     expect(result1).toBe('failed');
  170 | 
  171 |     // Restore network
  172 |     await page.context().setOffline(false);
  173 |     await page.waitForTimeout(1000);
  174 | 
  175 |     // Attempt submission again
  176 |     const result2 = await page.evaluate(async () => {
  177 |       try {
  178 |         const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ message: 'test' }) });
  179 |         return res.status === 200 || res.status === 404 ? 'success' : 'failed'; // Accept 404 since route might not exist, but network succeeded
  180 |       } catch (e) {
  181 |         return 'error';
  182 |       }
  183 |     });
  184 | 
  185 |     expect(result2).toBe('success');
  186 |   });
  187 | 
  188 | });
  189 | 
```