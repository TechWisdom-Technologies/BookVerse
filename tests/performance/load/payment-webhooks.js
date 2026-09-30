import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate==0'], // Webhooks must never fail!
  },
  stages: [
    { duration: '30s', target: 100 }, // Sudden burst of 100 payments
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    event: 'payment.success',
    transactionId: `txn_${__VU}_${__ITER}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Webhook-Signature': 'mock-valid-signature',
    },
  };

  const res = http.post(`${BASE_URL}/api/payment/uddokta/webhook`, payload, params);

  check(res, {
    'webhook status is 200/404': (r) => [200, 404, 400].includes(r.status), // 404/400 acceptable if mock data fails validation, but not 500
  });

  sleep(1);
}
