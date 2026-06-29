import type { Team, TeamInsert, TeamUpdate } from "@/types/database";

export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findBySeasonId(seasonId: string): Promise<Team[]>;
  create(data: TeamInsert): Promise<Team>;
  update(id: string, data: TeamUpdate): Promise<Team>;
}
