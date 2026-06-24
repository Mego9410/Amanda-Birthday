-- ⚠️  The Vercel / Neon query console runs everything through a single
--     prepared statement, so it can NOT run both tables at once
--     ("cannot insert multiple commands into a prepared statement").
--     Run STEP 1 first, then clear the editor and run STEP 2 separately.
--     (Make sure the "Read-only" toggle is OFF.)

-- ── STEP 1 ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  attending   TEXT        NOT NULL CHECK (attending IN ('yes', 'no', 'maybe')),
  dietary     TEXT,
  quote       TEXT        NOT NULL
);

-- ── STEP 2 ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS burn_book_entries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name   TEXT        NOT NULL,
  quote       TEXT        NOT NULL
);
