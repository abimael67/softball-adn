-- Migration: Create stat_revisions table
-- Description: Track all changes to statistics for audit purposes

CREATE TABLE stat_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  stat_type TEXT NOT NULL CHECK (stat_type IN ('batting', 'pitching', 'fielding')),
  revision_number INTEGER NOT NULL,
  previous_values JSONB,
  new_values JSONB NOT NULL,
  changed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT stat_revisions_unique_revision UNIQUE (game_id, player_id, stat_type, revision_number)
);

COMMENT ON TABLE stat_revisions IS 'Complete revision history for all statistics changes';
COMMENT ON COLUMN stat_revisions.stat_type IS 'Type of statistics: batting, pitching, or fielding';
COMMENT ON COLUMN stat_revisions.revision_number IS 'Sequential revision number per game/player/stat_type';
COMMENT ON COLUMN stat_revisions.previous_values IS 'JSON of statistics before the change';
COMMENT ON COLUMN stat_revisions.new_values IS 'JSON of statistics after the change';
COMMENT ON COLUMN stat_revisions.changed_by IS 'User who made the change';
COMMENT ON COLUMN stat_revisions.reason IS 'Optional reason for the change';

CREATE INDEX idx_stat_revisions_game_id ON stat_revisions(game_id);
CREATE INDEX idx_stat_revisions_player_id ON stat_revisions(player_id);
CREATE INDEX idx_stat_revisions_stat_type ON stat_revisions(stat_type);
CREATE INDEX idx_stat_revisions_changed_by ON stat_revisions(changed_by);
CREATE INDEX idx_stat_revisions_changed_at ON stat_revisions(changed_at);
CREATE INDEX idx_stat_revisions_game_player_type ON stat_revisions(game_id, player_id, stat_type, revision_number);

-- Stat revisions are immutable - no UPDATE or DELETE triggers
