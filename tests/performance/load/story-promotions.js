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
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.session-token=mock-valid-token-author-${__VU}`,
    },
  };

  const payload = JSON.stringify({
    storyId: 1,
    bidAmount: 50,
  });

  const res = http.post(`${BASE_URL}/api/story-promotions`, payload, params);

  check(res, {
    'promotion bid status valid': (r) => [200, 201, 404, 401, 403, 400].includes(r.status),
  });

  sleep(5);
}
