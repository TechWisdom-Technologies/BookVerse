import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRole } from "@/lib/cookie-crypto";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ─── CSRF / Origin validation for mutating API requests ───
  if (pathname.startsWith("/api/") && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    // Skip origin check for:
    //   - Stripe webhooks (Stripe sends from its own servers)
    //   - Cron jobs (sent by Vercel/external cron services)
    const isWebhook = pathname === "/api/stripe/webhook";
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

  // ─── Page auth guard (existing logic — unchanged) ───
  const protectedPages = [
    "/write/",
    "/upload/",
    "/admin/",
    "/shelf/",
    "/profile/edit",
    "/settings/",
    "/wallet/",
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected pages (existing)
    "/write/:path*",
    "/upload/:path*",
    "/admin/:path*",
    "/shelf/:path*",
    "/profile/edit",
    "/settings/:path*",
    "/wallet/:path*",
    // API routes (for CSRF origin check)
    "/api/:path*",
  ],
};
