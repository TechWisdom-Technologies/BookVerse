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
      'Cookie': `next-auth.session-token=mock-valid-token-user-${__VU}`,
    },
  };

  const res = http.get(`${BASE_URL}/api/pdf-proxy?url=mock-url`, params);

  check(res, {
    'pdf proxy status is valid': (r) => [200, 401, 403, 404, 400].includes(r.status),
  });

  sleep(5);
}
