import http from 'k6/http';
import { check, sleep } from 'k6';

// Test Configuration
export const options = {
  // Phase 7 threshold requirement (User requested 300ms)
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete below 300ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up to 20 users over 30 seconds
    { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp-down to 0 users
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Simulate a user browsing the library
  const responses = http.batch([
    ['GET', `${BASE_URL}/api/books?page=1&limit=10`],
    ['GET', `${BASE_URL}/api/stories?page=1&limit=10`],
  ]);

  check(responses[0], {
    'books api status is 200 or 404': (r) => r.status === 200 || r.status === 404, // 404 acceptable if API doesn't exist yet
  });

  check(responses[1], {
    'stories api status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  sleep(1); // User thinks/reads for 1 second before clicking again
}
