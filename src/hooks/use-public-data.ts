import { useQuery } from "@tanstack/react-query";
import { SupabaseSeasonRepository } from "@/services/repositories/supabase-season-repository";
import { SupabasePlayerRepository } from "@/services/repositories/supabase-player-repository";
import { SupabaseGameRepository } from "@/services/repositories/supabase-game-repository";
import { SupabaseBattingStatsRepository } from "@/services/repositories/supabase-batting-stats-repository";
import { SupabasePitchingStatsRepository } from "@/services/repositories/supabase-pitching-stats-repository";
import { SupabaseFieldingStatsRepository } from "@/services/repositories/supabase-fielding-stats-repository";
import { SupabaseSeasonRosterRepository } from "@/services/repositories/supabase-season-roster-repository";
import { QUERY_KEYS } from "@/lib/constants";
import type { BattingStats, PitchingStats, FieldingStats, Game } from "@/types/database";

const seasonRepo = new SupabaseSeasonRepository();
const playerRepo = new SupabasePlayerRepository();
const gameRepo = new SupabaseGameRepository();
const battingRepo = new SupabaseBattingStatsRepository();
const pitchingRepo = new SupabasePitchingStatsRepository();
const fieldingRepo = new SupabaseFieldingStatsRepository();
const rosterRepo = new SupabaseSeasonRosterRepository();

export function useLatestSeason() {
  return useQuery({
    queryKey: QUERY_KEYS.latestSeason,
    queryFn: () => seasonRepo.findLatest(),
  });
}

export function usePlayersPaginated(page: number, pageSize: number, search?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.playersPaginated(page, search),
    queryFn: () => playerRepo.findAllPaginated((page - 1) * pageSize, pageSize, search),
  });
}

export function useTeamSeasonRecord(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: ["team-record", teamId, seasonId],
    queryFn: async () => {
      const games = await gameRepo.findByTeamId(teamId, seasonId);
      const completed = games.filter(
        (g) => g.home_score !== null && g.away_score !== null
      );

      let wins = 0;
      let losses = 0;
      let ties = 0;

      for (const game of completed) {
        if (game.home_score === null || game.away_score === null) continue;

        const isHome = game.home_team_id === teamId;
        const teamScore = isHome ? game.home_score : game.away_score;
        const opponentScore = isHome ? game.away_score : game.home_score;

        if (teamScore > opponentScore) wins++;
        else if (teamScore < opponentScore) losses++;
        else ties++;
      }

      const totalGames = wins + losses + ties;
      const winningPercentage = totalGames > 0 ? wins / totalGames : 0;

      return { wins, losses, ties, winningPercentage, totalGames };
    },
    enabled: !!teamId && !!seasonId,
  });
}

export function useRecentTeamGames(teamId: string, seasonId: string, limit = 8) {
  return useQuery({
    queryKey: QUERY_KEYS.teamRecentGames(teamId, seasonId),
    queryFn: () => gameRepo.findRecentByTeam(teamId, seasonId, limit),
    enabled: !!teamId && !!seasonId,
  });
}

export function useTeamRoster(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.rosters(seasonId, teamId),
    queryFn: () => rosterRepo.findByTeamId(teamId, seasonId),
    enabled: !!teamId && !!seasonId,
  });
}

export interface AggregatedBattingStats {
  gamesPlayed: number;
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
  caughtStealing: number;
  hitByPitch: number;
  sacrificeFlies: number;
  battingAverage: number | null;
  onBasePercentage: number | null;
  sluggingPercentage: number | null;
}

export interface AggregatedPitchingStats {
  gamesPlayed: number;
  inningsPitched: number;
  wins: number;
  losses: number;
  saves: number;
  strikeouts: number;
  walks: number;
  hitsAllowed: number;
  runsAllowed: number;
  earnedRuns: number;
  homeRunsAllowed: number;
  wildPitches: number;
  era: number | null;
  whip: number | null;
}

export interface AggregatedFieldingStats {
  gamesPlayed: number;
  putouts: number;
  assists: number;
  errors: number;
  doublePlays: number;
  fieldingPercentage: number | null;
}

export interface PlayerSeasonStats {
  batting: AggregatedBattingStats | null;
  pitching: AggregatedPitchingStats | null;
  fielding: AggregatedFieldingStats | null;
}

function aggregateBattingStats(stats: BattingStats[]): AggregatedBattingStats | null {
  if (stats.length === 0) return null;

  const agg = stats.reduce(
    (acc, s) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      atBats: acc.atBats + s.at_bats,
      runs: acc.runs + s.runs,
      hits: acc.hits + s.hits,
      doubles: acc.doubles + s.doubles,
      triples: acc.triples + s.triples,
      homeRuns: acc.homeRuns + s.home_runs,
      rbi: acc.rbi + s.rbi,
      walks: acc.walks + s.walks,
      strikeouts: acc.strikeouts + s.strikeouts,
      stolenBases: acc.stolenBases + s.stolen_bases,
      caughtStealing: acc.caughtStealing + s.caught_stealing,
      hitByPitch: acc.hitByPitch + s.hit_by_pitch,
      sacrificeFlies: acc.sacrificeFlies + s.sacrifice_flies,
    }),
    {
      gamesPlayed: 0,
      atBats: 0,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      rbi: 0,
      walks: 0,
      strikeouts: 0,
      stolenBases: 0,
      caughtStealing: 0,
      hitByPitch: 0,
      sacrificeFlies: 0,
    }
  );

  const battingAverage = agg.atBats > 0 ? agg.hits / agg.atBats : null;
  const pa = agg.atBats + agg.walks + agg.hitByPitch + agg.sacrificeFlies;
  const onBasePercentage = pa > 0 ? (agg.hits + agg.walks + agg.hitByPitch) / pa : null;
  const totalBases =
    agg.hits + agg.doubles + agg.triples * 2 + agg.homeRuns * 3;
  const sluggingPercentage = agg.atBats > 0 ? totalBases / agg.atBats : null;

  return { ...agg, battingAverage, onBasePercentage, sluggingPercentage };
}

