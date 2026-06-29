export type LeaderCategory =
  | "batting_average"
  | "home_runs"
  | "rbi"
  | "runs"
  | "hits"
  | "stolen_bases"
  | "on_base_percentage"
  | "slugging_percentage"
  | "ops"
  | "wins"
  | "strikeouts_pitching"
  | "era"
  | "whip"
  | "saves";

export interface Leader {
  rank: number;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  value: number;
}

export interface Leaderboard {
  category: LeaderCategory;
  categoryName: string;
  leaders: Leader[];
}

export interface LeagueLeaders {
  seasonId: string;
  seasonName: string;
  leaderboards: Leaderboard[];
}

export interface QualificationRule {
  category: LeaderCategory;
  minimumValue: number;
  statField: string;
  description: string;
}

export interface QualificationRules {
  batting: QualificationRule[];
  pitching: QualificationRule[];
}
