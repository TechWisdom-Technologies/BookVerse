import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 200 }, // Huge spike in interactive votes
    { duration: '1m', target: 200 },
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

  const payload = JSON.stringify({ type: 'LIKE' });

  // Concurrently reacting and voting
  const responses = http.batch([
    ['POST', `${BASE_URL}/api/stories/1/reactions`, payload, params],
    ['POST', `${BASE_URL}/api/polls/1/vote`, payload, params],
  ]);

  check(responses[0], {
    'reaction post status is valid': (r) => [200, 201, 404, 400].includes(r.status),
  });

  sleep(2);
}
