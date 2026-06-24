-- Run this in your Vercel Postgres console (Storage → your DB → Query)
-- or any Postgres client connected to your POSTGRES_URL.

CREATE TABLE IF NOT EXISTS rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  attending   TEXT        NOT NULL CHECK (attending IN ('yes', 'no', 'maybe')),
  dietary     TEXT,
  quote       TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS burn_book_entries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name   TEXT        NOT NULL,
  quote       TEXT        NOT NULL
);
