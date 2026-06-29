-- Migration: Create season_rosters table
-- Description: Tracks which players belonged to which teams during each season

CREATE TABLE season_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  jersey_number INTEGER,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT season_rosters_jersey_number_positive CHECK (
    jersey_number IS NULL OR (jersey_number >= 0 AND jersey_number <= 99)
  ),
  CONSTRAINT season_rosters_left_at_consistency CHECK (
    (is_active = true AND left_at IS NULL) OR
    (is_active = false AND left_at IS NOT NULL)
  ),
  CONSTRAINT season_rosters_dates_valid CHECK (
    left_at IS NULL OR left_at >= joined_at
  )
);

COMMENT ON TABLE season_rosters IS 'Tracks player-team assignments for each season, supporting transfers';
COMMENT ON COLUMN season_rosters.season_id IS 'Season this roster entry belongs to';
COMMENT ON COLUMN season_rosters.team_id IS 'Team the player was assigned to';
COMMENT ON COLUMN season_rosters.player_id IS 'Player in this roster';
COMMENT ON COLUMN season_rosters.jersey_number IS 'Jersey number worn during this assignment';
COMMENT ON COLUMN season_rosters.joined_at IS 'When the player joined this team';
COMMENT ON COLUMN season_rosters.left_at IS 'When the player left this team (null if still active)';
COMMENT ON COLUMN season_rosters.is_active IS 'Whether this roster entry is currently active';

-- Partial unique index: only one active roster per player per season
CREATE UNIQUE INDEX idx_season_rosters_active_player
  ON season_rosters (season_id, player_id)
  WHERE is_active = true;
