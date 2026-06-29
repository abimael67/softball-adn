-- Migration: Update game_status enum
-- Description: Add workflow states to game_status enum

ALTER TYPE game_status ADD VALUE IF NOT EXISTS 'statistics_entry';
ALTER TYPE game_status ADD VALUE IF NOT EXISTS 'pending_review';
ALTER TYPE game_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE game_status ADD VALUE IF NOT EXISTS 'published';

COMMENT ON TYPE game_status IS 'Game lifecycle states: scheduled, in_progress, statistics_entry, pending_review, approved, published, postponed, cancelled';
