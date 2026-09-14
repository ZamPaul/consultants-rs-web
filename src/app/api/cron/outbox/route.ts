import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { retry, type MailPayload, type OutboxKind } from '@/lib/mail';
import { db } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Drains the email outbox, and keeps the database awake.
 *
 * Two jobs, one scheduled function, and the second one is not incidental: a
 * free tier Supabase project pauses after about a week of low activity, and a
 * brochure site can easily go a week without an enquiry. A paused database
 * means the contact form starts failing silently. This query runs daily
 * whether or not there is anything to send, which is enough to keep it alive.
 *
 * Give up after 6 attempts. Something that has failed six times over six days
 * is not a transient outage, and retrying forever just hides it.
 */
const MAX_ATTEMPTS = 6;

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${env().CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  }

  const { data, error } = await db()
    .from('email_outbox')
    .select('id, kind, payload, attempts')
    .is('sent_at', null)
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(25);

  if (error) {
    console.error(`[cron] outbox read failed: ${error.message}`);
    return NextResponse.json({ error: 'database unavailable' }, { status: 503 });
  }

  const rows = (data ?? []) as Array<{
    id: string;
    kind: OutboxKind;
    payload: MailPayload;
    attempts: number;
  }>;

  let sent = 0;
  for (const row of rows) {
    if (await retry(row)) sent += 1;
  }

  return NextResponse.json({ pending: rows.length, sent, keptAwake: true });
}
