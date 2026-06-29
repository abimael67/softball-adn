import type { GameWorkflowStatus } from "@/types/database";
import type { GameWorkflowState, WorkflowTransition } from "@/types/domain";

export const GAME_WORKFLOW_STATUSES: readonly GameWorkflowStatus[] = [
  "scheduled",
  "in_progress",
  "completed",
  "statistics_entry",
  "pending_review",
  "approved",
  "published",
  "postponed",
  "cancelled",
] as const;

export const WORKFLOW_STATUS_LABELS: Record<GameWorkflowStatus, string> = {
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

export const WORKFLOW_STATUS_DESCRIPTIONS: Record<GameWorkflowStatus, string> = {
  scheduled: "Juego programado para una fecha futura",
  in_progress: "Juego actualmente en progreso",
  completed: "Juego completado",
  statistics_entry: "Estadísticas siendo ingresadas",
  pending_review: "Enviado para revisión del administrador",
  approved: "Aprobado por administrador, listo para publicar",
  published: "Publicado y visible públicamente",
  postponed: "Juego pospuesto",
  cancelled: "Juego cancelado",
};

export const WORKFLOW_STATES: Record<GameWorkflowStatus, GameWorkflowState> = {
  scheduled: {
    status: "scheduled",
    label: "Programado",
    description: "Juego programado para una fecha futura",
    canEdit: true,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  in_progress: {
    status: "in_progress",
    label: "En Juego",
    description: "Juego actualmente en progreso",
    canEdit: true,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  completed: {
    status: "completed",
    label: "Completado",
    description: "Juego completado",
    canEdit: false,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  statistics_entry: {
    status: "statistics_entry",
    label: "Ingreso de Estadísticas",
    description: "Estadísticas siendo ingresadas",
    canEdit: true,
    canSubmit: true,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  pending_review: {
    status: "pending_review",
    label: "Pendiente de Revisión",
    description: "Enviado para revisión del administrador",
    canEdit: false,
    canSubmit: false,
    canApprove: true,
    canPublish: false,
    canReturn: true,
  },
  approved: {
    status: "approved",
    label: "Aprobado",
    description: "Aprobado por administrador, listo para publicar",
    canEdit: false,
    canSubmit: false,
    canApprove: false,
    canPublish: true,
    canReturn: true,
  },
  published: {
    status: "published",
    label: "Publicado",
    description: "Publicado y visible públicamente",
    canEdit: false,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  postponed: {
    status: "postponed",
    label: "Pospuesto",
    description: "Juego pospuesto",
    canEdit: false,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
  cancelled: {
    status: "cancelled",
    label: "Cancelado",
    description: "Juego cancelado",
    canEdit: false,
    canSubmit: false,
    canApprove: false,
    canPublish: false,
    canReturn: false,
  },
};

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  {
    from: "scheduled",
    to: "in_progress",
    action: "Iniciar Juego",
    requiredPermission: "manage_games",
  },
  {
    from: "in_progress",
    to: "statistics_entry",
    action: "Finalizar Juego",
    requiredPermission: "manage_games",
  },
  {
    from: "scheduled",
    to: "statistics_entry",
    action: "Iniciar Ingreso de Estadísticas",
    requiredPermission: "manage_games",
  },
  {
    from: "statistics_entry",
    to: "pending_review",
    action: "Enviar a Revisión",
    requiredPermission: "submit_games",
  },
  {
    from: "pending_review",
    to: "approved",
    action: "Aprobar",
    requiredPermission: "approve_games",
  },
  {
    from: "pending_review",
    to: "statistics_entry",
    action: "Devolver para Corrección",
    requiredPermission: "approve_games",
  },
  {
    from: "approved",
    to: "published",
    action: "Publicar",
    requiredPermission: "publish_games",
  },
  {
    from: "approved",
    to: "statistics_entry",
    action: "Devolver para Corrección",
    requiredPermission: "approve_games",
  },
  {
    from: "scheduled",
    to: "postponed",
    action: "Posponeer",
    requiredPermission: "manage_games",
  },
  {
    from: "scheduled",
    to: "cancelled",
    action: "Cancelar",
    requiredPermission: "manage_games",
  },
];

export function canTransitionTo(
  currentStatus: GameWorkflowStatus,
  targetStatus: GameWorkflowStatus,
): boolean {
  return WORKFLOW_TRANSITIONS.some(
    (transition) => transition.from === currentStatus && transition.to === targetStatus,
  );
}

export function getAvailableTransitions(currentStatus: GameWorkflowStatus): WorkflowTransition[] {
  return WORKFLOW_TRANSITIONS.filter((transition) => transition.from === currentStatus);
}

export function gameContributesToStats(status: GameWorkflowStatus): boolean {
  return status === "published";
}
