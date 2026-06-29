import type { GameScoreSheet, GameScoreSheetInsert } from "@/types/database";

export interface GameScoreSheetRepository {
  findByGameId(gameId: string): Promise<GameScoreSheet[]>;
  findById(id: string): Promise<GameScoreSheet | null>;
  create(data: GameScoreSheetInsert): Promise<GameScoreSheet>;
  delete(id: string): Promise<void>;
}
