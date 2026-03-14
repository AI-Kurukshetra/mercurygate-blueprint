import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "tms-platform",
    timestamp: new Date().toISOString()
  });
}

