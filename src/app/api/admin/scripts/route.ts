import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { execFile } from "child_process";
import util from "util";

const execFileAsync = util.promisify(execFile);

const ALLOWED_SCRIPTS = {
  "rebuild-search": "scripts/rebuild-search.ts",
  "cleanup-orphans": "scripts/cleanup-orphans.ts",
  "bulk-upload": "scripts/bulk-upload.ts",
  "expire-promotions": "scripts/expire-promotions.ts",
  "recalculate-stats": "scripts/recalculate-stats.ts",
  "upgrade-founding-users": "scripts/upgrade-founding-users.ts",
};

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { script, dir, email } = await request.json();

    if (!script || !(script in ALLOWED_SCRIPTS)) {
      return NextResponse.json({ error: "Invalid script name" }, { status: 400 });
    }

    const scriptPath = ALLOWED_SCRIPTS[script as keyof typeof ALLOWED_SCRIPTS];
    
    // Build arguments as an array — bypasses shell entirely, preventing injection
    const args = [scriptPath];
    if (script === "bulk-upload") {
      if (dir && typeof dir === "string") {
        args.push("--dir", dir);
      }
      if (email && typeof email === "string") {
        args.push("--email", email);
      }
    }
    
    // Use execFile with npx — no shell involved, arguments are passed directly
    const { stdout, stderr } = await execFileAsync("npx", ["tsx", ...args], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large outputs
      signal: request.signal,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Script executed successfully", 
      stdout, 
      stderr 
    });

  } catch (error: any) {
    console.error("Script execution failed:", error);
    return NextResponse.json(
      { 
        error: "Script execution failed", 
        details: process.env.NODE_ENV === "development" ? error.message : "Internal error",
      }, 
      { status: 500 }
    );
  }
}
