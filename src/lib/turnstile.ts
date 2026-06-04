/**
 * Server-side Cloudflare Turnstile CAPTCHA verification.
 *
 * Call verifyTurnstileToken(token) in any API route handler
 * to verify the CAPTCHA response before processing the request.
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string | null | undefined): Promise<{
  success: boolean;
  error?: string;
}> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // If Turnstile is not configured, allow the request (dev mode)
    console.warn("[Turnstile] TURNSTILE_SECRET_KEY not set — skipping verification.");
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "CAPTCHA verification required." };
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    console.warn("[Turnstile] Verification failed:", data["error-codes"]);
    return { success: false, error: "CAPTCHA verification failed. Please try again." };
  } catch (err) {
    console.error("[Turnstile] Verification request error:", err);
    // Don't block users if Turnstile service is down
    return { success: true };
  }
}
