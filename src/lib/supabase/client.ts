"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/**
 * Supabase client for use in Client Components (the browser).
 * Uses only the public anon key — safe to ship to the browser because
 * Row Level Security (added in a later milestone) governs what it can read.
 */
export function createClient() {
  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
