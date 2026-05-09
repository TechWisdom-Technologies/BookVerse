import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implement messaging feature with proper Prisma schema
  return NextResponse.json([], { status: 200 });
}
