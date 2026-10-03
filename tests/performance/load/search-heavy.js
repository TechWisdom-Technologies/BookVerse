import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'], 
    http_req_failed: ['rate<0.01'],   
  },
  stages: [
    { duration: '30s', target: 50 },  // Spiking to 50 concurrent searches
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';
const SEARCH_TERMS = ['fantasy', 'romance', 'sci-fi', 'magic', 'dragon', 'love'];

export default function () {
  // Pick a random search term
  const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
  
  const res = http.get(`${BASE_URL}/api/search?q=${term}`);

  check(res, {
    'search api status is 200 or 201': (r) => r.status === 200 ,
  });

  sleep(0.5); // Rapid searching
}
