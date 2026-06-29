-- Migration: Add game workflow fields
-- Description: Add fields to support draft and review workflow

ALTER TABLE games
  ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_notes TEXT;

COMMENT ON COLUMN games.submitted_by IS 'User who submitted the game for review';
COMMENT ON COLUMN games.submitted_at IS 'When the game was submitted for review';
COMMENT ON COLUMN games.approved_by IS 'User who approved the game';
COMMENT ON COLUMN games.approved_at IS 'When the game was approved';
COMMENT ON COLUMN games.published_by IS 'User who published the game';
COMMENT ON COLUMN games.published_at IS 'When the game was published';
COMMENT ON COLUMN games.last_edited_by IS 'User who last edited the game or statistics';
COMMENT ON COLUMN games.last_edited_at IS 'When the game was last edited';
COMMENT ON COLUMN games.review_notes IS 'Notes from reviewer (visible to collaborators)';

CREATE INDEX idx_games_submitted_by ON games(submitted_by);
CREATE INDEX idx_games_approved_by ON games(approved_by);
CREATE INDEX idx_games_published_by ON games(published_by);
CREATE INDEX idx_games_last_edited_by ON games(last_edited_by);
