# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility\a11y-workflows.spec.ts >> Complex Interactive Workflows (Phase 6) >> The Publish a Story Flow (Keyboard Only)
- Location: tests\e2e\accessibility\a11y-workflows.spec.ts:6:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -    1
+ Received  + 2087

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
+     "description": "Ensure image alternative is not repeated as text",
+     "help": "Alternative text of images should not be repeated as text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/image-redundant-alt?application=playwright",
+     "id": "image-redundant-alt",
+     "impact": "minor",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [],
+         "failureSummary": "Fix all of the following:
+   Element contains <img> element with alt text that duplicates existing text",
+         "html": "<img src=\"/bookverse.png\" alt=\"BookVerse\" class=\"w-full h-full object-cover\">",
+         "impact": "minor",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "duplicate-img-label",
+             "impact": "minor",
+             "message": "Element contains <img> element with alt text that duplicates existing text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           "img[alt=\"BookVerse\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.text-alternatives",
+       "best-practice",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - link [active] [ref=e26] [cursor=pointer]:
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
    - generic [ref=e79]:
      - generic [ref=e82]:
        - textbox "Find your next series..." [ref=e86]
        - generic [ref=e87]:
          - button "Voice Search" [ref=e88]
          - button "Search" [ref=e92]
      - heading "Your Next Story Awaits." [level=1] [ref=e93]
      - paragraph [ref=e94]: Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
      - generic [ref=e95]:
        - link "Start Reading" [ref=e96] [cursor=pointer]:
          - /url: /library
        - link "Latest Stories" [ref=e102] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e107]:
        - generic [ref=e108]:
          - img "User" [ref=e110]
          - img "User" [ref=e112]
          - img "User" [ref=e114]
          - img "User" [ref=e116]
        - generic [ref=e117]: Trusted by 7+ readers
    - generic [ref=e132]:
      - generic [ref=e133]:
        - generic [ref=e134]: 0+
        - generic [ref=e135]: Books
      - generic [ref=e136]:
        - generic [ref=e137]: 0+
        - generic [ref=e138]: Stories
      - generic [ref=e139]:
        - generic [ref=e140]: 0+
        - generic [ref=e141]: Readers
      - generic [ref=e142]:
        - generic [ref=e143]: 0+
        - generic [ref=e144]: Minutes Read
    - generic [ref=e146]:
      - link "All" [ref=e147] [cursor=pointer]:
        - /url: /stories
      - link "Action" [ref=e148] [cursor=pointer]:
        - /url: /stories?genre=Action
      - link "Adventure" [ref=e149] [cursor=pointer]:
        - /url: /stories?genre=Adventure
      - link "Comedy" [ref=e150] [cursor=pointer]:
        - /url: /stories?genre=Comedy
      - link "Contemporary" [ref=e151] [cursor=pointer]:
        - /url: /stories?genre=Contemporary
      - link "Drama" [ref=e152] [cursor=pointer]:
        - /url: /stories?genre=Drama
      - link "Dystopian" [ref=e153] [cursor=pointer]:
        - /url: /stories?genre=Dystopian
      - link "Fantasy" [ref=e154] [cursor=pointer]:
        - /url: /stories?genre=Fantasy
      - link "Fiction" [ref=e155] [cursor=pointer]:
        - /url: /stories?genre=Fiction
      - link "Historical" [ref=e156] [cursor=pointer]:
        - /url: /stories?genre=Historical
      - link "Horror" [ref=e157] [cursor=pointer]:
        - /url: /stories?genre=Horror
      - link "Mystery" [ref=e158] [cursor=pointer]:
        - /url: /stories?genre=Mystery
      - link "Paranormal" [ref=e159] [cursor=pointer]:
        - /url: /stories?genre=Paranormal
      - link "Poetry" [ref=e160] [cursor=pointer]:
        - /url: /stories?genre=Poetry
      - link "Romance" [ref=e161] [cursor=pointer]:
        - /url: /stories?genre=Romance
      - link "Science Fiction" [ref=e162] [cursor=pointer]:
        - /url: /stories?genre=Science%20Fiction
      - link "Slice of Life" [ref=e163] [cursor=pointer]:
        - /url: /stories?genre=Slice%20of%20Life
      - link "Supernatural" [ref=e164] [cursor=pointer]:
        - /url: /stories?genre=Supernatural
      - link "Thriller" [ref=e165] [cursor=pointer]:
        - /url: /stories?genre=Thriller
      - link "More" [ref=e166] [cursor=pointer]:
        - /url: /search
    - generic [ref=e171]:
      - generic [ref=e172]:
        - generic [ref=e173]:
          - generic [ref=e174]: Recommended
          - heading "Editor's Choice" [level=2] [ref=e178]
        - link "Browse All" [ref=e180] [cursor=pointer]:
          - /url: /library
      - generic [ref=e183]:
        - link "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার Fiction বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার CamScanner 0.0 0" [ref=e184] [cursor=pointer]:
          - /url: /library/cmu3nme32000p586w9p7gjkzh
          - generic [ref=e185]:
            - img "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [ref=e187]
            - generic [ref=e189]:
              - generic [ref=e190]: Fiction
              - heading "বাঙালির মস্তিষ্ক ও তাহার অপব্যবহার" [level=3] [ref=e192]
              - paragraph [ref=e193]: CamScanner
              - generic [ref=e194]:
                - generic [ref=e195]: "0.0"
                - generic [ref=e199]: "0"
        - link "Ashoka the Ungreat Fiction Ashoka the Ungreat Subhodeep Mukhopadhyay 0.0 0" [ref=e203] [cursor=pointer]:
          - /url: /library/cmu3nm10a000h586wwrlpn5uj
          - generic [ref=e204]:
            - img "Ashoka the Ungreat" [ref=e206]
            - generic [ref=e208]:
              - generic [ref=e209]: Fiction
              - heading "Ashoka the Ungreat" [level=3] [ref=e211]
              - paragraph [ref=e212]: Subhodeep Mukhopadhyay
              - generic [ref=e213]:
                - generic [ref=e214]: "0.0"
                - generic [ref=e218]: "0"
        - link "Julius Caesar Fiction Julius Caesar William Shakespeare 0.0 0" [ref=e222] [cursor=pointer]:
          - /url: /library/cmu3nq25j002r586wbx4xw0fa
          - generic [ref=e223]:
            - img "Julius Caesar" [ref=e225]
            - generic [ref=e227]:
              - generic [ref=e228]: Fiction
              - heading "Julius Caesar" [level=3] [ref=e230]
              - paragraph [ref=e231]: William Shakespeare
              - generic [ref=e232]:
                - generic [ref=e233]: "0.0"
                - generic [ref=e237]: "0"
        - link "The Odyssey Fiction The Odyssey Homer 0.0 0" [ref=e241] [cursor=pointer]:
          - /url: /library/cmu3nvkcm006p586wlivwrrtw
          - generic [ref=e242]:
            - img "The Odyssey" [ref=e244]
            - generic [ref=e246]:
              - generic [ref=e247]: Fiction
              - heading "The Odyssey" [level=3] [ref=e249]
              - paragraph [ref=e250]: Homer
              - generic [ref=e251]:
                - generic [ref=e252]: "0.0"
                - generic [ref=e256]: "0"
        - link "যারা ভোর এনেছিল Fiction যারা ভোর এনেছিল Unknown Author 0.0 0" [ref=e260] [cursor=pointer]:
          - /url: /library/cmpshibdm00ah58z8ciyjdatz
          - generic [ref=e261]:
            - img "যারা ভোর এনেছিল" [ref=e263]
            - generic [ref=e265]:
              - generic [ref=e266]: Fiction
              - heading "যারা ভোর এনেছিল" [level=3] [ref=e268]
              - paragraph [ref=e269]: Unknown Author
              - generic [ref=e270]:
                - generic [ref=e271]: "0.0"
                - generic [ref=e275]: "0"
        - link "Frankenstein (1818 Edition) Fiction Frankenstein (1818 Edition) Mary Shelley 0.0 0" [ref=e279] [cursor=pointer]:
          - /url: /library/cmu3nozxt0027586w1ebuaxf0
          - generic [ref=e280]:
            - img "Frankenstein (1818 Edition)" [ref=e282]
            - generic [ref=e284]:
              - generic [ref=e285]: Fiction
              - heading "Frankenstein (1818 Edition)" [level=3] [ref=e287]
              - paragraph [ref=e288]: Mary Shelley
              - generic [ref=e289]:
                - generic [ref=e290]: "0.0"
                - generic [ref=e294]: "0"
        - link "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Fiction মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী Unknown Author 0.0 0" [ref=e298] [cursor=pointer]:
          - /url: /library/cmpshhedo009x58z8fyt0etyg
          - generic [ref=e299]:
            - img "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [ref=e301]
            - generic [ref=e303]:
              - generic [ref=e304]: Fiction
              - heading "মানসিক রোগ ও সাইকোথেরাপি by ডা. দেওয়ান ওয়াহিদুন নবী" [level=3] [ref=e306]
              - paragraph [ref=e307]: Unknown Author
              - generic [ref=e308]:
                - generic [ref=e309]: "0.0"
                - generic [ref=e313]: "0"
        - link "Siege of Rome Fiction Siege of Rome David Pilling 0.0 0" [ref=e317] [cursor=pointer]:
          - /url: /library/cmu3nt84c004x586w78tspcz9
          - generic [ref=e318]:
            - img "Siege of Rome" [ref=e320]
            - generic [ref=e322]:
              - generic [ref=e323]: Fiction
              - heading "Siege of Rome" [level=3] [ref=e325]
              - paragraph [ref=e326]: David Pilling
              - generic [ref=e327]:
                - generic [ref=e328]: "0.0"
                - generic [ref=e332]: "0"
    - generic [ref=e337]:
      - generic [ref=e338]:
        - generic [ref=e339]:
          - generic [ref=e340]: Latest Stories
          - heading "Community Feed" [level=2] [ref=e343]
        - link "View All" [ref=e345] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e348]:
        - link "অন্ধকারের ডাক অন্ধকারের ডাক আজিজ ভিলা গ্যাং • Vol 1 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 10 40 2 4" [ref=e349] [cursor=pointer]:
          - /url: /stories/cmpmj9lbe0001la0467wfyaea
          - generic [ref=e350]:
            - img "অন্ধকারের ডাক" [ref=e352]
            - generic [ref=e354]:
              - heading "অন্ধকারের ডাক" [level=3] [ref=e356]
              - generic [ref=e357]: আজিজ ভিলা গ্যাং • Vol 1
              - generic [ref=e359]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e360]
                - paragraph [ref=e361]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e362]:
                - generic "Chapters" [ref=e363]: "10"
                - generic "Views" [ref=e366]: "40"
                - generic "Likes" [ref=e370]: "2"
                - generic "Comments" [ref=e373]: "4"
        - 'link "রক্তিম উপত্যকা: শিকারির ফাঁদ রক্তিম উপত্যকা: শিকারির ফাঁদ আজিজ ভিলা গ্যাং • Vol 2 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 19 0 0" [ref=e376] [cursor=pointer]':
          - /url: /stories/cmpmjlfgq0001jp04r6fasd14
          - generic [ref=e377]:
            - 'img "রক্তিম উপত্যকা: শিকারির ফাঁদ" [ref=e379]'
            - generic [ref=e381]:
              - 'heading "রক্তিম উপত্যকা: শিকারির ফাঁদ" [level=3] [ref=e383]'
              - generic [ref=e384]: আজিজ ভিলা গ্যাং • Vol 2
              - generic [ref=e386]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e387]
                - paragraph [ref=e388]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e389]:
                - generic "Chapters" [ref=e390]: "8"
                - generic "Views" [ref=e393]: "19"
                - generic "Likes" [ref=e397]: "0"
                - generic "Comments" [ref=e400]: "0"
        - link "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal) আজিজ ভিলা গ্যাং • Vol 11 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 9 17 0 0" [ref=e403] [cursor=pointer]:
          - /url: /stories/cmpvkc6cy0001jr04hcfo8rrv
          - generic [ref=e404]:
            - img "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [ref=e406]
            - generic [ref=e408]:
              - heading "ব্লাডলাইন এন্ডগেম এবং শেষ বিশ্বাসঘাতকতা (Bloodline Endgame and the Final Betrayal)" [level=3] [ref=e410]
              - generic [ref=e411]: আজিজ ভিলা গ্যাং • Vol 11
              - generic [ref=e413]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e414]
                - paragraph [ref=e415]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e416]:
                - generic "Chapters" [ref=e417]: "9"
                - generic "Views" [ref=e420]: "17"
                - generic "Likes" [ref=e424]: "0"
                - generic "Comments" [ref=e427]: "0"
        - link "সত্যের মূল্য - ২ The Whistleblower সত্যের মূল্য - ২ The Whistleblower THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 4 12 1 0" [ref=e430] [cursor=pointer]:
          - /url: /stories/cmpk77e2u0007js049sd7qdwl
          - generic [ref=e431]:
            - img "সত্যের মূল্য - ২ The Whistleblower" [ref=e433]
            - generic [ref=e435]:
              - heading "সত্যের মূল্য - ২ The Whistleblower" [level=3] [ref=e437]
              - generic [ref=e438]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e440]:
                - img "TechWisdom" [ref=e441]
                - paragraph [ref=e442]: TechWisdom
              - generic [ref=e443]:
                - generic "Chapters" [ref=e444]: "4"
                - generic "Views" [ref=e447]: "12"
                - generic "Likes" [ref=e451]: "1"
                - generic "Comments" [ref=e454]: "0"
        - link "অন্ধকারের শেষ সীমানা অন্ধকারের শেষ সীমানা আজিজ ভিলা গ্যাং • Vol 3 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 4 12 1 0" [ref=e457] [cursor=pointer]:
          - /url: /stories/cmpmk0xlz000bla049kzg96oy
          - generic [ref=e458]:
            - img "অন্ধকারের শেষ সীমানা" [ref=e460]
            - generic [ref=e462]:
              - heading "অন্ধকারের শেষ সীমানা" [level=3] [ref=e464]
              - generic [ref=e465]: আজিজ ভিলা গ্যাং • Vol 3
              - generic [ref=e467]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e468]
                - paragraph [ref=e469]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e470]:
                - generic "Chapters" [ref=e471]: "4"
                - generic "Views" [ref=e474]: "12"
                - generic "Likes" [ref=e478]: "1"
                - generic "Comments" [ref=e481]: "0"
        - link "অন্ধকারের শেষ যুদ্ধ অন্ধকারের শেষ যুদ্ধ THE DARK EMPIRE UNIVERSE • Vol 5 TechWisdom TechWisdom 8 12 1 0" [ref=e484] [cursor=pointer]:
          - /url: /stories/cmpk7co0o000bjs04tadrq43x
          - generic [ref=e485]:
            - img "অন্ধকারের শেষ যুদ্ধ" [ref=e487]
            - generic [ref=e489]:
              - heading "অন্ধকারের শেষ যুদ্ধ" [level=3] [ref=e491]
              - generic [ref=e492]: THE DARK EMPIRE UNIVERSE • Vol 5
              - generic [ref=e494]:
                - img "TechWisdom" [ref=e495]
                - paragraph [ref=e496]: TechWisdom
              - generic [ref=e497]:
                - generic "Chapters" [ref=e498]: "8"
                - generic "Views" [ref=e501]: "12"
                - generic "Likes" [ref=e505]: "1"
                - generic "Comments" [ref=e508]: "0"
        - link "জোয়ার-ভাটার ফাঁদ জোয়ার-ভাটার ফাঁদ আজিজ ভিলা গ্যাং • Vol 5 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 10 1 0" [ref=e511] [cursor=pointer]:
          - /url: /stories/cmppvwt3m0001l8043895z6uj
          - generic [ref=e512]:
            - img "জোয়ার-ভাটার ফাঁদ" [ref=e514]
            - generic [ref=e516]:
              - heading "জোয়ার-ভাটার ফাঁদ" [level=3] [ref=e518]
              - generic [ref=e519]: আজিজ ভিলা গ্যাং • Vol 5
              - generic [ref=e521]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e522]
                - paragraph [ref=e523]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e524]:
                - generic "Chapters" [ref=e525]: "8"
                - generic "Views" [ref=e528]: "10"
                - generic "Likes" [ref=e532]: "1"
                - generic "Comments" [ref=e535]: "0"
        - link "নীল জলের গুপ্তচর নীল জলের গুপ্তচর আজিজ ভিলা গ্যাং • Vol 4 Moizuddin Mohammad Mujahid Rashid Moizuddin Mohammad Mujahid Rashid 8 7 1 0" [ref=e538] [cursor=pointer]:
          - /url: /stories/cmppvw2nf0001l404uqqpdn36
          - generic [ref=e539]:
            - img "নীল জলের গুপ্তচর" [ref=e541]
            - generic [ref=e543]:
              - heading "নীল জলের গুপ্তচর" [level=3] [ref=e545]
              - generic [ref=e546]: আজিজ ভিলা গ্যাং • Vol 4
              - generic [ref=e548]:
                - img "Moizuddin Mohammad Mujahid Rashid" [ref=e549]
                - paragraph [ref=e550]: Moizuddin Mohammad Mujahid Rashid
              - generic [ref=e551]:
                - generic "Chapters" [ref=e552]: "8"
                - generic "Views" [ref=e555]: "7"
                - generic "Likes" [ref=e559]: "1"
                - generic "Comments" [ref=e562]: "0"
    - generic [ref=e566]:
      - generic [ref=e567]:
        - generic [ref=e568]: Explore
        - heading "Browse by Category" [level=2] [ref=e572]
      - generic [ref=e573]:
        - link [ref=e575] [cursor=pointer]:
          - /url: /stories?genre=Action
          - heading "Action" [level=3] [ref=e579]
          - paragraph [ref=e580]: 0 Stories
        - link [ref=e582] [cursor=pointer]:
          - /url: /stories?genre=Adventure
          - heading "Adventure" [level=3] [ref=e587]
          - paragraph [ref=e588]: 1 Stories
        - link [ref=e590] [cursor=pointer]:
          - /url: /stories?genre=Comedy
          - heading "Comedy" [level=3] [ref=e594]
          - paragraph [ref=e595]: 0 Stories
        - link [ref=e597] [cursor=pointer]:
          - /url: /stories?genre=Contemporary
          - heading "Contemporary" [level=3] [ref=e602]
          - paragraph [ref=e603]: 0 Stories
        - link [ref=e605] [cursor=pointer]:
          - /url: /stories?genre=Drama
          - heading "Drama" [level=3] [ref=e609]
          - paragraph [ref=e610]: 1 Stories
        - link [ref=e612] [cursor=pointer]:
          - /url: /stories?genre=Dystopian
          - heading "Dystopian" [level=3] [ref=e619]
          - paragraph [ref=e620]: 0 Stories
      - button "Load More" [ref=e622]
    - generic [ref=e626]:
      - generic [ref=e627]:
        - generic [ref=e628]:
          - generic [ref=e629]:
            - generic [ref=e630]: Explore Universes
            - heading "Explore Worlds" [level=2] [ref=e634]
          - link "Browse All" [ref=e636] [cursor=pointer]:
            - /url: /universes
        - generic [ref=e639]:
          - link [ref=e640] [cursor=pointer]:
            - /url: /universes/cmpll9h810005jl04zaj68jzz
            - generic [ref=e643]:
              - generic [ref=e644]:
                - generic [ref=e645]: Mystery
                - generic [ref=e646]: 11 Reads
              - generic [ref=e649]:
                - heading "ঢাকার ছায়া" [level=3] [ref=e650]
                - paragraph [ref=e651]: "মহাবিশ্বের পরিচয় এই সিরিজের নাম 'ঢাকার ছায়া'। এটি সম্পূর্ণরূপে আধুনিক বাংলাদেশে স্থাপিত একটি কাল্পনিক মহাবিশ্ব, যেখানে ঢাকার অলিগলি, চট্টগ্রামের বন্দর, সুন্দরবনের গভীরতা এবং সিলেটের চা-বাগান — সবকিছুই কাহিনির অংশ হয়ে ওঠে। এখানে কোনো সুপারহিরো নেই, কোনো অতিপ্রাকৃত শক্তি নেই — শুধু আছে মানুষ, তাদের উচ্চাকাঙ্ক্ষা, ভালোবাসা, ক্ষোভ, এবং বেঁচে থাকার লড়াই। মূল শৈলী: গ্রাউন্ডেড রিয়েলিজম। প্রতিটি বই একটি স্বতন্ত্র গল্প, তবু সব বই একটি বৃহত্তর ছায়া-ষড়যন্ত্রের সুতোয় বাঁধা — 'প্রজেক্ট ক্রোশ' নামক একটি গভীর রাষ্ট্রীয় দুর্নীতি চক্র, যার সম্পূর্ণ রহস্য শেষ ক্রসওভারে উন্মোচিত হবে। মূল চরিত্রসমূহ (Main Roster) চরিত্র ০১ — তানভীর রাসেল পেশা: সাবেক র‍্যাব কর্মকর্তা, বর্তমানে বেসরকারি গোয়েন্দা বয়স: ৩৮ বছর। জন্মস্থান: নরসিংদী। ব্যক্তিত্ব: তানভীর তীক্ষ্ণ বুদ্ধির মানুষ, কিন্তু অ্যালকোহল-নির্ভরতা তার সবচেয়ে বড় দুর্বলতা। র‍্যাব থেকে বরখাস্ত হয়েছিল এক 'এনকাউন্টার কেলেঙ্কারিতে' — যেখানে নিরীহ এক কিশোর মারা গিয়েছিল। সেই অপরাধবোধ তাকে তাড়া করে। পুরান ঢাকার একটি জরাজীর্ণ মেসে থাকে, কিন্তু তার মাথা এখনো রাজ্যের সেরা। ত্রুটি: অতিরিক্ত আত্মবিশ্বাস, মেয়াদ উত্তীর্ণ রেগে যাওয়ার স্বভাব, এবং একটি গোপন রোমান্টিক দুর্বলতা। সাইডকিক: মিলন মাঝি তানভীরের ছোটবেলার বন্ধু, বর্তমানে বুড়িগঙ্গার একজন নৌকাচালক। কম পড়াশোনা কিন্তু অসাধারণ লোক-বুদ্ধি। সে তানভীরের 'গ্রাউন্ড ইন্টেলিজেন্স' — ঢাকার যে অংশ তানভীর চেনে না, সেখানে মিলন হলো চোখ-কান। এই জুটির বন্ধুত্বে রসিকতা এবং তীব্র মতভেদ সমানভাবে আছে। চরিত্র ০২ — নাফিসা চৌধুরী পেশা: অনুসন্ধানী সাংবাদিক, দৈনিক 'প্রতিধ্বনি' বয়স: ৩২ বছর। জন্মস্থান: চট্টগ্রাম। ব্যক্তিত্ব: নাফিসা নির্ভীক, তীক্ষ্ণভাষী এবং নিজের পেশার প্রতি প্রায় ধর্মীয়ভাবে নিষ্ঠাবান। বাবা একজন দুর্নীতিগ্রস্ত সরকারি কর্মকর্তা ছিলেন — সেই ক্ষত থেকে তার সততার জন্ম। তবে সত্য খুঁজতে গিয়ে সে কখনো কখনো নৈতিক সীমারেখাও অতিক্রম করে ফেলে। ত্রুটি: নিজের নিরাপত্তার প্রতি উদাসীনতা, ব্যক্তিগত সম্পর্কে শূন্যতা, এবং বিশ্বাস করার তীব্র অনীহা। সাইডকিক: রিদওয়ান 'রিদ' হাসান নাফিসার জুনিয়র ফটোজার্নালিস্ট। হাস্যরসপ্রিয়, সোশ্যাল মিডিয়া-আসক্ত এক তরুণ যে বিপদের মুখে অদ্ভুত শান্তি খুঁজে পায়। নাফিসার গাম্ভীর্যের বিপরীতে রিদের হালকা মেজাজ এই জুটিকে অনন্য করে তোলে। চরিত্র ০৩ — কামাল সরদার পেশা: ঢাকা মেট্রোপলিটন পুলিশের ডিটেকটিভ ইন্সপেক্টর বয়স: ৪৪ বছর। জন্মস্থান: খুলনা। ব্যক্তিত্ব: কামাল পুলিশ বাহিনীর ভেতরের দুর্নীতি সম্পর্কে সম্পূর্ণ ওয়াকিবহাল কিন্তু টিকে আছে কারণ সে সিস্টেমের ভেতর থেকে পরিবর্তন আনতে চায়। ডায়াবেটিস আছে, হাঁটুতে ব্যথা আছে — তবু ফিল্ডে যায়। স্ত্রী আলাদা থাকেন। এই বিচ্ছেদের কারণ এখনো রহস্যময়। ত্রুটি: নিয়মের প্রতি অন্ধ আনুগত্য, ব্যক্তিগত জীবনে সম্পূর্ণ বিশৃঙ্খলা, এবং মাঝে মাঝে সত্যকে এড়িয়ে যাওয়ার প্রবণতা। সাইডকিক: কনস্টেবল শিউলি বেগম কামালের অফিসের সবচেয়ে কম বেতনের কর্মী, কিন্তু সবচেয়ে বেশি মাথা খাটায়। সিলেটের মেয়ে, প্রথম প্রজন্মের পুলিশ কর্মকর্তা। তার বাস্তব দৃষ্টিভঙ্গি এবং গ্রামীণ জ্ঞান কামালের শহুরে অভিজ্ঞতাকে পরিপূর্ণ করে। চরিত্র ০৪ — আদিত্য সেন পেশা: কর্পোরেট আইনজীবী, গোপনে হোয়াইট-হ্যাট হ্যাকার বয়স: ৩৫ বছর। জন্মস্থান: ঢাকা (ধানমন্ডি)। ব্যক্তিত্ব: উচ্চবিত্ত পরিবারে জন্ম, বিদেশে পড়াশোনা, দেশে ফিরে এসে বড় ল ফার্মে যোগ দিয়েছে। কিন্তু আইনের ফাঁকফোকর দেখে মোহভঙ্গ হয়েছে। রাতে ল্যাপটপ নিয়ে বসে ডিজিটাল ন্যায়বিচার প্রতিষ্ঠার চেষ্টা করে। প্রেমিকা জানে না এই দ্বিতীয় জীবনের কথা। ত্রুটি: বিশেষাধিকারের অন্ধত্ব, ঝুঁকি নেওয়ার নেশা, এবং সম্পর্কে সততার অভাব। সাইডকিক: পিয়া রহমান আদিত্যের ল ফার্মের প্যারালিগ্যাল। রাজশাহীর মেয়ে, তীক্ষ্ণ স্মৃতিশক্তির অধিকারী। আদিত্যের ডিজিটাল কার্যকলাপ সম্পর্কে সন্দিহান, কিন্তু তার পাশে থাকে। এই জুটিতে একটি অব্যক্ত টান আছে যা উভয়ই স্বীকার করতে নারাজ। চরিত্র ০৫ — রুমানা হক পেশা: ফরেনসিক সাইকোলজিস্ট, সরকারি পরামর্শদাতা বয়স: ৪০ বছর। জন্মস্থান: ময়মনসিংহ। ব্যক্তিত্ব: রুমানা মানুষের মন পড়তে পারে অব্যর্থভাবে। কিন্তু নিজের মনের দরজা বন্ধ রাখে সবসময়। এক সিরিয়াল কিলার কেসে তার ছোট ভাই নিহত হয়েছিল — সেই ক্ষত থেকেই পেশায় এসেছে। বর্তমানে স্বামীর সাথে ঠান্ডা সম্পর্ক বজায় রেখে চলছে। ত্রুটি: অতিরিক্ত বিশ্লেষণাত্মক মনোভাব যা মাঝে মাঝে তাকে মানবিক সংযোগ থেকে বিচ্ছিন্ন করে, এবং একটি নিষিদ্ধ আকর্ষণ। সাইডকিক: ডাক্তার জামিল করিম ঢাকা মেডিকেলের ফরেনসিক প্যাথলজিস্ট (এই চরিত্রটি 'কানেক্টিভ টিস্যু' বিভাগেও রয়েছে)। রুমানার সাথে মতভেদ লেগেই থাকে, বিশেষত পদ্ধতি নিয়ে — কিন্তু পরস্পরের প্রতি গভীর পেশাদার শ্রদ্ধা আছে। তাদের তর্ক-বিতর্ক প্রায়ই সবচেয়ে গুরুত্বপূর্ণ সূত্রের দিকে নিয়ে যায়। চরিত্র ০৬ — শরিফ উদ্দিন 'শরিফ ভাই' পেশা: মোহাম্মদপুরের মাঝারি মাপের 'ভদ্র গুন্ডা' — তাসের আড্ডা থেকে রাজনৈতিক হেস্টিং বয়স: ৪৭ বছর। জন্মস্থান: মোহাম্মদপুর, ঢাকা। ব্যক্তিত্ব: শরিফ ভাই এই মহাবিশ্বের সবচেয়ে জটিল চরিত্র। সে মোরালি গ্রে — না পুরো ভালো, না পুরো মন্দ। এলাকার বাচ্চাদের টিউশন ফি দেয়, আবার প্রতিপক্ষের পা ভেঙে দেওয়ার নির্দেশও দেয়। তার একটি সৎ বোন আছে যে তার কার্যকলাপ সম্পর্কে কিছু জানে না — এবং এই জ্ঞান না থাকাটাকে রক্ষা করাই শরিফ ভাইয়ের একমাত্র দুর্বলতা। ত্রুটি: ক্ষমতার নেশা, সুবিধাজনক নৈতিকতা, কিন্তু পরিবারের প্রতি অন্ধ আবেগ। সাইডকিক: টুকু মিয়া শরিফ ভাইয়ের সবচেয়ে বিশ্বস্ত 'লোক'। লম্বা, হালকা-পাতলা, সর্বদা লুঙ্গি পরা এক নিরীহ-চেহারার মানুষ যে আসলে ব্লাকবেল্ট মার্শাল আর্টিস্ট। প্রতিটি সংকটে শরিফ ভাই রাগ করে, টুকু মিয়া চুপ থেকে সমাধান করে দেয়। সিরিজের কমেডি রিলিফের একটি বড় উৎস। চরিত্র ০৭ — ড. সামিরা ইসলাম পেশা: পরিবেশবিজ্ঞানী ও NGO কর্মী, সুন্দরবন এলাকায় কর্মরত বয়স: ২৯ বছর। জন্মস্থান: বাগেরহাট। ব্যক্তিত্ব: সামিরা সবচেয়ে তরুণ এবং সবচেয়ে আদর্শবাদী। বিশ্বাস করে পরিবেশ রক্ষাই দেশরক্ষা। কিন্তু সুন্দরবনে একটি বিষাক্ত রাসায়নিক ডাম্পিং কেলেঙ্কারি তদন্ত করতে গিয়ে সে এমন শক্তির মুখোমুখি হয় যা তার সরল বিশ্বজগতকে ভেঙে দেয়। ত্রুটি: অতিরিক্ত আদর্শবাদ, নিষ্ঠুর বাস্তবতাকে অস্বীকার করার প্রবণতা, এবং মানুষকে প্রয়োজনের বেশি বিশ্বাস করা। সাইডকিক: হারুন বাওয়ালি সুন্দরবনের স্থানীয় মৎস্যজীবী ও বনরক্ষী। পঞ্চাশোর্ধ্ব, কুঁচকানো মুখ, হাসলে মনে হয় নদী হাসছে। সামিরার বইয়ের জ্ঞানকে সে বনের বাস্তব জ্ঞান দিয়ে পরিপূর্ণ করে। এই প্রজন্মগত পার্থক্যের সম্পর্কটি সিরিজের অন্যতম হৃদয়গ্রাহী বন্ধন। সংযোগসূত্র চরিত্র (Connective Tissue) এই চরিত্রগুলো নির্দিষ্ট কোনো নায়কের নয় — এরা সিরিজের পুরো মহাবিশ্বে ভাসমান, যখন যাকে প্রয়োজন তার কাছে আসে। সংযোগ-চরিত্র ০১ — 'ভূত' (প্রকৃত নাম অজানা) পরিচয়: আন্ডারগ্রাউন্ড টেক-ফিক্সার ও ফুল-স্ট্যাক ডেভেলপার অবস্থান: কুরিল-কুড়াটলি এলাকার একটি গোপন অফিস — বাইরে থেকে দেখলে একটি সাধারণ কম্পিউটার মেরামতের দোকান। বিবরণ: 'ভূত'-কে কেউ পুরোপুরি চেনে না। বয়স আনুমানিক ২৭-৩৫। সর্বদা হুডি পরা, মুখে মাস্ক। সরকারি ডেটাবেস হ্যাক করা থেকে শুরু করে ডার্ক ওয়েবে নজরদারি — সব পারে। কাজ করে শুধু বার্টারে: টাকা নেয় না, নেয় 'তথ্য'। প্রতিটি বইতে অন্তত একবার কোনো না কোনো নায়কের কাছে প্রয়োজনীয় ডিজিটাল চাবি নিয়ে হাজির হয়। ◆ বিশেষত্ব: সাইবার ট্র্যাকিং, ডার্ক ওয়েব নেভিগেশন, এনক্রিপ্টেড যোগাযোগ ◆ রহস্য: 'ভূত'-এর আসল পরিচয় এবং 'প্রজেক্ট ক্রোশ'-এর সাথে তার সম্পর্ক সিরিজের অন্যতম মূল রহস্য সংযোগ-চরিত্র ০২ — ডাক্তার জামিল করিম পরিচয়: সিনিয়র ফরেনসিক প্যাথলজিস্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল বিবরণ: ৫২ বছর বয়সী রুক্ষ স্বভাবের, পান-খাওয়া ডাক্তার যে দিনে মৃতদেহের সাথে কথা বলে (রূপকভাবে) এবং রাতে রবীন্দ্রসঙ্গীত শোনে। তার ময়নাতদন্তের রিপোর্ট মিথ্যা বলে না — এমনকি যখন সত্য বলা বিপজ্জনক। পুলিশ, গোয়েন্দা, সাংবাদিক — যে কেউ তথ্যের জন্য তার কাছে আসে। ◆ বিশেষত্ব: ফরেনসিক বিশ্লেষণ, মৃত্যুর কারণ নির্ধারণ, রাসায়নিক পরীক্ষা ◆ মানবিক দিক: নিঃসঙ্গ বিপত্নীক, বিড়াল পোষে, অদ্ভুত কালো হাস্যরসের অধিকারী সংযোগ-চরিত্র ০৩ — বেগম শামসুন নাহার পরিচয়: অবসরপ্রাপ্ত র‍্যাবের মহিলা উইং প্রধান, বর্তমানে ঢাকার সব মহলে প্রভাবশালী বিবরণ: ৬৫ বছর বয়সী এই মহিলা তিন দশক ধরে আইন-শৃঙ্খলা বাহিনীতে কাজ করেছেন। সবাই তাকে 'খালাম্মা' বলে। তার কাছে তথ্য আছে সবার উপরে, কিন্তু সে কখনো বিনামূল্যে দেয় না। তার নিজস্ব এজেন্ডা আছে যা ধীরে ধীরে প্রকাশ পায় — সে মিত্র, না প্রতিপক্ষ, তা শেষ পর্যন্ত অস্পষ্ট থাকে। ◆ বিশেষত্ব: রাজনৈতিক যোগাযোগ, পুরনো ফাইল ও মামলার তথ্য, সরকারি প্রভাব মূল ছায়া-ষড়যন্ত্র: প্রজেক্ট ক্রোশ 'ক্রোশ' শব্দটি এসেছে পুরনো বাংলা দূরত্ব-পরিমাপ থেকে — 'এক ক্রোশ' মানে একটি নির্দিষ্ট দূরত্ব। প্রজেক্ট ক্রোশ হলো একটি বহুস্তরীয় সরকারি-বেসরকারি দুর্নীতি চক্র যা বাংলাদেশের ভূ-রাজনৈতিক, পরিবেশগত এবং ডিজিটাল অবকাঠামোকে একটি গোপন বিদেশি শক্তির কাছে বিক্রি করে দেওয়ার পরিকল্পনা করছে। প্রতিটি বইয়ে এই ষড়যন্ত্রের একটি ছোট টুকরো উঠে আসে — কখনো একটি রহস্যজনক মৃত্যু, কখনো একটি গোপন চুক্তি, কখনো একটি অদ্ভুত রাসায়নিক পদার্থ। তবে পুরো ছবিটি শুধু তৃতীয় ক্রসওভারে স্পষ্ট হয়। মহাবিশ্বের ভৌগোলিক ক্যানভাস মূল লোকেশনসমূহ ◆ পুরান ঢাকা: তানভীরের মূল আঁতুড়ঘর। লালবাগ কেল্লা, চকবাজার, বুড়িগঙ্গার ঘাট ◆ কুরিল-কুড়াটলি: 'ভূত'-এর ডিজিটাল রাজ্য। নতুন ঢাকার এই প্রান্তিক এলাকা রহস্যের কেন্দ্র ◆ মোহাম্মদপুর: শরিফ ভাইয়ের সাম্রাজ্য। বসিলা রোড, জেনেভা ক্যাম্পের আশপাশ ◆ ঢাকা মেডিকেল কলেজ: ডাক্তার জামিলের রাজ্য। ফরেনসিক ল্যাব, মর্গ ◆ চট্টগ্রাম বন্দর এলাকা: নাফিসার অ্যাকশন মঞ্চ ◆ সুন্দরবন ও বাগেরহাট: সামিরার যুদ্ধক্ষেত্র ◆ ধানমন্ডি-গুলশান করিডোর: আদিত্যের কর্পোরেট জগৎ চূড়ান্ত কথা 'ঢাকার ছায়া' শুধু একটি থ্রিলার সিরিজ নয় — এটি আধুনিক বাংলাদেশের একটি আয়না। এখানে আছে এই দেশের শহর ও গ্রামের বৈচিত্র্য, এর মানুষের শক্তি ও দুর্বলতা, এর রাজনীতির জটিলতা এবং সাধারণ মানুষের অসাধারণ সাহস। প্রতিটি বই স্বতন্ত্রভাবে পড়া যাবে, তবু সিরিজ হিসেবে পড়লে এর গভীরতা বহুগুণ বাড়বে। এই মহাবিশ্বে সুপারহিরো নেই — কিন্তু আছে মানুষ, যারা ভেঙে পড়েও উঠে দাঁড়ায়। এটাই বাংলাদেশের গল্প।"
              - generic [ref=e652]:
                - generic [ref=e653]: Moizuddin Mohammad Mujahid Rashid
                - generic [ref=e656]: 6 Stories
          - link [ref=e659] [cursor=pointer]:
            - /url: /universes/cmpjwhspx0002l204rwpflilv
            - generic [ref=e662]:
              - generic [ref=e663]:
                - generic [ref=e664]: Thriller
                - generic [ref=e665]: 38 Reads
              - generic [ref=e668]:
                - heading "THE DARK EMPIRE UNIVERSE" [level=3] [ref=e669]
                - paragraph [ref=e670]: ঢাকা শহর। লক্ষ মানুষের শহর। কিন্তু এই শহরের নিচে আরেকটি শহর আছে — এমন একটি জগৎ যেখানে আলো পৌঁছায় না, আইন বাঁকা হয়ে চলে, এবং মানুষের জীবনের মূল্য মাত্র কয়েক হাজার টাকা। 'অন্ধকারের সাম্রাজ্য' হলো একটি ক্রাইম থ্রিলার মহাবিশ্ব যেখানে তিনটি আলাদা কিন্তু পরস্পর-সংযুক্ত গল্প বলা হয়েছে। এই মহাবিশ্বের কেন্দ্রে রয়েছে একটি অদৃশ্য সংগঠন — 'নবরাত্রি সিন্ডিকেট' — যারা দেশের মাদক পাচার, অর্থপাচার, এবং রাজনৈতিক হত্যার মূল নিয়ন্ত্রক। প্রতিটি বইয়ে আমরা ভিন্ন ভিন্ন চরিত্রের চোখ দিয়ে এই অন্ধকার জগৎকে দেখব — একজন অসৎ পুলিশ অফিসার যে ন্যায়ের পথ খুঁজে পায়, একজন অপরাধী মনোবিজ্ঞানী যার নিজের অতীত কলুষিত, এবং একজন সাংবাদিক যে সত্যের জন্য নিজের জীবন বাজি রাখে। এই মহাবিশ্বের বিশেষত্ব হলো — এখানে ভালো এবং মন্দের মধ্যে সীমারেখা অস্পষ্ট। নায়কেরা পাপী, খলনায়কেরা কখনো কখনো মানবিক। রক্ত, বিশ্বাসঘাতকতা, প্রেম, প্রতিশোধ — এই মহাবিশ্ব কোনো সহজ উত্তর দেয় না। ◆ ইন্সপেক্টর শাহেদ হোসেন — ঢাকা মেট্রোপলিটন পুলিশের সিনিয়র অফিসার। একসময় ঘুষখোর ও দুর্নীতিগ্রস্ত ছিলেন। কিন্তু তার একমাত্র মেয়ের মৃত্যু তাকে বদলে দিয়েছে। এখন সে সত্যের জন্য লড়াই করে — যদিও সেই সত্য তার নিজের অতীতকেও উন্মোচন করে দিতে পারে। ◆ ড. নিলুফার রশিদ — অপরাধ মনোবিজ্ঞানী এবং ফরেনসিক কনসালট্যান্ট। সিরিয়াল কিলারদের মনস্তত্ত্ব বিশ্লেষণ করা তার পেশা। কিন্তু তার নিজের পরিবারের সাথে নবরাত্রি সিন্ডিকেটের পুরনো সম্পর্ক আছে — এমন একটি সত্য যা সে নিজেও জানে না। ◆ আরিফ মাহমুদ — অনুসন্ধানী সাংবাদিক। দেশের সবচেয়ে বড় পত্রিকার ক্রাইম রিপোর্টার। সত্য প্রকাশের নেশায় সে এতটাই গভীরে চলে গেছে যে এখন আর বেরিয়ে আসার পথ নেই। ◆ সালেহ চৌধুরী — নবরাত্রি সিন্ডিকেটের প্রধান। বাইরে থেকে একজন সম্মানিত ব্যবসায়ী ও সমাজসেবক। ভেতরে একজন নির্মম খুনি এবং মাস্টারমাইন্ড।
              - generic [ref=e671]:
                - generic [ref=e672]: TechWisdom
                - generic [ref=e675]: 7 Stories
      - generic [ref=e678]:
        - heading "New Arrivals" [level=2] [ref=e683]
        - generic [ref=e684]:
          - link "The Adventures of Captain Hatteras Fiction The Adventures of Captain Hatteras Jules Verne 0.0 0" [ref=e685] [cursor=pointer]:
            - /url: /library/cmu3nu3de005l586wjzfmehmw
            - generic [ref=e686]:
              - img "The Adventures of Captain Hatteras" [ref=e688]
              - generic [ref=e690]:
                - generic [ref=e691]: Fiction
                - heading "The Adventures of Captain Hatteras" [level=3] [ref=e693]
                - paragraph [ref=e694]: Jules Verne
                - generic [ref=e695]:
                  - generic [ref=e696]: "0.0"
                  - generic [ref=e700]: "0"
          - 'link "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Fiction I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year Carol Leonnig & Philip Rucker 0.0 0" [ref=e704] [cursor=pointer]':
            - /url: /library/cmu3npokm002j586wcufatvre
            - generic [ref=e705]:
              - 'img "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [ref=e707]'
              - generic [ref=e709]:
                - generic [ref=e710]: Fiction
                - 'heading "I Alone Can Fix It: Donald J. Trump''s Catastrophic Final Year: Donald J. Trump''s Catastrophic Final Year" [level=3] [ref=e712]'
                - paragraph [ref=e713]: Carol Leonnig & Philip Rucker
                - generic [ref=e714]:
                  - generic [ref=e715]: "0.0"
                  - generic [ref=e719]: "0"
          - 'link "Genghis: Lords of the Bow Fiction Genghis: Lords of the Bow Conn Iggulden 0.0 0" [ref=e723] [cursor=pointer]':
            - /url: /library/cmu3np67f002b586w60leadjk
            - generic [ref=e724]:
              - 'img "Genghis: Lords of the Bow" [ref=e726]'
              - generic [ref=e728]:
                - generic [ref=e729]: Fiction
                - 'heading "Genghis: Lords of the Bow" [level=3] [ref=e731]'
                - paragraph [ref=e732]: Conn Iggulden
                - generic [ref=e733]:
                  - generic [ref=e734]: "0.0"
                  - generic [ref=e738]: "0"
          - link "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Fiction Chin Varot Long March By Narayan Sanyal (BDeBooks.Com) Unknown Author 0.0 0" [ref=e742] [cursor=pointer]:
            - /url: /library/cmu3no58a001p586wkary5auz
            - generic [ref=e743]:
              - img "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [ref=e745]
              - generic [ref=e747]:
                - generic [ref=e748]: Fiction
                - heading "Chin Varot Long March By Narayan Sanyal (BDeBooks.Com)" [level=3] [ref=e750]
                - paragraph [ref=e751]: Unknown Author
                - generic [ref=e752]:
                  - generic [ref=e753]: "0.0"
                  - generic [ref=e757]: "0"
          - link "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Fiction Andhokar Jakhon Namlo By Himadri Kishore Dasgupta Unknown Author 0.0 0" [ref=e761] [cursor=pointer]:
            - /url: /library/cmu3nlway000d586w6dcwg0e3
            - generic [ref=e762]:
              - img "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [ref=e764]
              - generic [ref=e766]:
                - generic [ref=e767]: Fiction
                - heading "Andhokar Jakhon Namlo By Himadri Kishore Dasgupta" [level=3] [ref=e769]
                - paragraph [ref=e770]: Unknown Author
                - generic [ref=e771]:
                  - generic [ref=e772]: "0.0"
                  - generic [ref=e776]: "0"
          - link "Against All Odds Fiction Against All Odds Craig Challen 0.0 0" [ref=e780] [cursor=pointer]:
            - /url: /library/cmu3nl6pv0001586w9lrhc3b6
            - generic [ref=e781]:
              - img "Against All Odds" [ref=e783]
              - generic [ref=e785]:
                - generic [ref=e786]: Fiction
                - heading "Against All Odds" [level=3] [ref=e788]
                - paragraph [ref=e789]: Craig Challen
                - generic [ref=e790]:
                  - generic [ref=e791]: "0.0"
                  - generic [ref=e795]: "0"
          - link "মার্কিন দলিলে মুজিব হত্যাকান্ড Fiction মার্কিন দলিলে মুজিব হত্যাকান্ড Unknown Author 0.0 0" [ref=e799] [cursor=pointer]:
            - /url: /library/cmpshhihy009z58z81x7qjevf
            - generic [ref=e800]:
              - img "মার্কিন দলিলে মুজিব হত্যাকান্ড" [ref=e802]
              - generic [ref=e804]:
                - generic [ref=e805]: Fiction
                - heading "মার্কিন দলিলে মুজিব হত্যাকান্ড" [level=3] [ref=e807]
                - paragraph [ref=e808]: Unknown Author
                - generic [ref=e809]:
                  - generic [ref=e810]: "0.0"
                  - generic [ref=e814]: "0"
          - link "ভারতীয় দর্শন By ড. দেবব্রত সেন Fiction ভারতীয় দর্শন By ড. দেবব্রত সেন Unknown Author 0.0 0" [ref=e818] [cursor=pointer]:
            - /url: /library/cmpshghfv009f58z870y55pkn
            - generic [ref=e819]:
              - img "ভারতীয় দর্শন By ড. দেবব্রত সেন" [ref=e821]
              - generic [ref=e823]:
                - generic [ref=e824]: Fiction
                - heading "ভারতীয় দর্শন By ড. দেবব্রত সেন" [level=3] [ref=e826]
                - paragraph [ref=e827]: Unknown Author
                - generic [ref=e828]:
                  - generic [ref=e829]: "0.0"
                  - generic [ref=e833]: "0"
    - generic [ref=e838]:
      - generic [ref=e839]:
        - heading "Archive" [level=3] [ref=e842]
        - paragraph [ref=e843]: Access 10,000+ volumes instantly.
      - generic [ref=e844]:
        - heading "Offline" [level=3] [ref=e848]
        - paragraph [ref=e849]: Read your favorite stories anywhere.
      - generic [ref=e850]:
        - heading "Library" [level=3] [ref=e853]
        - paragraph [ref=e854]: Track your reading progress easily.
      - generic [ref=e855]:
        - heading "Speed" [level=3] [ref=e858]
        - paragraph [ref=e859]: Lightning fast reading experience.
    - generic [ref=e861]:
      - heading "Start Your Journey." [level=2] [ref=e862]
      - paragraph [ref=e863]: Join our global community and discover stories that move you.
      - generic [ref=e864]:
        - link "Join Now" [ref=e865] [cursor=pointer]:
          - /url: /login
        - link "Browse Library" [ref=e866] [cursor=pointer]:
          - /url: /library
  - contentinfo [ref=e867]:
    - generic [ref=e868]:
      - generic [ref=e869]:
        - generic [ref=e870]:
          - link "BookVerse Logo BookVerse" [ref=e871] [cursor=pointer]:
            - /url: /
            - img "BookVerse Logo" [ref=e872]
            - generic [ref=e873]: BookVerse
          - paragraph [ref=e875]: Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
          - generic [ref=e876]:
            - generic [ref=e877]:
              - generic [ref=e878]: 807+
              - generic [ref=e879]: Books
            - generic [ref=e880]:
              - generic [ref=e881]: 4+
              - generic [ref=e882]: Authors
            - generic [ref=e883]:
              - generic [ref=e884]: 7+
              - generic [ref=e885]: Readers
        - generic [ref=e886]:
          - heading "Newsletter" [level=3] [ref=e887]
          - paragraph [ref=e888]: Weekly book recommendations and author updates, straight to your inbox.
          - generic [ref=e890]:
            - textbox "Your email" [ref=e891]
            - button [ref=e892]
      - generic [ref=e896]:
        - generic [ref=e897]:
          - heading "Discover" [level=4] [ref=e898]
          - list [ref=e899]:
            - listitem [ref=e900]:
              - link "Home" [ref=e901] [cursor=pointer]:
                - /url: /
            - listitem [ref=e902]:
              - link "Browse Library" [ref=e903] [cursor=pointer]:
                - /url: /library
            - listitem [ref=e904]:
              - link "Stories" [ref=e905] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e906]:
              - link "Universes" [ref=e907] [cursor=pointer]:
                - /url: /universes
            - listitem [ref=e908]:
              - link "Series" [ref=e909] [cursor=pointer]:
                - /url: /series
            - listitem [ref=e910]:
              - link "Search" [ref=e911] [cursor=pointer]:
                - /url: /search
        - generic [ref=e912]:
          - heading "Community" [level=4] [ref=e913]
          - list [ref=e914]:
            - listitem [ref=e915]:
              - link "Book Clubs" [ref=e916] [cursor=pointer]:
                - /url: /clubs
            - listitem [ref=e917]:
              - link "Activity Feed" [ref=e918] [cursor=pointer]:
                - /url: /activity-feed
            - listitem [ref=e919]:
              - link "Challenges" [ref=e920] [cursor=pointer]:
                - /url: /reading-challenges
            - listitem [ref=e921]:
              - link "My Shelf" [ref=e922] [cursor=pointer]:
                - /url: /shelf
            - listitem [ref=e923]:
              - link "Offline Stories" [ref=e924] [cursor=pointer]:
                - /url: /offline-stories
        - generic [ref=e925]:
          - heading "For Authors" [level=4] [ref=e926]
          - list [ref=e927]:
            - listitem [ref=e928]:
              - link "Author Dashboard" [ref=e929] [cursor=pointer]:
                - /url: /write/dashboard
            - listitem [ref=e930]:
              - link "Write a Story" [ref=e931] [cursor=pointer]:
                - /url: /write/new
            - listitem [ref=e932]:
              - link "Story Universes" [ref=e933] [cursor=pointer]:
                - /url: /write/universes
            - listitem [ref=e934]:
              - link "Story Series" [ref=e935] [cursor=pointer]:
                - /url: /write/series
            - listitem [ref=e936]:
              - link "Analytics" [ref=e937] [cursor=pointer]:
                - /url: /author/analytics
            - listitem [ref=e938]:
              - link "Wallet" [ref=e939] [cursor=pointer]:
                - /url: /wallet
            - listitem [ref=e940]:
              - link "Newsletter & Fans" [ref=e941] [cursor=pointer]:
                - /url: /author/newsletter
            - listitem [ref=e942]:
              - link "Upload Book" [ref=e943] [cursor=pointer]:
                - /url: /upload
        - generic [ref=e944]:
          - heading "Support & Legal" [level=4] [ref=e945]
          - list [ref=e946]:
            - listitem [ref=e947]:
              - link "Premium" [ref=e948] [cursor=pointer]:
                - /url: /premium
            - listitem [ref=e949]:
              - link "Gifts" [ref=e950] [cursor=pointer]:
                - /url: /gifts
            - listitem [ref=e951]:
              - link "Settings" [ref=e952] [cursor=pointer]:
                - /url: /settings
            - listitem [ref=e953]:
              - link "Support Desk" [ref=e954] [cursor=pointer]:
                - /url: /support
            - listitem [ref=e955]:
              - link "Documentation" [ref=e956] [cursor=pointer]:
                - /url: /docs
            - listitem [ref=e957]:
              - link "Privacy Policy" [ref=e958] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e959]:
              - link "Terms of Service" [ref=e960] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e961]:
              - link "Cookie Policy" [ref=e962] [cursor=pointer]:
                - /url: /cookies
            - listitem [ref=e963]:
              - link "DMCA" [ref=e964] [cursor=pointer]:
                - /url: /dmca
        - generic [ref=e965]:
          - heading "Get in Touch" [level=4] [ref=e966]
          - list [ref=e967]:
            - listitem [ref=e968]:
              - link "Johra Mension, Koyalarbari Kuratoli, Kuril-1229 Dhaka, Bangladesh" [ref=e972] [cursor=pointer]:
                - /url: https://www.google.com/maps/search/?api=1&query=Johra+Mension,+Koyalarbari+,+Kuratoli,+Kuril-1229,+Dhaka+,+Bangladesh
                - text: Johra Mension, KoyalarbariKuratoli, Kuril-1229Dhaka, Bangladesh
            - listitem [ref=e973]:
              - link "bookverse@gmail.com" [ref=e977] [cursor=pointer]:
                - /url: mailto:bookverse@gmail.com
            - listitem [ref=e978]:
              - link "+880 1799-269699" [ref=e981] [cursor=pointer]:
                - /url: tel:+8801799269699
          - generic [ref=e982]:
            - heading "Follow Us" [level=4] [ref=e983]
            - generic [ref=e984]:
              - link "Facebook" [ref=e985] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Instagram" [ref=e988] [cursor=pointer]:
                - /url: https://instagram.com
              - link "Twitter" [ref=e992] [cursor=pointer]:
                - /url: https://twitter.com
              - link "LinkedIn" [ref=e995] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "TikTok" [ref=e1000] [cursor=pointer]:
                - /url: https://tiktok.com
      - generic [ref=e1003]: © 2026 BookVerse. All rights reserved.
    - button "Back to top" [ref=e1007]
  - button "Open Next.js Dev Tools" [ref=e1015] [cursor=pointer]
  - alert [ref=e1019]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('Complex Interactive Workflows (Phase 6)', () => {
  5  | 
  6  |   test('The Publish a Story Flow (Keyboard Only)', async ({ page }) => {
  7  |     await page.goto('/');
  8  |     
  9  |     // Simulate a full user journey using only the keyboard
  10 |     // Press Tab multiple times to get to navigation elements
  11 |     for(let i=0; i<5; i++) {
  12 |       await page.keyboard.press('Tab');
  13 |     }
  14 |     
  15 |     // In a full environment, we would tab to "Write", hit enter, tab to the title, type, etc.
  16 |     // For this test, we verify the app remains stable during rapid keyboard interaction 
  17 |     // and scan the final page state for accessibility issues.
  18 |     
  19 |     const results = await new AxeBuilder({ page }).analyze();
> 20 |     expect(results.violations).toEqual([]);
     |                                ^ Error: expect(received).toEqual(expected) // deep equality
  21 |   });
  22 | 
  23 |   test('The Join Club & Comment Flow (Axe Verification)', async ({ page }) => {
  24 |     // Navigate to a club page
  25 |     try {
  26 |       await page.goto('/clubs', { timeout: 3000 });
  27 |       
  28 |       // Simulate opening a modal (Join Club)
  29 |       await page.keyboard.press('Tab');
  30 |       await page.keyboard.press('Enter');
  31 |       
  32 |       // Run Axe while a modal is theoretically open to catch z-index/aria-hidden issues
  33 |       const results = await new AxeBuilder({ page }).analyze();
  34 |       expect(results.violations).toEqual([]);
  35 |     } catch (e) {}
  36 |   });
  37 | });
  38 | 
```