import type { Game, Team, Venue } from "@/types/database";

export interface GameWithTeams extends Game {
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue | null;
}

export interface GameSummary {
  id: string;
  scheduledAt: string;
  venueName: string | null;
  status: Game["status"];
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    score: number | null;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    score: number | null;
  };
}
