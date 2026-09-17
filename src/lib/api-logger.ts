import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

/**
 * Higher-Order Function to wrap Next.js API Routes.
 * - Logs routes taking > 3000ms to `SlowApiLog`
 * - Catches unhandled errors and logs them to `CrashReport`
 * 
 * @param handler The actual API route handler
 * @param routeName An identifier for the route (e.g. "/api/upload")
 */
export function withPerformanceLogger(handler: ApiHandler, routeName: string): ApiHandler {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.url || routeName;

    try {
      // Execute the actual route handler
      const response = await handler(req, ...args);

      // Check duration
      const durationMs = Date.now() - startTime;
      if (durationMs > 3000) {
        // Log asynchronously so we don't slow down the response further
        prisma.slowApiLog.create({
          data: {
            method,
            url: routeName,
            durationMs,
          }
        }).catch(err => console.error("[PerformanceLogger] DB Error:", err));
      }

      return response;
    } catch (error: any) {
      // Catch unhandled crashes
      const durationMs = Date.now() - startTime;
      const errorMessage = error?.message || "Unknown Error";
      const stackTrace = error?.stack || null;

      console.error(`[API Crash] ${method} ${routeName} failed in ${durationMs}ms:`, error);

      // Log the crash to the database
      await prisma.crashReport.create({
        data: {
          url: routeName,
          errorMessage: errorMessage.substring(0, 500),
          stackTrace: stackTrace?.substring(0, 2000),
        }
      }).catch(err => console.error("[PerformanceLogger] Crash Log DB Error:", err));

      // Return a safe 500 response
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
