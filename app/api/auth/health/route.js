import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db";

export const runtime = "nodejs";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const dbStatus = await testConnection();

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus ? "connected" : "disconnected",
    environment: process.env.NODE_ENV,
  });
}
