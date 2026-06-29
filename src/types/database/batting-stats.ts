export interface BattingStats {
  id: string;
  season_id: string;
  game_id: string;
  player_id: string;
  team_id: string;
  at_bats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  home_runs: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  stolen_bases: number;
  caught_stealing: number;
  hit_by_pitch: number;
  sacrifice_flies: number;
  created_at: string;
  updated_at: string;
}

export type BattingStatsInsert = Omit<BattingStats, "id" | "created_at" | "updated_at">;
export type BattingStatsUpdate = Partial<
  Omit<BattingStats, "id" | "season_id" | "game_id" | "player_id" | "team_id" | "created_at" | "updated_at">
>;
