const fs = require('fs');
const path = require('path');

const pages = [
  'src/app/write/page.tsx',
  'src/app/write/new/page.tsx',
  'src/app/write/dashboard/page.tsx',
  'src/app/write/series/page.tsx',
  'src/app/write/universes/page.tsx',
  'src/app/write/requests/page.tsx',
  'src/app/wallet/page.tsx',
  'src/app/reading-challenges/page.tsx',
  'src/app/author/analytics/page.tsx',
  'src/app/author/newsletter/page.tsx',
  'src/app/gifts/page.tsx',
  'src/app/write/story/[id]/edit/page.tsx'
];

for (const relPath of pages) {
  const p = path.join(process.cwd(), relPath);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf8');

  // Fix 1: if (authLoading || loading)
  content = content.replace(
    /if \(authLoading \|\| loading\) \{/g,
    'if (authLoading || (loading && access.allowed)) {'
  );
  
  // Fix 2: if (authLoading || loadingStory)
  content = content.replace(
    /if \(authLoading \|\| loadingStory\) \{/g,
    'if (authLoading || (loadingStory && access.allowed)) {'
  );

  // Fix 3: some pages might have `if (authLoading) {` which is fine, because access.allowed check comes after it.
  // Wait, in `write/new/page.tsx`, I injected:
  // if (authLoading) { return <Loader2 /> }
  // if (!access.allowed) { return <AccessDeniedModal ... /> }
  // This is PERFECT and doesn't need fixing because it doesn't depend on `loading`.

  fs.writeFileSync(p, content);
}

console.log('Loader logic fixed.');
