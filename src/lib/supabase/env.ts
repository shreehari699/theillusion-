/**
 * Validate environment variables at startup rather than crashing
 * mysteriously deep in a request. If a required key is missing,
 * we throw a clear, named error immediately.
 */
function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Add it to your .env.local (local) and Vercel Project Settings (production).`
    );
  }
  return value;
}

export const supabaseEnv = {
  url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  anonKey: required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
} as const;

/**
 * Service-role key is SERVER-ONLY and dangerous (bypasses row-level security).
 * It must never be imported into a client component. We read it lazily and
 * only in server code (admin actions in later milestones).
 */
export function getServiceRoleKey(): string {
  return required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
