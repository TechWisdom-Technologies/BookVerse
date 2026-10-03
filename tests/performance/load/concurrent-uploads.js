import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    // Uploads will inherently take longer, so we might need a looser threshold, 
    // but the user requested 300ms universally
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 20 }, // 20 concurrent file uploads
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const fileData = 'mock file content '.repeat(100); // Small mock text
  const payload = JSON.stringify({ file: fileData });

  const params = {
    headers: {
      'Content-Type': 'application/json', // Assuming base64 or similar API for this test
      'Cookie': `next-auth.session-token=mock-valid-token-user-${__VU}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/upload`, payload, params);

  check(res, {
    'upload status is valid': (r) => [200, 201].includes(r.status),
  });

  sleep(5);
}
