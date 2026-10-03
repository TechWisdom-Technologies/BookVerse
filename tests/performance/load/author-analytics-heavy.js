import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Analytics queries can be slow, but let's strictly enforce 300ms
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 20 }, // 20 authors pulling complex reports
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const params = {
    headers: {
      'Cookie': `next-auth.session-token=mock-valid-token-author-${__VU}`,
    },
  };

  const res = http.get(`${BASE_URL}/api/stories/1/analytics-detailed`, params);

  check(res, {
    'analytics status is valid': (r) => [200].includes(r.status),
  });

  // Authors don't refresh analytics 10 times a second
  sleep(10);
}
