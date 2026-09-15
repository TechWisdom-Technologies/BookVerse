import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRole, verifyTier } from "@/lib/cookie-crypto";

// ─── Tier rank helper (must match entitlements.ts) ───
// BANNED and SUSPENDED get rank -1 so they are always blocked.
// Expiry is checked at login (auth/sync sets the effective tier cookie),
// so between logins a stale cookie may grant access. The API layer
// (hasFeatureAccess) is the final authority and checks expiry in real-time.
function tierRank(tier?: string | null) {
  if (tier === "BANNED" || tier === "SUSPENDED") return -1;
  if (tier === "CREATOR") return 3;
  if (tier === "PRO") return 2;
  if (tier === "AUTHOR") return 1;
  return 0; // FREE / null
}

// ─── Tier-protected route definitions ───
// Each entry maps a path prefix to the minimum tier required.
// Order matters — more specific paths must come before broader ones.
const tierProtectedRoutes: { path: string; requiredTier: string }[] = [
  // CREATOR tier routes
  { path: "/author/analytics", requiredTier: "CREATOR" },
  { path: "/author/newsletter", requiredTier: "CREATOR" },
  { path: "/gifts", requiredTier: "CREATOR" },

  // PRO tier routes
  { path: "/wallet", requiredTier: "PRO" },
  { path: "/reading-challenges", requiredTier: "PRO" },
  { path: "/write/requests", requiredTier: "PRO" },

  // AUTHOR tier routes
  { path: "/write/dashboard", requiredTier: "AUTHOR" },
  { path: "/write/new", requiredTier: "AUTHOR" },
  { path: "/write/series", requiredTier: "AUTHOR" },
  { path: "/write/universes", requiredTier: "AUTHOR" },
  { path: "/write/newsletter", requiredTier: "AUTHOR" },
  { path: "/write/story", requiredTier: "AUTHOR" },
  { path: "/write", requiredTier: "AUTHOR" },
  { path: "/upload", requiredTier: "AUTHOR" },
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ─── CSRF / Origin validation for mutating API requests ───
  if (pathname.startsWith("/api/") && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    // Skip origin check for:
    //   - UddoktaPay webhooks (sent from their own servers)
    //   - Cron jobs (sent by Vercel/external cron services)
    const isWebhook = pathname === "/api/payment/uddokta/webhook";
    const isCron = pathname.startsWith("/api/cron/");

    if (!isWebhook && !isCron) {
      const origin = req.headers.get("origin");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;

      // If an Origin header is present, it must match our app domain.
      // Browser requests always include Origin on cross-origin fetches.
      // Same-origin requests from fetch() also include it.
      // Server-to-server calls (no browser) won't have Origin — those are fine.
      if (origin && appUrl) {
        const allowedOrigin = new URL(appUrl).origin;
        if (origin !== allowedOrigin) {
          return NextResponse.json(
            { error: "Cross-origin request blocked" },
            { status: 403 }
          );
        }
      }
    }
  }

  // ─── Page auth guard ───
  // All routes that require the user to be logged in.
  const protectedPages = [
    "/write/",
    "/upload/",
    "/admin/",
    "/shelf/",
    "/profile/edit",
    "/settings/",
    "/wallet/",
    "/author/",
    "/notifications",
    "/activity-feed",
    "/reading-challenges",
    "/reading-stats",
    "/achievements",
    "/gifts",
  ];

  const isProtectedPage = protectedPages.some(
    (p) => pathname.startsWith(p) || pathname === p.replace(/\/$/, "")
  );

  if (isProtectedPage) {
    const token = req.cookies.get("firebase-token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }

    // ─── Admin role check ───
    if (pathname.startsWith("/admin")) {
      const role = req.cookies.get("user-role")?.value;
      const roleSig = req.cookies.get("user-role-sig")?.value;
      const isRoleValid = await verifyRole(role || "", roleSig || "");

      if (!isRoleValid || role !== "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    // ─── Tier enforcement ───
    // Check if this route requires a specific membership tier.
    const tierRoute = tierProtectedRoutes.find(
      (r) => pathname.startsWith(r.path) || pathname === r.path
    );

    if (tierRoute) {
      const role = req.cookies.get("user-role")?.value;
      const roleSig = req.cookies.get("user-role-sig")?.value;
      const isRoleValid = await verifyRole(role || "", roleSig || "");

      // Admins bypass all tier checks
      if (isRoleValid && role === "ADMIN") {
        return NextResponse.next();
      }

      const tier = req.cookies.get("user-tier")?.value;
      const tierSig = req.cookies.get("user-tier-sig")?.value;
      const isTierValid = await verifyTier(tier || "", tierSig || "");

      // BANNED or SUSPENDED users → redirect to home (they cannot upgrade)
      if (isTierValid && (tier === "BANNED" || tier === "SUSPENDED")) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // If tier cookie is missing/invalid or tier is insufficient → redirect to upgrade page
      if (!isTierValid || tierRank(tier) < tierRank(tierRoute.requiredTier)) {
        const tierSlug = tierRoute.requiredTier.toLowerCase();
        const url = req.nextUrl.clone();
        url.pathname = `/premium/checkout`;
        url.searchParams.set("plan", tierSlug);
        url.searchParams.set("redirect", `${pathname}${search}`);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected pages
    "/write/:path*",
    "/upload/:path*",
    "/admin/:path*",
    "/shelf/:path*",
    "/profile/edit",
    "/settings/:path*",
    "/wallet/:path*",
    "/author/:path*",
    "/notifications",
    "/activity-feed",
    "/reading-challenges",
    "/reading-stats",
    "/achievements",
    "/gifts",
    // API routes (for CSRF origin check)
    "/api/:path*",
  ],
};
