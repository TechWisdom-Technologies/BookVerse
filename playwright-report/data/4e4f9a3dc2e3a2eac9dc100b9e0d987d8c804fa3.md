# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility\a11y-components.spec.ts >> Component-Specific Deep Dives (Phase 5) >> The Reader Component Accessibility
- Location: tests\e2e\accessibility\a11y-components.spec.ts:5:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -    1
+ Received  + 2136

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
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"grid grid-cols-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-6 shadow-sm\">",
+                 "target": Array [
+                   ".grid-cols-4",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-[10px] font-bold text-zinc-400 uppercase tracking-widest\">Books</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".last\\:border-0.border-r.border-zinc-50:nth-child(1) > .text-zinc-400.text-\\[10px\\].tracking-widest",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"grid grid-cols-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-6 shadow-sm\">",
+                 "target": Array [
+                   ".grid-cols-4",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-[10px] font-bold text-zinc-400 uppercase tracking-widest\">Stories</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".last\\:border-0.border-r.border-zinc-50:nth-child(2) > .text-zinc-400.text-\\[10px\\].tracking-widest",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"grid grid-cols-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-6 shadow-sm\">",
+                 "target": Array [
+                   ".grid-cols-4",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-[10px] font-bold text-zinc-400 uppercase tracking-widest\">Readers</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".last\\:border-0.border-r.border-zinc-50:nth-child(3) > .text-zinc-400.text-\\[10px\\].tracking-widest",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"grid grid-cols-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-6 shadow-sm\">",
+                 "target": Array [
+                   ".grid-cols-4",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-[10px] font-bold text-zinc-400 uppercase tracking-widest\">Minutes Read</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".last\\:border-0.border-r.border-zinc-50:nth-child(4) > .text-zinc-400.text-\\[10px\\].tracking-widest",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+                 "target": Array [
+                   ".py-24 > .max-w-7xl.mx-auto > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".py-24 > .max-w-7xl.mx-auto > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(4) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(4) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(6) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(6) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-7xl.mx-auto > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+                 "target": Array [
+                   ".border-y > .max-w-7xl.mx-auto > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".border-y > .max-w-7xl.mx-auto > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 1</span>",
+                 "target": Array [
+                   "a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 1</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 2</span>",
+                 "target": Array [
+                   "a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 2</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 11</span>",
+                 "target": Array [
+                   "a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 11</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 3</span>",
+                 "target": Array [
+                   "a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 3</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 5</span>",
+                 "target": Array [
+                   "a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 5</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#ecfdf5",
+               "contrastRatio": 3.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#009966",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 4</span>",
+                 "target": Array [
+                   "a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.46 (foreground color: #009966, background color: #ecfdf5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">আজিজ ভিলা গ্যাং • Vol 4</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-3:nth-child(2) > .bg-emerald-50.dark\\:bg-emerald-950\\/30.text-emerald-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">",
+                 "target": Array [
+                   ".border-zinc-200.py-1.inline-flex",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".border-zinc-200.py-1.inline-flex",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Actio...\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Action\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">0 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Action\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Adven...\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Adventure\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">1 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Adventure\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Comed...\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Comedy\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">0 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Comedy\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Conte...\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Contemporary\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">0 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Contemporary\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Drama\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Drama\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">1 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Drama\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a class=\"group relative flex ...\" href=\"/stories?genre=Dysto...\">",
+                 "target": Array [
+                   ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Dystopian\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10\">0 Stories</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:-translate-y-1.hover\\:shadow-lg[href=\"/stories?genre=Dystopian\"] > .dark\\:text-zinc-600.font-semibold.z-10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+                 "target": Array [
+                   ".space-y-32 > div:nth-child(1) > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".space-y-32 > div:nth-child(1) > .items-end.pb-6.mb-12 > .space-y-3 > .border-zinc-200\\/50.py-1.inline-flex",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[8px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800\">Mystery</span>",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].px-1\\.5.py-0\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[8px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800\">Mystery</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].px-1\\.5.py-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].gap-1.dark\\:text-zinc-500",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-[8px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[80px]\">Moizuddin Mohammad Mujahid Rashid</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .border-zinc-50.dark\\:border-zinc-900.justify-between > .gap-1\\.5.items-center.flex > .max-w-\\[80px\\].text-\\[8px\\].truncate",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-[8px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(1) > .p-5.flex-1.space-y-3 > .border-zinc-50.dark\\:border-zinc-900.justify-between > .text-\\[8px\\].tracking-\\[0\\.2em\\].group-hover\\:text-zinc-900",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[8px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800\">Thriller</span>",
+                 "target": Array [
+                   ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].px-1\\.5.py-0\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #9f9fa9, background color: #fafafa, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[8px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800\">Thriller</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].px-1\\.5.py-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .justify-between.items-center.flex:nth-child(1) > .text-\\[8px\\].gap-1.dark\\:text-zinc-500",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-[8px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[80px]\">TechWisdom</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .border-zinc-50.dark\\:border-zinc-900.justify-between > .gap-1\\.5.items-center.flex > .max-w-\\[80px\\].text-\\[8px\\].truncate",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 6.0pt (8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"flex items-center gap-1 text-[8px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-zinc-50\\/50.dark\\:hover\\:bg-zinc-900\\/50.dark\\:bg-zinc-950:nth-child(2) > .p-5.flex-1.space-y-3 > .border-zinc-50.dark\\:border-zinc-900.justify-between > .text-\\[8px\\].tracking-\\[0\\.2em\\].group-hover\\:text-zinc-900",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 1.47,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#d4d4d8",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.47 (foreground color: #d4d4d8, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
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
+   Element has insufficient color contrast of 1.47 (foreground color: #d4d4d8, background color: #ffffff, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h2 class=\"text-[10px] font-bold uppercase tracking-widest text-zinc-300\">New Arrivals</h2>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mb-10.pb-4.border-b > .text-zinc-300",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(1) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(2) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(3) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(4) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(4) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(5) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(6) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(6) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(7) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4f5",
+               "contrastRatio": 4.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#71717b",
+               "fontSize": "6.8pt (9px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+                 "target": Array [
+                   "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.39 (foreground color: #71717b, background color: #f4f4f5, font size: 6.8pt (9px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400\">Fiction</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3 > a:nth-child(8) > .cursor-pointer.h-full.group > .flex-grow.flex-col.flex > .mb-2.gap-2.items-center > .dark\\:bg-zinc-800.bg-zinc-100.px-1\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"py-48 px-6 text-center border-t border-zinc-50 dark:border-zinc-900 bg-white dark:bg-zinc-950\">",
+                 "target": Array [
+                   ".py-48",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[11px] text-zinc-400 max-w-sm mx-auto font-medium italic leading-relaxed\">Join our global community and discover stories that move you.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-sm",
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
+   Object {
+     "description": "Ensure links have discernible text",
+     "help": "Links must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/link-name?application=playwright",
+     "id": "link-name",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"group relative flex items-center justify-center mx-1\" href=\"/\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".justify-around > .mx-1.justify-center[href=\"/\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag244",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.2.4.4",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-6.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "Mobile navigation" [ref=e2]:
    - generic [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /library
      - link [ref=e9] [cursor=pointer]:
        - /url: /search
      - link [ref=e15] [cursor=pointer]:
        - /url: /
      - link [ref=e20] [cursor=pointer]:
        - /url: /support
      - button "Toggle AI Librarian" [ref=e26]
      - button "Open navigation menu" [ref=e31]
  - main [ref=e35]:
    - generic [ref=e40]:
      - generic [ref=e43]:
        - textbox "Find your next series..." [ref=e47]
        - generic [ref=e48]:
          - button "Voice Search" [ref=e49]
          - button "Search" [ref=e53]
      - heading "Your Next Story Awaits." [level=1] [ref=e54]
      - paragraph [ref=e55]: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
      - generic [ref=e56]:
        - link "Start Reading" [ref=e57] [cursor=pointer]:
          - /url: /library
        - link "Latest Stories" [ref=e63] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e68]:
        - generic [ref=e69]:
          - img "User" [ref=e71]
          - img "User" [ref=e73]
          - img "User" [ref=e75]
          - img "User" [ref=e77]
        - generic [ref=e78]: Trusted by 7+ readers
    - generic [ref=e93]:
      - generic [ref=e94]:
        - generic [ref=e95]: 0+
        - generic [ref=e96]: Books
      - generic [ref=e97]:
        - generic [ref=e98]: 0+
        - generic [ref=e99]: Stories
      - generic [ref=e100]:
        - generic [ref=e101]: 0+
        - generic [ref=e102]: Readers
      - generic [ref=e103]:
        - generic [ref=e104]: 0+
        - generic [ref=e105]: Minutes Read
    - generic [ref=e107]:
      - link "All" [ref=e108] [cursor=pointer]:
        - /url: /stories
      - link "Action" [ref=e109] [cursor=pointer]:
        - /url: /stories?genre=Action
      - link "Adventure" [ref=e110] [cursor=pointer]:
        - /url: /stories?genre=Adventure
      - link "Comedy" [ref=e111] [cursor=pointer]:
        - /url: /stories?genre=Comedy
      - link "Contemporary" [ref=e112] [cursor=pointer]:
        - /url: /stories?genre=Contemporary
      - link "Drama" [ref=e113] [cursor=pointer]:
        - /url: /stories?genre=Drama
      - link "Dystopian" [ref=e114] [cursor=pointer]:
        - /url: /stories?genre=Dystopian
      - link "Fantasy" [ref=e115] [cursor=pointer]:
        - /url: /stories?genre=Fantasy
      - link "Fiction" [ref=e116] [cursor=pointer]:
        - /url: /stories?genre=Fiction
      - link "Historical" [ref=e117] [cursor=pointer]:
        - /url: /stories?genre=Historical
      - link "Horror" [ref=e118] [cursor=pointer]:
        - /url: /stories?genre=Horror
      - link "Mystery" [ref=e119] [cursor=pointer]:
        - /url: /stories?genre=Mystery
      - link "Paranormal" [ref=e120] [cursor=pointer]:
        - /url: /stories?genre=Paranormal
      - link "Poetry" [ref=e121] [cursor=pointer]:
        - /url: /stories?genre=Poetry
      - link "Romance" [ref=e122] [cursor=pointer]:
        - /url: /stories?genre=Romance
      - link "Science Fiction" [ref=e123] [cursor=pointer]:
        - /url: /stories?genre=Science%20Fiction
      - link "Slice of Life" [ref=e124] [cursor=pointer]:
        - /url: /stories?genre=Slice%20of%20Life
      - link "Supernatural" [ref=e125] [cursor=pointer]:
        - /url: /stories?genre=Supernatural
      - link "Thriller" [ref=e126] [cursor=pointer]:
        - /url: /stories?genre=Thriller
      - link "More" [ref=e127] [cursor=pointer]:
        - /url: /search
    - generic [ref=e132]:
      - generic [ref=e133]:
        - generic [ref=e134]:
          - generic [ref=e135]: Recommended
          - heading "Editor's Choice" [level=2] [ref=e139]
        - link "Browse All" [ref=e140] [cursor=pointer]:
          - /url: /library
      - generic [ref=e143]:
        - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0" [ref=e144] [cursor=pointer]:
          - /url: /library/cmu3nme32000p586w9p7gjkzh
          - generic [ref=e145]:
            - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [ref=e147]
            - generic [ref=e149]:
              - generic [ref=e150]: Fiction
              - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3] [ref=e152]
              - paragraph [ref=e153]: CamScanner
              - generic [ref=e154]:
                - generic [ref=e155]: "0.0"
                - generic [ref=e159]: "0"
        - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0" [ref=e163] [cursor=pointer]:
          - /url: /library/cmu3nm10a000h586wwrlpn5uj
          - generic [ref=e164]:
            - img "Ashoka the Ungreat" [ref=e166]
            - generic [ref=e168]:
              - generic [ref=e169]: Fiction
              - heading "Ashoka the Ungreat" [level=3] [ref=e171]
              - paragraph [ref=e172]: Subhodeep Mukhopadhyay
              - generic [ref=e173]:
                - generic [ref=e174]: "0.0"
                - generic [ref=e178]: "0"
        - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0" [ref=e182] [cursor=pointer]:
          - /url: /library/cmu3nq25j002r586wbx4xw0fa
          - generic [ref=e183]:
            - img "Julius Caesar" [ref=e185]
            - generic [ref=e187]:
              - generic [ref=e188]: Fiction
              - heading "Julius Caesar" [level=3] [ref=e190]
              - paragraph [ref=e191]: William Shakespeare
              - generic [ref=e192]:
                - generic [ref=e193]: "0.0"
                - generic [ref=e197]: "0"
        - link "The Odyssey Fiction The Odyssey Homer 0.0 0" [ref=e201] [cursor=pointer]:
          - /url: /library/cmu3nvkcm006p586wlivwrrtw
          - generic [ref=e202]:
            - img "The Odyssey" [ref=e204]
            - generic [ref=e206]:
              - generic [ref=e207]: Fiction
              - heading "The Odyssey" [level=3] [ref=e209]
              - paragraph [ref=e210]: Homer
              - generic [ref=e211]:
                - generic [ref=e212]: "0.0"
                - generic [ref=e216]: "0"
        - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0" [ref=e220] [cursor=pointer]:
          - /url: /library/cmpshibdm00ah58z8ciyjdatz
          - generic [ref=e221]:
            - img "যারা ভোর এনেছিল" [ref=e223]
            - generic [ref=e225]:
              - generic [ref=e226]: Fiction
              - heading "যারা ভোর এনেছিল" [level=3] [ref=e228]
              - paragraph [ref=e229]: Unknown Author
              - generic [ref=e230]:
                - generic [ref=e231]: "0.0"
                - generic [ref=e235]: "0"
        - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0" [ref=e239] [cursor=pointer]:
          - /url: /library/cmu3nozxt0027586w1ebuaxf0
          - generic [ref=e240]:
            - img "Frankenstein (1818 Edition)" [ref=e242]
            - generic [ref=e244]:
              - generic [ref=e245]: Fiction
              - heading "Frankenstein (1818 Edition)" [level=3] [ref=e247]
              - paragraph [ref=e248]: Mary Shelley
              - generic [ref=e249]:
                - generic [ref=e250]: "0.0"
                - generic [ref=e254]: "0"
        - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0" [ref=e258] [cursor=pointer]:
          - /url: /library/cmpshhedo009x58z8fyt0etyg
          - generic [ref=e259]:
            - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [ref=e261]
            - generic [ref=e263]:
              - generic [ref=e264]: Fiction
              - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3] [ref=e266]
              - paragraph [ref=e267]: Unknown Author
              - generic [ref=e268]:
                - generic [ref=e269]: "0.0"
                - generic [ref=e273]: "0"
        - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0" [ref=e277] [cursor=pointer]:
          - /url: /library/cmu3nt84c004x586w78tspcz9
          - generic [ref=e278]:
            - img "Siege of Rome" [ref=e280]
            - generic [ref=e282]:
              - generic [ref=e283]: Fiction
              - heading "Siege of Rome" [level=3] [ref=e285]
              - paragraph [ref=e286]: David Pilling
              - generic [ref=e287]:
                - generic [ref=e288]: "0.0"
                - generic [ref=e292]: "0"
    - generic [ref=e297]:
      - generic [ref=e298]:
        - generic [ref=e299]:
          - generic [ref=e300]: Latest Stories
          - heading "Community Feed" [level=2] [ref=e303]
        - link "View All" [ref=e304] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e307]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e308] [cursor=pointer]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e309]:
            - img "অন্ধকারের ডাক" [ref=e311]
            - generic [ref=e313]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e315]
              - generic [ref=e316]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e318]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e319]
                - paragraph [ref=e320]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e321]:
                - generic "Chapters" [ref=e322]: "10"
                - generic "Views" [ref=e325]: "40"
                - generic "Likes" [ref=e329]: "2"
                - generic "Comments" [ref=e332]: "4"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e335] [cursor=pointer]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e336]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e338]'
            - generic [ref=e340]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e342]'
              - generic [ref=e343]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e345]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e346]
                - paragraph [ref=e347]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e348]:
                - generic "Chapters" [ref=e349]: "8"
                - generic "Views" [ref=e352]: "19"
                - generic "Likes" [ref=e356]: "0"
                - generic "Comments" [ref=e359]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e362] [cursor=pointer]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e363]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e365]
            - generic [ref=e367]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e369]
              - generic [ref=e370]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e372]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e373]
                - paragraph [ref=e374]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e375]:
                - generic "Chapters" [ref=e376]: "9"
                - generic "Views" [ref=e379]: "17"
                - generic "Likes" [ref=e383]: "0"
                - generic "Comments" [ref=e386]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e389] [cursor=pointer]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e390]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e392]
            - generic [ref=e394]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e396]
              - generic [ref=e397]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e399]:
                - img "TechWisdom" [ref=e400]
                - paragraph [ref=e401]: TechWisdom
              - generic [ref=e402]:
                - generic "Chapters" [ref=e403]: "4"
                - generic "Views" [ref=e406]: "12"
                - generic "Likes" [ref=e410]: "1"
                - generic "Comments" [ref=e413]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e416] [cursor=pointer]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e417]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e419]
            - generic [ref=e421]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e423]
              - generic [ref=e424]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e426]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e427]
                - paragraph [ref=e428]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e429]:
                - generic "Chapters" [ref=e430]: "4"
                - generic "Views" [ref=e433]: "12"
                - generic "Likes" [ref=e437]: "1"
                - generic "Comments" [ref=e440]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e443] [cursor=pointer]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e444]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e446]
            - generic [ref=e448]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e450]
              - generic [ref=e451]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e453]:
                - img "TechWisdom" [ref=e454]
                - paragraph [ref=e455]: TechWisdom
              - generic [ref=e456]:
                - generic "Chapters" [ref=e457]: "8"
                - generic "Views" [ref=e460]: "12"
                - generic "Likes" [ref=e464]: "1"
                - generic "Comments" [ref=e467]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e470] [cursor=pointer]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e471]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e473]
            - generic [ref=e475]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e477]
              - generic [ref=e478]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e480]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e481]
                - paragraph [ref=e482]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e483]:
                - generic "Chapters" [ref=e484]: "8"
                - generic "Views" [ref=e487]: "10"
                - generic "Likes" [ref=e491]: "1"
                - generic "Comments" [ref=e494]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e497] [cursor=pointer]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e498]:
            - img "নীল জলের গুপ্তচর" [ref=e500]
            - generic [ref=e502]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e504]
              - generic [ref=e505]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e507]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e508]
                - paragraph [ref=e509]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e510]:
                - generic "Chapters" [ref=e511]: "8"
                - generic "Views" [ref=e514]: "7"
                - generic "Likes" [ref=e518]: "1"
                - generic "Comments" [ref=e521]: "0"
    - generic [ref=e525]:
      - generic [ref=e526]:
        - generic [ref=e527]: Explore
        - heading "Browse by Category" [level=2] [ref=e531]
      - generic [ref=e532]:
        - link [ref=e534] [cursor=pointer]:
          - /url: /stories?genre=Action
          - heading "Action" [level=3] [ref=e538]
          - paragraph [ref=e539]: 0 Stories
        - link [ref=e541] [cursor=pointer]:
          - /url: /stories?genre=Adventure
          - heading "Adventure" [level=3] [ref=e546]
          - paragraph [ref=e547]: 1 Stories
        - link [ref=e549] [cursor=pointer]:
          - /url: /stories?genre=Comedy
          - heading "Comedy" [level=3] [ref=e553]
          - paragraph [ref=e554]: 0 Stories
        - link [ref=e556] [cursor=pointer]:
          - /url: /stories?genre=Contemporary
          - heading "Contemporary" [level=3] [ref=e561]
          - paragraph [ref=e562]: 0 Stories
        - link [ref=e564] [cursor=pointer]:
          - /url: /stories?genre=Drama
          - heading "Drama" [level=3] [ref=e568]
          - paragraph [ref=e569]: 1 Stories
        - link [ref=e571] [cursor=pointer]:
          - /url: /stories?genre=Dystopian
          - heading "Dystopian" [level=3] [ref=e578]
          - paragraph [ref=e579]: 0 Stories
      - button "Load More" [ref=e581]
    - generic [ref=e585]:
      - generic [ref=e586]:
        - generic [ref=e587]:
          - generic [ref=e588]:
            - generic [ref=e589]: Explore Universes
            - heading "Explore Worlds" [level=2] [ref=e593]
          - link "Browse All" [ref=e594] [cursor=pointer]:
            - /url: /universes
        - generic [ref=e597]:
          - link [ref=e598] [cursor=pointer]:
            - /url: /universes/cmpll9h810005jl04zaj68jzz
            - generic [ref=e601]:
              - generic [ref=e602]:
                - generic [ref=e603]: Mystery
                - generic [ref=e604]: 11 Reads
              - generic [ref=e607]:
                - heading "ঢাকার ছায়া" [level=3] [ref=e608]
                - paragraph [ref=e609]: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
              - generic [ref=e610]:
                - generic [ref=e611]: Moizuddin Mohammad Mujahid Rashid
                - generic [ref=e614]: 6 Stories
          - link [ref=e617] [cursor=pointer]:
            - /url: /universes/cmpjwhspx0002l204rwpflilv
            - generic [ref=e620]:
              - generic [ref=e621]:
                - generic [ref=e622]: Thriller
                - generic [ref=e623]: 38 Reads
              - generic [ref=e626]:
                - heading "THE DARK EMPIRE UNIVERSE" [level=3] [ref=e627]
                - paragraph [ref=e628]: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
              - generic [ref=e629]:
                - generic [ref=e630]: TechWisdom
                - generic [ref=e633]: 7 Stories
      - generic [ref=e636]:
        - heading "New Arrivals" [level=2] [ref=e641]
        - generic [ref=e642]:
          - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0" [ref=e643] [cursor=pointer]:
            - /url: /library/cmu3nu3de005l586wjzfmehmw
            - generic [ref=e644]:
              - img "The Adventures of Captain Hatteras" [ref=e646]
              - generic [ref=e648]:
                - generic [ref=e649]: Fiction
                - heading "The Adventures of Captain Hatteras" [level=3] [ref=e651]
                - paragraph [ref=e652]: Jules Verne
                - generic [ref=e653]:
                  - generic [ref=e654]: "0.0"
                  - generic [ref=e658]: "0"
          - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0" [ref=e662] [cursor=pointer]':
            - /url: /library/cmu3npokm002j586wcufatvre
            - generic [ref=e663]:
              - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [ref=e665]'
              - generic [ref=e667]:
                - generic [ref=e668]: Fiction
                - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3] [ref=e670]'
                - paragraph [ref=e671]: Carol Leonnig & Philip Rucker
                - generic [ref=e672]:
                  - generic [ref=e673]: "0.0"
                  - generic [ref=e677]: "0"
          - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0" [ref=e681] [cursor=pointer]':
            - /url: /library/cmu3np67f002b586w60leadjk
            - generic [ref=e682]:
              - 'img "Genghis: Lords of the Bow" [ref=e684]'
              - generic [ref=e686]:
                - generic [ref=e687]: Fiction
                - 'heading "Genghis: Lords of the Bow" [level=3] [ref=e689]'
                - paragraph [ref=e690]: Conn Iggulden
                - generic [ref=e691]:
                  - generic [ref=e692]: "0.0"
                  - generic [ref=e696]: "0"
          - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0" [ref=e700] [cursor=pointer]:
            - /url: /library/cmu3no58a001p586wkary5auz
            - generic [ref=e701]:
              - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [ref=e703]
              - generic [ref=e705]:
                - generic [ref=e706]: Fiction
                - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3] [ref=e708]
                - paragraph [ref=e709]: Unknown Author
                - generic [ref=e710]:
                  - generic [ref=e711]: "0.0"
                  - generic [ref=e715]: "0"
          - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0" [ref=e719] [cursor=pointer]:
            - /url: /library/cmu3nlway000d586w6dcwg0e3
            - generic [ref=e720]:
              - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [ref=e722]
              - generic [ref=e724]:
                - generic [ref=e725]: Fiction
                - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3] [ref=e727]
                - paragraph [ref=e728]: Unknown Author
                - generic [ref=e729]:
                  - generic [ref=e730]: "0.0"
                  - generic [ref=e734]: "0"
          - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0" [ref=e738] [cursor=pointer]:
            - /url: /library/cmu3nl6pv0001586w9lrhc3b6
            - generic [ref=e739]:
              - img "Against All Odds" [ref=e741]
              - generic [ref=e743]:
                - generic [ref=e744]: Fiction
                - heading "Against All Odds" [level=3] [ref=e746]
                - paragraph [ref=e747]: Craig Challen
                - generic [ref=e748]:
                  - generic [ref=e749]: "0.0"
                  - generic [ref=e753]: "0"
          - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0" [ref=e757] [cursor=pointer]:
            - /url: /library/cmpshhihy009z58z81x7qjevf
            - generic [ref=e758]:
              - img "মার্কিন দলিলে মুজিব হত্যাকান্ড" [ref=e760]
              - generic [ref=e762]:
                - generic [ref=e763]: Fiction
                - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3] [ref=e765]
                - paragraph [ref=e766]: Unknown Author
                - generic [ref=e767]:
                  - generic [ref=e768]: "0.0"
                  - generic [ref=e772]: "0"
          - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0" [ref=e776] [cursor=pointer]:
            - /url: /library/cmpshghfv009f58z870y55pkn
            - generic [ref=e777]:
              - img "ভারতীয় দর্শন By ড. দেবব্রত সেন" [ref=e779]
              - generic [ref=e781]:
                - generic [ref=e782]: Fiction
                - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3] [ref=e784]
                - paragraph [ref=e785]: Unknown Author
                - generic [ref=e786]:
                  - generic [ref=e787]: "0.0"
                  - generic [ref=e791]: "0"
    - generic [ref=e796]:
      - generic [ref=e797]:
        - heading "Archive" [level=3] [ref=e800]
        - paragraph [ref=e801]: Access 10,000+ volumes instantly.
      - generic [ref=e802]:
        - heading "Offline" [level=3] [ref=e806]
        - paragraph [ref=e807]: Read your favorite stories anywhere.
      - generic [ref=e808]:
        - heading "Library" [level=3] [ref=e811]
        - paragraph [ref=e812]: Track your reading progress easily.
      - generic [ref=e813]:
        - heading "Speed" [level=3] [ref=e816]
        - paragraph [ref=e817]: Lightning fast reading experience.
    - generic [ref=e819]:
      - heading "Start Your Journey." [level=2] [ref=e820]
      - paragraph [ref=e821]: Join our global community and discover stories that move you.
      - generic [ref=e822]:
        - link "Join Now" [ref=e823] [cursor=pointer]:
          - /url: /login
        - link "Browse Library" [ref=e824] [cursor=pointer]:
          - /url: /library
  - contentinfo [ref=e825]:
    - generic [ref=e826]:
      - generic [ref=e827]:
        - generic [ref=e828]:
          - link "BookVerse Logo BookVerse" [ref=e829] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e830]
            - generic [ref=e831]: BookVerse
          - paragraph [ref=e833]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e834]:
            - generic [ref=e835]:
              - generic [ref=e836]: 807+
              - generic [ref=e837]: Books
            - generic [ref=e838]:
              - generic [ref=e839]: 4+
              - generic [ref=e840]: Authors
            - generic [ref=e841]:
              - generic [ref=e842]: 7+
              - generic [ref=e843]: Readers
        - generic [ref=e844]:
          - heading "Newsletter" [level=3] [ref=e845]
          - paragraph [ref=e846]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e848]:
            - textbox "Your email" [ref=e849]
            - button [ref=e850]
      - generic [ref=e854]:
        - generic [ref=e855]:
          - heading "Discover" [level=4] [ref=e856]
          - list [ref=e857]:
            - listitem [ref=e858]:
              - link "Home" [ref=e859] [cursor=pointer]:
                - /url: /
            - listitem [ref=e860]:
              - link "Browse Library" [ref=e861] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e862]:
              - link "Stories" [ref=e863] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e864]:
              - link "Universes" [ref=e865] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e866]:
              - link "Series" [ref=e867] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e868]:
              - link "Search" [ref=e869] [cursor=pointer]:
                - /url: /search
        - generic [ref=e870]:
          - heading "Community" [level=4] [ref=e871]
          - list [ref=e872]:
            - listitem [ref=e873]:
              - link "Book Clubs" [ref=e874] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e875]:
              - link "Activity Feed" [ref=e876] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e877]:
              - link "Challenges" [ref=e878] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e879]:
              - link "My Shelf" [ref=e880] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e881]:
              - link "Offline Stories" [ref=e882] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e883]:
          - heading "For Authors" [level=4] [ref=e884]
          - list [ref=e885]:
            - listitem [ref=e886]:
              - link "Author Dashboard" [ref=e887] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e888]:
              - link "Write a Story" [ref=e889] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e890]:
              - link "Story Universes" [ref=e891] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e892]:
              - link "Story Series" [ref=e893] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e894]:
              - link "Analytics" [ref=e895] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e896]:
              - link "Wallet" [ref=e897] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e898]:
              - link "Newsletter & Fans" [ref=e899] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e900]:
              - link "Upload Book" [ref=e901] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e902]:
          - heading "Support & Legal" [level=4] [ref=e903]
          - list [ref=e904]:
            - listitem [ref=e905]:
              - link "Premium" [ref=e906] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e907]:
              - link "Gifts" [ref=e908] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e909]:
              - link "Settings" [ref=e910] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e911]:
              - link "Support Desk" [ref=e912] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e913]:
              - link "Documentation" [ref=e914] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e915]:
              - link "Privacy Policy" [ref=e916] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e917]:
              - link "Terms of Service" [ref=e918] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e919]:
              - link "Cookie Policy" [ref=e920] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e921]:
              - link "DMCA" [ref=e922] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e923]:
          - heading "Get in Touch" [level=4] [ref=e924]
          - list [ref=e925]:
            - listitem [ref=e926]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e930] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e931]:
              - link "bookverse@gmail.com" [ref=e935] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e936]:
              - link "+880 1799-269699" [ref=e939] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e940]:
            - heading "Follow Us" [level=4] [ref=e941]
            - generic [ref=e942]:
              - link "Facebook" [ref=e943] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e946] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e950] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e953] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e958] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e961]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e965]
  - button "Open Next.js Dev Tools" [ref=e973] [cursor=pointer]
  - alert [ref=e977]
  - iframe [aria-hidden] [ref=e978]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('Component-Specific Deep Dives (Phase 5)', () => {
  5  |   test('The Reader Component Accessibility', async ({ page }) => {
  6  |     // Go to a dummy reader route or homepage to simulate
  7  |     await page.goto('/');
  8  |     
  9  |     // Simulate reader component check
  10 |     // We would check if there is an aria-label describing reading progress
  11 |     // For this generic test, we ensure the page passes axe
  12 |     const results = await new AxeBuilder({ page }).analyze();
> 13 |     expect(results.violations).toEqual([]);
     |                                ^ Error: expect(received).toEqual(expected) // deep equality
  14 |   });
  15 | 
  16 |   test('The Editor Toolbar ARIA States', async ({ page }) => {
  17 |     // Test that rich text editor buttons have aria-pressed
  18 |     // Navigate to writing page
  19 |     try {
  20 |       await page.goto('/write', { timeout: 3000 });
  21 |       // Example check: Toolbar button for bold text
  22 |       const boldBtn = page.locator('button[aria-label="Bold"], button[title="Bold"]').first();
  23 |       if (await boldBtn.count() > 0) {
  24 |         await expect(boldBtn).toHaveAttribute('aria-pressed');
  25 |       }
  26 |     } catch (e) {}
  27 |   });
  28 | 
  29 |   test('Clubs & Discussions Heading Hierarchy', async ({ page }) => {
  30 |     // Navigate to a club page
  31 |     try {
  32 |       await page.goto('/clubs', { timeout: 3000 });
  33 |       // Verify h1, h2, h3 are used linearly without skipping levels
  34 |       // Axe checks this via the 'heading-order' rule
  35 |       const results = await new AxeBuilder({ page }).withRules(['heading-order']).analyze();
  36 |       expect(results.violations).toEqual([]);
  37 |     } catch (e) {}
  38 |   });
  39 | });
  40 | 
```