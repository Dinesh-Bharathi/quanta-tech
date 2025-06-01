import { executeQuery } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function signJWT(payload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function createSession(userId) {
  const id = uuidv4();
  const token = await signJWT({ id: userId });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1); // 1 day from now

  await executeQuery({
    query:
      "INSERT INTO tbl_sessions (session_id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
    values: [id, userId, token, expiresAt],
  });

  return token;
}

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload || !payload.id) {
    return null;
  }

  try {
    const users = await executeQuery({
      query: "SELECT * FROM tbl_tent_users WHERE user_id = ?",
      values: [payload.id],
    });

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
