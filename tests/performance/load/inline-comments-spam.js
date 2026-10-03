import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
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
    text: 'Great paragraph!', 
    rangeStart: 10, 
    rangeEnd: 25 
  });

  const res = http.post(`${BASE_URL}/api/stories/1/inline-comments`, payload, params);

  check(res, {
    'inline comment post status is valid': (r) => [200, 201].includes(r.status),
  });

  sleep(3);
}
