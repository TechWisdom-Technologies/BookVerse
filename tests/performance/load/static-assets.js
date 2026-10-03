import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Static assets should be extremely fast, < 100ms
    http_req_duration: ['p(95)<100'],
  },
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const responses = http.batch([
    ['GET', `${BASE_URL}/favicon.ico`],
    // Attempting to fetch generic CSS file if NextJS has built it
    ['GET', `${BASE_URL}/_next/static/css/styles.css`],
  ]);

  check(responses[0], {
    'favicon status is 200 or 201': (r) => r.status === 200 ,
  });

  sleep(0.5);
}
