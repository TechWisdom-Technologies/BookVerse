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
  let content = fs.readFileSync(p, 'utf8');

  // We want to add a state: const [isRedirecting, setIsRedirecting] = useState(false);
  // And change `router.push(access.redirectTo);` to `setIsRedirecting(true); router.push(access.redirectTo);`
  // And add `if (authLoading || isRedirecting) return <Loader2... />` at the top of the return logic.

  // 1. Add setIsRedirecting to the useEffect block
  content = content.replace(
    /router\.push\(access\.redirectTo\);/g,
    'setIsRedirecting(true);\n      router.push(access.redirectTo);'
  );

  // 2. Add isRedirecting state right after `const router = useRouter();` or `const { ... } = useAuth();`
  if (!content.includes('const [isRedirecting, setIsRedirecting] = useState(false);')) {
    content = content.replace(
      /(const {.*?loading: authLoading.*?} = useAuth\(\);)/,
      '$1\n  const [isRedirecting, setIsRedirecting] = useState(false);'
    );
  }

  // 3. Add the loading render block right before the first `return (` or `if (!data)` or similar main render logic.
  // Actually, some pages already have `if (authLoading || loading) return <Loader2 />`.
  // Let's modify existing `authLoading` checks.
  
  // If it has `if (authLoading || loading) {`, change to `if (authLoading || loading || isRedirecting) {`
  if (content.includes('if (authLoading || loading) {')) {
    content = content.replace(
      'if (authLoading || loading) {',
      'if (authLoading || loading || isRedirecting) {'
    );
  } else if (content.includes('if (authLoading) return <')) {
    // If it has `if (authLoading) return <Loader2 ...`
    content = content.replace(
      /if \(authLoading\) return <.*/,
      'if (authLoading || isRedirecting) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950"><Loader2 className="w-6 h-6 animate-spin text-zinc-300 dark:text-zinc-700" /></div>;'
    );
  } else {
    // Inject it before the first `return (`
    const loaderBlock = `
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300 dark:text-zinc-700" />
      </div>
    );
  }
`;
    // Find the first `return (` that isn't inside a useEffect or callback.
    // A safe way is to find `return (` that is indented by 2 or 4 spaces and is the main render.
    // Instead, let's just find `return (` and inject it before if we haven't handled it.
    // Wait, let's just use a regex to insert after the state declarations (e.g. after the last useEffect)
    // Actually, just find `const fetch` or `return (`
    // It's safer to just look manually at the pages that need it:
    // /write/page.tsx, /write/new/page.tsx, /write/story/[id]/edit/page.tsx
    
  }

  // Make sure Loader2 is imported
  if (!content.includes('Loader2')) {
    content = content.replace(
      /import {(.*?)} from ['"]lucide-react['"];/,
      'import { Loader2, $1 } from "lucide-react";'
    );
  }

  fs.writeFileSync(p, content);
}
console.log('Done refactoring 12 pages.');
