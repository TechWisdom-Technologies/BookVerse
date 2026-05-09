const { Client } = require('pg');
const fs = require('fs');

async function test() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const match = env.match(/DIRECT_URL=["']?(.*?)["']?(\s|$)/);
  const url = match[1].trim().replace(/^"|"$/g, '');

  console.log('Testing connection to:', url.split('@')[1]);
  const client = new Client({ connectionString: url });
  
  try {
    await client.connect();
    console.log('CONNECTED successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('CONNECTION FAILED:', err.message);
    process.exit(1);
  }
}

test();
