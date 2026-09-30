import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Simulate an authenticated user by passing a mock session cookie
  // Note: For real testing against protected routes, you need valid tokens.
  const params = {
    headers: {
      'Cookie': 'next-auth.session-token=mock-valid-token-for-load-test',
    },
  };

  const responses = http.batch([
    ['GET', `${BASE_URL}/api/users/me`, null, params],
    ['GET', `${BASE_URL}/api/users/me/shelf`, null, params],
  ]);

  check(responses[0], {
    'profile api status is 200 or 401/404': (r) => [200, 401, 404].includes(r.status),
  });

  sleep(1);
}
