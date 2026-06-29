-- Migration: Create seasons table
-- Description: Core table for league seasons

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status season_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT seasons_year_positive CHECK (year > 0),
  CONSTRAINT seasons_date_range CHECK (end_date >= start_date),
  CONSTRAINT seasons_name_unique UNIQUE (name),
  CONSTRAINT seasons_year_name_unique UNIQUE (year, name)
);

COMMENT ON TABLE seasons IS 'Represents a league season (e.g., 2026 Spring, 2026 Fall)';
COMMENT ON COLUMN seasons.name IS 'Human-readable season name';
COMMENT ON COLUMN seasons.year IS 'Calendar year of the season';
COMMENT ON COLUMN seasons.status IS 'Current season lifecycle status';
