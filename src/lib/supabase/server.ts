import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 * Reads/writes the auth session from cookies so the user stays logged in
 * across server-rendered pages. Still uses the anon key + user session —
 * NOT the service role key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // set() throws in pure Server Components; the middleware
          // refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  });
}
