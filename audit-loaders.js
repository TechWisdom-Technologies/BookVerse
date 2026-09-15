const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/app');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx') || file.endsWith('layout.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

let missingCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Only check files that use checkTierAccess
  if (!content.includes('checkTierAccess(') && !content.includes('AccessDeniedModal')) {
    return;
  }

  // We are looking for any return <Loader2 /> blocks that do NOT check `access.allowed`
  // E.g. `if (loading) return (` or `if (authLoading || loading) return (`
  // or `if (loading) { return (`
  
  // Regex to find typical loader block conditions that DON'T have access.allowed
  // It matches "if (something_loading) return" or "if (something_loading) {"
  const regex = /if\s*\([^)]*loading[^)]*\)\s*(?:return\s*\(|\{)/gi;
  
  let match;
  let hasIssues = false;
  
  while ((match = regex.exec(content)) !== null) {
    const matchedStr = match[0];
    if (!matchedStr.includes('access.allowed')) {
      console.log(`\n🚨 ISSUE FOUND in ${file}`);
      console.log(`Matched block: ${matchedStr}`);
      hasIssues = true;
      missingCount++;
    }
  }
});

console.log(`\nAudit complete. Found ${missingCount} issues.`);
