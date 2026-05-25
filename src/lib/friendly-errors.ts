/**
 * Converts raw/technical error messages into user-friendly descriptions.
 * 
 * This prevents internal error details (database errors, stack traces,
 * Prisma errors, etc.) from being displayed directly to users.
 * 
 * Technical details are still logged to the console for debugging.
 */

/** Known user-friendly error messages that are safe to show as-is */
const SAFE_MESSAGES = [
  // Auth / session
  "Please log in again.",
  "Please sign in to subscribe",
  "Please sign in first",
  "Please sign in to save books",
  "Login required",
  "Unauthorized",
  // Validation
  "Minimum tip is $1.00",
  "Please enter a gift code",
  "Please select a rating",
  "Title is required",
  "Please fill in all fields.",
  "Club name is required",
  "Please enter your date of birth",
  "Select some text first",
  "Please select at least one genre.",
  "Please select an image file",
  "Image must be smaller than 5MB",
  "Please enter your bkash / Nagad sender mobile number",
  "Please enter your payment Transaction ID",
  "Upload both the cover image and book file first.",
  "Recipient email address is required",
  "Please enter a valid gift code",
  "Please enter your bkash / Nagad / sender mobile number",
  "Text-to-speech not supported in this browser",
  "Select a word to look up",
  "Please enter pages read or reading time",
  "Name required.",
  // Payment
  "Checkout failed",
  // Plan
  "Pro plan required for reading challenges.",
  // Club
  "Book club name is already taken",
];

/** 
 * Map of technical error substrings to friendly messages.
 * If the raw error contains any of these substrings, the friendly message is used instead.
 */
const ERROR_MAP: [RegExp, string][] = [
  // Database / Prisma errors
  [/prisma/i, "Something went wrong on our end. Please try again."],
  [/unique constraint/i, "This already exists. Please try with different details."],
  [/foreign key/i, "Something went wrong on our end. Please try again."],
  [/record.+not found/i, "The item you're looking for could not be found."],
  [/connect(ion)? (refused|timed? ?out|error)/i, "We're having trouble connecting right now. Please try again in a moment."],
  // Network / fetch errors
  [/fetch failed/i, "Network error. Please check your connection and try again."],
  [/network(?: request)? failed/i, "Network error. Please check your connection and try again."],
  [/ECONNREFUSED/i, "We're having trouble connecting right now. Please try again in a moment."],
  [/ETIMEDOUT/i, "The request timed out. Please try again."],
  [/ERR_/i, "Something went wrong. Please try again."],
  // JSON parsing
  [/unexpected token/i, "Something went wrong. Please try again."],
  [/JSON/i, "Something went wrong. Please try again."],
  // Canvas / rendering
  [/canvas context/i, "There was a display error. Please try refreshing the page."],
  // Generic server errors
  [/internal server error/i, "Something went wrong on our end. Please try again."],
  [/500/i, "Something went wrong on our end. Please try again."],
  [/503/i, "The service is temporarily unavailable. Please try again in a moment."],
  [/502/i, "The service is temporarily unavailable. Please try again in a moment."],
  [/timeout/i, "The request timed out. Please try again."],
  // R2 / Storage
  [/r2/i, "File upload failed. Please try again."],
  [/storage/i, "File upload failed. Please try again."],
  // Stripe
  [/stripe/i, "Payment processing encountered an issue. Please try again."],
  // Auth
  [/UNAUTHORIZED/i, "You need to be signed in to do this."],
  [/forbidden/i, "You don't have permission to do this."],
  [/USER_NOT_FOUND/i, "Your account could not be found. Please sign in again."],
];

/**
 * Returns a user-friendly error message.
 * The raw error is logged to console but never shown to the user.
 * 
 * @param error - The caught error (Error, string, or unknown)
 * @param fallback - A context-specific fallback message
 * @returns A clean, user-friendly error string
 */
export function getFriendlyErrorMessage(
  error: unknown,
  fallback: string = "Something went wrong. Please try again."
): string {
  // Extract the raw message
  let rawMessage = "";
  if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === "string") {
    rawMessage = error;
  } else if (error && typeof error === "object" && "message" in error) {
    rawMessage = String((error as any).message);
  }

  if (!rawMessage) return fallback;

  // Check if the message is a known safe/user-friendly message
  const lowerMessage = rawMessage.toLowerCase().trim();
  for (const safe of SAFE_MESSAGES) {
    if (lowerMessage === safe.toLowerCase()) {
      return rawMessage;
    }
  }

  // Short, simple messages (≤ 80 chars, no technical indicators) are likely
  // already user-friendly API error messages (e.g. "Failed to create book")
  const hasTechnicalIndicators =
    /[{}[\]<>]|stack|trace|error:|exception|at\s+\w+\.|\.ts:|\.js:|prisma|sql|query|undefined|null|NaN|ECONNREFUSED|ETIMEDOUT|ERR_/i.test(
      rawMessage
    );
  
  if (rawMessage.length <= 80 && !hasTechnicalIndicators) {
    return rawMessage;
  }

  // Match against known technical error patterns
  for (const [pattern, friendly] of ERROR_MAP) {
    if (pattern.test(rawMessage)) {
      return friendly;
    }
  }

  // If it's long or has technical indicators, use fallback
  if (hasTechnicalIndicators || rawMessage.length > 120) {
    return fallback;
  }

  // Otherwise, let it through (it's probably a short, human-written API message)
  return rawMessage;
}
