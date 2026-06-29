import type { Team } from "@/types/database";

export interface TeamWithRoster extends Team {
  playerCount: number;
}

export interface TeamWithRecord extends Team {
  wins: number;
  losses: number;
  ties: number;
  winningPercentage: number;
}
