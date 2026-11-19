-- CMF website: reader accounts, reading workspace, enquiries and management reporting.
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to re-run.
--
-- Security model: every table has row-level security ON and NO policies, so the public anon key can
-- read or write nothing. Only the website's server, using the service-role key, can reach this data.
-- Personal notes are stored here only to sync a reader's own devices; nothing in this schema is ever
-- sent to Google Analytics.

create extension if not exists citext;
create extension if not exists pgcrypto;

-- Readers --------------------------------------------------------------------------------------
create table if not exists readers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  name text not null,
  country text not null,
  city text,
  newsletter boolean not null default false,          -- separate, optional consent (§10.4)
  newsletter_at timestamptz,
  privacy_ack_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  last_seen_at timestamptz,
  deleted_at timestamptz
);

-- One-time sign-in links: a link's nonce is recorded when used and can never be used again.
create table if not exists used_links (
  nonce text primary key,
  used_at timestamptz not null default now()
);

-- The reading workspace ------------------------------------------------------------------------
create table if not exists reading_state (
  reader_id uuid not null references readers(id) on delete cascade,
  book text not null,
  section text,
  ratio real not null default 0,
  percent smallint not null default 0,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  saved boolean not null default false,               -- "saved for later" in the personal library
  primary key (reader_id, book)
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references readers(id) on delete cascade,
  book text not null,
  section text not null,
  section_title text not null,
  quote text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_reader_book on notes (reader_id, book);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references readers(id) on delete cascade,
  book text not null,
  section text not null,
  section_title text not null,
  ratio real not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists bookmarks_reader_book on bookmarks (reader_id, book);

create table if not exists reader_prefs (
  reader_id uuid primary key references readers(id) on delete cascade,
  prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- What readers and visitors send to the Foundation ---------------------------------------------
-- Feedback is only what a reader deliberately sends with "Send feedback to CMF" (§6.3).
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid references readers(id) on delete set null,
  book text,
  section text,
  name text,
  email citext,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

-- Contact enquiries, institutional orders, partnership and volunteer enquiries, newsletter sign-ups.
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null,          -- 'contact' | 'order' | 'newsletter'
  topic text,                  -- enquiry type, order purpose…
  book text,
  quantity integer,
  country text,
  name text,
  email citext,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'in-progress', 'done', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists enquiries_kind_created on enquiries (kind, created_at desc);

-- Donations confirmed against the payment provider's records (never from a visit to a
-- "thank you" page, §9.6). Entered by authorised staff in the dashboard, or by a verified webhook.
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  received_on date not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'NGN',
  category text not null default 'general',
  method text not null default 'online',   -- 'online' | 'bank-transfer' | 'other'
  reference text unique,                   -- the provider's payment reference
  donor_name text,
  donor_email citext,
  note text,
  recorded_by text,
  created_at timestamptz not null default now()
);

-- Book sales and sponsorships are recorded separately from donations (§8.4).
create table if not exists sponsorships (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  arrangement text not null,
  amount numeric(14, 2),
  currency text default 'NGN',
  starts_on date,
  status text not null default 'proposed' check (status in ('proposed', 'approved', 'active', 'completed', 'declined')),
  note text,
  created_at timestamptz not null default now()
);

-- Aggregate counts (no personal data): one row per day, event and book. Fed by the website so the
-- dashboard works even for visitors who decline analytics cookies. Counts only, never people.
create table if not exists daily_metrics (
  day date not null,
  event text not null,
  book text not null default '',
  count integer not null default 0,
  primary key (day, event, book)
);

create or replace function increment_metric(p_event text, p_book text default '', p_by integer default 1)
returns void language sql security definer set search_path = public as $$
  insert into daily_metrics (day, event, book, count)
  values ((now() at time zone 'Africa/Lagos')::date, p_event, coalesce(p_book, ''), p_by)
  on conflict (day, event, book) do update set count = daily_metrics.count + excluded.count;
$$;
revoke all on function increment_metric(text, text, integer) from public, anon, authenticated;

-- Lock everything down: RLS on, no policies. The service role bypasses RLS; nothing else gets in.
alter table readers enable row level security;
alter table used_links enable row level security;
alter table reading_state enable row level security;
alter table notes enable row level security;
alter table bookmarks enable row level security;
alter table reader_prefs enable row level security;
alter table feedback enable row level security;
alter table enquiries enable row level security;
alter table donations enable row level security;
alter table sponsorships enable row level security;
alter table daily_metrics enable row level security;

-- Retention (§10.2): used sign-in links are only needed for an hour.
-- Schedule with pg_cron if enabled: select cron.schedule('cmf-cleanup', '0 3 * * *', $$delete from used_links where used_at < now() - interval '1 day'$$);

-- Access: only the server's service role. The public (anon) and signed-in (authenticated) API roles get
-- nothing, so even a leaked publishable key cannot read or write this data.
grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant execute on function increment_metric(text, text, integer) to service_role;
revoke all on all tables in schema public from anon, authenticated;
