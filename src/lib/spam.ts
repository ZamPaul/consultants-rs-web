import 'server-only';
import { createHash } from 'node:crypto';
import { env } from '@/lib/env';
import { db } from '@/lib/supabase/server';

/**
 * Salted hash of the submitter's address.
 *
 * Rate limiting needs to recognise a repeat sender, not identify one. A raw
 * IP in the table is personal data at rest that we would then have to describe
 * in the privacy policy and defend; a salted hash is not.
 */
export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(`${env().IP_HASH_SALT}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  return (
    forwarded?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Rate limit, counted in Postgres rather than Redis.
 *
 * The build plan specified Upstash. For a consultancy taking single digit
 * enquiries a week that is a third party signup, a second free tier that can
 * expire, and another service to be woken at 3am for, in exchange for
 * precision nobody will ever measure. The enquiry table already carries
 * `ip_hash` and `created_at` and is already indexed, so one query does the
 * job with no new dependency.
 *
 * The honest trade: this only counts submissions that got as far as a row, so
 * a flood of invalid payloads is not counted here. Turnstile and the honeypot
 * are what stop those. If volume ever makes this the wrong call, Upstash
 * slots in behind the same function signature.
 */
const MAX_PER_HOUR = 3;
const MAX_PER_DAY = 8;

export async function rateLimited(ipHash: string): Promise<false | string> {
  const { data, error } = await db()
    .from('enquiry')
    .select('created_at')
    .eq('ip_hash', ipHash)
    .gte('created_at', new Date(Date.now() - 24 * 3600_000).toISOString());

  // Fail open. A database that cannot answer must not be able to block a
  // real lead; the other three defences still apply.
  if (error || !data) return false;

  const hourAgo = Date.now() - 3600_000;
  const lastHour = data.filter((r) => new Date(r.created_at).getTime() > hourAgo).length;
  if (lastHour >= MAX_PER_HOUR) {
    return 'You have already sent a few messages. Give us a chance to reply, or call us on (914) 906-6800.';
  }
  if (data.length >= MAX_PER_DAY) {
    return 'That is a lot of messages for one day. Please call us on (914) 906-6800 instead.';
  }
  return false;
}

/**
 * Cloudflare Turnstile. Returns true when the request should be allowed.
 * With no secret configured it allows and warns, so the form is never broken
 * by a missing key.
 */
export async function turnstileOk(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = env().TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('[enquiry] TURNSTILE_SECRET_KEY is not set, skipping verification');
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const body = (await res.json()) as { success?: boolean };
    return body.success === true;
  } catch {
    // A Cloudflare outage must not take the contact form down with it.
    console.error('[enquiry] Turnstile verification failed to reach Cloudflare');
    return true;
  }
}
