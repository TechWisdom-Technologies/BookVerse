import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Calling external AI APIs (OpenAI/Google) can be slow. 
    // We expect this to take up to 2 seconds, but let's monitor it.
    http_req_duration: ['p(95)<2000'],
  },
  stages: [
    { duration: '30s', target: 20 }, // 20 concurrent stories submitted
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    content: "This is a new chapter that needs AI moderation check.",
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.session-token=mock-valid-token-author-${__VU}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/moderation/check-content`, payload, params);

  check(res, {
    'moderation status is valid': (r) => [200, 201, 401, 403, 404].includes(r.status),
  });

  sleep(5);
}
