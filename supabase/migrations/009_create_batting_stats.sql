-- Migration: Create batting_stats table
-- Description: Batting statistics per player per game

CREATE TABLE batting_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,

  at_bats INTEGER NOT NULL DEFAULT 0,
  runs INTEGER NOT NULL DEFAULT 0,
  hits INTEGER NOT NULL DEFAULT 0,
  doubles INTEGER NOT NULL DEFAULT 0,
  triples INTEGER NOT NULL DEFAULT 0,
  home_runs INTEGER NOT NULL DEFAULT 0,
  rbi INTEGER NOT NULL DEFAULT 0,
  walks INTEGER NOT NULL DEFAULT 0,
  strikeouts INTEGER NOT NULL DEFAULT 0,
  stolen_bases INTEGER NOT NULL DEFAULT 0,
  caught_stealing INTEGER NOT NULL DEFAULT 0,
  hit_by_pitch INTEGER NOT NULL DEFAULT 0,
  sacrifice_flies INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT batting_stats_game_player_unique UNIQUE (game_id, player_id),
  CONSTRAINT batting_stats_non_negative CHECK (
    at_bats >= 0 AND runs >= 0 AND hits >= 0 AND doubles >= 0 AND
    triples >= 0 AND home_runs >= 0 AND rbi >= 0 AND walks >= 0 AND
    strikeouts >= 0 AND stolen_bases >= 0 AND caught_stealing >= 0 AND
    hit_by_pitch >= 0 AND sacrifice_flies >= 0
  ),
  CONSTRAINT batting_stats_hits_valid CHECK (
    hits >= (doubles + triples + home_runs)
  )
);

COMMENT ON TABLE batting_stats IS 'Batting statistics for each player per game';
COMMENT ON COLUMN batting_stats.season_id IS 'Season this game belongs to (denormalized for query performance)';
COMMENT ON COLUMN batting_stats.game_id IS 'Game this stat belongs to';
COMMENT ON COLUMN batting_stats.player_id IS 'Player who generated these stats';
COMMENT ON COLUMN batting_stats.team_id IS 'Team the player was on when this game was played';
COMMENT ON COLUMN batting_stats.at_bats IS 'Official at-bats (AB)';
COMMENT ON COLUMN batting_stats.runs IS 'Runs scored (R)';
COMMENT ON COLUMN batting_stats.hits IS 'Total hits (H)';
COMMENT ON COLUMN batting_stats.doubles IS 'Doubles (2B)';
COMMENT ON COLUMN batting_stats.triples IS 'Triples (3B)';
COMMENT ON COLUMN batting_stats.home_runs IS 'Home runs (HR)';
COMMENT ON COLUMN batting_stats.rbi IS 'Runs batted in (RBI)';
COMMENT ON COLUMN batting_stats.walks IS 'Base on balls (BB)';
COMMENT ON COLUMN batting_stats.strikeouts IS 'Strikeouts (SO)';
COMMENT ON COLUMN batting_stats.stolen_bases IS 'Stolen bases (SB)';
COMMENT ON COLUMN batting_stats.caught_stealing IS 'Caught stealing (CS)';
COMMENT ON COLUMN batting_stats.hit_by_pitch IS 'Hit by pitch (HBP)';
COMMENT ON COLUMN batting_stats.sacrifice_flies IS 'Sacrifice flies (SF)';
