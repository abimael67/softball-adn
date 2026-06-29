-- Migration: Create players table
-- Description: Core table for player information independent from seasons

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT,
  birth_date DATE,
  bats batting_hand,
  throws throwing_hand,
  primary_position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
  photo_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT players_birth_date_valid CHECK (birth_date IS NULL OR birth_date < CURRENT_DATE)
);

COMMENT ON TABLE players IS 'Player information independent of any season';
COMMENT ON COLUMN players.nickname IS 'Optional player nickname';
COMMENT ON COLUMN players.bats IS 'Batting hand preference';
COMMENT ON COLUMN players.throws IS 'Throwing hand preference';
COMMENT ON COLUMN players.primary_position_id IS 'Primary defensive position';
COMMENT ON COLUMN players.photo_key IS 'Object storage key for player photo';
