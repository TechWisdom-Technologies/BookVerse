import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike testing configuration
export const options = {
  thresholds: {
    // During a massive spike, we might expect some degradation, but let's keep the threshold tight
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.05'], // Up to 5% failure rate tolerated during massive spike
  },
  stages: [
    { duration: '10s', target: 20 },   // Normal load
    { duration: '10s', target: 200 },  // Sudden spike to 200 concurrent users!
    { duration: '30s', target: 200 },  // Hold spike
    { duration: '10s', target: 20 },   // Scale down
    { duration: '30s', target: 20 },   // Normal load
    { duration: '10s', target: 0 },    // Scale down
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Everyone hits the new book release page simultaneously
  const res = http.get(`${BASE_URL}/library/999`); // Assuming 999 is the viral book

  check(res, {
    'page loaded successfully (200 or 201)': (r) => r.status === 200 ,
  });

  sleep(1);
}
