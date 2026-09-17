const { Redis } = require("@upstash/redis");
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function test() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  
  const response = await fetch(`${url.replace(/\/$/, '')}/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(["DBSIZE"]),
  });
  const data = await response.json();
  console.log("DBSIZE:", data);
}
test();
