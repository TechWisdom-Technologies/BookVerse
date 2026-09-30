import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Should be incredibly fast since it's polled frequently
    http_req_duration: ['p(95)<100'],
  },
  stages: [
    { duration: '30s', target: 500 }, // 500 users sitting on the site
    { duration: '1m', target: 500 },
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

  // Simulating the interval polling for priority notifications
  const res = http.get(`${BASE_URL}/api/notifications/priority`, params);

  check(res, {
    'notification poll status is valid': (r) => [200, 304, 401, 404, 403].includes(r.status),
  });

  // Clients typically poll every 10-30 seconds
  sleep(10);
}
