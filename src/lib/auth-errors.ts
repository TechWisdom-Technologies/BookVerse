/**
 * Maps raw Firebase Authentication error codes or messages
 * to human-readable user-friendly error descriptions.
 */
export function getFriendlyAuthErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred."
): string {
  if (!error) return defaultMessage;

  const err = error as any;
  const code = err.code || "";
  const message = err.message || "";

  // 1. Map known Firebase Auth error codes
  if (code === "auth/invalid-credential" || message.includes("auth/invalid-credential")) {
    return "Invalid email address or password. Please try again.";
  }
  if (code === "auth/wrong-password" || message.includes("auth/wrong-password")) {
    return "Incorrect password. Please try again.";
  }
  if (code === "auth/user-not-found" || message.includes("auth/user-not-found")) {
    return "No account exists with this email address.";
  }
  if (code === "auth/email-already-in-use" || message.includes("auth/email-already-in-use")) {
    return "This email address is already registered to another account.";
  }
  if (code === "auth/weak-password" || message.includes("auth/weak-password")) {
    return "The password is too weak. Please choose a password with at least 8 characters.";
  }
  if (code === "auth/too-many-requests" || message.includes("auth/too-many-requests")) {
    return "Too many unsuccessful attempts. This account has been temporarily locked. Please try again later.";
  }
  if (code === "auth/user-disabled" || message.includes("auth/user-disabled")) {
    return "This account has been disabled. Please contact system support.";
  }
  if (code === "auth/invalid-email" || message.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (code === "auth/popup-closed-by-user" || message.includes("auth/popup-closed-by-user")) {
    return "Sign in cancelled. Please try again.";
  }

  // 2. Fallback: Strip the "Firebase: " prefix from other errors to keep it clean
  if (message) {
    return message.replace(/^Firebase:\s*(Error\s*)?\(.*?\)?\s*/i, "").trim();
  }

  return defaultMessage;
}
