import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the secure cookies by setting their maxAge to 0
  response.cookies.set("firebase-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("user-role", "", { maxAge: 0, path: "/" });
  response.cookies.set("user-role-sig", "", { maxAge: 0, path: "/" });
  
  return response;
}
