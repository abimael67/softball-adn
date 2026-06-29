import type { FieldingStats, FieldingStatsInsert, FieldingStatsUpdate } from "@/types/database";

export interface FieldingStatsRepository {
  findByGameId(gameId: string): Promise<FieldingStats[]>;
  findByPlayerId(playerId: string): Promise<FieldingStats[]>;
  findByPlayerAndGame(playerId: string, gameId: string): Promise<FieldingStats | null>;
  create(data: FieldingStatsInsert): Promise<FieldingStats>;
  update(id: string, data: FieldingStatsUpdate): Promise<FieldingStats>;
}
