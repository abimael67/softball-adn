-- Migration: Create user_roles table
-- Description: Maps Supabase auth users to application roles

CREATE TYPE user_role AS ENUM ('administrator', 'collaborator');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role)
);

COMMENT ON TABLE user_roles IS 'Maps Supabase users to application roles';
COMMENT ON COLUMN user_roles.user_id IS 'Reference to Supabase auth.users';
COMMENT ON COLUMN user_roles.role IS 'Application role: administrator or collaborator';
COMMENT ON COLUMN user_roles.assigned_by IS 'User who assigned this role';
COMMENT ON COLUMN user_roles.is_active IS 'Whether this role assignment is currently active';

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_active ON user_roles(is_active);

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
