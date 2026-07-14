import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every request. Its job in M1 is simple but important:
 * keep the Supabase auth session fresh (refresh expiring tokens) so a
 * logged-in user never gets silently logged out. Later milestones add
 * route protection (redirect guests away from /account and /admin) here.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env isn't configured yet (e.g. first local run before .env.local),
  // don't crash the whole site — just pass the request through.
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the session so tokens refresh. Do not remove.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on all routes except static assets and images (performance).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
