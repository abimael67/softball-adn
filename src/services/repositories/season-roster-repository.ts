import type { SeasonRoster, SeasonRosterInsert, SeasonRosterUpdate } from "@/types/database";

export interface SeasonRosterRepository {
  findBySeasonId(seasonId: string): Promise<SeasonRoster[]>;
  findByTeamId(teamId: string, seasonId: string): Promise<SeasonRoster[]>;
  findByPlayerId(playerId: string, seasonId: string): Promise<SeasonRoster[]>;
  findActiveByPlayerId(playerId: string, seasonId: string): Promise<SeasonRoster | null>;
  getHistory(playerId: string, seasonId: string): Promise<SeasonRoster[]>;
  create(data: SeasonRosterInsert): Promise<SeasonRoster>;
  update(id: string, data: SeasonRosterUpdate): Promise<SeasonRoster>;
  deactivate(id: string): Promise<SeasonRoster>;
}
