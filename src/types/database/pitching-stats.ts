export interface PitchingStats {
  id: string;
  season_id: string;
  game_id: string;
  player_id: string;
  team_id: string;
  innings_pitched: number;
  hits_allowed: number;
  runs_allowed: number;
  earned_runs: number;
  walks: number;
  strikeouts: number;
  home_runs_allowed: number;
  wild_pitches: number;
  wins: number;
  losses: number;
  saves: number;
  created_at: string;
  updated_at: string;
}

export type PitchingStatsInsert = Omit<PitchingStats, "id" | "created_at" | "updated_at">;
export type PitchingStatsUpdate = Partial<
  Omit<PitchingStats, "id" | "season_id" | "game_id" | "player_id" | "team_id" | "created_at" | "updated_at">
>;
