-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)

-- ── Private RSVP table ────────────────────────────────────────
-- Stores full guest details. Anon can INSERT but never SELECT
-- (keeps emails and dietary info private).

create table rsvps (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  full_name  text        not null,
  email      text        not null,
  attending  text        not null    check (attending in ('yes', 'no', 'maybe')),
  dietary    text,
  quote      text        not null
);

alter table rsvps enable row level security;

create policy "rsvps_insert" on rsvps
  for insert to anon with check (true);


-- ── Public Burn Book entries ───────────────────────────────────
-- Stores only name + quote. Anon can INSERT and SELECT — this is
-- what the website reads to display messages in real time.

create table burn_book_entries (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  full_name  text        not null,
  quote      text        not null
);

alter table burn_book_entries enable row level security;

create policy "entries_insert" on burn_book_entries
  for insert to anon with check (true);

create policy "entries_select" on burn_book_entries
  for select to anon using (true);


-- ── Enable Realtime ───────────────────────────────────────────
-- Run this so new entries broadcast to all open sessions.
-- (You can also enable this via the Supabase dashboard:
--  Table Editor → burn_book_entries → Realtime toggle)

alter publication supabase_realtime add table burn_book_entries;
