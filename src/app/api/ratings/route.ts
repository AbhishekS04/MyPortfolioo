import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Max requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute window

// Allowed origins for CSRF protection
const ALLOWED_ORIGINS = [
  "https://www.abhisheksingh.tech",
  "https://abhisheksingh.tech",
  "http://localhost:3000",
];

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Check origin header first
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // Fallback to referer check
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      if (ALLOWED_ORIGINS.includes(refererOrigin)) {
        return true;
      }
    } catch {
      // Invalid referer URL
    }
  }

  return false;
}

export async function POST(request: Request) {
  // CSRF protection
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const supabase = await createClient();
  try {
    const { rating } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const { error } = await supabase.from("ratings").insert({ rating });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  // CSRF protection for same-origin only
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("ratings").select("rating");

    if (error) throw error;

    // Calculate stats
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((r: { rating: number }) => {
      if (r.rating >= 1 && r.rating <= 5) {
        // @ts-expect-error — counts is indexed by number 1-5
        counts[r.rating]++;
      }
    });

    const total = data.length;
    const average =
      total > 0
        ? (data.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)
        : "0.0";

    return NextResponse.json({ counts, total, average });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
