'use server';

import { headers } from 'next/headers';
import { enquirySchema, SERVICE_DB } from '@/lib/schema';
import { clientIp, hashIp, rateLimited, turnstileOk } from '@/lib/spam';
import { sendOrQueue, type MailPayload } from '@/lib/mail';
import { enquiryRef } from '@/lib/ref';
import { db } from '@/lib/supabase/server';

export type EnquiryResult =
  | { ok: true; ref: string }
  | { ok: false; error: string; fields?: Record<string, string> };

/**
 * The only write path in the application.
 *
 * Order matters, and it is deliberately not the order the build plan first
 * specified. The plan said write to the database, then email. That rule was
 * written for a project on a paid database. On a free Supabase project the
 * database can be asleep, so the two are **not wired in series**: if the
 * insert fails the emails still go and the payload still lands in the outbox.
 * A lead reaching a human matters more than a lead reaching a table.
 */
export async function submitEnquiry(raw: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fields[key]) fields[key] = issue.message;
    }
    return { ok: false, error: 'Please check the highlighted fields.', fields };
  }

  const input = parsed.data;

  // Honeypot. A real person never fills a field they cannot see.
  if (input.company) {
    // Answer as though it worked. Telling a bot it was caught only teaches it.
    return { ok: true, ref: enquiryRef() };
  }

  const head = await headers();
  const ip = clientIp(head);
  const ipHash = hashIp(ip);

  if (!(await turnstileOk(input.turnstileToken, ip))) {
    return {
      ok: false,
      error: 'That verification did not go through. Please try again.',
    };
  }

  const limited = await rateLimited(ipHash);
  if (limited) return { ok: false, error: limited };

  const ref = enquiryRef();
  const payload: MailPayload = {
    ref,
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    service: input.service,
    message: input.message,
    receivedAt: new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };

  let enquiryId: string | null = null;
  try {
    const { data, error } = await db()
      .from('enquiry')
      .insert({
        ref,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        service: SERVICE_DB[input.service],
        message: input.message,
        ip_hash: ipHash,
        user_agent: head.get('user-agent')?.slice(0, 500) ?? null,
      })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    enquiryId = data?.id ?? null;
  } catch (cause) {
    // Loud, but not fatal. The emails below still run.
    console.error(
      `[enquiry] insert failed for ${ref}: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }

  const [alerted] = await Promise.all([
    sendOrQueue('team_alert', payload, enquiryId),
    sendOrQueue('sender_receipt', payload, enquiryId),
  ]);

  if (!alerted && enquiryId === null) {
    // Both halves failed: no row, no mail out, only an outbox attempt that may
    // itself have failed. Say so rather than showing a success panel.
    return {
      ok: false,
      error:
        'Something went wrong on our side and we are not certain your message reached us. Please call (914) 906-6800.',
    };
  }

  return { ok: true, ref };
}
