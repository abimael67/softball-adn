import type { Player, PlayerInsert, PlayerUpdate } from "@/types/database";

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

export interface PlayerRepository {
  findAll(): Promise<Player[]>;
  findAllPaginated(
    offset: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResult<Player>>;
  findById(id: string): Promise<Player | null>;
  findByTeamId(teamId: string, seasonId: string): Promise<Player[]>;
  search(query: string): Promise<Player[]>;
  create(data: PlayerInsert): Promise<Player>;
  update(id: string, data: PlayerUpdate): Promise<Player>;
  delete(id: string): Promise<void>;
}
