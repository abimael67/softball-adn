import type { StatRevision, StatRevisionInsert } from "@/types/database";

export interface StatRevisionRepository {
  findAll(): Promise<StatRevision[]>;
  findById(id: string): Promise<StatRevision | null>;
  findByGameId(gameId: string): Promise<StatRevision[]>;
  findByPlayerId(playerId: string): Promise<StatRevision[]>;
  findByGameAndPlayer(
    gameId: string,
    playerId: string,
    statType: string,
  ): Promise<StatRevision[]>;
  getLatestRevision(
    gameId: string,
    playerId: string,
    statType: string,
  ): Promise<StatRevision | null>;
  create(data: StatRevisionInsert): Promise<StatRevision>;
}
