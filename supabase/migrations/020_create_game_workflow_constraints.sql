-- Migration: Create game_workflow_constraints
-- Description: Add constraints to enforce valid workflow transitions

CREATE OR REPLACE FUNCTION validate_game_workflow()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate workflow state transitions
  IF NEW.status = 'pending_review' AND OLD.status NOT IN ('statistics_entry', 'in_progress') THEN
    RAISE EXCEPTION 'Cannot submit game for review from status: %', OLD.status;
  END IF;

  IF NEW.status = 'approved' AND OLD.status != 'pending_review' THEN
    RAISE EXCEPTION 'Cannot approve game from status: %', OLD.status;
  END IF;

  IF NEW.status = 'published' AND OLD.status != 'approved' THEN
    RAISE EXCEPTION 'Cannot publish game from status: %', OLD.status;
  END IF;

  -- Validate required fields for workflow states
  IF NEW.status = 'pending_review' AND NEW.submitted_by IS NULL THEN
    RAISE EXCEPTION 'submitted_by is required when status is pending_review';
  END IF;

  IF NEW.status = 'approved' AND NEW.approved_by IS NULL THEN
    RAISE EXCEPTION 'approved_by is required when status is approved';
  END IF;

  IF NEW.status = 'published' AND NEW.published_by IS NULL THEN
    RAISE EXCEPTION 'published_by is required when status is published';
  END IF;

  -- Prevent editing published games
  IF OLD.status = 'published' AND NEW.status != 'published' THEN
    RAISE EXCEPTION 'Cannot change status of published game';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_game_workflow_trigger
  BEFORE UPDATE ON games
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_game_workflow();

COMMENT ON FUNCTION validate_game_workflow IS 'Enforces valid game workflow state transitions';
