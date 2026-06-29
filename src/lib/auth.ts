import type { Permission } from "@/types/domain";
import type { UserRole } from "@/types/database";

export const USER_ROLES: readonly UserRole[] = ["administrator", "collaborator"] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  administrator: "Administrador",
  collaborator: "Colaborador",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  administrator: "Acceso completo al sistema",
  collaborator: "Ingreso de estadísticas y hojas de puntuación",
};

export const PERMISSIONS: readonly Permission[] = [
  "manage_seasons",
  "manage_teams",
  "manage_players",
  "manage_venues",
  "manage_rosters",
  "manage_games",
  "edit_statistics",
  "approve_games",
  "publish_games",
  "manage_users",
  "view_audit_log",
  "upload_score_sheets",
  "enter_statistics",
  "submit_games",
  "view_assigned_games",
] as const;

export const PERMISSION_LABELS: Record<Permission, string> = {
  manage_seasons: "Gestionar Temporadas",
  manage_teams: "Gestionar Equipos",
  manage_players: "Gestionar Jugadores",
  manage_venues: "Gestionar Sedes",
  manage_rosters: "Gestionar Rosters",
  manage_games: "Gestionar Juegos",
  edit_statistics: "Editar Estadísticas",
  approve_games: "Aprobar Juegos",
  publish_games: "Publicar Juegos",
  manage_users: "Gestionar Usuarios",
  view_audit_log: "Ver Registro de Auditoría",
  upload_score_sheets: "Subir Hojas de Puntuación",
  enter_statistics: "Ingresar Estadísticas",
  submit_games: "Enviar Juegos a Revisión",
  view_assigned_games: "Ver Juegos Asignados",
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  administrator: [
    "manage_seasons",
    "manage_teams",
    "manage_players",
    "manage_venues",
    "manage_rosters",
    "manage_games",
    "edit_statistics",
    "approve_games",
    "publish_games",
    "manage_users",
    "view_audit_log",
    "upload_score_sheets",
    "enter_statistics",
    "submit_games",
    "view_assigned_games",
  ],
  collaborator: [
    "upload_score_sheets",
    "enter_statistics",
    "submit_games",
    "view_assigned_games",
  ],
};

export function hasPermission(roles: UserRole[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function getUserPermissions(roles: UserRole[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach((role) => {
    ROLE_PERMISSIONS[role].forEach((permission) => permissions.add(permission));
  });
  return Array.from(permissions);
}
