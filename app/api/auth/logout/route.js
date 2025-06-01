import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { executeQuery } from "@/lib/db";
import { verifyToken } from "@/controllers/auth.controller.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Already logged out" },
        { status: 200 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      // Even if token is invalid, still clear the cookie
      cookieStore.set({
        name: "accessToken",
        value: "",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
      });

      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // Soft invalidate the session
    await executeQuery({
      query: `UPDATE tbl_sessions SET revoked = TRUE WHERE token = ?`,
      values: [token],
    });

    // Clear the cookie
    cookieStore.set({
      name: "accessToken",
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
