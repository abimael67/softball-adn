-- Migration: Create pitching_stats table
-- Description: Pitching statistics per pitcher per game

CREATE TABLE pitching_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,

  innings_pitched NUMERIC(4,1) NOT NULL DEFAULT 0,
  hits_allowed INTEGER NOT NULL DEFAULT 0,
  runs_allowed INTEGER NOT NULL DEFAULT 0,
  earned_runs INTEGER NOT NULL DEFAULT 0,
  walks INTEGER NOT NULL DEFAULT 0,
  strikeouts INTEGER NOT NULL DEFAULT 0,
  home_runs_allowed INTEGER NOT NULL DEFAULT 0,
  wild_pitches INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  saves INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT pitching_stats_game_player_unique UNIQUE (game_id, player_id),
  CONSTRAINT pitching_stats_innings_non_negative CHECK (innings_pitched >= 0),
  CONSTRAINT pitching_stats_non_negative CHECK (
    hits_allowed >= 0 AND runs_allowed >= 0 AND earned_runs >= 0 AND
    walks >= 0 AND strikeouts >= 0 AND home_runs_allowed >= 0 AND
    wild_pitches >= 0 AND wins >= 0 AND losses >= 0 AND saves >= 0
  ),
  CONSTRAINT pitching_stats_earned_runs_valid CHECK (
    earned_runs <= runs_allowed
  ),
  CONSTRAINT pitching_stats_decision_valid CHECK (
    (wins = 0 AND losses = 0) OR (wins = 1 AND losses = 0) OR (wins = 0 AND losses = 1)
  )
);

COMMENT ON TABLE pitching_stats IS 'Pitching statistics for each pitcher per game';
COMMENT ON COLUMN pitching_stats.season_id IS 'Season this game belongs to (denormalized for query performance)';
COMMENT ON COLUMN pitching_stats.game_id IS 'Game this stat belongs to';
COMMENT ON COLUMN pitching_stats.player_id IS 'Pitcher who generated these stats';
COMMENT ON COLUMN pitching_stats.team_id IS 'Team the pitcher was on when this game was played';
COMMENT ON COLUMN pitching_stats.innings_pitched IS 'Innings pitched (IP), stored as decimal (e.g., 6.1 = 6 and 1/3 innings)';
COMMENT ON COLUMN pitching_stats.hits_allowed IS 'Hits allowed (H)';
COMMENT ON COLUMN pitching_stats.runs_allowed IS 'Total runs allowed (R)';
COMMENT ON COLUMN pitching_stats.earned_runs IS 'Earned runs allowed (ER)';
COMMENT ON COLUMN pitching_stats.walks IS 'Base on balls allowed (BB)';
COMMENT ON COLUMN pitching_stats.strikeouts IS 'Strikeouts (SO)';
COMMENT ON COLUMN pitching_stats.home_runs_allowed IS 'Home runs allowed (HR)';
COMMENT ON COLUMN pitching_stats.wild_pitches IS 'Wild pitches (WP)';
COMMENT ON COLUMN pitching_stats.wins IS 'Win decision (W)';
COMMENT ON COLUMN pitching_stats.losses IS 'Loss decision (L)';
COMMENT ON COLUMN pitching_stats.saves IS 'Saves (SV)';
