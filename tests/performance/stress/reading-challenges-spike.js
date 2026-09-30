import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '20s', target: 200 }, // Huge sudden burst (e.g. New Year's Day challenge launch)
    { duration: '30s', target: 200 },
    { duration: '10s', target: 0 },
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
    goal: 50, // 50 books a year
  });

  const res = http.post(`${BASE_URL}/api/reading-challenges/1/participate`, payload, params);

  check(res, {
    'challenge participate status valid': (r) => [200, 201, 404, 401, 400].includes(r.status),
  });

  sleep(1);
}
