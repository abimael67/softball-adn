import type { BattingStats, BattingStatsInsert, BattingStatsUpdate } from "@/types/database";

export interface BattingStatsRepository {
  findByGameId(gameId: string): Promise<BattingStats[]>;
  findByPlayerId(playerId: string): Promise<BattingStats[]>;
  findByPlayerAndGame(playerId: string, gameId: string): Promise<BattingStats | null>;
  create(data: BattingStatsInsert): Promise<BattingStats>;
  update(id: string, data: BattingStatsUpdate): Promise<BattingStats>;
}
