import type { GameWorkflowStatus } from "@/types/database";

export const GAME_STATUS_LABELS: Record<GameWorkflowStatus, string> = {
  scheduled: "Programado",
  in_progress: "En Juego",
  completed: "Completado",
  statistics_entry: "Ingreso de Estadísticas",
  pending_review: "Pendiente de Revisión",
  approved: "Aprobado",
  published: "Publicado",
  postponed: "Pospuesto",
  cancelled: "Cancelado",
};

export const PUBLISHED_GAME_STATUS: GameWorkflowStatus = "published";

export function gameContributesToStats(status: GameWorkflowStatus): boolean {
  return status === PUBLISHED_GAME_STATUS;
}

export const STANDINGS_RANKING_CRITERIA = {
  primary: "winningPercentage",
  secondary: "runDifferential",
} as const;

export const INNINGS_PER_GAME = 7;

export const LEADERBOARD_DISPLAY_LIMIT = 10;

export const LAST_GAMES_COUNT = 10;

export const STREAK_WIN = "W";
export const STREAK_LOSS = "L";
