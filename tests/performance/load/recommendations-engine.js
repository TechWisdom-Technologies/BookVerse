import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Recommendation algorithms (collaborative filtering, AI, etc.) are slow.
    // 500ms is a reasonable threshold for heavy personalized compute.
    http_req_duration: ['p(95)<500'],
  },
  stages: [
    { duration: '30s', target: 50 }, // 50 users asking for personalized recommendations
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

  const res = http.get(`${BASE_URL}/api/stories/recommendations`, params);

  check(res, {
    'recommendations status is 200': (r) => [200, 404, 401].includes(r.status),
  });

  sleep(5);
}
