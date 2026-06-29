import type { Player, Position, Team } from "@/types/database";

export interface PlayerWithTeam extends Player {
  team: Team | null;
  jerseyNumber: number | null;
}

export interface PlayerWithPosition extends Omit<Player, "position"> {
  position: Position | null;
}

export interface PlayerCareerStats {
  playerId: string;
  seasonsPlayed: number;
  gamesPlayed: number;
  batting: CareerBattingStats;
  pitching: CareerPitchingStats;
  fielding: CareerFieldingStats;
}

export interface CareerBattingStats {
  atBats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  stolenBases: number;
  battingAverage: number | null;
  onBasePercentage: number | null;
  sluggingPercentage: number | null;
}

export interface CareerPitchingStats {
  inningsPitched: number;
  wins: number;
  losses: number;
  saves: number;
  strikeouts: number;
  walks: number;
  era: number | null;
}

export interface CareerFieldingStats {
  putouts: number;
  assists: number;
  errors: number;
  doublePlays: number;
  fieldingPercentage: number | null;
}
