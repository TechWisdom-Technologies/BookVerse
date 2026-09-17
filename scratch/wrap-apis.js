const fs = require('fs');
const path = require('path');

const targets = [
  "src/app/api/payment/uddokta/initiate/route.ts",
  "src/app/api/payment/uddokta/verify/route.ts",
  "src/app/api/premium/upgrade/route.ts",
  "src/app/api/tips/[userId]/route.ts",
  "src/app/api/story-promotions/route.ts",
  "src/app/api/chat/route.ts",
  "src/app/api/clubs/route.ts",
  "src/app/api/users/me/route.ts",
  "src/app/api/users/[username]/route.ts",
  "src/app/api/auth/sync/route.ts",
  "src/app/api/pdf-proxy/route.ts",
  "src/app/api/series/route.ts",
  "src/app/api/universes/route.ts"
];

for (const p of targets) {
  const fullPath = path.join(process.cwd(), p);
  if (!fs.existsSync(fullPath)) {
    console.log("File not found:", p);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  if (content.includes('withPerformanceLogger')) {
    console.log("Already wrapped:", p);
    continue;
  }
  
  // Add imports
  if (!content.includes('import { NextRequest')) {
     if (content.includes('import { NextResponse')) {
        content = content.replace('import { NextResponse', 'import { NextRequest, NextResponse');
     } else if (content.includes('import { NextApiRequest')) {
        content = content.replace('import { NextApiRequest', 'import { NextRequest, NextApiRequest');
     } else {
        content = 'import { NextRequest, NextResponse } from "next/server";\n' + content;
     }
  }
  
  content = 'import { withPerformanceLogger } from "@/lib/api-logger";\n' + content;
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  let modified = false;
  
  for (const method of methods) {
    // Matches: export async function GET(req: Request) { ... }
    const regexWithArgs = new RegExp(`export async function ${method}\\(([^)]+)\\) \\{`, 'g');
    if (regexWithArgs.test(content)) {
      content = content.replace(regexWithArgs, `const ${method.toLowerCase()}Handler = async ($1) => {`);
      const routeName = '/' + p.replace('src/app/', '').replace('/route.ts', '').replace(/\\[.*?\\]/g, ':id').replace(/\\/g, '/');
      content += `\nexport const ${method} = withPerformanceLogger(${method.toLowerCase()}Handler as any, "${routeName}");\n`;
      modified = true;
    }
    
    // Matches: export async function GET() { ... }
    const regexNoArgs = new RegExp(`export async function ${method}\\(\\) \\{`, 'g');
    if (regexNoArgs.test(content)) {
      content = content.replace(regexNoArgs, `const ${method.toLowerCase()}Handler = async (req: NextRequest) => {`);
      const routeName = '/' + p.replace('src/app/', '').replace('/route.ts', '').replace(/\\[.*?\\]/g, ':id').replace(/\\/g, '/');
      content += `\nexport const ${method} = withPerformanceLogger(${method.toLowerCase()}Handler as any, "${routeName}");\n`;
      modified = true;
    }
  }
  
  if (modified) {
    // Replace req: Request with req: NextRequest in handlers where possible
    const reqRegex = /(const [a-z]+Handler = async \([a-zA-Z0-9_]+): Request\)/g;
    content = content.replace(reqRegex, '$1: NextRequest)');

    fs.writeFileSync(fullPath, content);
    console.log('Wrapped', p);
  } else {
    console.log('No methods matched in', p);
  }
}
