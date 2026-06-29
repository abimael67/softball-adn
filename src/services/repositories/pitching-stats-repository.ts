import type { PitchingStats, PitchingStatsInsert, PitchingStatsUpdate } from "@/types/database";

export interface PitchingStatsRepository {
  findByGameId(gameId: string): Promise<PitchingStats[]>;
  findByPlayerId(playerId: string): Promise<PitchingStats[]>;
  findByPlayerAndGame(playerId: string, gameId: string): Promise<PitchingStats | null>;
  create(data: PitchingStatsInsert): Promise<PitchingStats>;
  update(id: string, data: PitchingStatsUpdate): Promise<PitchingStats>;
}
