import type { Game, GameInsert, GameUpdate, GameWorkflowStatus } from "@/types/database";

export interface GameRepository {
  findAll(): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  findBySeasonId(seasonId: string): Promise<Game[]>;
  findByTeamId(teamId: string, seasonId: string): Promise<Game[]>;
  findByStatus(status: GameWorkflowStatus, seasonId: string): Promise<Game[]>;
  findUpcoming(seasonId: string, limit?: number): Promise<Game[]>;
  findRecent(seasonId: string, limit?: number): Promise<Game[]>;
  findPendingReview(seasonId: string): Promise<Game[]>;
  findApproved(seasonId: string): Promise<Game[]>;
  create(data: GameInsert): Promise<Game>;
  update(id: string, data: GameUpdate): Promise<Game>;
  delete(id: string): Promise<void>;
  submitForReview(id: string, userId: string): Promise<Game>;
  approve(id: string, userId: string): Promise<Game>;
  publish(id: string, userId: string): Promise<Game>;
  returnForCorrection(id: string, userId: string, notes: string): Promise<Game>;
}
