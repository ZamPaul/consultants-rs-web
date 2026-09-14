-- 0001 — enquiry and email outbox.
--
-- There is no dashboard by design, so this schema is deliberately small.
-- Its job is to be the durable record: if a mail rule eats a lead, the row
-- is the only proof it arrived.

create extension if not exists "pgcrypto";

create type enquiry_service as enum (
  'business_launch',
  'marketing',
  'advertising',
  'unsure'
);

create type enquiry_status as enum (
  'new',
  'contacted',
  'won',
  'lost',
  'spam'
);

create table enquiry (
  id            uuid primary key default gen_random_uuid(),
  ref           text not null unique,
  name          text not null check (length(btrim(name)) between 2 and 120),
  email         text not null check (position('@' in email) > 1),
  phone         text check (length(phone) <= 40),
  service       enquiry_service not null,
  message       text not null check (length(btrim(message)) between 10 and 4000),
  status        enquiry_status not null default 'new',
  -- Salted hash only. Rate limiting needs to recognise a repeat sender,
  -- not identify one, and a raw address here is personal data at rest.
  ip_hash       text,
  user_agent    text,
  created_at    timestamptz not null default now(),
  responded_at  timestamptz
);

create index enquiry_created_at_idx on enquiry (created_at desc);
create index enquiry_status_idx on enquiry (status) where status = 'new';
create index enquiry_email_idx on enquiry (lower(email));

comment on table enquiry is
  'Contact form submissions. Triaged in the Supabase table editor; there is no admin app.';
comment on column enquiry.responded_at is
  'Set by hand when someone replies. The one metric worth knowing about themselves.';

-- The outbox exists so that a Resend outage delays a lead rather than losing
-- one, and so that a sleeping free-tier database never blocks an email.
create type outbox_kind as enum ('team_alert', 'sender_receipt');

create table email_outbox (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid references enquiry (id) on delete cascade,
  kind        outbox_kind not null,
  payload     jsonb not null,
  attempts    int not null default 0,
  last_error  text,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index email_outbox_pending_idx
  on email_outbox (created_at)
  where sent_at is null;

-- No RLS policies and no anon access: every read and write goes through the
-- service role from a server action. Revoking here makes that explicit rather
-- than implicit, so a future anon key cannot quietly read the table.
revoke all on enquiry from anon, authenticated;
revoke all on email_outbox from anon, authenticated;
