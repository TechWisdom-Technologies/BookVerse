const COOKIE_SECRET = (() => {
  const secret = process.env.COOKIE_SIGNING_SECRET || process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("COOKIE_SIGNING_SECRET or FIREBASE_ADMIN_PRIVATE_KEY environment variable is required in production");
    }
    return "bookverse-fallback-secret-for-development";
  }
  return secret;
})();

/**
 * Sign the user's role using HMAC-SHA256 with a private server-only key.
 */
export async function signRole(role: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(COOKIE_SECRET);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(role)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verify that the user's role matches the given HMAC-SHA256 signature.
 * Uses a constant-time comparison to prevent timing side-channel attacks.
 */
export async function verifyRole(role: string, signature: string): Promise<boolean> {
  if (!role || !signature) return false;
  const expectedSignature = await signRole(role);
  if (expectedSignature.length !== signature.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(expectedSignature);
  const b = encoder.encode(signature);

  // Constant-time bitwise comparison
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}
