const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

const replacements = {
  'text-zinc-955': 'text-zinc-950',
  'bg-zinc-955': 'bg-zinc-950',
  'text-zinc-455': 'text-zinc-400',
  'bg-zinc-850': 'bg-zinc-800',
  'border-zinc-850': 'border-zinc-800',
  'text-zinc-450': 'text-zinc-400',
  'text-zinc-150': 'text-zinc-200',
  'bg-zinc-150': 'bg-zinc-200',
  'border-zinc-150': 'border-zinc-200',
  'hover:bg-zinc-850': 'hover:bg-zinc-800',
  'hover:border-zinc-650': 'hover:border-zinc-600',
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [bad, good] of Object.entries(replacements)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
