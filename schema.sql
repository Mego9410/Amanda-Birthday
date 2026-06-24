-- ⚠️  The Vercel / Neon query console runs everything through a single
--     prepared statement, so it can NOT run multiple statements at once
--     ("cannot insert multiple commands into a prepared statement").
--     Run each block on its own. (Make sure the "Read-only" toggle is OFF.)

-- ── FRESH SETUP ─────────────────────────────────────────────────
-- All RSVPs (name, email, attending, dietary, quote) live in one table.
-- `approved` controls whether a guest's memory shows in "Notes from the
-- Burn Book". It defaults to FALSE so nothing appears until the admin
-- toggles it on.
CREATE TABLE IF NOT EXISTS rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  attending   TEXT        NOT NULL CHECK (attending IN ('yes', 'no', 'maybe')),
  dietary     TEXT,
  quote       TEXT        NOT NULL,
  approved    BOOLEAN     NOT NULL DEFAULT FALSE
);

-- ── ALREADY RAN THE OLD SCHEMA? ─────────────────────────────────
-- If you created the tables before the moderation feature, run this
-- single line to add the new column to your existing rsvps table:
-- ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT FALSE;

-- ── OPTIONAL CLEANUP ────────────────────────────────────────────
-- The separate burn_book_entries table is no longer used — memories now
-- live in rsvps. You can drop it if you created it earlier:
-- DROP TABLE IF EXISTS burn_book_entries;
