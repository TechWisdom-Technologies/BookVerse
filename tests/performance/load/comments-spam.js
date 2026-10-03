import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Writes might be slower than reads, but let's aim for the 300ms threshold
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 30 }, // Spiking to 30 concurrent commenters
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    content: 'This is a load test comment!',
    storyId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'next-auth.session-token=mock-valid-token-for-load-test',
    },
  };

  const res = http.post(`${BASE_URL}/api/comments`, payload, params);

  check(res, {
    'comment post status is 201 or 401/404': (r) => [201].includes(r.status),
  });

  sleep(2); // Users don't spam 10 comments a second usually
}
