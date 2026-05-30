import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    headers.set("Access-Control-Allow-Origin", "*");
    
    if (response.headers.has("Content-Length")) {
      headers.set("Content-Length", response.headers.get("Content-Length")!);
    }

    return new NextResponse(response.body, { headers });
  } catch (error: any) {
    console.error("PDF Proxy Error:", error);
    return new NextResponse("Internal Server Error fetching PDF", { status: 500 });
  }
}
