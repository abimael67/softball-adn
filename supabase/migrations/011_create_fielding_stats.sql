-- Migration: Create fielding_stats table
-- Description: Fielding statistics per player per game

CREATE TABLE fielding_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,

  putouts INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  double_plays INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fielding_stats_game_player_unique UNIQUE (game_id, player_id),
  CONSTRAINT fielding_stats_non_negative CHECK (
    putouts >= 0 AND assists >= 0 AND errors >= 0 AND double_plays >= 0
  )
);

COMMENT ON TABLE fielding_stats IS 'Fielding statistics for each player per game';
COMMENT ON COLUMN fielding_stats.season_id IS 'Season this game belongs to (denormalized for query performance)';
COMMENT ON COLUMN fielding_stats.game_id IS 'Game this stat belongs to';
COMMENT ON COLUMN fielding_stats.player_id IS 'Player who generated these stats';
COMMENT ON COLUMN fielding_stats.team_id IS 'Team the player was on when this game was played';
COMMENT ON COLUMN fielding_stats.putouts IS 'Putouts (PO)';
COMMENT ON COLUMN fielding_stats.assists IS 'Assists (A)';
COMMENT ON COLUMN fielding_stats.errors IS 'Errors (E)';
COMMENT ON COLUMN fielding_stats.double_plays IS 'Double plays turned (DP)';
