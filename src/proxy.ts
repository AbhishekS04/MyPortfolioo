import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Note: NextRequest.cookies.set does not accept options — options are
        // applied only on supabaseResponse.cookies.set below.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Admin Route Protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login, verify-2fa, and setup (for initial enrollment)
    const isExempt =
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/admin/verify-2fa" ||
      request.nextUrl.pathname === "/admin/mfa-setup";

    if (!user && !isExempt) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (user && !isExempt) {
      // Check Assurance Level
      const { data: aalData, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError || !aalData) {
        // If we can't check security, fail safe -> verify
        return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
      }

      const { currentLevel } = aalData;

      // If user is stuck at AAL1 (Password only)
      if (currentLevel === "aal1") {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerifiedFactor = factors?.totp?.some(
          (f) => f.status === "verified",
        );

        if (hasVerifiedFactor) {
          // Start Verification Flow
          return NextResponse.redirect(
            new URL("/admin/verify-2fa", request.url),
          );
        } else {
          // No 2FA setup yet? Redirect to setup.
          return NextResponse.redirect(
            new URL("/admin/mfa-setup", request.url),
          );
        }
      }
    }
  }

  // 2. Visitor Tracking (Telegram Analytics)
  if (
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.includes(".")
  ) {
    if (!request.cookies.has("visitor_tracked")) {
      const country =
        request.headers.get("x-vercel-ip-country") || "Unknown Country";
      const city = request.headers.get("x-vercel-ip-city") || "Unknown City";
      const path = request.nextUrl.pathname;

      supabaseResponse.cookies.set("visitor_tracked", "true", {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: "lax",
      });

      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (BOT_TOKEN && CHAT_ID) {
        const message = `🚨 *New Visitor Alert*\n\n🌍 Location: ${city}, ${country}\n📄 Page: ${path}\n🕒 Time: ${new Date().toUTCString()}`;

        try {
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }),
          }).catch((err) =>
            console.error("Telegram notification failed:", err),
          );
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
