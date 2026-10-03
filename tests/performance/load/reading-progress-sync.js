import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // 300ms threshold for this high-frequency route
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 500 },  // Massive ramp up to 500 concurrent readers
    { duration: '1m', target: 500 },   // Maintain 500 readers
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.session-token=mock-valid-token-user-${__VU}`,
    },
  };

  const payload = JSON.stringify({
    progress: Math.floor(Math.random() * 100),
    timeSpent: 30, // seconds
  });

  // Readers hitting both reading-logs and story progress
  const responses = http.batch([
    ['POST', `${BASE_URL}/api/stories/1/progress`, payload, params],
    ['POST', `${BASE_URL}/api/reading-logs/user_${__VU}`, payload, params],
  ]);

  check(responses[0], {
    'progress sync status is 200/201/404': (r) => [200, 201].includes(r.status),
  });
  
  check(responses[1], {
    'reading log sync status is 200/201/404': (r) => [200, 201].includes(r.status),
  });

  // Usually synced every 10-30 seconds, but we speed it up slightly to generate load
  sleep(5);
}
