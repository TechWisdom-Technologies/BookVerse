import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // External email dispatch via Resend can take a second
    http_req_duration: ['p(95)<1500'],
  },
  stages: [
    { duration: '30s', target: 10 }, // 10 authors sending newsletters at the same time
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    subject: "My New Chapter is Out!",
    body: "Read my new chapter now...",
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.session-token=mock-valid-token-author-${__VU}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/newsletter/send`, payload, params);

  check(res, {
    'newsletter dispatch status is valid': (r) => [200, 201].includes(r.status),
  });

  sleep(5);
}
