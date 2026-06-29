export type AuditAction =
  | "user_login"
  | "user_logout"
  | "game_created"
  | "game_updated"
  | "game_submitted"
  | "game_approved"
  | "game_published"
  | "game_returned"
  | "statistics_entered"
  | "statistics_updated"
  | "roster_modified"
  | "player_created"
  | "player_updated"
  | "team_created"
  | "team_updated"
  | "season_created"
  | "season_updated"
  | "venue_created"
  | "venue_updated"
  | "user_role_assigned"
  | "user_role_revoked"
  | "score_sheet_uploaded"
  | "score_sheet_deleted";

export type AuditEntity =
  | "user"
  | "game"
  | "statistics"
  | "roster"
  | "player"
  | "team"
  | "season"
  | "venue"
  | "score_sheet";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string | null;
  summary: string;
  details: Record<string, unknown> | null;
}

export interface AuditLogFilter {
  action?: AuditAction;
  entity?: AuditEntity;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface StatRevisionEntry {
  id: string;
  gameName: string;
  playerName: string;
  statType: string;
  revisionNumber: number;
  changedBy: string;
  changedAt: string;
  reason: string | null;
  changes: Record<string, { old: unknown; new: unknown }>;
}
