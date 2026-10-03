import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 25 },
    { duration: '1m', target: 25 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    amount: 100, // Tip amount
    authorId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'next-auth.session-token=mock-valid-token-for-load-test',
    },
  };

  const res = http.post(`${BASE_URL}/api/tips`, payload, params);

  check(res, {
    'tip post status is 201/200 or 201/404': (r) => [200, 201].includes(r.status),
  });

  sleep(2);
}
