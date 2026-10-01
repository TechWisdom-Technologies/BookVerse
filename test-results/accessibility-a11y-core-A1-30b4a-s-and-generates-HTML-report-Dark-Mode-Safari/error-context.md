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

- Expected  -    1
+ Received  + 1984

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
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Chapters\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Chapters\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(4) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(6) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#212123",
+               "contrastRatio": 3.32,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10\">",
+                 "target": Array [
+                   ".border-y",
+                 ],
+               },
+               Object {
+                 "html": "<main class=\"relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.32 (foreground color: #71717b, background color: #212123, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center gap-1\" title=\"Views\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .gap-3.dark\\:border-zinc-800\\/50.pt-3 > .gap-1[title=\"Views\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm\" href=\"/universes/cmpll9h810005jl04zaj68jzz\">",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].gap-1.text-zinc-400",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm\" href=\"/universes/cmpll9h810005jl04zaj68jzz\">",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-zinc-500 font-medium line-clamp-2 leading-relaxed\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .flex-1 > .leading-relaxed.line-clamp-2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm\" href=\"/universes/cmpjwhspx0002l204rwpflilv\">",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].gap-1.text-zinc-400",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm\" href=\"/universes/cmpjwhspx0002l204rwpflilv\">",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-zinc-500 font-medium line-clamp-2 leading-relaxed\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .flex-1 > .leading-relaxed.line-clamp-2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[11px] text-zinc-500 leading-relaxed font-medium max-w-md italic\">Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-md",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div id=\"newsletter\" class=\"border border-zinc-100 dark:border-zinc-900 rounded p-8 bg-white dark:bg-zinc-950 shadow-sm\">",
+                 "target": Array [
+                   "#newsletter",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[11px] text-zinc-500 mb-6 font-medium leading-relaxed italic\">Weekly book recommendations and author updates, straight to your inbox.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mb-6",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">Discover</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-6:nth-child(1) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/\">Home</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:text-zinc-900.dark\\:hover\\:text-white[href=\"/\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/library\">Browse Library</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"library\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/stories\">Stories</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(3) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"stories\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/universes\">Universes</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(4) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"universes\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/series\">Series</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(5) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"series\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/search\">Search</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(6) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"search\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">Community</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-6:nth-child(2) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/clubs\">Book Clubs</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"clubs\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/activity-feed\">Activity Feed</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"activity-feed\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/reading-challenges\">Challenges</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"reading-challenges\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/shelf\">My Shelf</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"shelf\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/offline-stories\">Offline Stories</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"offline-stories\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">For Authors</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-6:nth-child(3) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/write/dashboard\">Author Dashboard</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"dashboard\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/write/new\">Write a Story</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"new\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/write/universes\">Story Universes</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(3) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"universes\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/write/series\">Story Series</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "li:nth-child(4) > .hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"series\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/author/analytics\">Analytics</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"analytics\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/wallet\">Wallet</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"wallet\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/author/newsletter\">Newsletter &amp; Fans</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"newsletter\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/upload\">Upload Book</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"upload\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">Support &amp; Legal</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-6:nth-child(4) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/premium\">Premium</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"premium\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/gifts\">Gifts</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"gifts\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/settings\">Settings</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"settings\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/support\">Support Desk</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:text-zinc-900.dark\\:hover\\:text-white[href$=\"support\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/docs\">Documentation</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"docs\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/privacy\">Privacy Policy</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"privacy\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/terms\">Terms of Service</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"terms\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/cookies\">Cookie Policy</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"cookies\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\" href=\"/dmca\">DMCA</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"dmca\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">Get in Touch</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-6:nth-child(5) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a href=\"https://www.google.c...\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-[10px] font-bol...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".leading-relaxed[target=\"_blank\"][rel=\"noopener noreferrer\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a href=\"mailto:bookverse@gmail.com\" class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\">bookverse@gmail.com</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href=\"mailto:bookverse@gmail.com\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a href=\"tel:+8801799269699\" class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-zinc-400 dark:hover:text-white transition-colors\">+880 1799-269699</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href=\"tel:+8801799269699\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic mb-4\">Follow Us</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-4 > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#09090b",
+               "contrastRatio": 4.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.12 (foreground color: #71717b, background color: #09090b, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 dark:text-zinc-300 italic\">© <!-- -->2026<!-- --> BookVerse. All rights reserved.</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".md\\:items-start > .italic.dark\\:text-zinc-300.dark\\:text-zinc-500",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
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
        - link [ref=e5]:
          - /url: /
          - img "BookVerse" [ref=e8]
          - generic: BookVerse
        - link [ref=e9]:
          - /url: /support
        - link [ref=e15]:
          - /url: /library
        - link [ref=e20]:
          - /url: /stories
        - link [ref=e26]:
          - /url: /universes
        - link [ref=e32]:
          - /url: /series
        - link [ref=e39]:
          - /url: /clubs
      - link [ref=e45]:
        - /url: /
      - generic [ref=e50]:
        - link [ref=e51]:
          - /url: /search
        - link [ref=e57]:
          - /url: /activity-feed
        - button "Toggle AI Librarian" [ref=e62]:
          - generic: AI Librarian
        - link "Sign In" [ref=e67]:
          - /url: /login
  - main [ref=e72]:
    - generic [ref=e79]:
      - generic [ref=e82]:
        - textbox "Try searching 'Adventure'..." [ref=e86]
        - button "Search" [ref=e88]
      - heading "Your Next Story Awaits." [level=1] [ref=e89]
      - paragraph [ref=e90]: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
      - generic [ref=e91]:
        - link "Start Reading" [ref=e92]:
          - /url: /library
        - link "Latest Stories" [ref=e98]:
          - /url: /stories
      - generic [ref=e103]:
        - generic [ref=e104]:
          - img "User" [ref=e106]
          - img "User" [ref=e108]
          - img "User" [ref=e110]
          - img "User" [ref=e112]
        - generic [ref=e113]: Trusted by 7+ readers
    - generic [ref=e128]:
      - generic [ref=e129]:
        - generic [ref=e130]: 0+
        - generic [ref=e131]: Books
      - generic [ref=e132]:
        - generic [ref=e133]: 0+
        - generic [ref=e134]: Stories
      - generic [ref=e135]:
        - generic [ref=e136]: 0+
        - generic [ref=e137]: Readers
      - generic [ref=e138]:
        - generic [ref=e139]: 0+
        - generic [ref=e140]: Minutes Read
    - generic [ref=e142]:
      - link "All" [ref=e143]:
        - /url: /stories
      - link "Action" [ref=e144]:
        - /url: /stories?genre=Action
      - link "Adventure" [ref=e145]:
        - /url: /stories?genre=Adventure
      - link "Comedy" [ref=e146]:
        - /url: /stories?genre=Comedy
      - link "Contemporary" [ref=e147]:
        - /url: /stories?genre=Contemporary
      - link "Drama" [ref=e148]:
        - /url: /stories?genre=Drama
      - link "Dystopian" [ref=e149]:
        - /url: /stories?genre=Dystopian
      - link "Fantasy" [ref=e150]:
        - /url: /stories?genre=Fantasy
      - link "Fiction" [ref=e151]:
        - /url: /stories?genre=Fiction
      - link "Historical" [ref=e152]:
        - /url: /stories?genre=Historical
      - link "Horror" [ref=e153]:
        - /url: /stories?genre=Horror
      - link "Mystery" [ref=e154]:
        - /url: /stories?genre=Mystery
      - link "Paranormal" [ref=e155]:
        - /url: /stories?genre=Paranormal
      - link "Poetry" [ref=e156]:
        - /url: /stories?genre=Poetry
      - link "Romance" [ref=e157]:
        - /url: /stories?genre=Romance
      - link "Science Fiction" [ref=e158]:
        - /url: /stories?genre=Science%20Fiction
      - link "Slice of Life" [ref=e159]:
        - /url: /stories?genre=Slice%20of%20Life
      - link "Supernatural" [ref=e160]:
        - /url: /stories?genre=Supernatural
      - link "Thriller" [ref=e161]:
        - /url: /stories?genre=Thriller
      - link "More" [ref=e162]:
        - /url: /search
    - generic [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - generic [ref=e170]: Recommended
          - heading "Editor's Choice" [level=2] [ref=e174]
        - link "Browse All" [ref=e176]:
          - /url: /library
      - generic [ref=e179]:
        - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0" [ref=e180]:
          - /url: /library/cmu3nme32000p586w9p7gjkzh
          - generic [ref=e181] [cursor=pointer]:
            - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [ref=e183]
            - generic [ref=e185]:
              - generic [ref=e186]: Fiction
              - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3] [ref=e188]
              - paragraph [ref=e189]: CamScanner
              - generic [ref=e190]:
                - generic [ref=e191]: "0.0"
                - generic [ref=e195]: "0"
        - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0" [ref=e199]:
          - /url: /library/cmu3nm10a000h586wwrlpn5uj
          - generic [ref=e200] [cursor=pointer]:
            - img "Ashoka the Ungreat" [ref=e202]
            - generic [ref=e204]:
              - generic [ref=e205]: Fiction
              - heading "Ashoka the Ungreat" [level=3] [ref=e207]
              - paragraph [ref=e208]: Subhodeep Mukhopadhyay
              - generic [ref=e209]:
                - generic [ref=e210]: "0.0"
                - generic [ref=e214]: "0"
        - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0" [ref=e218]:
          - /url: /library/cmu3nq25j002r586wbx4xw0fa
          - generic [ref=e219] [cursor=pointer]:
            - img "Julius Caesar" [ref=e221]
            - generic [ref=e223]:
              - generic [ref=e224]: Fiction
              - heading "Julius Caesar" [level=3] [ref=e226]
              - paragraph [ref=e227]: William Shakespeare
              - generic [ref=e228]:
                - generic [ref=e229]: "0.0"
                - generic [ref=e233]: "0"
        - link "The Odyssey Fiction The Odyssey Homer 0.0 0" [ref=e237]:
          - /url: /library/cmu3nvkcm006p586wlivwrrtw
          - generic [ref=e238] [cursor=pointer]:
            - img "The Odyssey" [ref=e240]
            - generic [ref=e242]:
              - generic [ref=e243]: Fiction
              - heading "The Odyssey" [level=3] [ref=e245]
              - paragraph [ref=e246]: Homer
              - generic [ref=e247]:
                - generic [ref=e248]: "0.0"
                - generic [ref=e252]: "0"
        - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0" [ref=e256]:
          - /url: /library/cmpshibdm00ah58z8ciyjdatz
          - generic [ref=e257] [cursor=pointer]:
            - img "যারা ভোর এনেছিল" [ref=e259]
            - generic [ref=e261]:
              - generic [ref=e262]: Fiction
              - heading "যারা ভোর এনেছিল" [level=3] [ref=e264]
              - paragraph [ref=e265]: Unknown Author
              - generic [ref=e266]:
                - generic [ref=e267]: "0.0"
                - generic [ref=e271]: "0"
        - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0" [ref=e275]:
          - /url: /library/cmu3nozxt0027586w1ebuaxf0
          - generic [ref=e276] [cursor=pointer]:
            - img "Frankenstein (1818 Edition)" [ref=e278]
            - generic [ref=e280]:
              - generic [ref=e281]: Fiction
              - heading "Frankenstein (1818 Edition)" [level=3] [ref=e283]
              - paragraph [ref=e284]: Mary Shelley
              - generic [ref=e285]:
                - generic [ref=e286]: "0.0"
                - generic [ref=e290]: "0"
        - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0" [ref=e294]:
          - /url: /library/cmpshhedo009x58z8fyt0etyg
          - generic [ref=e295] [cursor=pointer]:
            - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [ref=e297]
            - generic [ref=e299]:
              - generic [ref=e300]: Fiction
              - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3] [ref=e302]
              - paragraph [ref=e303]: Unknown Author
              - generic [ref=e304]:
                - generic [ref=e305]: "0.0"
                - generic [ref=e309]: "0"
        - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0" [ref=e313]:
          - /url: /library/cmu3nt84c004x586w78tspcz9
          - generic [ref=e314] [cursor=pointer]:
            - img "Siege of Rome" [ref=e316]
            - generic [ref=e318]:
              - generic [ref=e319]: Fiction
              - heading "Siege of Rome" [level=3] [ref=e321]
              - paragraph [ref=e322]: David Pilling
              - generic [ref=e323]:
                - generic [ref=e324]: "0.0"
                - generic [ref=e328]: "0"
    - generic [ref=e333]:
      - generic [ref=e334]:
        - generic [ref=e335]:
          - generic [ref=e336]: Latest Stories
          - heading "Community Feed" [level=2] [ref=e339]
        - link "View All" [ref=e341]:
          - /url: /stories
      - generic [ref=e344]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e345]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e346] [cursor=pointer]:
            - img "অন্ধকারের ডাক" [ref=e348]
            - generic [ref=e350]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e352]
              - generic [ref=e353]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e355]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e356]
                - paragraph [ref=e357]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e358]:
                - generic "Chapters" [ref=e359]: "10"
                - generic "Views" [ref=e362]: "40"
                - generic "Likes" [ref=e366]: "2"
                - generic "Comments" [ref=e369]: "4"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e372]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e373] [cursor=pointer]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e375]'
            - generic [ref=e377]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e379]'
              - generic [ref=e380]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e382]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e383]
                - paragraph [ref=e384]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e385]:
                - generic "Chapters" [ref=e386]: "8"
                - generic "Views" [ref=e389]: "19"
                - generic "Likes" [ref=e393]: "0"
                - generic "Comments" [ref=e396]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e399]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e400] [cursor=pointer]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e402]
            - generic [ref=e404]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e406]
              - generic [ref=e407]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e409]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e410]
                - paragraph [ref=e411]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e412]:
                - generic "Chapters" [ref=e413]: "9"
                - generic "Views" [ref=e416]: "17"
                - generic "Likes" [ref=e420]: "0"
                - generic "Comments" [ref=e423]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e426]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e427] [cursor=pointer]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e429]
            - generic [ref=e431]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e433]
              - generic [ref=e434]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e436]:
                - img "TechWisdom" [ref=e437]
                - paragraph [ref=e438]: TechWisdom
              - generic [ref=e439]:
                - generic "Chapters" [ref=e440]: "4"
                - generic "Views" [ref=e443]: "12"
                - generic "Likes" [ref=e447]: "1"
                - generic "Comments" [ref=e450]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e453]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e454] [cursor=pointer]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e456]
            - generic [ref=e458]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e460]
              - generic [ref=e461]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e463]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e464]
                - paragraph [ref=e465]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e466]:
                - generic "Chapters" [ref=e467]: "4"
                - generic "Views" [ref=e470]: "12"
                - generic "Likes" [ref=e474]: "1"
                - generic "Comments" [ref=e477]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e480]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e481] [cursor=pointer]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e483]
            - generic [ref=e485]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e487]
              - generic [ref=e488]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e490]:
                - img "TechWisdom" [ref=e491]
                - paragraph [ref=e492]: TechWisdom
              - generic [ref=e493]:
                - generic "Chapters" [ref=e494]: "8"
                - generic "Views" [ref=e497]: "12"
                - generic "Likes" [ref=e501]: "1"
                - generic "Comments" [ref=e504]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e507]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e508] [cursor=pointer]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e510]
            - generic [ref=e512]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e514]
              - generic [ref=e515]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e517]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e518]
                - paragraph [ref=e519]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e520]:
                - generic "Chapters" [ref=e521]: "8"
                - generic "Views" [ref=e524]: "10"
                - generic "Likes" [ref=e528]: "1"
                - generic "Comments" [ref=e531]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e534]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e535] [cursor=pointer]:
            - img "নীল জলের গুপ্তচর" [ref=e537]
            - generic [ref=e539]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e541]
              - generic [ref=e542]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e544]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e545]
                - paragraph [ref=e546]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e547]:
                - generic "Chapters" [ref=e548]: "8"
                - generic "Views" [ref=e551]: "7"
                - generic "Likes" [ref=e555]: "1"
                - generic "Comments" [ref=e558]: "0"
    - generic [ref=e562]:
      - generic [ref=e563]:
        - generic [ref=e564]: Explore
        - heading "Browse by Category" [level=2] [ref=e568]
      - generic [ref=e569]:
        - link [ref=e571]:
          - /url: /stories?genre=Action
          - heading "Action" [level=3] [ref=e575]
          - paragraph [ref=e576]: 0 Stories
        - link [ref=e578]:
          - /url: /stories?genre=Adventure
          - heading "Adventure" [level=3] [ref=e583]
          - paragraph [ref=e584]: 1 Stories
        - link [ref=e586]:
          - /url: /stories?genre=Comedy
          - heading "Comedy" [level=3] [ref=e590]
          - paragraph [ref=e591]: 0 Stories
        - link [ref=e593]:
          - /url: /stories?genre=Contemporary
          - heading "Contemporary" [level=3] [ref=e598]
          - paragraph [ref=e599]: 0 Stories
        - link [ref=e601]:
          - /url: /stories?genre=Drama
          - heading "Drama" [level=3] [ref=e605]
          - paragraph [ref=e606]: 1 Stories
        - link [ref=e608]:
          - /url: /stories?genre=Dystopian
          - heading "Dystopian" [level=3] [ref=e615]
          - paragraph [ref=e616]: 0 Stories
      - button "Load More" [ref=e618]
    - generic [ref=e622]:
      - generic [ref=e623]:
        - generic [ref=e624]:
          - generic [ref=e625]:
            - generic [ref=e626]: Explore Universes
            - heading "Explore Worlds" [level=2] [ref=e630]
          - link "Browse All" [ref=e632]:
            - /url: /universes
        - generic [ref=e635]:
          - link [ref=e636]:
            - /url: /universes/cmpll9h810005jl04zaj68jzz
            - generic [ref=e639]:
              - generic [ref=e640]:
                - generic [ref=e641]: Mystery
                - generic [ref=e642]: 11 Reads
              - generic [ref=e645]:
                - heading "ঢাকার ছায়া" [level=3] [ref=e646]
                - paragraph [ref=e647]: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
              - generic [ref=e648]:
                - generic [ref=e649]: Moizuddin Mohammad Mujahid Rashid
                - generic [ref=e652]: 6 Stories
          - link [ref=e655]:
            - /url: /universes/cmpjwhspx0002l204rwpflilv
            - generic [ref=e658]:
              - generic [ref=e659]:
                - generic [ref=e660]: Thriller
                - generic [ref=e661]: 38 Reads
              - generic [ref=e664]:
                - heading "THE DARK EMPIRE UNIVERSE" [level=3] [ref=e665]
                - paragraph [ref=e666]: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
              - generic [ref=e667]:
                - generic [ref=e668]: TechWisdom
                - generic [ref=e671]: 7 Stories
      - generic [ref=e674]:
        - heading "New Arrivals" [level=2] [ref=e679]
        - generic [ref=e680]:
          - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0" [ref=e681]:
            - /url: /library/cmu3nu3de005l586wjzfmehmw
            - generic [ref=e682] [cursor=pointer]:
              - img "The Adventures of Captain Hatteras" [ref=e684]
              - generic [ref=e686]:
                - generic [ref=e687]: Fiction
                - heading "The Adventures of Captain Hatteras" [level=3] [ref=e689]
                - paragraph [ref=e690]: Jules Verne
                - generic [ref=e691]:
                  - generic [ref=e692]: "0.0"
                  - generic [ref=e696]: "0"
          - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0" [ref=e700]':
            - /url: /library/cmu3npokm002j586wcufatvre
            - generic [ref=e701] [cursor=pointer]:
              - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [ref=e703]'
              - generic [ref=e705]:
                - generic [ref=e706]: Fiction
                - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3] [ref=e708]'
                - paragraph [ref=e709]: Carol Leonnig & Philip Rucker
                - generic [ref=e710]:
                  - generic [ref=e711]: "0.0"
                  - generic [ref=e715]: "0"
          - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0" [ref=e719]':
            - /url: /library/cmu3np67f002b586w60leadjk
            - generic [ref=e720] [cursor=pointer]:
              - 'img "Genghis: Lords of the Bow" [ref=e722]'
              - generic [ref=e724]:
                - generic [ref=e725]: Fiction
                - 'heading "Genghis: Lords of the Bow" [level=3] [ref=e727]'
                - paragraph [ref=e728]: Conn Iggulden
                - generic [ref=e729]:
                  - generic [ref=e730]: "0.0"
                  - generic [ref=e734]: "0"
          - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0" [ref=e738]:
            - /url: /library/cmu3no58a001p586wkary5auz
            - generic [ref=e739] [cursor=pointer]:
              - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [ref=e741]
              - generic [ref=e743]:
                - generic [ref=e744]: Fiction
                - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3] [ref=e746]
                - paragraph [ref=e747]: Unknown Author
                - generic [ref=e748]:
                  - generic [ref=e749]: "0.0"
                  - generic [ref=e753]: "0"
          - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0" [ref=e757]:
            - /url: /library/cmu3nlway000d586w6dcwg0e3
            - generic [ref=e758] [cursor=pointer]:
              - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [ref=e760]
              - generic [ref=e762]:
                - generic [ref=e763]: Fiction
                - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3] [ref=e765]
                - paragraph [ref=e766]: Unknown Author
                - generic [ref=e767]:
                  - generic [ref=e768]: "0.0"
                  - generic [ref=e772]: "0"
          - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0" [ref=e776]:
            - /url: /library/cmu3nl6pv0001586w9lrhc3b6
            - generic [ref=e777] [cursor=pointer]:
              - img "Against All Odds" [ref=e779]
              - generic [ref=e781]:
                - generic [ref=e782]: Fiction
                - heading "Against All Odds" [level=3] [ref=e784]
                - paragraph [ref=e785]: Craig Challen
                - generic [ref=e786]:
                  - generic [ref=e787]: "0.0"
                  - generic [ref=e791]: "0"
          - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0" [ref=e795]:
            - /url: /library/cmpshhihy009z58z81x7qjevf
            - generic [ref=e796] [cursor=pointer]:
              - img "মার্কিন দলিলে মুজিব হত্যাকান্ড" [ref=e798]
              - generic [ref=e800]:
                - generic [ref=e801]: Fiction
                - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3] [ref=e803]
                - paragraph [ref=e804]: Unknown Author
                - generic [ref=e805]:
                  - generic [ref=e806]: "0.0"
                  - generic [ref=e810]: "0"
          - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0" [ref=e814]:
            - /url: /library/cmpshghfv009f58z870y55pkn
            - generic [ref=e815] [cursor=pointer]:
              - img "ভারতীয় দর্শন By ড. দেবব্রত সেন" [ref=e817]
              - generic [ref=e819]:
                - generic [ref=e820]: Fiction
                - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3] [ref=e822]
                - paragraph [ref=e823]: Unknown Author
                - generic [ref=e824]:
                  - generic [ref=e825]: "0.0"
                  - generic [ref=e829]: "0"
    - generic [ref=e834]:
      - generic [ref=e835]:
        - heading "Archive" [level=3] [ref=e838]
        - paragraph [ref=e839]: Access 10,000+ volumes instantly.
      - generic [ref=e840]:
        - heading "Offline" [level=3] [ref=e844]
        - paragraph [ref=e845]: Read your favorite stories anywhere.
      - generic [ref=e846]:
        - heading "Library" [level=3] [ref=e849]
        - paragraph [ref=e850]: Track your reading progress easily.
      - generic [ref=e851]:
        - heading "Speed" [level=3] [ref=e854]
        - paragraph [ref=e855]: Lightning fast reading experience.
    - generic [ref=e857]:
      - heading "Start Your Journey." [level=2] [ref=e858]
      - paragraph [ref=e859]: Join our global community and discover stories that move you.
      - generic [ref=e860]:
        - link "Join Now" [ref=e861]:
          - /url: /login
        - link "Browse Library" [ref=e862]:
          - /url: /library
  - contentinfo [ref=e863]:
    - generic [ref=e864]:
      - generic [ref=e865]:
        - generic [ref=e866]:
          - link "BookVerse Logo BookVerse" [ref=e867]:
            - /url: /
            - img "BookVerse Logo" [ref=e868]
            - generic [ref=e869]: BookVerse
          - paragraph [ref=e871]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e872]:
            - generic [ref=e873]:
              - generic [ref=e874]: 807+
              - generic [ref=e875]: Books
            - generic [ref=e876]:
              - generic [ref=e877]: 4+
              - generic [ref=e878]: Authors
            - generic [ref=e879]:
              - generic [ref=e880]: 7+
              - generic [ref=e881]: Readers
        - generic [ref=e882]:
          - heading "Newsletter" [level=3] [ref=e883]
          - paragraph [ref=e884]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e886]:
            - textbox "Your email" [ref=e887]
            - button [ref=e888]
      - generic [ref=e892]:
        - generic [ref=e893]:
          - heading "Discover" [level=4] [ref=e894]
          - list [ref=e895]:
            - listitem [ref=e896]:
              - link "Home" [ref=e897]:
                - /url: /
            - listitem [ref=e898]:
              - link "Browse Library" [ref=e899]:
                - /url: /library
            - listitem [ref=e900]:
              - link "Stories" [ref=e901]:
                - /url: /stories
            - listitem [ref=e902]:
              - link "Universes" [ref=e903]:
                - /url: /universes
            - listitem [ref=e904]:
              - link "Series" [ref=e905]:
                - /url: /series
            - listitem [ref=e906]:
              - link "Search" [ref=e907]:
                - /url: /search
        - generic [ref=e908]:
          - heading "Community" [level=4] [ref=e909]
          - list [ref=e910]:
            - listitem [ref=e911]:
              - link "Book Clubs" [ref=e912]:
                - /url: /clubs
            - listitem [ref=e913]:
              - link "Activity Feed" [ref=e914]:
                - /url: /activity-feed
            - listitem [ref=e915]:
              - link "Challenges" [ref=e916]:
                - /url: /reading-challenges
            - listitem [ref=e917]:
              - link "My Shelf" [ref=e918]:
                - /url: /shelf
            - listitem [ref=e919]:
              - link "Offline Stories" [ref=e920]:
                - /url: /offline-stories
        - generic [ref=e921]:
          - heading "For Authors" [level=4] [ref=e922]
          - list [ref=e923]:
            - listitem [ref=e924]:
              - link "Author Dashboard" [ref=e925]:
                - /url: /write/dashboard
            - listitem [ref=e926]:
              - link "Write a Story" [ref=e927]:
                - /url: /write/new
            - listitem [ref=e928]:
              - link "Story Universes" [ref=e929]:
                - /url: /write/universes
            - listitem [ref=e930]:
              - link "Story Series" [ref=e931]:
                - /url: /write/series
            - listitem [ref=e932]:
              - link "Analytics" [ref=e933]:
                - /url: /author/analytics
            - listitem [ref=e934]:
              - link "Wallet" [ref=e935]:
                - /url: /wallet
            - listitem [ref=e936]:
              - link "Newsletter & Fans" [ref=e937]:
                - /url: /author/newsletter
            - listitem [ref=e938]:
              - link "Upload Book" [ref=e939]:
                - /url: /upload
        - generic [ref=e940]:
          - heading "Support & Legal" [level=4] [ref=e941]
          - list [ref=e942]:
            - listitem [ref=e943]:
              - link "Premium" [ref=e944]:
                - /url: /premium
            - listitem [ref=e945]:
              - link "Gifts" [ref=e946]:
                - /url: /gifts
            - listitem [ref=e947]:
              - link "Settings" [ref=e948]:
                - /url: /settings
            - listitem [ref=e949]:
              - link "Support Desk" [ref=e950]:
                - /url: /support
            - listitem [ref=e951]:
              - link "Documentation" [ref=e952]:
                - /url: /docs
            - listitem [ref=e953]:
              - link "Privacy Policy" [ref=e954]:
                - /url: /privacy
            - listitem [ref=e955]:
              - link "Terms of Service" [ref=e956]:
                - /url: /terms
            - listitem [ref=e957]:
              - link "Cookie Policy" [ref=e958]:
                - /url: /cookies
            - listitem [ref=e959]:
              - link "DMCA" [ref=e960]:
                - /url: /dmca
        - generic [ref=e961]:
          - heading "Get in Touch" [level=4] [ref=e962]
          - list [ref=e963]:
            - listitem [ref=e964]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e968]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e969]:
              - link "bookverse@gmail.com" [ref=e973]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e974]:
              - link "+880 1799-269699" [ref=e977]:
                - /url: tel:+8801799269699
          - generic [ref=e978]:
            - heading "Follow Us" [level=4] [ref=e979]
            - generic [ref=e980]:
              - link "Facebook" [ref=e981]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e984]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e988]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e991]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e996]:
                - /url: https://tiktok.com
      - generic [ref=e999]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e1003]
  - button "Open Next.js Dev Tools" [ref=e1011] [cursor=pointer]
  - iframe [aria-hidden] [ref=e1015]
  - alert [ref=e1016]
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