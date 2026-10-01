# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\reset-password.spec.ts >> Reset Password Flow >> reset password page requires valid token
- Location: tests\e2e\auth\reset-password.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "invalid"
Received string:    "((e, i, s, u, m, a, l, h)=>{
    let d = document.documentelement, w = [
        \"light\",
        \"dark\"
    ];
    function p(n) {
        (array.isarray(e) ? e : [
            e
        ]).foreach((y)=>{
            let k = y === \"class\", s = k && a ? m.map((f)=>a[f] || f) : m;
            k ? (d.classlist.remove(...s), d.classlist.add(a && a[n] ? a[n] : n)) : d.setattribute(y, n);
        }), r(n);
    }
    function r(n) {
        h && w.includes(n) && (d.style.colorscheme = n);
    }
    function c() {
        return window.matchmedia(\"(prefers-color-scheme: dark)\").matches ? \"dark\" : \"light\";
    }
    if (u) p(u);
    else try {
        let n = localstorage.getitem(i) || s, y = l && n === \"system\" ? c() : n;
        p(y);
    } catch (n) {}
})(\"class\",\"theme\",\"system\",null,[\"light\",\"dark\",\"rose\",\"amoled\",\"cyberpunk\",\"mint\",\"neon\",\"earth\",\"canvas\",\"vintage\",\"oceanic\",\"royal\"],{\"light\":\"light\",\"dark\":\"dark\",\"rose\":\"rose\",\"amoled\":\"amoled\",\"cyberpunk\":\"cyberpunk\",\"mint\":\"mint\",\"neon\":\"neon\",\"earth\":\"earth\",\"canvas\":\"canvas\",\"vintage\":\"vintage\",\"oceanic\":\"oceanic\",\"royal\":\"royal\"},true,true)librarysearchsupportbookversesupportlibrarystoriesuniversesseriesclubshomesearchfeedai librarianbookversepage not found404.the page you're looking for doesn't exist or has been moved.404not found go home go backlooking for something? search bookversebookversediscover, read, and share your favorite books with a community of passionate readers. join millions of book lovers on their literary journey.10k+books500+authors50k+readersnewsletterweekly book recommendations and author updates, straight to your inbox.discoverhomebrowse librarystoriesuniversesseriessearchcommunitybook clubsactivity feedchallengesmy shelfoffline storiesfor authorsauthor dashboardwrite a storystory universesstory seriesanalyticswalletnewsletter & fansupload booksupport & legalpremiumgiftssettingssupport deskdocumentationprivacy policyterms of servicecookie policydmcaget in touchjohra mension, koyalarbarikuratoli, kuril-1229dhaka, bangladeshbookverse@gmail.com+880 1799-269699follow us© 2026 bookverse. all rights reserved.requestanimationframe(function(){$rt=performance.now()});self.__next_r=\"gs0v-k0v9__uvvglpshwp\"$rb=[];$rv=function(a){$rt=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentnode&&e.parentnode.removechild(e);var f=c.parentnode;if(f){var g=c.previoussibling,h=0;do{if(c&&8===c.nodetype){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextsibling;f.removechild(c);c=d}while(c);for(;e.firstchild;)f.insertbefore(e.firstchild,c);g.data=\"$\";g._reactretry&&requestanimationframe(g._reactretry)}}a.length=0};
$rc=function(a,b){if(b=document.getelementbyid(b))(a=document.getelementbyid(a))?(a.previoussibling.data=\"$~\",$rb.push(a,b),2===$rb.length&&(\"number\"!==typeof $rt?requestanimationframe($rv.bind(null,$rb)):(a=performance.now(),settimeout($rv.bind(null,$rb),2300>a&&2e3<a?2300-a:$rt+300-a)))):b.parentnode.removechild(b)};$rc(\"b:0\",\"s:0\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"7:i[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"loadingboundaryprovider\\\"]\\n9:i[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"segmentviewnode\\\"]\\nb:i[\\\"[project]/src/app/loading.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/_0gpfz60._.js\\\",\\\"/_next/static/chunks/src_app_loading_tsx_11f055q._.js\\\"],\\\"default\\\"]\\n10:\\\"$sreact.fragment\\\"\\n26:i[\\\"[project]/src/app/providers.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"providers\\\"]\\n28:i[\\\"[project]/src/components/layout/applayout.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"applayout\\\"]\\n2a:i[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n2b:i[\\\"[project]/src/app/error.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/_05gqgj9._.js\\\",\\\"/_next/static/chunks/src_app_error_tsx_11f055q._.js\\\"],\\\"default\\\"]\\n30:i[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/\"])self.__next_f.push([1,\"chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n33:i[\\\"[project]/src/app/not-found.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/_02clat1._.js\\\",\\\"/_next/static/chunks/src_app_not-found_tsx_11f055q._.js\\\"],\\\"default\\\"]\\n39:i[\\\"[project]/node_modules/next/dist/client/script.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\n40:i[\\\"[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"clientpageroot\\\"]\\n48:i[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"outletboundary\\\"]\\n4a:\\\"$sreact.suspense\\\"\\n59:i[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"viewportboundary\\\"]\\n63:i[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"metadataboundary\\\"]\\n6a:i[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_11f\"])self.__next_f.push([1,\"055q.js\\\"],\\\"default\\\",1]\\n8e:i[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"iconmark\\\"]\\n:hl[\\\"/_next/static/chunks/%5broot-of-the-server%5d__0xt1hc~._.css\\\",\\\"style\\\"]\\n1:d\\\"$4\\\"\\n1:d\\\"$2\\\"\\n1:d\\\"$5\\\"\\n1:null\\n19:d\\\"$21\\\"\\n19:d\\\"$1a\\\"\\n19:d\\\"$23\\\"\\n\"])self.__next_f.push([1,\"19:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"en\\\",\\\"classname\\\":\\\"h-full antialiased plus_jakarta_sans_7d753922-module__n5odtq__variable merriweather_1c1d663-module__5nxrrq__variable hind_siliguri_26d35420-module__br54yg__variable\\\",\\\"suppresshydrationwarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"classname\\\":\\\"min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-[family-name:var(--font-sans)] dark:bg-zinc-950 dark:text-zinc-50\\\",\\\"suppresshydrationwarning\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"$l26\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$l28\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$l2a\\\",null,{\\\"parallelrouterkey\\\":\\\"children\\\",\\\"error\\\":\\\"$2b\\\",\\\"errorstyles\\\":[\\\"$\\\",\\\"$l9\\\",null,{\\\"type\\\":\\\"error\\\",\\\"pagepath\\\":\\\"error.tsx\\\",\\\"children\\\":[]},null,\\\"$2c\\\",0],\\\"errorscripts\\\":[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/_05gqgj9._.js\\\",\\\"async\\\":true},null,\\\"$2d\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_error_tsx_11f055q._.js\\\",\\\"async\\\":true},null,\\\"$2e\\\",0]],\\\"template\\\":[\\\"$\\\",\\\"$l30\\\",null,{},null,\\\"$2f\\\",1],\\\"templatestyles\\\":\\\"$undefined\\\",\\\"templatescripts\\\":\\\"$undefined\\\",\\\"notfound\\\":[\\\"$\\\",\\\"$l9\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagepath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[[\\\"$\\\",\\\"$l33\\\",null,{},null,\\\"$32\\\",1],[]]},null,\\\"$31\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentviewboundaries\\\":[[\\\"$\\\",\\\"$l9\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagepath\\\":\\\"not-found.tsx@boundary\\\"},null,\\\"$34\\\",1],[\\\"$\\\",\\\"$l9\\\",null,{\\\"type\\\":\\\"boundary:loading\\\",\\\"pagepath\\\":\\\"loading.tsx@boundary\\\"},null,\\\"$35\\\",1],[\\\"$\\\",\\\"$l9\\\",null,{\\\"type\\\":\\\"boundary:error\\\",\\\"pagepath\\\":\\\"error.tsx@boundary\\\"},null,\\\"$36\\\",1],[\\\"$\\\",\\\"$l9\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagepath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$37\\\",1]]},null,\\\"$29\\\",1]},\\\"$1a\\\",\\\"$27\\\",1]},\\\"$1a\\\",\\\"$25\\\",1],[\\\"$\\\",\\\"$l39\\\",null,{\\\"id\\\":\\\"service-worker-registration\\\",\\\"strategy\\\":\\\"afterinteractive\\\",\\\"children\\\":\\\"\\\\n            if ('serviceworker' in navigator) {\\\\n              window.addeventlistener('load', function() {\\\\n                navigator.serviceworker.register('/sw.js').then(function(registration) {\\\\n                  console.log('serviceworker registration successful');\\\\n                }, function(err) {\\\\n                  console.log('serviceworker registration failed: ', err);\\\\n                });\\\\n              });\\\\n            }\\\\n          \\\"},\\\"$1a\\\",\\\"$38\\\",1]]},\\\"$1a\\\",\\\"$24\\\",1]},\\\"$1a\\\",\\\"$22\\\",1]\\n\"])self.__next_f.push([1,\"43:d\\\"$45\\\"\\n43:d\\\"$44\\\"\\n43:d\\\"$47\\\"\\n43:[\\\"$\\\",\\\"$l48\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4a\\\",null,{\\\"name\\\":\\\"next.metadataoutlet\\\",\\\"children\\\":\\\"$@4b\\\"},\\\"$44\\\",\\\"$49\\\",1]},\\\"$44\\\",\\\"$46\\\",1]\\n4e:d\\\"$51\\\"\\n4e:d\\\"$4f\\\"\\n4e:d\\\"$53\\\"\\n4e:[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"noindex\\\"},\\\"$4f\\\",\\\"$52\\\",1]\\n54:d\\\"$56\\\"\\n54:d\\\"$55\\\"\\n54:d\\\"$58\\\"\\n5a:d\\\"$5c\\\"\\n5a:d\\\"$5b\\\"\\n54:[\\\"$\\\",\\\"$l59\\\",null,{\\\"children\\\":\\\"$l5a\\\"},\\\"$55\\\",\\\"$57\\\",1]\\n5d:d\\\"$5f\\\"\\n5d:d\\\"$5e\\\"\\n5d:d\\\"$61\\\"\\n65:d\\\"$67\\\"\\n65:d\\\"$66\\\"\\n5d:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$l63\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4a\\\",null,{\\\"name\\\":\\\"next.metadata\\\",\\\"children\\\":\\\"$l65\\\"},\\\"$5e\\\",\\\"$64\\\",1]},\\\"$5e\\\",\\\"$62\\\",1]},\\\"$5e\\\",\\\"$60\\\",1]\\n69:[]\\n\"])self.__next_f.push([1,\"0:{\\\"p\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"reset-password\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"/_not-found\\\",{\\\"children\\\":[\\\"__page__\\\",{}]}]},\\\"$undefined\\\",\\\"$undefined\\\",20],[[\\\"$\\\",\\\"$l7\\\",null,{\\\"loading\\\":[[\\\"$\\\",\\\"$l9\\\",\\\"c-loading\\\",{\\\"type\\\":\\\"loading\\\",\\\"pagepath\\\":\\\"loading.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$lb\\\",\\\"l\\\",{},null,\\\"$a\\\",1]},null,\\\"$8\\\",0],[],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/_0gpfz60._.js\\\",\\\"async\\\":true},null,\\\"$c\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_loading_tsx_11f055q._.js\\\",\\\"async\\\":true},null,\\\"$d\\\",0]]],\\\"children\\\":[\\\"$\\\",\\\"$l9\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagepath\\\":\\\"layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$10\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5broot-of-the-server%5d__0xt1hc~._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__0xt1hc~._.css\\\",\\\"crossorigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$11\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_0zxn8.f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$12\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_073119l._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$13\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_%40firebase_auth_dist_esm_0~gfruc._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$14\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_03co3hq._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$15\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0oitghd._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$16\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_0ohi0nc._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$17\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$18\\\",0]],\\\"$19\\\"]},null,\\\"$f\\\",1]},null,\\\"$e\\\",0]},null,\\\"$6\\\",2],{\\\"children\\\":[[\\\"$\\\",\\\"$10\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$l2a\\\",null,{\\\"parallelrouterkey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorstyles\\\":\\\"$undefined\\\",\\\"errorscripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$l30\\\",null,{},null,\\\"$3c\\\",1],\\\"templatestyles\\\":\\\"$undefined\\\",\\\"templatescripts\\\":\\\"$undefined\\\",\\\"notfound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentviewboundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$3b\\\",1]]},null,\\\"$3a\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$10\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$l9\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagepath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$l40\\\",null,{\\\"component\\\":\\\"$33\\\",\\\"serverprovidedparams\\\":{\\\"searchparams\\\":{},\\\"params\\\":{},\\\"promises\\\":null}},null,\\\"$3f\\\",1]},null,\\\"$3e\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/_02clat1._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$41\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_not-found_tsx_11f055q._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$42\\\",0]],\\\"$43\\\"]},null,\\\"$3d\\\",0],{},null,false,null]},null,false,\\\"$@4c\\\"]},null,false,null],[\\\"$\\\",\\\"$10\\\",\\\"h\\\",{\\\"children\\\":[\\\"$4e\\\",\\\"$54\\\",\\\"$5d\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$68\\\",1]]},null,\\\"$4d\\\",0],false]],\\\"m\\\":\\\"$w69\\\",\\\"g\\\":[\\\"$6a\\\",[\\\"$\\\",\\\"$l9\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagepath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5broot-of-the-server%5d__0xt1hc~._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__0xt1hc~._.css\\\",\\\"crossorigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$6c\\\",0]]},null,\\\"$6b\\\",0]],\\\"s\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"6d:[]\\n4c:d\\\"$6e\\\"\\n4c:\\\"$w6d\\\"\\n5a:d\\\"$6f\\\"\\n5a:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charset\\\":\\\"utf-8\\\"},\\\"$44\\\",\\\"$70\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$44\\\",\\\"$71\\\",0]]\\n4b:d\\\"$72\\\"\\n4b:null\\n65:d\\\"$73\\\"\\n\"])self.__next_f.push([1,\"65:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"bookverse - read, write, connect\\\"},\\\"$44\\\",\\\"$74\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"read free books, publish original stories, and build your personal library. bookverse is an open platform for readers and writers worldwide.\\\"},\\\"$44\\\",\\\"$75\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"2\\\",{\\\"name\\\":\\\"author\\\",\\\"content\\\":\\\"bookverse team\\\"},\\\"$44\\\",\\\"$76\\\",0],[\\\"$\\\",\\\"link\\\",\\\"3\\\",{\\\"rel\\\":\\\"manifest\\\",\\\"href\\\":\\\"/site.webmanifest\\\",\\\"crossorigin\\\":\\\"$undefined\\\"},\\\"$44\\\",\\\"$77\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"4\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"books,reading,stories,writing,ebooks,free books,online library,fan fiction,novels,authors\\\"},\\\"$44\\\",\\\"$78\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"bookverse\\\"},\\\"$44\\\",\\\"$79\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"},\\\"$44\\\",\\\"$7a\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1\\\"},\\\"$44\\\",\\\"$7b\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"bookverse - read, write, connect\\\"},\\\"$44\\\",\\\"$7c\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"read free books, publish original stories, and build your personal library.\\\"},\\\"$44\\\",\\\"$7d\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"http://localhost:3000\\\"},\\\"$44\\\",\\\"$7e\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"11\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"bookverse\\\"},\\\"$44\\\",\\\"$7f\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:locale\\\",\\\"content\\\":\\\"en_us\\\"},\\\"$44\\\",\\\"$80\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"http://localhost:3000/og-image.jpg\\\"},\\\"$44\\\",\\\"$81\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"},\\\"$44\\\",\\\"$82\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"},\\\"$44\\\",\\\"$83\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"bookverse\\\"},\\\"$44\\\",\\\"$84\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"},\\\"$44\\\",\\\"$85\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"},\\\"$44\\\",\\\"$86\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"bookverse - read, write, connect\\\"},\\\"$44\\\",\\\"$87\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"read free books, publish original stories, and build your personal library.\\\"},\\\"$44\\\",\\\"$88\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"http://localhost:3000/og-image.jpg\\\"},\\\"$44\\\",\\\"$89\\\",0],[\\\"$\\\",\\\"link\\\",\\\"22\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/bookverse.png\\\"},\\\"$44\\\",\\\"$8a\\\",0],[\\\"$\\\",\\\"link\\\",\\\"23\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/bookverse.png\\\"},\\\"$44\\\",\\\"$8b\\\",0],[\\\"$\\\",\\\"link\\\",\\\"24\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/apple-touch-icon.png\\\"},\\\"$44\\\",\\\"$8c\\\",0],[\\\"$\\\",\\\"$l8e\\\",\\\"25\\\",{},\\\"$44\\\",\\\"$8d\\\",0]]\\n\"])"
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
        - link "BookVerse Logo BookVerse" [ref=e72] [cursor=pointer]:
          - /url: /
          - img "BookVerse Logo" [ref=e73]
          - generic [ref=e74]: BookVerse
        - generic [ref=e76]: Page Not Found
        - heading "404." [level=1] [ref=e79]
        - paragraph [ref=e80]: The page you're looking for doesn't exist or has been moved.
      - generic [ref=e81]:
        - generic [ref=e82]: "404"
        - generic [ref=e83]: Not Found
      - generic [ref=e84]:
        - link "Go Home" [ref=e85] [cursor=pointer]:
          - /url: /
        - button "Go Back" [ref=e89]
      - generic [ref=e92]:
        - paragraph [ref=e93]: Looking for something?
        - link "Search BookVerse" [ref=e94] [cursor=pointer]:
          - /url: /search
  - contentinfo [ref=e98]:
    - generic [ref=e99]:
      - generic [ref=e100]:
        - generic [ref=e101]:
          - link "BookVerse Logo BookVerse" [ref=e102] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e103]
            - generic [ref=e104]: BookVerse
          - paragraph [ref=e106]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e107]:
            - generic [ref=e108]:
              - generic [ref=e109]: 10K+
              - generic [ref=e110]: Books
            - generic [ref=e111]:
              - generic [ref=e112]: 500+
              - generic [ref=e113]: Authors
            - generic [ref=e114]:
              - generic [ref=e115]: 50K+
              - generic [ref=e116]: Readers
        - generic [ref=e117]:
          - heading "Newsletter" [level=3] [ref=e118]
          - paragraph [ref=e119]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e121]:
            - textbox "Your email" [ref=e122]
            - button [ref=e123]
      - generic [ref=e127]:
        - generic [ref=e128]:
          - heading "Discover" [level=4] [ref=e129]
          - list [ref=e130]:
            - listitem [ref=e131]:
              - link "Home" [ref=e132] [cursor=pointer]:
                - /url: /
            - listitem [ref=e133]:
              - link "Browse Library" [ref=e134] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e135]:
              - link "Stories" [ref=e136] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e137]:
              - link "Universes" [ref=e138] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e139]:
              - link "Series" [ref=e140] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e141]:
              - link "Search" [ref=e142] [cursor=pointer]:
                - /url: /search
        - generic [ref=e143]:
          - heading "Community" [level=4] [ref=e144]
          - list [ref=e145]:
            - listitem [ref=e146]:
              - link "Book Clubs" [ref=e147] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e148]:
              - link "Activity Feed" [ref=e149] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e150]:
              - link "Challenges" [ref=e151] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e152]:
              - link "My Shelf" [ref=e153] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e154]:
              - link "Offline Stories" [ref=e155] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e156]:
          - heading "For Authors" [level=4] [ref=e157]
          - list [ref=e158]:
            - listitem [ref=e159]:
              - link "Author Dashboard" [ref=e160] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e161]:
              - link "Write a Story" [ref=e162] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e163]:
              - link "Story Universes" [ref=e164] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e165]:
              - link "Story Series" [ref=e166] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e167]:
              - link "Analytics" [ref=e168] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e169]:
              - link "Wallet" [ref=e170] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e171]:
              - link "Newsletter & Fans" [ref=e172] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e173]:
              - link "Upload Book" [ref=e174] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e175]:
          - heading "Support & Legal" [level=4] [ref=e176]
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "Premium" [ref=e179] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e180]:
              - link "Gifts" [ref=e181] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e182]:
              - link "Settings" [ref=e183] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e184]:
              - link "Support Desk" [ref=e185] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e186]:
              - link "Documentation" [ref=e187] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e188]:
              - link "Privacy Policy" [ref=e189] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e190]:
              - link "Terms of Service" [ref=e191] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e192]:
              - link "Cookie Policy" [ref=e193] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e194]:
              - link "DMCA" [ref=e195] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e196]:
          - heading "Get in Touch" [level=4] [ref=e197]
          - list [ref=e198]:
            - listitem [ref=e199]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e203] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e204]:
              - link "bookverse@gmail.com" [ref=e208] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e209]:
              - link "+880 1799-269699" [ref=e212] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e213]:
            - heading "Follow Us" [level=4] [ref=e214]
            - generic [ref=e215]:
              - link "Facebook" [ref=e216] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e219] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e223] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e226] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e231] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e234]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e238]
  - button "Open Next.js Dev Tools" [ref=e246] [cursor=pointer]
  - alert [ref=e250]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Reset Password Flow
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('Reset Password Flow', () => {
  7  |   test('reset password page requires valid token', async ({ page }) => {
  8  |     // Accessing without token should show error or redirect
  9  |     await page.goto('/reset-password');
  10 |     await page.waitForLoadState('domcontentloaded');
  11 |     
  12 |     const body = await page.textContent('body');
  13 |     // Usually expects a token in query string, e.g., ?token=123
> 14 |     expect(body?.toLowerCase()).toContain('invalid');
     |                                 ^ Error: expect(received).toContain(expected) // indexOf
  15 |   });
  16 | 
  17 |   test('reset password page loads with mock token', async ({ page }) => {
  18 |     await page.goto('/reset-password?token=mock-valid-token');
  19 |     await page.waitForLoadState('domcontentloaded');
  20 |     
  21 |     // Should display the new password form
  22 |     const passwordInput = page.locator('input[type="password"]').first();
  23 |     if (await passwordInput.count() > 0) {
  24 |       await expect(passwordInput).toBeVisible();
  25 |     }
  26 |   });
  27 | });
  28 | 
```