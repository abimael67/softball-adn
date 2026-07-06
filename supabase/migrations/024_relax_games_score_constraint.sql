-- Migration: Relax games score constraint
-- Description: Allow scores in multiple game states (statistics_entry, pending_review, approved, published, completed)

ALTER TABLE games DROP CONSTRAINT games_score_requires_completed;

ALTER TABLE games ADD CONSTRAINT games_score_requires_valid_status CHECK (
  (status IN ('statistics_entry', 'pending_review', 'approved', 'published', 'completed') 
   AND home_score IS NOT NULL AND away_score IS NOT NULL)
  OR
  (status NOT IN ('statistics_entry', 'pending_review', 'approved', 'published', 'completed') 
   AND home_score IS NULL AND away_score IS NULL)
);

COMMENT ON CONSTRAINT games_score_requires_valid_status ON games IS 
  'Scores are required for games in statistics_entry, pending_review, approved, published, or completed status. Scores must be NULL for other statuses.';
