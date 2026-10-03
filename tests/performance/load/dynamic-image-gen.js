import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Dynamic image generation (like OG cards) is CPU bound and can be slow.
    http_req_duration: ['p(95)<1500'],
  },
  stages: [
    { duration: '30s', target: 30 }, // 30 concurrent users requesting share cards
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/stories/1/share-card`);

  check(res, {
    'share card generated (200 or 201)': (r) => [200].includes(r.status),
  });

  sleep(2);
}