function aggregatePitchingStats(stats: PitchingStats[]): AggregatedPitchingStats | null {
  if (stats.length === 0) return null;

  const agg = stats.reduce(
    (acc, s) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      inningsPitched: acc.inningsPitched + Number(s.innings_pitched),
      wins: acc.wins + s.wins,
      losses: acc.losses + s.losses,
      saves: acc.saves + s.saves,
      strikeouts: acc.strikeouts + s.strikeouts,
      walks: acc.walks + s.walks,
      hitsAllowed: acc.hitsAllowed + s.hits_allowed,
      runsAllowed: acc.runsAllowed + s.runs_allowed,
      earnedRuns: acc.earnedRuns + s.earned_runs,
      homeRunsAllowed: acc.homeRunsAllowed + s.home_runs_allowed,
      wildPitches: acc.wildPitches + s.wild_pitches,
    }),
    {
      gamesPlayed: 0,
      inningsPitched: 0,
      wins: 0,
      losses: 0,
      saves: 0,
      strikeouts: 0,
      walks: 0,
      hitsAllowed: 0,
      runsAllowed: 0,
      earnedRuns: 0,
      homeRunsAllowed: 0,
      wildPitches: 0,
    }
  );

  const era = agg.inningsPitched > 0 ? (agg.earnedRuns * 7) / agg.inningsPitched : null;
  const whip = agg.inningsPitched > 0 ? (agg.walks + agg.hitsAllowed) / agg.inningsPitched : null;

  return { ...agg, era, whip };
}

function aggregateFieldingStats(stats: FieldingStats[]): AggregatedFieldingStats | null {
  if (stats.length === 0) return null;

  const agg = stats.reduce(
    (acc, s) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      putouts: acc.putouts + s.putouts,
      assists: acc.assists + s.assists,
      errors: acc.errors + s.errors,
      doublePlays: acc.doublePlays + s.double_plays,
    }),
    {
      gamesPlayed: 0,
      putouts: 0,
      assists: 0,
      errors: 0,
      doublePlays: 0,
    }
  );

  const totalChances = agg.putouts + agg.assists + agg.errors;
  const fieldingPercentage = totalChances > 0 ? (agg.putouts + agg.assists) / totalChances : null;

  return { ...agg, fieldingPercentage };
}

export function useTeamSeasonBattingStats(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.teamSeasonBatting(teamId, seasonId),
    queryFn: async () => {
      const stats = await battingRepo.findByTeamAndSeason(teamId, seasonId);
      return aggregateBattingStats(stats);
    },
    enabled: !!teamId && !!seasonId,
  });
}

export interface GameBattingStats {
  hits: number;
  homeRuns: number;
  runs: number;
  errors: number;
}

export interface GameWithBatting {
  game: Game;
  batting: GameBattingStats;
}

export function useTeamGameBatting(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.teamGameBatting(teamId, seasonId),
    queryFn: async (): Promise<GameWithBatting[]> => {
      const [games, battingStats, fieldingStats] = await Promise.all([
        gameRepo.findByTeamId(teamId, seasonId),
        battingRepo.findByTeamAndSeason(teamId, seasonId),
        fieldingRepo.findByTeamAndSeason(teamId, seasonId),
      ]);

      const gameBatting = new Map<string, GameBattingStats>();
      for (const stat of battingStats) {
        const current = gameBatting.get(stat.game_id) || { hits: 0, homeRuns: 0, runs: 0, errors: 0 };
        current.hits += stat.hits;
        current.homeRuns += stat.home_runs;
        current.runs += stat.runs;
        gameBatting.set(stat.game_id, current);
      }
      for (const stat of fieldingStats) {
        const current = gameBatting.get(stat.game_id) || { hits: 0, homeRuns: 0, runs: 0, errors: 0 };
        current.errors += stat.errors;
        gameBatting.set(stat.game_id, current);
      }

      return games
        .filter((g) => g.home_score !== null && g.away_score !== null)
        .map((game) => ({
          game,
          batting: gameBatting.get(game.id) || { hits: 0, homeRuns: 0, runs: 0, errors: 0 },
        }));
    },
    enabled: !!teamId && !!seasonId,
  });
}

export function usePlayerSeasonStats(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["player-season-stats", playerId, seasonId],
    queryFn: async (): Promise<PlayerSeasonStats> => {
      const [battingStats, pitchingStats, fieldingStats] = await Promise.all([
        battingRepo.findByPlayerAndSeason(playerId, seasonId),
        pitchingRepo.findByPlayerAndSeason(playerId, seasonId),
        fieldingRepo.findByPlayerAndSeason(playerId, seasonId),
      ]);

      return {
        batting: aggregateBattingStats(battingStats),
        pitching: aggregatePitchingStats(pitchingStats),
        fielding: aggregateFieldingStats(fieldingStats),
      };
    },
    enabled: !!playerId && !!seasonId,
  });
}
