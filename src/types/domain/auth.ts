import type { UserRole } from "@/types/database";

export type Permission =
  | "manage_seasons"
  | "manage_teams"
  | "manage_players"
  | "manage_venues"
  | "manage_rosters"
  | "manage_games"
  | "edit_statistics"
  | "approve_games"
  | "publish_games"
  | "manage_users"
  | "view_audit_log"
  | "upload_score_sheets"
  | "enter_statistics"
  | "submit_games"
  | "view_assigned_games";

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export interface UserContext {
  userId: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  isAuthenticated: boolean;
}

export interface AuthorizationCheck {
  permission: Permission;
  resourceId?: string;
  resourceType?: string;
}
