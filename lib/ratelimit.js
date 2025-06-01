import { NextResponse } from "next/server";

// Simple in-memory rate limiter
// For production, use a Redis-based solution
const rateLimit = new Map();

/**
 * Rate limiter middleware
 * @param {NextRequest} request - Next.js request
 * @param {number} limit - Maximum number of requests
 * @param {number} windowMs - Time window in milliseconds
 * @returns {NextResponse|null} - Response or null to continue
 */
export function rateLimiter(request, limit = 10, windowMs = 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.resetTime < windowStart) {
      rateLimit.delete(key);
    }
  }

  // Get or create rate limit entry
  const entry = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };

  // Increment count
  entry.count += 1;
  rateLimit.set(ip, entry);

  // Set headers
  const headers = new Headers(request.headers);
  headers.set("X-RateLimit-Limit", limit.toString());
  headers.set(
    "X-RateLimit-Remaining",
    Math.max(0, limit - entry.count).toString()
  );
  headers.set("X-RateLimit-Reset", entry.resetTime.toString());

  // Check if rate limit exceeded
  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": entry.resetTime.toString(),
        },
      }
    );
  }

  // Continue with the request
  return null;
}
