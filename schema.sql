-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- Creates the RSVP table and restricts it so guests can only INSERT (not read others' responses)

create table rsvps (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  full_name  text        not null,
  email      text        not null,
  attending  text        not null    check (attending in ('yes', 'no', 'maybe')),
  dietary    text
);

-- Allow the anon key to INSERT but not SELECT
alter table rsvps enable row level security;

create policy "allow_insert" on rsvps
  for insert to anon with check (true);
