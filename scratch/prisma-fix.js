const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = fs.readFileSync(envPath, 'utf8');
  
  // Try to find DIRECT_URL or DATABASE_URL
  const directUrlMatch = env.match(/DIRECT_URL=["']?(.*?)["']?(\s|$)/);
  const dbUrlMatch = env.match(/DATABASE_URL=["']?(.*?)["']?(\s|$)/);
  
  const url = (directUrlMatch && directUrlMatch[1]) || (dbUrlMatch && dbUrlMatch[1]);
  
  if (!url) {
    console.error('Could not find connection URL in .env.local');
    process.exit(1);
  }

  process.env.DATABASE_URL = url.trim().replace(/^"|"$/g, '');
  console.log('Using URL:', process.env.DATABASE_URL.split('@')[1]); // Log host for confirmation

  console.log('Running prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('SUCCESS: Database tables created.');

} catch (error) {
  console.error('Prisma fix failed:', error.message);
  process.exit(1);
}
