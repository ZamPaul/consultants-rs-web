import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * The only Supabase client in this project. It holds the service role key,
 * so importing this module from a client component must fail the build —
 * that is what `server-only` above is for. There is deliberately no anon
 * key and no RLS: nothing in the browser ever talks to Postgres.
 */
let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (client) return client;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env();
  client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'consultants-rs-web' } },
  });
  return client;
}
