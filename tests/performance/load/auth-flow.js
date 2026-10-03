import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    email: `loadtest_${__VU}_${__ITER}@example.com`,
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Simulating hitting the credentials provider endpoint in NextAuth
  const res = http.post(`${BASE_URL}/api/auth/callback/credentials`, payload, params);

  check(res, {
    'auth status is 200 or 201/404': (r) => [200].includes(r.status),
  });

  sleep(2);
}
