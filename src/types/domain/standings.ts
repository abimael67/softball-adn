export interface Standing {
  teamId: string;
  teamName: string;
  teamShortName: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winningPercentage: number;
  gamesBack: number;
  runsScored: number;
  runsAllowed: number;
  runDifferential: number;
  streak: string;
  lastTen: string;
}

export interface StandingsTable {
  seasonId: string;
  seasonName: string;
  standings: Standing[];
}

export type StandingsSortField = "winningPercentage" | "runDifferential" | "wins" | "gamesBack";

export interface StandingsSortCriteria {
  primary: StandingsSortField;
  secondary?: StandingsSortField;
}
