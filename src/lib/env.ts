import 'server-only';
import { z } from 'zod';

/**
 * Validated once, at first import on the server. A missing key fails loudly
 * at boot rather than as `undefined` inside a Resend call three weeks later.
 */
const schema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  RESEND_API_KEY: z.string().min(10),
  ENQUIRY_NOTIFY_TO: z.string().min(3),
  ENQUIRY_FROM: z.string().min(3),
  ENQUIRY_REPLY_TO: z.email(),
  TURNSTILE_SECRET_KEY: z.string().min(10),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(10),
  IP_HASH_SALT: z.string().min(16),
  CRON_SECRET: z.string().min(16),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Invalid or missing environment variables: ${missing}`);
  }
  cached = parsed.data;
  return cached;
}

/** Recipients of the internal alert, as an array. */
export function notifyTo(): string[] {
  return env()
    .ENQUIRY_NOTIFY_TO.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
