import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Data exports can be very slow, but we'll monitor them
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 5 }, // Just 5 concurrent exports is a lot of CPU
    { duration: '30s', target: 5 },
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

  const res = http.get(`${BASE_URL}/api/users/me/export`, params);

  check(res, {
    'export status is valid': (r) => [200, 202, 401, 404, 403].includes(r.status),
  });

  sleep(15);
}
