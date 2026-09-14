import 'server-only';
import { Resend } from 'resend';
import { env, notifyTo } from '@/lib/env';
import { db } from '@/lib/supabase/server';
import { SenderReceipt } from '@/emails/SenderReceipt';
import { TeamAlert } from '@/emails/TeamAlert';
import { SITE } from '@/lib/site';

export type OutboxKind = 'team_alert' | 'sender_receipt';

export type MailPayload = {
  ref: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  receivedAt: string;
};

let client: Resend | null = null;
function resend(): Resend {
  client ??= new Resend(env().RESEND_API_KEY);
  return client;
}

function build(kind: OutboxKind, p: MailPayload) {
  if (kind === 'team_alert') {
    return {
      from: env().ENQUIRY_FROM,
      to: notifyTo(),
      // Reply goes to the enquirer, so hitting reply answers the customer.
      replyTo: p.email,
      subject: `New enquiry: ${p.name} · ${p.service} · ${p.ref}`,
      react: TeamAlert(p),
    };
  }
  return {
    from: env().ENQUIRY_FROM,
    to: [p.email],
    replyTo: env().ENQUIRY_REPLY_TO,
    subject: `We have your message, ${p.name.trim().split(/\s+/)[0] ?? p.name}`,
    react: SenderReceipt({
      ref: p.ref,
      name: p.name,
      service: p.service,
      message: p.message,
      phone: SITE.phone,
      email: SITE.email,
    }),
  };
}

/**
 * Send, or park it in the outbox.
 *
 * Nothing here throws. A send failure becomes a row a cron job will retry,
 * because the alternative is a lead that exists nowhere. Returns whether it
 * went out now, for logging only.
 */
export async function sendOrQueue(
  kind: OutboxKind,
  payload: MailPayload,
  enquiryId: string | null,
): Promise<boolean> {
  try {
    const { error } = await resend().emails.send(build(kind, payload));
    if (!error) return true;
    await queue(kind, payload, enquiryId, error.message ?? 'unknown Resend error');
    return false;
  } catch (cause) {
    await queue(
      kind,
      payload,
      enquiryId,
      cause instanceof Error ? cause.message : String(cause),
    );
    return false;
  }
}

async function queue(
  kind: OutboxKind,
  payload: MailPayload,
  enquiryId: string | null,
  lastError: string,
): Promise<void> {
  console.error(`[enquiry] ${kind} failed for ${payload.ref}: ${lastError}`);
  try {
    await db()
      .from('email_outbox')
      .insert({
        enquiry_id: enquiryId,
        kind,
        payload,
        last_error: lastError,
        attempts: 1,
      });
  } catch {
    // The database is unreachable too. Nothing left to do but make sure the
    // failure is loud in the logs; Sentry picks it up from there.
    console.error(`[enquiry] outbox write also failed for ${payload.ref}`);
  }
}

/** Retry one queued message. Used by the cron route. */
export async function retry(row: {
  id: string;
  kind: OutboxKind;
  payload: MailPayload;
  attempts: number;
}): Promise<boolean> {
  try {
    const { error } = await resend().emails.send(build(row.kind, row.payload));
    if (error) throw new Error(error.message ?? 'unknown Resend error');
    await db()
      .from('email_outbox')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', row.id);
    return true;
  } catch (cause) {
    await db()
      .from('email_outbox')
      .update({
        attempts: row.attempts + 1,
        last_error: cause instanceof Error ? cause.message : String(cause),
      })
      .eq('id', row.id);
    return false;
  }
}
