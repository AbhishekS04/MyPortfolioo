import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

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

        console.log(`[Proxy] Checking path: ${request.nextUrl.pathname} | User: ${user?.id ? 'Logged In' : 'No Session'} | Exempt: ${isExempt}`);

        if (!user && !isExempt) {
            console.log(`[Proxy] Access Denied: Redirecting to Login`);
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        if (user && !isExempt) {
            // Check Assurance Level
            const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (aalError || !aalData) {
                // If we can't check security, fail safe -> verify
                return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
            }

            const { currentLevel } = aalData;
            console.log(`[Proxy] AAL Level: ${currentLevel}`);

            // If user is stuck at AAL1 (Password only) 
            if (currentLevel === 'aal1') {
                const { data: factors } = await supabase.auth.mfa.listFactors();
                const hasVerifiedFactor = factors?.totp?.some(f => f.status === 'verified');

                console.log(`[Proxy] Verified Factors: ${hasVerifiedFactor}`);

                if (hasVerifiedFactor) {
                    // Start Verification Flow
                    return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
                } else {
                    // No 2FA setup yet? Redirect to setup.
                    return NextResponse.redirect(new URL("/admin/mfa-setup", request.url));
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
