-- Migration: Create teams table
-- Description: Core table for league teams

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT,
  logo_key TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT teams_name_unique UNIQUE (name),
  CONSTRAINT teams_short_name_unique UNIQUE (short_name),
  CONSTRAINT teams_short_name_length CHECK (char_length(short_name) <= 10),
  CONSTRAINT teams_color_format CHECK (
    primary_color IS NULL OR primary_color ~ '^#[0-9a-fA-F]{6}$'
  ),
  CONSTRAINT teams_secondary_color_format CHECK (
    secondary_color IS NULL OR secondary_color ~ '^#[0-9a-fA-F]{6}$'
  )
);

COMMENT ON TABLE teams IS 'League teams that persist across all seasons';
COMMENT ON COLUMN teams.short_name IS 'Abbreviated team name for displays (max 10 chars)';
COMMENT ON COLUMN teams.logo_key IS 'Object storage key for team logo';
COMMENT ON COLUMN teams.primary_color IS 'Hex color code for primary brand color';
COMMENT ON COLUMN teams.secondary_color IS 'Hex color code for secondary brand color';
