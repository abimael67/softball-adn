import type { Season } from "@/types/database";

export interface SeasonWithStats extends Season {
  totalGames: number;
  totalTeams: number;
  totalPlayers: number;
}

export interface SeasonSelector {
  seasons: Season[];
  currentSeason: Season | null;
  selectedSeasonId: string | null;
}
