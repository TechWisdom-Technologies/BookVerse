import http from 'k6/http';
import { check, sleep } from 'k6';

// Soak testing configuration - testing for memory leaks over a long period
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '1h', target: 20 }, // Stay at 20 users for 1 hour (Soak)
    { duration: '2m', target: 0 },  // Ramp down
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/books`);

  check(res, {
    'books api status is 200 or 201': (r) => r.status === 200 ,
  });

  sleep(1);
}
