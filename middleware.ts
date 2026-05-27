import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRole } from "@/lib/cookie-crypto";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/write/:path*",
    "/upload/:path*",
    "/admin/:path*",
    "/shelf/:path*",
    "/profile/edit",
    "/settings/:path*",
    "/wallet/:path*",
  ],
};

