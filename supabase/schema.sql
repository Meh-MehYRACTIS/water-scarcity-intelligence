-- ============================================================
-- Water Scarcity Intelligence Project
-- Database Schema v1.0
-- Run this first in Supabase SQL Editor
-- ============================================================

-- Core table: one row per country assessment
CREATE TABLE IF NOT EXISTS countries (
  id                UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT         NOT NULL,
  code              TEXT         NOT NULL UNIQUE,      -- ISO 2-letter: 'ir', 'mx', etc.
  region            TEXT         NOT NULL,
  risk_score        TEXT         NOT NULL,             -- e.g. 'CCC–'
  risk_outlook      TEXT         NOT NULL,             -- e.g. 'Critical / Deteriorating'
  geography_tag     TEXT         NOT NULL,             -- displayed above headline
  headline          TEXT         NOT NULL,
  deck              TEXT         NOT NULL,             -- subtitle paragraph
  published_date    DATE         NOT NULL,
  framework_version TEXT         NOT NULL DEFAULT '1.0',
  content           JSONB        NOT NULL DEFAULT '{}', -- all rich section content
  is_published      BOOLEAN      NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Fast lookup by code
CREATE UNIQUE INDEX IF NOT EXISTS countries_code_idx
  ON countries (code);

-- Filter index for published-only queries
CREATE INDEX IF NOT EXISTS countries_published_idx
  ON countries (is_published)
  WHERE is_published = true;

-- ============================================================
-- Row Level Security
-- Allows public read of published rows; blocks all writes
-- ============================================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read: published countries"
  ON countries
  FOR SELECT
  USING (is_published = true);

-- ============================================================
-- Auto-update updated_at on every row change
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
