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

  // Add import for AccessDeniedModal
  if (!content.includes('AccessDeniedModal')) {
    content = content.replace(
      /(import .*? from ['"]@\/lib\/tier-check['"];)/,
      '$1\nimport { AccessDeniedModal } from "@/components/auth/AccessDeniedModal";'
    );
  }

  // 1. Find the checkTierAccess in useEffect and extract the required tier and path.
  // It looks like: const access = checkTierAccess(dbUser, "AUTHOR", "/write");
  const match = content.match(/const access = checkTierAccess\(dbUser, ("[^"]+"), ("[^\"]+"|`[^`]+`)\);/);
  if (match) {
    const requiredTier = match[1];
    const tierPath = match[2];

    // Remove the check from inside useEffect
    content = content.replace(
      /const access = checkTierAccess\(dbUser, "[^"]+", [^)]+\);\s*if \(!access\.allowed\) {\s*router\.push\(access\.redirectTo\);\s*return;\s*}/g,
      ''
    );
    
    // Sometimes there's no router.push if I replaced it with something else, but I didn't yet.
    
    // 2. Inject the check right after `const { ... loading: authLoading } = useAuth();`
    // We will place it before the `useEffect`
    content = content.replace(
      /(const {.*?loading: authLoading.*?} = useAuth\(\);)/,
      `$1\n  const access = checkTierAccess(dbUser, ${requiredTier}, ${tierPath});`
    );

    // 3. Update useEffect dependencies and early return
    // Change `if (authLoading) return;` to `if (authLoading || !access.allowed) return;`
    content = content.replace(
      /if \(authLoading\) return;/,
      'if (authLoading || !access.allowed) return;'
    );
    
    // Update useEffect dependencies to include access.allowed
    // e.g. }, [user, dbUser, authLoading, router]); -> }, [user, dbUser, authLoading, router, access.allowed]);
    content = content.replace(
      /}, \[(.*?)\]\);/,
      (fullMatch, deps) => {
        if (!deps.includes('access.allowed')) {
          return `}, [${deps}, access.allowed]);`;
        }
        return fullMatch;
      }
    );

    // 4. Inject AccessDeniedModal
    // Find the first occurrence of `if (authLoading` or `return (` that represents the main render
    // Actually, we can just replace the loader block!
    // Example:
    // if (authLoading || loading) {
    //   return (
    //     <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
    //       <Loader2 className="w-6 h-6 animate-spin text-zinc-300 dark:text-zinc-700" />
    //     </div>
    //   );
    // }
    
    const loaderBlockRegex = /if \(authLoading( \|\| loading(Story)?)?\) {\s*return \(\s*<div[^>]*>\s*<Loader2[^>]*\/>\s*<\/div>\s*\);\s*}/;
    if (loaderBlockRegex.test(content)) {
      content = content.replace(
        loaderBlockRegex,
        (match) => {
          return `${match}\n\n  if (!access.allowed) {\n    return <AccessDeniedModal requiredTier={access.requiredTier} redirectTo={access.redirectTo} />;\n  }`;
        }
      );
    } else {
      // For pages that don't have the standard loader block, inject it right before `return (`
      content = content.replace(
        /(\n\s*)return \(\s*<main/i,
        `$1if (!access.allowed) {\n    return <AccessDeniedModal requiredTier={access.requiredTier} redirectTo={access.redirectTo} />;\n  }$1return (\n    <main`
      );
    }
  }

  fs.writeFileSync(p, content);
}

console.log('Script completed.');
