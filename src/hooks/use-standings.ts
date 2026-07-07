import { useQuery } from "@tanstack/react-query";
import { SupabaseGameRepository } from "@/services/repositories/supabase-game-repository";
import { SupabaseTeamRepository } from "@/services/repositories/supabase-team-repository";
import { QUERY_KEYS } from "@/lib/constants";
import type { Standing } from "@/types/domain/standings";
import type { Game } from "@/types/database";

const gameRepo = new SupabaseGameRepository();
const teamRepo = new SupabaseTeamRepository();

function hasGameScore(game: Game): boolean {
  return game.home_score !== null && game.away_score !== null;
}

function calculateTeamStats(
  teamId: string,
  teamName: string,
  teamShortName: string,
  games: Game[],
): Standing {
  let wins = 0;
  let losses = 0;
  let runsScored = 0;
  let runsAllowed = 0;

  const results: ("W" | "L" | "T")[] = [];

  for (const game of games) {
    if (game.home_score === null || game.away_score === null) continue;

    const isHome = game.home_team_id === teamId;
    const teamScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;

    if (teamScore > opponentScore) {
      wins++;
      results.push("W");
    } else if (teamScore < opponentScore) {
      losses++;
      results.push("L");
    } else {
      results.push("T");
    }

    runsScored += teamScore;
    runsAllowed += opponentScore;
  }

  const gamesPlayed = wins + losses;
  const winningPercentage = gamesPlayed > 0 ? wins / gamesPlayed : 0;
  const runDifferential = runsScored - runsAllowed;

  let streak = "-";
  if (results.length > 0) {
    const streakType = results[results.length - 1];
    let count = 1;
    for (let i = results.length - 2; i >= 0; i--) {
      if (results[i] === streakType) count++;
      else break;
    }
    streak = `${streakType}${count}`;
  }

  const last10 = results.slice(-10);
  const last10Wins = last10.filter((r) => r === "W").length;
  const last10Losses = last10.filter((r) => r === "L").length;
  const lastTen = `${last10Wins}-${last10Losses}`;

  return {
    teamId,
    teamName,
    teamShortName,
    wins,
    losses,
    gamesPlayed,
    winningPercentage: Math.round(winningPercentage * 1000) / 1000,
    gamesBack: 0,
    runsScored,
    runsAllowed,
    runDifferential,
    streak,
    lastTen,
  };
}

export function useStandings(seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.standings(seasonId),
    queryFn: async (): Promise<Standing[]> => {
      const [teams, games] = await Promise.all([
        teamRepo.findBySeasonId(seasonId),
        gameRepo.findBySeasonId(seasonId),
      ]);

      const completedGames = games.filter((g) =>
        hasGameScore(g)
      );

      const standings = teams.map((team) => {
        const teamGames = completedGames.filter(
          (g) => g.home_team_id === team.id || g.away_team_id === team.id
        );
        return calculateTeamStats(team.id, team.name, team.short_name, teamGames);
      });

      standings.sort((a, b) => {
        if (b.winningPercentage !== a.winningPercentage) {
          return b.winningPercentage - a.winningPercentage;
        }
        return b.runDifferential - a.runDifferential;
      });

      if (standings.length > 0) {
        const leaderWins = standings[0].wins;
        const leaderLosses = standings[0].losses;
        for (const standing of standings) {
          standing.gamesBack = (leaderWins - standing.wins + standing.losses - leaderLosses) / 2;
        }
      }

      return standings;
    },
    enabled: !!seasonId,
  });
}
