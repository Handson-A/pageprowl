import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/studio") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/library");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const requiresAuthCheck = isProtectedRoute || isAuthRoute;

  // On public browsing routes (e.g. /, /browse, /search, /genres, /discover, /series/*),
  // skip external Supabase auth network calls in middleware to eliminate navigation waterfalls.
  if (!requiresAuthCheck) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment is unconfigured, prevent unauthenticated access to protected routes
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", getSafeRedirectUrl(pathname + request.nextUrl.search));
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Authenticate and refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Route Protection Guard: /studio, /account, and /library require authentication
  if (isProtectedRoute) {
    if (!user) {
      const originalDestination = pathname + request.nextUrl.search;
      const safeTarget = getSafeRedirectUrl(originalDestination, "/studio");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", safeTarget);

      const redirectResponse = NextResponse.redirect(loginUrl);
      // Propagate any refreshed or cleared cookies
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  // 2. Auth Routes (/login, /signup): If already authenticated, redirect to destination
  if (pathname === "/login" || pathname === "/signup") {
    const isSignoutAction = request.nextUrl.searchParams.get("action") === "signout";
    if (user && !isSignoutAction) {
      const rawTarget =
        request.nextUrl.searchParams.get("redirect") ||
        request.nextUrl.searchParams.get("next");
      const safeTarget = getSafeRedirectUrl(rawTarget, "/studio");
      const destinationUrl = new URL(safeTarget, request.url);

      const redirectResponse = NextResponse.redirect(destinationUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, icons under public
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
