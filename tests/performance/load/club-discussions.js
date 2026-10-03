import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
  stages: [
    { duration: '30s', target: 40 }, // 40 highly active club members chatting
    { duration: '1m', target: 40 },
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

  const payload = JSON.stringify({
    content: "I totally agree with this theory!",
  });

  const responses = http.batch([
    ['GET', `${BASE_URL}/api/clubs/1/read`, null, params], // Polling for new messages
    ['POST', `${BASE_URL}/api/clubs/1/discussions/1/replies`, payload, params], // Posting a reply
  ]);

  check(responses[0], { 'club read status valid': (r) => [200].includes(r.status) });
  check(responses[1], { 'club reply status valid': (r) => [200, 201].includes(r.status) });

  sleep(3);
}
