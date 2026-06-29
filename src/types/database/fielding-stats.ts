export interface FieldingStats {
  id: string;
  season_id: string;
  game_id: string;
  player_id: string;
  team_id: string;
  putouts: number;
  assists: number;
  errors: number;
  double_plays: number;
  created_at: string;
  updated_at: string;
}

export type FieldingStatsInsert = Omit<FieldingStats, "id" | "created_at" | "updated_at">;
export type FieldingStatsUpdate = Partial<
  Omit<FieldingStats, "id" | "season_id" | "game_id" | "player_id" | "team_id" | "created_at" | "updated_at">
>;
