-- Migration: Create games table
-- Description: Core table for scheduled and completed games

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status game_status NOT NULL DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT games_different_teams CHECK (home_team_id != away_team_id),
  CONSTRAINT games_score_non_negative CHECK (
    home_score IS NULL OR home_score >= 0
  ),
  CONSTRAINT games_away_score_non_negative CHECK (
    away_score IS NULL OR away_score >= 0
  ),
  CONSTRAINT games_score_requires_completed CHECK (
    (status = 'completed' AND home_score IS NOT NULL AND away_score IS NOT NULL)
    OR
    (status != 'completed' AND home_score IS NULL AND away_score IS NULL)
  )
);

COMMENT ON TABLE games IS 'Scheduled and completed games within a season';
COMMENT ON COLUMN games.venue_id IS 'Venue where the game was played';
COMMENT ON COLUMN games.scheduled_at IS 'Scheduled date and time of the game';
COMMENT ON COLUMN games.status IS 'Current game status';
COMMENT ON COLUMN games.home_score IS 'Final score for home team (only when completed)';
COMMENT ON COLUMN games.away_score IS 'Final score for away team (only when completed)';
