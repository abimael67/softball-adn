import { useAuth } from "@/providers/auth-provider";
import type { Permission } from "@/types/domain";

export function usePermission(permission: Permission): boolean {
  const { permissions } = useAuth();
  return permissions.includes(permission);
}

export function useCanManageTeams(): boolean {
  return usePermission("manage_teams");
}

export function useCanManagePlayers(): boolean {
  return usePermission("manage_players");
}

export function useCanManageGames(): boolean {
  return usePermission("manage_games");
}

export function useCanManageSeasons(): boolean {
  return usePermission("manage_seasons");
}

export function useCanManageVenues(): boolean {
  return usePermission("manage_venues");
}

export function useCanManageRosters(): boolean {
  return usePermission("manage_rosters");
}

export function useCanEditStatistics(): boolean {
  return usePermission("edit_statistics");
}

export function useCanApproveGames(): boolean {
  return usePermission("approve_games");
}

export function useCanPublishGames(): boolean {
  return usePermission("publish_games");
}

export function useCanSubmitGames(): boolean {
  return usePermission("submit_games");
}

export function useCanEnterStatistics(): boolean {
  return usePermission("enter_statistics");
}

export function useCanUploadScoreSheets(): boolean {
  return usePermission("upload_score_sheets");
}

export function useCanManageUsers(): boolean {
  return usePermission("manage_users");
}

export function useCanViewAuditLog(): boolean {
  return usePermission("view_audit_log");
}
