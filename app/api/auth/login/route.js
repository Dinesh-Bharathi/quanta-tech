import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { executeQuery } from "@/lib/db";
import { comparePassword, createSession } from "@/controllers/auth.controller";

export const runtime = "nodejs";

// Input validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    const body = await request.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find the user
    const users = await executeQuery({
      query: "SELECT * FROM tbl_tent_users WHERE email = ?",
      values: [email],
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session and get token
    const token = await createSession(user.user_id);

    // Set the token as an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "accessToken",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    const responseData = {
      status: true,
      message: "Login successful",
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
