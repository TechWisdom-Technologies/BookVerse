import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { exec } from "child_process";
import util from "util";
import path from "path";

const execAsync = util.promisify(exec);

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
    
    // Construct command
    let command = `npx tsx ${scriptPath}`;
    if (script === "bulk-upload") {
      if (dir) command += ` --dir "${dir.replace(/"/g, '\\"')}"`;
      if (email) command += ` --email "${email.replace(/"/g, '\\"')}"`;
    }
    
    // Execute the script using npx tsx
    // We pass the request.signal so that if the client aborts, the child process is terminated.
    const { stdout, stderr } = await execAsync(command, {
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
        details: error.message,
        stdout: error.stdout,
        stderr: error.stderr 
      }, 
      { status: 500 }
    );
  }
}
