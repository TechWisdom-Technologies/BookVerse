# 🔒 BookVerse Security Audit Report

**Date:** May 27, 2026  
**Scope:** Full application — auth, APIs, middleware, cookies, uploads, admin routes

---

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 2 | Needs fix |
| 🟠 HIGH | 4 | Needs fix |
| 🟡 MEDIUM | 5 | Should fix |
| 🔵 LOW / INFO | 4 | Nice to have |

---

## 🔴 CRITICAL Findings

### 1. Admin Middleware Bypass via Cookie Spoofing

**File:** [middleware.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/middleware.ts#L14-L21)

```typescript
if (pathname.startsWith("/admin")) {
    const role = req.cookies.get("user-role")?.value;
    if (role !== "ADMIN") { ... redirect ... }
}
```

**Problem:** The middleware checks admin access using a **client-writable cookie** (`user-role`). Any user can open DevTools → Application → Cookies and set `user-role = ADMIN` to bypass middleware and access the `/admin` dashboard pages.

**Impact:** Anyone can access the admin UI. However, admin **API routes** are safe because they independently verify `dbUser.role !== Role.ADMIN` after a full token verification. So the attacker sees the admin UI but all API calls would return 403.

**Risk:** UI exposure of admin panels (labels, layout, navigation). The data is safe because API routes have proper auth.

**Fix:** Verify the role from the Firebase token or the database in middleware, not from a cookie. Or at minimum, make the `user-role` cookie `httpOnly` and `Secure` so it can't be tampered from client JS. Alternatively, decode the JWT in middleware.

---

### 2. Auth Token Stored in Non-HttpOnly Cookie (XSS → Full Account Takeover)

**File:** [useAuth.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/hooks/useAuth.ts#L43-L47)

```typescript
function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, "Path=/", "SameSite=Lax"];
  if (maxAgeSeconds != null) parts.push(`Max-Age=${maxAgeSeconds}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}
```

**Problem:** The `firebase-token` cookie is set via `document.cookie` **without the `HttpOnly` flag**. This means any XSS vulnerability (even from a third-party script, browser extension, or injected content) can steal the full Firebase JWT token via `document.cookie`.

**Impact:** If an attacker achieves XSS, they can exfiltrate the authentication token and fully impersonate any user, access their data, delete their account, etc.

**Why it's this way:** The token needs to be set from client-side JS after Firebase Auth returns it. This is a common trade-off in client-side Firebase auth patterns.

**Fix:** Switch to a server-side session model. After Firebase auth on the client, POST the token to a `/api/auth/session` endpoint that sets an `HttpOnly; Secure; SameSite=Strict` cookie. The client never touches the cookie directly.

---

## 🟠 HIGH Findings

### 3. XSS Vector via dangerouslySetInnerHTML in Chapter Reader

**File:** [chapters/[chapterId]/page.tsx](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/stories/%5Bid%5D/chapters/%5BchapterId%5D/page.tsx#L132)

```tsx
<div dangerouslySetInnerHTML={{ __html: html }} className="text-lg" />
```

**Problem:** Chapter content (stored as TipTap JSON) is rendered to HTML via `generateHTML()` and injected as raw HTML. If a malicious author crafts a TipTap JSON document with embedded `<script>` tags, `<img onerror>`, or `<a href="javascript:">` payloads, these will execute in every reader's browser.

**Mitigating factor:** TipTap's `generateHTML` only renders known node types (paragraphs, headings, images, bold, etc.), which limits the attack surface. However, the `Image` extension does render `<img>` tags, and malformed JSON could potentially bypass TipTap's schema.

**Fix:** Sanitize the HTML output using a library like `DOMPurify` or `sanitize-html` before injecting it:
```typescript
import DOMPurify from 'isomorphic-dompurify';
const cleanHtml = DOMPurify.sanitize(html);
```

---

### 4. No Rate Limiting on Any API Route

**Problem:** Zero rate limiting across the entire application. Every API route can be hammered indefinitely.

**Exploitable scenarios:**
- **Brute force block list:** Automated scripts can block/unblock thousands of users per second
- **Tip spam:** A malicious user could flood the tip system with fake PENDING transactions
- **Comment flooding:** No throttle on comment creation
- **GDPR export abuse:** The `/api/users/me/export` route does ~10 database queries — an attacker could DDoS the database by calling it in a loop
- **Password reset spam:** Repeatedly triggering password resets

**Fix:** Add rate limiting middleware. Options:
- `next-rate-limit` or `@upstash/ratelimit` (Redis-backed, works on Vercel)
- At minimum, add IP-based rate limits to auth, tipping, comment, and export routes

---

### 5. No CSRF Protection

**Problem:** The app uses `SameSite=Lax` cookies, which provides partial CSRF protection for POST requests. However, `Lax` still allows top-level navigations (e.g., `<form method="POST" action="/api/users/me/deactivate">` on an attacker page). A malicious site could:
- Deactivate a user's account
- Delete their account (if the user had the right deleteConfirm value in a hidden form)

**Mitigating factor:** The API routes expect JSON bodies (`request.json()`), which cannot be sent via regular HTML forms. Browser CORS also blocks cross-origin `fetch()` with credentials. So the real-world risk is **limited** but not zero.

**Fix:** Upgrade cookies to `SameSite=Strict` and/or implement CSRF tokens for state-changing operations.

---

### 6. Mock Stripe Portal URL Leaking to Users

**Files:** 
- [wallet/page.tsx:L422](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/wallet/page.tsx#L422)
- [settings/page.tsx:L829](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/settings/page.tsx#L829)

```tsx
href="https://billing.stripe.com/p/login/mock-portal"
```

**Problem:** This links to a non-existent Stripe portal URL. A user clicking it will see an error page on stripe.com. This is unprofessional and could confuse users. More importantly, if you ever create a real portal, the mock string is easy to miss.

**Fix:** Either:
- Remove the link entirely until Stripe is integrated
- Replace with a disabled button that says "Coming Soon"
- Gate it behind an environment variable: `process.env.STRIPE_PORTAL_URL`

---

## 🟡 MEDIUM Findings

### 7. Deactivation Route Accepts Negative/Extreme Day Values

**File:** [deactivate/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/users/me/deactivate/route.ts#L12)

```typescript
if (days && typeof days === "number" && days > 0) {
    deactivatedUntil = new Date();
    deactivatedUntil.setDate(deactivatedUntil.getDate() + days);
}
```

**Problem:** No upper bound on `days`. A user could send `days: 999999999` which sets `deactivatedUntil` to a date thousands of years in the future. Not a security vulnerability per se, but it's a validation gap.

**Fix:** Cap `days` to a maximum (e.g., 365):
```typescript
const safeDays = Math.min(Math.max(1, Math.floor(days)), 365);
```

---

### 8. GET /api/tips/[userId] Has No Auth and No Pagination Limit

**File:** [tips/[userId]/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/tips/%5BuserId%5D/route.ts#L9-L47)

**Problem:** 
- The GET endpoint is **unauthenticated** — anyone can query any user's complete tip history including sender usernames, amounts, and messages
- Although limited to 50 results via `take: 50`, the sender details are fully exposed

**Privacy impact:** An attacker can enumerate all authors' tip records, see who is tipping whom, and how much.

**Fix:** Either:
- Require authentication and only show tip data to the receiver
- Strip sender details from public responses
- Add auth check: only the user themselves or an admin can see their tips

---

### 9. Newsletter Sends to All Subscribers via Resend `to:` Field

**File:** [newsletter/send/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/newsletter/send/route.ts#L54-L59)

```typescript
await resend.emails.send({
    from,
    to: subscriberEmails,  // All emails visible to each other!
    subject: subject,
    html: htmlContent,
});
```

**Problem:** Sending to multiple recipients in the `to:` field exposes **all subscriber email addresses** to each other. Every subscriber sees every other subscriber's email.

**Fix:** Use `bcc:` instead of `to:`, or send individual emails in a loop / batch:
```typescript
await resend.emails.send({
    from,
    to: user.email,  // Send from self
    bcc: subscriberEmails,
    subject, html: htmlContent,
});
```

---

### 10. user-role Cookie Not HttpOnly

**File:** [auth/sync/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/auth/sync/route.ts#L71)

```typescript
res.cookies.set("user-role", user.role, { httpOnly: false, sameSite: "lax", path: "/" });
```

**Problem:** The `user-role` cookie is explicitly set to `httpOnly: false`. This cookie is readable AND writable by client-side JavaScript. Combined with finding #1, this is the mechanism that enables admin UI bypass.

**Fix:** Set `httpOnly: true` and `Secure: true`. The middleware should read the role from the server-side verified token, not from a client-accessible cookie.

---

### 11. Cron Route Accessible in Development Without Auth

**File:** [cron/publish-chapters/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/cron/publish-chapters/route.ts#L12-L16)

```typescript
const isDev = process.env.NODE_ENV === 'development';
if (!isDev && !isVercelCron && !hasValidToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Problem:** In development mode, the cron route is completely open — no auth required. If the dev server is accidentally exposed to a public network (e.g., `--hostname 0.0.0.0`), anyone can trigger chapter publishing.

**Risk:** Low in practice (dev only), but worth noting.

---

## 🔵 LOW / Informational

### 12. No Input Sanitization on bkashNumber / nagadNumber

**File:** [validators.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/lib/validators.ts#L60-L61)

```typescript
bkashNumber: z.string().optional().nullable(),
nagadNumber: z.string().optional().nullable(),
```

**Problem:** These accept any string — no format validation. A user could store `"><script>alert(1)</script>` as their bKash number. While React auto-escapes this in rendering, if this value is ever used in email templates or raw HTML contexts, it becomes an XSS vector.

**Suggestion:** Add regex validation: `z.string().regex(/^01[3-9]\d{8}$/).optional().nullable()`

---

### 13. Full User Object Returned by /api/auth/sync

**File:** [auth/sync/route.ts](file:///c:/Users/RAJ/Desktop/Running%20projects/Book%20v1.1.1/bookverse/src/app/api/auth/sync/route.ts#L70)

```typescript
const res = NextResponse.json({ user, needsOnboarding });
```

**Problem:** The full Prisma User object is returned to the client, which may include fields like `firebaseUid`, `isDeactivated`, `deactivatedUntil`, and internal IDs. While this goes to the authenticated user only, it's unnecessary data exposure.

**Suggestion:** Use a `select` clause to return only needed fields.

---

### 14. No Content-Security-Policy Headers

**Problem:** The application doesn't set CSP headers, which would help mitigate XSS by restricting inline scripts, external script sources, and form targets.

**Suggestion:** Add CSP headers via `next.config.js`:
```javascript
headers: [{ key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; ..." }]
```

---

### 15. Settings/Wallet Pages Protected Only by Client-Side Auth Check

**Problem:** The `/settings` and `/wallet` pages are NOT in the middleware matcher. They rely entirely on the client-side `useAuth()` hook to redirect unauthenticated users. An attacker can view the page's HTML source and UI skeleton before the redirect fires.

**Risk:** Very low — no sensitive data leaks before auth check completes, but it's inconsistent with other protected routes.

**Suggestion:** Add `/settings/:path*` and `/wallet/:path*` to the middleware matcher:
```typescript
matcher: [
    "/write/:path*",
    "/upload/:path*",
    "/admin/:path*",
    "/shelf/:path*",
    "/profile/edit",
    "/settings/:path*",  // Add
    "/wallet/:path*",    // Add
],
```

---

## ✅ What's Done Right

| Area | Assessment |
|------|-----------|
| **Admin API authorization** | ✅ Every admin API route independently checks `dbUser.role !== Role.ADMIN` after token verification |
| **Ownership checks (IDOR)** | ✅ Comment edit/delete, story update/delete all verify `authorId === dbUser.id` |
| **Firebase token verification** | ✅ All authenticated routes use `adminAuth.verifyIdToken()` — tokens can't be forged |
| **Upload validation** | ✅ File type, size, and extension validation. Filenames are sanitized. UUID prevents collisions |
| **Prisma ORM** | ✅ Using parameterized queries — no SQL injection risk |
| **Password/secrets** | ✅ `.env*` is in `.gitignore`, no hardcoded secrets found in source |
| **Block list** | ✅ Self-block prevention, duplicate check, user existence validation |
| **Account deletion** | ✅ Deletes from both Firebase Auth and Postgres, clears cookies |
| **Tip self-tip prevention** | ✅ `userId === user.id` check prevents self-tipping |
| **Duplicate transaction prevention** | ✅ Checks both Tip and SubscriptionTransaction tables for duplicate transaction IDs |

---

## Priority Remediation Order

1. **CRITICAL #2** — Make `firebase-token` cookie HttpOnly (server-side session exchange)
2. **CRITICAL #1** — Fix admin middleware to not trust client cookie for role
3. **HIGH #3** — Add DOMPurify to chapter HTML rendering
4. **HIGH #4** — Add rate limiting to auth, tips, export, and comment routes
5. **MEDIUM #9** — Fix newsletter email privacy (use BCC)
6. **MEDIUM #8** — Restrict tip history visibility
7. Everything else in order of effort
