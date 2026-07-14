import { createClient } from "@supabase/supabase-js";
import { supabaseEnv, getServiceRoleKey } from "./env";

/**
 * SERVER-ONLY admin client using the service-role key.
 * Bypasses Row Level Security — use ONLY in trusted server code
 * (server actions guarded by an admin check). Never import in a
 * client component.
 */
export function createAdminClient() {
  return createClient(supabaseEnv.url, getServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
