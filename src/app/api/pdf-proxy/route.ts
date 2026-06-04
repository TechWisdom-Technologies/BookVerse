import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

// Only allow proxying PDFs from our own R2 storage domain
const ALLOWED_HOSTS = [
  "pub-666ffca9921d4b79b6738f62abc3af39.r2.dev",
];

function isAllowedUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  // Rate limit: 30 proxy requests per minute per IP
  const limitRes = await checkRateLimit(30, 60000);
  if (limitRes.limited) return limitRes.response;

  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return new NextResponse("URL not allowed. Only BookVerse storage URLs are permitted.", { status: 403 });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    
    if (response.headers.has("Content-Length")) {
      headers.set("Content-Length", response.headers.get("Content-Length")!);
    }

    return new NextResponse(response.body, { headers });
  } catch (error: any) {
    console.error("PDF Proxy Error:", error);
    return new NextResponse("Internal Server Error fetching PDF", { status: 500 });
  }
}
