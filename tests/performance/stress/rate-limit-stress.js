import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // We WANT a high failure rate here because we want the Upstash Ratelimit to block them!
    http_req_failed: ['rate>0.80'], // At least 80% of these malicious requests should be blocked (429)
  },
  stages: [
    { duration: '10s', target: 100 }, // Sudden malicious burst
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // A malicious user trying to brute force an endpoint
  const res = http.get(`${BASE_URL}/api/search?q=spam`);

  check(res, {
    'rate limit triggered (429)': (r) => r.status === 429,
  });

  // No sleep, hammering the endpoint as fast as possible to trigger rate limiting
}
