-- Migration: Create audit_logs table
-- Description: Complete audit trail for all administrative actions

CREATE TYPE audit_action AS ENUM (
  'user_login',
  'user_logout',
  'game_created',
  'game_updated',
  'game_submitted',
  'game_approved',
  'game_published',
  'game_returned',
  'statistics_entered',
  'statistics_updated',
  'roster_modified',
  'player_created',
  'player_updated',
  'team_created',
  'team_updated',
  'season_created',
  'season_updated',
  'venue_created',
  'venue_updated',
  'user_role_assigned',
  'user_role_revoked',
  'score_sheet_uploaded',
  'score_sheet_deleted'
);

CREATE TYPE audit_entity AS ENUM (
  'user',
  'game',
  'statistics',
  'roster',
  'player',
  'team',
  'season',
  'venue',
  'score_sheet'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action audit_action NOT NULL,
  entity audit_entity NOT NULL,
  entity_id UUID,
  previous_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for all administrative actions';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action (null for system actions)';
COMMENT ON COLUMN audit_logs.user_email IS 'Email of user at time of action (for historical reference)';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed';
COMMENT ON COLUMN audit_logs.entity IS 'Type of entity affected';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN audit_logs.previous_values IS 'JSON of values before the change';
COMMENT ON COLUMN audit_logs.new_values IS 'JSON of values after the change';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context-specific data';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user';
COMMENT ON COLUMN audit_logs.user_agent IS 'Browser user agent string';

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_entity_timestamp ON audit_logs(entity, entity_id, timestamp);

-- Audit logs are immutable - no UPDATE or DELETE triggers
