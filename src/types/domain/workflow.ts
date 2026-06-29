import type { GameWorkflowStatus } from "@/types/database";

export interface GameWorkflowState {
  status: GameWorkflowStatus;
  label: string;
  description: string;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canReturn: boolean;
}

export interface WorkflowTransition {
  from: GameWorkflowStatus;
  to: GameWorkflowStatus;
  action: string;
  requiredPermission: string;
}

export interface GameWorkflowContext {
  gameId: string;
  currentStatus: GameWorkflowStatus;
  submittedBy: string | null;
  submittedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedBy: string | null;
  publishedAt: string | null;
  reviewNotes: string | null;
}
