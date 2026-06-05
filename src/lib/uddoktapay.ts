/**
 * UddoktaPay API Client
 *
 * Server-side helper for initiating and verifying payments
 * via UddoktaPay (bKash, Nagad, Card — all in one).
 *
 * Env vars required:
 *   UDDOKTAPAY_API_KEY   — from your UddoktaPay dashboard
 *   UDDOKTAPAY_API_URL   — e.g. https://sandbox.uddoktapay.com or your live URL
 */

const getBaseUrl = () => {
  const url = process.env.UDDOKTAPAY_API_URL;
  if (!url) throw new Error("[UddoktaPay] UDDOKTAPAY_API_URL is not set.");
  // Strip trailing slash
  return url.replace(/\/+$/, "");
};

const getApiKey = () => {
  const key = process.env.UDDOKTAPAY_API_KEY;
  if (!key) throw new Error("[UddoktaPay] UDDOKTAPAY_API_KEY is not set.");
  return key;
};

// ─── Types ───────────────────────────────────────────────────────

export interface UddoktaInitiatePayload {
  full_name: string;
  email: string;
  amount: number;
  metadata: Record<string, string>;
  redirect_url: string;
  cancel_url: string;
  return_type?: "GET" | "POST";
}

export interface UddoktaInitiateResponse {
  payment_url: string;
  // The API might return other fields, but we only need the redirect URL
  [key: string]: unknown;
}

export interface UddoktaVerifyResponse {
  invoice_id: string;
  status: "COMPLETED" | "PENDING" | "ERROR";
  transaction_id: string | null;
  sender_number: string | null;
  amount: string;
  charged_amount: string;
  fee: string;
  payment_method: string | null;
  date: string;
  full_name: string;
  email: string;
  metadata: Record<string, string>;
  message?: string;
}

// ─── API Functions ───────────────────────────────────────────────

/**
 * Initiate a checkout session.
 * Returns the payment_url to redirect the user to.
 */
export async function initiatePayment(
  payload: UddoktaInitiatePayload
): Promise<UddoktaInitiateResponse> {
  const res = await fetch(`${getBaseUrl()}/api/checkout-v2`, {
    method: "POST",
    headers: {
      "RT-UDDOKTAPAY-API-KEY": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...payload,
      return_type: payload.return_type || "GET",
    }),
  });

  const textResponse = await res.text();
  let data;
  try {
    data = JSON.parse(textResponse);
  } catch (err) {
    console.error("[UddoktaPay] Initiate Failed (Not JSON). Raw response:", textResponse);
    throw new Error(`UddoktaPay Gateway Error: ${res.status} ${res.statusText}`);
  }

  if (!res.ok || !data.payment_url) {
    console.error("[UddoktaPay] Initiate failed:", data);
    throw new Error(data.message || "Failed to create UddoktaPay checkout.");
  }

  return data as UddoktaInitiateResponse;
}

/**
 * Verify a completed payment using the invoice_id.
 */
export async function verifyPayment(
  invoiceId: string
): Promise<UddoktaVerifyResponse> {
  const res = await fetch(`${getBaseUrl()}/api/verify-payment`, {
    method: "POST",
    headers: {
      "RT-UDDOKTAPAY-API-KEY": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ invoice_id: invoiceId }),
  });

  const textResponse = await res.text();
  let data;
  try {
    data = JSON.parse(textResponse);
  } catch (err) {
    console.error("[UddoktaPay] Verify Failed (Not JSON). Raw response:", textResponse);
    throw new Error(`UddoktaPay Gateway Error: ${res.status} ${res.statusText}`);
  }

  if (!res.ok) {
    console.error("[UddoktaPay] Verify failed:", data);
    throw new Error(data.message || "Payment verification failed.");
  }

  return data as UddoktaVerifyResponse;
}

export interface UddoktaRefundResponse {
  status: boolean;
  message: string;
}

/**
 * Refund a completed payment using the invoice_id.
 */
export async function refundPayment(
  invoiceId: string
): Promise<UddoktaRefundResponse> {
  const res = await fetch(`${getBaseUrl()}/api/refund-payment`, {
    method: "POST",
    headers: {
      "RT-UDDOKTAPAY-API-KEY": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ invoice_id: invoiceId }),
  });

  const textResponse = await res.text();
  let data;
  try {
    data = JSON.parse(textResponse);
  } catch (err) {
    console.error("[UddoktaPay] Refund Failed (Not JSON). Raw response:", textResponse);
    throw new Error(`UddoktaPay Gateway Error: ${res.status} ${res.statusText}`);
  }

  if (!res.ok) {
    console.error("[UddoktaPay] Refund failed:", data);
    throw new Error(data.message || "Payment refund failed.");
  }

  return data as UddoktaRefundResponse;
}
