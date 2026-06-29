-- Migration: Create game_score_sheets table
-- Description: Store official score sheet images in R2

CREATE TABLE game_score_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  image_key TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT game_score_sheets_image_key_unique UNIQUE (image_key)
);

COMMENT ON TABLE game_score_sheets IS 'Official score sheet images stored in R2';
COMMENT ON COLUMN game_score_sheets.image_key IS 'R2 object key for the image';
COMMENT ON COLUMN game_score_sheets.uploaded_by IS 'User who uploaded the image';
COMMENT ON COLUMN game_score_sheets.notes IS 'Optional notes about the score sheet';

CREATE INDEX idx_game_score_sheets_game_id ON game_score_sheets(game_id);
CREATE INDEX idx_game_score_sheets_uploaded_by ON game_score_sheets(uploaded_by);
CREATE INDEX idx_game_score_sheets_uploaded_at ON game_score_sheets(uploaded_at);
